"use client";
import PrivateRoute from "@/components/PrivateRoute";
import CollaborativeEditorPage from "../components/CollaborativeEditor";

const LiveCodingPage = () => {
  
  return (
    <div>
      <h1 className="text-center text-xl font-bold">Collaborative Code Editor</h1>
     <CollaborativeEditorPage />
    </div>
  );
}

const Page = () => {
  return (
    <PrivateRoute>
      <LiveCodingPage />
    </PrivateRoute>
  );
};

export default Page;
