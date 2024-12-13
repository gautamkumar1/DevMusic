"use client";

import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import CollaborativeEditorPage from "./CollaborativeEditor";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Define routes where the RoomProvider should be used
  const isLiveCodingPage = pathname.startsWith("/liveCoding");

  // If it's not a live coding page, just render children directly
  if (!isLiveCodingPage) {
    return <>{children}</>;
  }

  // Extract the workspace name from the URL path (after /liveCoding/)
  const workspaceName = pathname.split("/liveCoding/")[1];

  // If workspaceName is missing, show loading fallback
  if (!workspaceName) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" />
        <p>Loading workspace...</p>
      </div>
    );
  }

  // Render the RoomProvider with the extracted workspace name
  return (
    <LiveblocksProvider publicApiKey={"pk_prod_2Uz0ZDSKXGtJrPFK-NwxFDuQS7A6a-OVt_dl_K18vl2hsKqsVVmWPBI09AfJtZsv"}>
      <RoomProvider id={workspaceName}>
        <ClientSideSuspense
          fallback={
            <div className="flex justify-center items-center h-screen">
              <Loader2 className="animate-spin" />
            </div>
          }
        >
          <CollaborativeEditorPage />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
