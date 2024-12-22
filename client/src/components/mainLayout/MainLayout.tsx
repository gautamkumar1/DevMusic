"use client"
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
  const [leftPanelSize, setLeftPanelSize] = useState<number>(LEFT_PANEL_DEFAULT_SIZE);
  const [rightPanelSize, setRightPanelSize] = useState<number>(RIGHT_PANEL_DEFAULT_SIZE);
  const [mainPanelSize, setMainPanelSize] = useState<number>(MAIN_PANEL_DESKTOP_SIZE);

  // Load saved panel sizes from localStorage on initial render
  useEffect(() => {
    const savedLeftSize = localStorage.getItem('leftPanelSize');
    const savedRightSize = localStorage.getItem('rightPanelSize');
    const savedMainSize = localStorage.getItem('mainPanelSize');

    if (savedLeftSize) setLeftPanelSize(Number(savedLeftSize));
    if (savedRightSize) setRightPanelSize(Number(savedRightSize));
    if (savedMainSize) setMainPanelSize(Number(savedMainSize));
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Update main panel size when switching between mobile and desktop
      if (mobile) {
        setMainPanelSize(MAIN_PANEL_MOBILE_SIZE);
      } else {
        setMainPanelSize(MAIN_PANEL_DESKTOP_SIZE);
      }
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handler for panel resizing
  const handlePanelResize = (sizes: number[]) => {
    setLeftPanelSize(sizes[0]);
    setMainPanelSize(sizes[1]);
    if (!isMobile) {
      setRightPanelSize(sizes[2]);
    }

    // Save sizes to localStorage
    localStorage.setItem('leftPanelSize', sizes[0].toString());
    localStorage.setItem('mainPanelSize', sizes[1].toString());
    if (!isMobile) {
      localStorage.setItem('rightPanelSize', sizes[2].toString());
    }
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 flex h-full overflow-hidden"
        onLayout={handlePanelResize}
      >
        <ResizablePanel
          defaultSize={leftPanelSize}
          minSize={isMobile ? LEFT_PANEL_MIN_SIZE_MOBILE : LEFT_PANEL_MIN_SIZE_DESKTOP}
          maxSize={LEFT_PANEL_MAX_SIZE}
        >
          <LeftSidebar />
        </ResizablePanel>
        <ResizableHandle className="w-2 bg-gray-800" />
        <ResizablePanel
          defaultSize={mainPanelSize}
          minSize={0}
          className="overflow-hidden flex flex-col"
        >
          {children}
        </ResizablePanel>
        {!isMobile && (
          <>
            <ResizableHandle className="w-2 bg-gray-800" />
            <ResizablePanel
              defaultSize={rightPanelSize}
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