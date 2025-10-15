'use client';

import Link from "next/link";
import { useThemeContext } from "../context/themeContext";
import { useAudioControls } from "../navigation/audio-utils";
import { motion , cubicBezier} from "../../utils/motion";
import { useEffect, useState, useRef } from "react";
import Button, { ButtonType, ButtonSound } from "../base/button/button";
import { Brain } from "@phosphor-icons/react/dist/icons/Brain";
import { Barbell } from "@phosphor-icons/react/dist/icons/Barbell";
import { BookOpenText } from "@phosphor-icons/react/dist/icons/BookOpenText";
import { Eyes } from "@phosphor-icons/react/dist/icons/Eyes";
import { Fingerprint } from "@phosphor-icons/react/dist/icons/Fingerprint";
import { Intersect } from "@phosphor-icons/react/dist/icons/Intersect";
import { Panorama } from "@phosphor-icons/react/dist/icons/Panorama";
import { Smiley } from "@phosphor-icons/react/dist/icons/Smiley";
import { DiamondsFour } from "@phosphor-icons/react/dist/icons/DiamondsFour";
export default function NavBarApplause({
  pages,
  activePage,
  currentTheme,
  handleNavClick,
}) {
  // State to track mouse position globally
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseInContainer, setIsMouseInContainer] = useState(false);
  const containerRef = useRef(null);


  const getNavigationPositionClass = (navigationPosition) => {
    switch (navigationPosition) {
      case "topLeft":
      case "topCenter":
      case "topRight":
        return "margin-auto items-start";
      case "bottomLeft":
      case "bottomCenter":
      case "bottomRight":
        return "margin-auto mb-8 items-end";
      case "leftCenter":
        return "col-start-1 col-span-1 row-span-1 row-start-3 flex flex-col w-[40px] writing-mode-sideways-rl ml-4";
      case "rightCenter":
        return "col-start-5 col-span-1 row-span-1 row-start-3 flex flex-col w-[40px] writing-mode-sideways-rl mr-4";
      default:
        return "col-start-2 col-span-1 row-span-1 row-start-1";
    }
  };

  const getShadowSizeClass = (size) => {
    switch (size) {
      case "sm":
        return "shadow-sm";
      case "md":
        return "shadow-md";
      case "lg":
        return "shadow-lg";
      default:
        return ""; // Return an empty string if no match
    }
  };

  


  // Handle mouse movement at the container level
  const handleContainerMouseMove = (e) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    // Calculate mouse position relative to the container
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };
  
  // Handle mouse enter/leave for the container
  const handleContainerMouseEnter = () => {
    setIsMouseInContainer(true);
  };
  
  const handleContainerMouseLeave = () => {
    setIsMouseInContainer(false);
  };
  
  return (
    <div 
      ref={containerRef}
      className={`        
        ${getNavigationPositionClass(currentTheme?.data?.navPosition)} 
        relative z-50 flex self-center gap-1 pointer-events-auto
      `}
      onMouseMove={handleContainerMouseMove}
      onMouseEnter={handleContainerMouseEnter}
      onMouseLeave={handleContainerMouseLeave}
    >
     
      
      {pages.map((page) => (
        <NavItem 
          key={page.id}
          page={page}
          activePage={activePage}
          handleNavClick={handleNavClick}
          mousePosition={mousePosition}
          containerRect={containerRef.current?.getBoundingClientRect()}
          isMouseInContainer={isMouseInContainer}
          currentTheme={currentTheme}
        />
      ))}
    </div>
  );
}

// Helper function to calculate distance between two points
const distancePoints = (x1, y1, x2, y2) => Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));

// Separate component for each nav item to handle individual hover effects
function NavItem({ page, activePage, handleNavClick, mousePosition, containerRect, isMouseInContainer, currentTheme }) {
  const [scale, setScale] = useState(1);
  const divRef = useRef(null);
  
  // Base size (66px)
  const baseSize = 66;
  // Max size (90px)
  const maxSize = 90;
  // Maximum distance for scaling effect (in pixels)
  const maxDistance = 200;
  
  // Update scale based on mouse position
  useEffect(() => {
    // If mouse is not in container, reset scale to 1
    if (!isMouseInContainer) {
      setScale(1);
      return;
    }
    
    if (!divRef.current || !containerRect) return;
    
    const rect = divRef.current.getBoundingClientRect();
    
    // Calculate the center of the element
    const elementCenterX = rect.left + rect.width / 2;
    const elementCenterY = rect.top + rect.height / 2;
    
    // Calculate the mouse position
    const mouseX = containerRect.left + mousePosition.x;
    const mouseY = containerRect.top + mousePosition.y;
    
    // Calculate the distance between the mouse and the element's center
    const distance = distancePoints(mouseX, mouseY, elementCenterX, elementCenterY);
    
    // If the distance is greater than the maximum distance, return to initial size
    if (distance >= maxDistance) {
      setScale(1);
      return;
    }
    
    // Calculate the scale based on the distance
    // Closer to center = larger scale
    // At center (distance = 0) = maximum scale
    // At maxDistance = minimum scale (1)
    const distanceScale = 1 - (distance / maxDistance);
    
    // Calculate the new size based on the distance scale
    const newSize = baseSize + (maxSize - baseSize) * distanceScale;
    setScale(newSize / baseSize);
  }, [mousePosition, containerRect, isMouseInContainer]);
  


  const renderDynamicIcon = (iconName, size = 20) => {
      
    if (iconName === 'Brain') {
      return <Brain size={size} />;
    }
    if (iconName === 'Barbell') {
      return <Barbell size={size} />;
    }
    if (iconName === 'BookOpenText') {
      return <BookOpenText size={size} />;
    } 
    if (iconName === 'Eyes') {
      return <Eyes size={size} />;
    }
    if (iconName === 'Fingerprint') {
      return <Fingerprint size={size} />;
    }
    if (iconName === 'Intersect') {
      return <Intersect size={size} />;
    }
    if (iconName === 'Panorama') {
      return <Panorama size={size} />;
    }
      if (iconName === 'Smiley') {
        return <Smiley size={size} />;
      }
      if (iconName === 'DiamondsFour') {
        return <DiamondsFour size={size} />;
      }
  };
  
  
  return (
    <motion.div 
      ref={divRef}
      className="rounded-lg aspect-square"
      style={{
        backgroundColor: activePage === page.id ? "var(--accent-pri)" : "var(--surface1)",
        color: activePage === page.id ? "var(--text-color)" : "var(--text-color-inv)",
      }}
      initial={{
        width: "66px",
        height: "66px",
      }}
      animate={{
        width: `${Math.round(66 * scale)}px`,
        height: `${Math.round(66 * scale)}px`,
      }}
      transition={{
        duration: 1,
        ease: cubicBezier(0.16, 1, 0.3, 1)
      }}
    >
      <Link
        href={page.url}
        scroll={false}
        onClick={() => handleNavClick(page.id)}
        className="relative flex items-center justify-center w-full h-full p-3 text-sm no-underline uppercase"

      >
            
            {page.icon && renderDynamicIcon(page.icon, 20)}
            {!page.icon && 'NO'}
    
      </Link>
    </motion.div>
  );
}
