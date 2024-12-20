"use client"
import { FC, ReactNode, useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
// import AudioPlayer from "../AudioPlayer";
import LeftSidebar from "../LeftSidebar";
import FriendsActivity from "../FriendsActivity";


interface MainLayoutProps {
  children: ReactNode;
}

const LEFT_PANEL_DEFAULT_SIZE = 20;
const LEFT_PANEL_MIN_SIZE_MOBILE = 0;
const LEFT_PANEL_MIN_SIZE_DESKTOP = 10;
const LEFT_PANEL_MAX_SIZE = 30;

const RIGHT_PANEL_DEFAULT_SIZE = 20;
const RIGHT_PANEL_MAX_SIZE = 25;
const MAIN_PANEL_MOBILE_SIZE = 80;
const MAIN_PANEL_DESKTOP_SIZE = 60;

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 flex h-full overflow-hidden"
      >
        <ResizablePanel
          defaultSize={LEFT_PANEL_DEFAULT_SIZE}
          minSize={isMobile ? LEFT_PANEL_MIN_SIZE_MOBILE : LEFT_PANEL_MIN_SIZE_DESKTOP}
          maxSize={LEFT_PANEL_MAX_SIZE}
        >
          <LeftSidebar />
        </ResizablePanel>
        <ResizableHandle className="w-2 bg-gray-800" />

        <ResizablePanel
          defaultSize={isMobile ? MAIN_PANEL_MOBILE_SIZE : MAIN_PANEL_DESKTOP_SIZE}
          minSize={0}
          className="overflow-hidden flex flex-col"
        >
          {children}
        </ResizablePanel>

        {!isMobile && (
          <>
            <ResizableHandle className="w-2 bg-gray-800" />
            <ResizablePanel
              defaultSize={RIGHT_PANEL_DEFAULT_SIZE}
              minSize={0}
              maxSize={RIGHT_PANEL_MAX_SIZE}
            >
              <FriendsActivity />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default MainLayout;
