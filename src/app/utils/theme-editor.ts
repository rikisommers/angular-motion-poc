// "use client";
// import React, { useState, useEffect, useRef, useCallback } from "react";
// import {
//   themes,
//   textAnimationThemes,
//   textHighlightThemes,
//   pageTransitionThemes,
//   pageWidthThemes,
//   cardThemes,
//   cardHoverThemes,
//   heroTypeThemes,
//   heroBackgroundThemes,
//   heroHeightThemes,
//   heroTextImageThemes,
//   heroTextCompositionThemes,
//   heroTextPositionThemes,
//   navigationPositionThemes,
//   navigationDragThemes,
//   fontScaleThemes,
//   bodyTextAlign,
//   navigationStyleThemes,
//   navigationOptions,
//   cursorThemes,
//   gridThemes,
//   mixBlendThemes,
// } from "./theme";
// import { useThemeContext } from "../components/context/themeContext";
// import ThemeModal from "../components/base/theme-modal";
// import { toCamelCase } from "../components/utils/toCamelCase";
// import Modal from "../components/base/modal";
// import ButtonAlt from "../components/base/button-alt";
// import { useToast } from "../components/context/toastContext";
// import { Pane } from 'tweakpane';
// import dynamic from 'next/dynamic';

// // Dynamic import with client-side rendering only
// const DynamicPane = dynamic(
//   () => import('tweakpane').then((tp) => tp.Pane),
//   { ssr: false }
// );

// const getBestTheme = (weightType, sliderValue) => {
//   let bestTheme = null;
//   let closestScoreDiff = Infinity; // Start with a large difference

//   for (const [themeName, metrics] of Object.entries(themes)) {
//     // Get the weight based on the specified type
//     const themeWeight = metrics.weights[weightType];

//     // Calculate the difference between the theme weight and the slider value
//     const scoreDiff = Math.abs(themeWeight - sliderValue);

//     // Check if this theme is closer to the slider value than the previous best
//     if (scoreDiff < closestScoreDiff) {
//       closestScoreDiff = scoreDiff;
//       bestTheme = themeName;
//     }
//   }

//   return bestTheme ? themes[bestTheme] : null;
// };

// export default function ThemeEditor({ customThemes }) {
//   const { currentTheme, updateTheme } = useThemeContext();
//   const [themeName, setThemeName] = useState("");
//   const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const containerRef = useRef(null);
//   const paneRef = useRef(null);
//   const presetThemes = themes;
//   const showToast = useToast();

//   const handleCloseSaveModal = () => {
//     setIsSaveModalOpen(false);
//   };

//   const handleCloseDeleteModal = () => {
//     setIsDeleteModalOpen(false);
//   };

//   // Ref use to manage live updates to currentTheme for save to CMS
//   const currentThemeRef = useRef(currentTheme);

//   //  Update the ref whenever currentTheme changes
//   useEffect(() => {
//     updateTheme(currentTheme);
//     currentThemeRef.current = currentTheme;
//     setStyleProperties(currentTheme);
//   }, [currentTheme, updateTheme]);

//   const setStyleProperties = useCallback((theme) => {
//     const root = document.documentElement;

//     if (!theme) {
//       console.warn("Theme is not defined. Exiting setStyleProperties.");
//       return;
//     }

//     root.style.setProperty("--text-highlight", theme.data.textHighlight || "text");
//     root.style.setProperty("--text-animation", theme.data.textAnimation || "linesup");
//     root.style.setProperty("--text-animation-sec", theme.data.textAnimationSec || "linesup");
//     root.style.setProperty("--page-transition", theme.data.pageTransition || "fade");
//     root.style.setProperty("--page-width", theme.data.pageWidth || "large");
//     root.style.setProperty("--cursor", theme.data.cursor || "dot");
//     root.style.setProperty("--font-family-primary", theme.data.fontFamilyPrimary || "sans-serif");
//     root.style.setProperty("--font-family-secondary", theme.data.fontFamilySecondary || "sans-serif");
//     root.style.setProperty("--font-scale", theme.data.fontScale || 'fluid');
//     root.style.setProperty("--font-ratio-min", theme.data.fluidFontRatioMin || 1.2);
//     root.style.setProperty("--font-ratio-max", theme.data.fluidFontRatioMax || 1.25);
//     root.style.setProperty("--body-text-indent", theme.data.bodyTextIndent || "false");
//     root.style.setProperty("--body-background-color", theme.data.bodyBackgroundColor || "#ffffff");
//     root.style.setProperty("--background-color", theme.data.backgroundColor || "#ffffff");
//     root.style.setProperty("--surface1", theme.data.surface1 || "#ffffff");
//     root.style.setProperty("--surface2", theme.data.surface2 || "#ffffff");
//     root.style.setProperty("--surface3", theme.data.surface3 || "#ffffff");
//     root.style.setProperty("--heading-color", theme.data.headingColor || "#000000");
//     root.style.setProperty("--text-color", theme.data.textColor || "#000000");
//     root.style.setProperty("--text-accent", theme.data.textAccent || "#000000");
//     root.style.setProperty("--subtext-color", theme.data.subtextColor || "#000000");
//     root.style.setProperty("--text-color-inv", theme.data.textColorInv || "#000000");
//     root.style.setProperty("--nav-bg", theme.data.navBg || "#ffffff");
//     root.style.setProperty("--accent-pri", theme.data.accentPri || "#000000");
//     root.style.setProperty("--accent-sec", theme.data.accentSec || "#000000");
//     root.style.setProperty("--grad-start", theme.data.gradStart || "#000000");
//     root.style.setProperty("--grad-stop", theme.data.gradStop || "#000000");
//     root.style.setProperty("--audio-enabled", theme.data.audioEnabled || "false");
//     root.style.setProperty("--audio-volume", theme.data.audioVolume || 1);
//     root.style.setProperty("--nav-position", theme.data.navPosition || "static");
//     root.style.setProperty("--nav-style", theme.data.navStyle || "default");
//     root.style.setProperty("--nav-floating", theme.data.navFloating || "false");
//     root.style.setProperty("--nav-fixed", theme.data.navFixed || "false");
//     root.style.setProperty("--nav-border", theme.data.navBorder || "none");
//     root.style.setProperty("--nav-shadow", theme.data.navShadow || "none");
//     root.style.setProperty("--nav-shadow-color", theme.data.navShadowColor || "#000000");
//     root.style.setProperty("--nav-shadow-size", theme.data.navShadowSize || "0px");
//     root.style.setProperty("--nav-label-display", theme.data.navLabelDisplay || "text");
//     root.style.setProperty("--hero-height", theme.data.heroHeight || heroHeightThemes.full);
//     root.style.setProperty("--hero-type", theme.data.heroType || heroTypeThemes.monks);
//     root.style.setProperty("--hero-background-style", theme.data.heroBackgroundStyle || heroBackgroundThemes.gradient);
//     root.style.setProperty("--hero-grad-mid-point", theme.data.heroGradMidPoint || 0.5);
//     root.style.setProperty("--hero-text-image-style", theme.data.heroTextImageStyle || heroTextImageThemes.inline);
//     root.style.setProperty("--hero-text-position", theme.data.heroTextPosition || heroTextPositionThemes.bottomLeft);
//     root.style.setProperty("--hero-text-composition", theme.data.heroTextComposition || heroTextCompositionThemes.foo);
//     root.style.setProperty("--card-layout", theme.data.cardLayout || "default");
//     root.style.setProperty("--card-hover", theme.data.cardHover || "none");
//     root.style.setProperty("--card-grid", theme.data.cardGrid || "default");
//     root.style.setProperty("--image-parallax", theme.data.imageParallax || false);
//     root.style.setProperty("--image-mix-blend-mode", theme.data.imageMixBlendMode || "normal");
//   }, []);

//   // Live udates to the current theme.
//   const updateThemeProp = useCallback((key, value) => {
//     const { data, ...rest } = currentThemeRef.current;

//     const mergedTheme = {
//       ...rest,
//       data: {
//         ...data,
//         [key]: value,
//       },
//     };

//     currentThemeRef.current = mergedTheme;
//     setStyleProperties(mergedTheme);
//     updateTheme(mergedTheme);

//   }, [updateTheme, setStyleProperties]);

//   const handleThemeChange = useCallback((e, target) => {
//     const selectedThemeKey = e;
//     const selectedTheme = Object.values(target).find(
//       (theme) => theme.data.key === selectedThemeKey
//     );
//     if (selectedTheme) {
//       updateTheme(selectedTheme);
//       setStyleProperties(selectedTheme);
//       currentThemeRef.current = selectedTheme;
//     } else {
//       console.error("Theme not found for key:", selectedThemeKey);
//     }
//   }, [updateTheme, setStyleProperties]);

//   const saveNewTheme = async () => {
//     try {
//       const customKey = toCamelCase(themeName);

//       const { key, ...rest } = currentThemeRef.current.data;

//       const themeToSave = {
//         name: themeName,
//         data: {
//           ...rest,
//           key: customKey,
//         },
//       };

//       const response = await fetch("/api/save-new-theme", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(themeToSave),
//       });
//       if (!response.ok) throw new Error("Failed to save theme");
//       showToast("Theme saved successfully", themeToSave.name);
//     } catch (error) {
//       console.error("Error saving theme:", error);
//       showToast("Error saving theme:", error);
//     }
//   };

//   const deleteTheme = async () => {
//     try {
//       const entryIdToDelete = currentThemeRef.current.sys.id;

//       const deleteResponse = await fetch(
//         `/api/delete-theme?id=${entryIdToDelete}`,
//         { method: "DELETE" }
//       );

//       const responseBody = await deleteResponse.json();

//       if (!deleteResponse.ok) {
//         showToast(`Failed to delete theme: ${responseBody.message}`);
//         throw new Error(`Failed to delete theme: ${responseBody.message}`);
//       }

//       showToast("Theme deleted successfully");
//     } catch (error) {
//       console.error("Error deleting theme:", error);
//       showToast("Error deleting theme:", error);
//     }
//   };

//   const saveThemeToContentful = async () => {
//     try {
//       const themeToSave = currentThemeRef.current;

//       const response = await fetch("/api/save-theme", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(themeToSave),
//       });
//       if (!response.ok) {
//         showToast(`Failed to save theme: ${errorData.message}`);
//         const errorData = await response.json();
//         throw new Error(`Failed to save theme: ${errorData.message}`);
//       }
//       showToast("Theme saved to Contentful successfully");
//     } catch (error) {
//       console.error("Error saving theme to Contentful:", error.message);
//       showToast("Error saving theme to Contentful:", error.message);
//     }
//   };

//   const handleApply = () => {
//     saveThemeToContentful();
//   };

//   const handleWeightChange = (metricType, value) => {
//     const bestTheme = getBestTheme(metricType, value);
//     if (bestTheme) {
//       updateTheme(bestTheme);
//     }
//   };

//   useEffect(() => {
//     if (containerRef.current && !paneRef.current) {
//       const newPane = new Pane({ container: containerRef.current });
//       paneRef.current = newPane;

//       // Theme selection folder
//       const themeFolder = paneRef.current.addFolder({ title: "Theme Editor" });

//         // Custom theme select
//         themeFolder.addBinding({ custom: customThemes[0]?.data?.key || '' }, 'custom', {
//           options: Object.fromEntries(Object.keys(customThemes).map(key => [customThemes[key].data.key, customThemes[key].data.key])),
//           label: 'Custom Theme'
//         }).on('change', (ev) => handleThemeChange(ev.value, customThemes));

//         // Add preset theme select
//         themeFolder.addBinding({ presets: Object.keys(presetThemes)[0] }, 'presets', {
//           options: Object.fromEntries(Object.keys(presetThemes).map(key => [key, key])),
//           label: 'Preset Theme'
//         }).on('change', (ev) => handleThemeChange(ev.value, presetThemes));
        
//       // Add controls for each theme property
//       Object.keys(currentThemeRef.current.data).forEach(key => {
//         if (key === 'key') return; // Skip 'key' property
//         let controlParams = { label: key };
//         let initialValue = currentThemeRef.current.data[key];

//         if (typeof initialValue === 'number') {
//           controlParams = {
//             min: 0,
//             max: 1,
//             step: 0.01,
//             label: key,
//           }
//         } else if (typeof initialValue === 'boolean') {
//           // No additional configuration needed for boolean
//         } else if (typeof initialValue === 'string' && initialValue.startsWith('#')) {
//           controlParams = { view: 'color', label: key };
//         }
//     themeFolder.addBinding(currentThemeRef.current.data, key, controlParams)
//             .on('change', (ev) => updateThemeProp(key, ev.value));
//       });

//       // Action buttons
//       themeFolder.addButton({ title: 'Save Theme' })
//       .on('click', () => setIsSaveModalOpen(true));
//       themeFolder.addButton({ title: 'Delete Theme' })
//       .on('click', () => setIsDeleteModalOpen(true));

//       return () => {
//         if (paneRef.current) {
//           paneRef.current.dispose();
//           paneRef.current = null;
//         }
//       };
//     }
//   }, [customThemes, presetThemes, updateTheme, updateThemeProp, handleThemeChange, setStyleProperties]);

//   return (
//     <div>
//       <div ref={containerRef} style={{ position: 'relative', zIndex: 10 }} />

//       {/* Modals */}
//       <Modal
//         isOpen={isSaveModalOpen}
//         onClose={handleCloseSaveModal}
//         title="Save Theme"
//       >
//         <div className="flex flex-col space-y-4">
//           <label htmlFor="themeName">Theme Name:</label>
//           <input
//             type="text"
//             id="themeName"
//             value={themeName}
//             onChange={(e) => setThemeName(e.target.value)}
//             className="p-2 border"
//           />
//           <ButtonAlt onClick={saveNewTheme}>Save Theme</ButtonAlt>
//         </div>
//       </Modal>
//       <Modal
//         isOpen={isDeleteModalOpen}
//         onClose={handleCloseDeleteModal}
//         title="Delete Theme"
//       >
//         <p>Are you sure you want to delete this theme?</p>
//         <ButtonAlt onClick={deleteTheme}>Delete Theme</ButtonAlt>
//       </Modal>
//     </div>
//   );
// }
