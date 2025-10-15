"use client";
import dynamic from 'next/dynamic';

import React, { useRef } from "react";
import { motion } from "../../utils/motion";
import { useRouter } from "next/router";
import { useState } from "react";
//import { useScrollPosition } from "../scrollPosContext";
import ThemeEditor from "../../utils/themeEditor";
const TweakpaneComponent = dynamic(
  () => import('../../utils/tweakpane'),
  { 
    ssr: false,
    loading: () => <p>Loading controls...</p>
  }
);

// import ThemeEditor from "../../utils/themeEditor";

import Modal, {
  ModalDirection,
  ModalWidth,
  ModalPosition,
} from "../base/modal";
import { useThemeContext } from "../context/themeContext";
import NavBar from "./navbar";
import Logo from "./logo";

export default function Navigation({data, logo, customThemes}) {
  const router = useRouter();
  const containerRef = useRef(null);

  const menuDragRef = useRef("menuDragRef");
  //const { scrollPosition } = useScrollPosition();
  const [isActive, setIsActive] = useState(false);
  const [isThemeEditorOpen, setIsThemeEditorOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isThemeDialogOpen, setIsThemeDialogOpen } = useThemeContext();
  const { currentTheme } = useThemeContext();

  const [edges, setEdges] = useState({
    left: false,
    right: false,
    top: false,
    bottom: false,
  });
  const [orientation, setOrientation] = useState("");


  console.log('menu:',data)
  // Function to toggle the ThemeEditor modal
  const toggleThemeEditor = () => {
    console.log("sdd");
    setIsModalOpen((prev) => !prev);
  };

  const toggleThemeEditor2 = () => {
    console.log("sdd");
    setIsThemeDialogOpen((prev) => !prev);
  };

  return (
    <>
            <motion.div
        onClick={toggleThemeEditor2}
        className="fixed flex items-center gap-1 p-1 px-2 py-2 text-xs uppercase rounded-lg cursor-pointer top-4 right-4"
        style={{
          zIndex: 9999,
          backgroundColor:'var(--body-background-color)',
          color:'var(--accent-pri)',
        }}
      >
        theme icon
      </motion.div>
      <div
        ref={containerRef}
        className={`${currentTheme.data.navFixed ? "fixed h-dvh grid grid-cols-[40px_1fr_1fr_1fr_40px] grid-rows-[auto_1fr_1fr_1fr_auto]" : "absolute"} ${
          currentTheme.data.navBorder
            ? "border-solid border-b-[1px] border-t-0 border-l-0 border-r-0"
            : "border-none"
        } bg-opacity-25 top-0 left-0 z-50  w-screen p-3 pointer-events-none grid grid-cols-3 `}
        style={{
          //  backgroundColor: currentTheme.data.navBorder ? 'var(--body-background-color)' : 'transparent',
          borderColor: "var(--nav-shadow-color)",
        }}
      >
        <div className="z-50 flex items-start justify-start col-start-1 row-span-1 row-start-1 w-fit"
             onClick={toggleThemeEditor}>
          <Logo logo={logo} />
        </div>

        <NavBar containerRef={containerRef} data={data} />
{/* 
       <motion.div className="absolute z-50 flex items-center gap-1 p-1 bg-red-400 rounded-lg top-4 right-4">
            <img className="w-[30px] h-[30px]" src="./icons/change.svg" title="theme"/>
        </motion.div>  */}


      </div>

      {/* Modal for "Available for work" */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        direction={ModalDirection.RIGHT}
        width={ModalWidth.PANEL_SM}
        position={ModalPosition.BOTTOM_RIGHT}
      >
        <div
          className="h-svh "
        >
              <TweakpaneComponent customThemes={customThemes}/>

          </div>
          {/* <h2>Hello, I'm available for work!</h2>
          <p>
            This is some sample content for the modal. You can customize this as
            needed.
          </p>
          <button onClick={() => setIsModalOpen(false)}>Close</button>
        </div> */}
      </Modal>

      {/* Modal for ThemeEditor */}
      <Modal
        isOpen={isThemeDialogOpen}
        onClose={toggleThemeEditor}
        direction={ModalDirection.RIGHT}
        width={ModalWidth.PANEL_SM}
        position={ModalPosition.BOTTOM_RIGHT}
        bodyClass="theme-dialog-open"
      >
        <div className="w-full h-screen overflow-y-auto">
          {/* <ThemeEditor  customThemes={customThemes}/> */}
          {/* <TweakpaneComponent/> */}
          <button onClick={toggleThemeEditor}>Close</button>
        </div>
      </Modal>
    </>
  );
}
