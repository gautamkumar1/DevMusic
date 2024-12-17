"use client";
import { useCallback, useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { Awareness } from "y-protocols/awareness";
import { useRoom } from "@liveblocks/react";
import { jwtDecode } from "jwt-decode";
import PrivateRoute from "@/components/PrivateRoute";


// Function to generate a consistent color based on a string
const generateColorFromString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 50%)`; // Generates a color in HSL format
  return color;
};

// Collaborative text editor with simple rich text, live cursors, and live avatars
const CollaborativeEditor = () => {
  const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>();
  const room = useRoom();

  // Decode user info from token
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode<any>(token) : null;

  // Set up Liveblocks Yjs provider and attach Monaco editor
  useEffect(() => {
    let yProvider: any;
    let yDoc: any;
    let binding: any;

    const initYjs = async () => {
      if (editorRef && typeof window !== 'undefined') {
        const { Doc } = await import('yjs');
        const { LiveblocksYjsProvider } = await import('@liveblocks/yjs');
        const { MonacoBinding } = await import('y-monaco');
        const { Awareness } = await import('y-protocols/awareness');

        yDoc = new Doc();
        const yText = yDoc.getText("monaco");
        yProvider = new LiveblocksYjsProvider(room, yDoc);

        // Generate a dynamic color if not provided
        const userColor = generateColorFromString(user._id || user.username);

        // Set user info in awareness
        yProvider.awareness.setLocalState({
          user: {
            id: user._id,
            name: user.username,
            color: userColor,
          },
        });

        // Attach Yjs to Monaco
        binding = new MonacoBinding(
          yText,
          editorRef.getModel() as editor.ITextModel,
          new Set([editorRef]),
          yProvider.awareness as Awareness
        );
      }
    };

    initYjs();

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
      binding?.destroy();
    };
  }, [editorRef, room, user]);

  const handleOnMount = useCallback((e: editor.IStandaloneCodeEditor) => {
    setEditorRef(e);
  }, []);

  return (
    <Editor
      onMount={handleOnMount}
      height="100vh"
      width="100vw"
      theme="vs-dark"
      defaultLanguage="typescript"
      defaultValue=""
      options={{
        tabSize: 2,
      }}
    />
  );
}
const CollaborativeEditorPage = () => {
  return (
    <PrivateRoute>
      <CollaborativeEditor />
    </PrivateRoute>
  )
}
export default CollaborativeEditorPage
