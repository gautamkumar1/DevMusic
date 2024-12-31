"use client";
import { FC, ReactNode, useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
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
    const updateIsMobile = () => setIsMobile(window.innerWidth < 768);
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 flex h-full"
      >
        {/* Left Sidebar */}
        <ResizablePanel
          defaultSize={LEFT_PANEL_DEFAULT_SIZE}
          minSize={isMobile ? LEFT_PANEL_MIN_SIZE_MOBILE : LEFT_PANEL_MIN_SIZE_DESKTOP}
          maxSize={LEFT_PANEL_MAX_SIZE}
          className="bg-zinc-900 border-r border-zinc-800"
        >
          <LeftSidebar />
        </ResizablePanel>

        {/* Main Content */}
        <ResizablePanel className="flex-1 overflow-hidden">
          {children}
        </ResizablePanel>

        {/* Right Sidebar */}
        {!isMobile && (
          <ResizablePanel
            defaultSize={RIGHT_PANEL_DEFAULT_SIZE}
            maxSize={RIGHT_PANEL_MAX_SIZE}
            className="bg-zinc-900 border-l border-zinc-800"
          >
            <FriendsActivity />
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default MainLayout;
