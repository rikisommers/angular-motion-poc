const colorThemes = {
    light: {
      bodyBackgroundColor: '#fafafa',
      backgroundColor: '#f4f4f5',
      surface1: '#c1c1c1',
      surface2: '#6f6f6f',
      surface3:'#C0C6C9',
      backgroundColorInv: '#6b7280',
      headingColor: '#52525b',
      textColor: '#09090b',
      subtextColor: '#52525b',
      textColorInv: '#fafafa',
      navBg:"#C0C6C9",
      accentPri: '#EF7801',
      accentSec: '#FCD00A',
      gradStart: '#EF7801',
      gradStop: '#f4f4f5',
      textAccent:'#d946ef',
      stateSuccessBackground:'#d946ef',
    },
    dark: {
      bodyBackgroundColor: '#271C1B',
      backgroundColor: '#47362E',
      surface1: '#c1c1c1',
      surface2: '#6f6f6f',
      surface3:'#C0C6C9',
      backgroundColorInv: '#f4f4f5',
      headingColor: '#e4e4e7',
      textColor: '#fafafa',
      subtextColor: '#FE8500',
      navBg:"#C0C6C9",
      accentPri: '#EF7801',
      accentSec: '#FCD00A',
      gradStart: '#EF7801',
      gradStop: '#47362E',
      textAccent:'#99f6e4',
      stateSuccessBackground:'#d946ef',
    },
    tokyo: {
      bodyBackgroundColor: '#F8FBF8',
      backgroundColor: '#F7FCFE',
      surface1: '#F8FBF8',
      surface2: '#F7FCFE',
      surface3:'#C0C6C9',
      backgroundColorInv: '#C0C6C9',
      headingColor: '#887F7A',
      textColor: '#887F7A',
      subtextColor: '#C0C6C9',
      textColorInv: '#887F7A',
      navBg:"#C0C6C9",
      accentPri: '#EF7801',
      accentSec: '#FCD00A',
      gradStart: '#EF7801',
      gradStop: '#F7FCFE',
      textAccent:'#BED3CD',
      stateSuccessBackground:'#BED3CD',
    },
    amberMonochrome: {
      bodyBackgroundColor: '#000000',
      backgroundColor: '#1A1A00',
      surface1: '#332900',
      surface2: '#4D3D00',
      surface3:'#665200',
      backgroundColorInv: '#FFB000',
      headingColor: '#FFB000',
      textColor: '#FFB000',
      subtextColor: '#CC8C00',
      textColorInv: '#000000',
      navBg:"#332900",
      accentPri: '#FFB000',
      accentSec: '#FFD700',
      textAccent:'#FFEA00',
      stateSuccessBackground:'#4D3D00',
      gradStart: '#FFB000', // Using accentPri as gradStart
      gradStop: '#1A1A00',  // Using bodyBackgroundColor as gradStop
    },
    greenPhosphor: {
      bodyBackgroundColor: '#001100',
      backgroundColor: '#002200',
      surface1: '#003300',
      surface2: '#004400',
      surface3:'#005500',
      backgroundColorInv: '#00FF00',
      headingColor: '#00FF00',
      textColor: '#00FF00',
      subtextColor: '#00CC00',
      textColorInv: '#001100',
      navBg:"#003300",
      accentPri: '#00FF00',
      accentSec: '#00FF33',
      textAccent:'#33FF33',
      stateSuccessBackground:'#004400',
      gradStart: '#00FF00', // Using accentPri as gradStart
      gradStop: '#002200',  // Using bodyBackgroundColor as gradStop
    },
    ibmPcXt: {
      bodyBackgroundColor: '#000000',
      backgroundColor: '#0000AA',
      surface1: '#000055',
      surface2: '#0000FF',
      surface3:'#5555FF',
      backgroundColorInv: '#AAAAAA',
      headingColor: '#55FFFF',
      textColor: '#FFFFFF',
      subtextColor: '#55FFFF',
      textColorInv: '#000000',
      navBg:"#000055",
      accentPri: '#FFFF55',
      accentSec: '#55FF55',
      textAccent:'#FF5555',
      stateSuccessBackground:'#55FF55',
      gradStart: '#FFFF55', // Using accentPri as gradStart
      gradStop: '#0000AA',  // Using bodyBackgroundColor as gradStop
    },
    commodore64: {
      bodyBackgroundColor: '#40318D',
      backgroundColor: '#7869C4',
      surface1: '#8F84D9',
      surface2: '#A59FE6',
      surface3:'#BCBAF0',
      backgroundColorInv: '#FFFFFF',
      headingColor: '#FFFFFF',
      textColor: '#FFFFFF',
      subtextColor: '#BCBAF0',
      textColorInv: '#40318D',
      navBg:"#8F84D9",
      accentPri: '#A59FE6',
      accentSec: '#BCBAF0',
      textAccent:'#FFFFFF',
      stateSuccessBackground:'#A59FE6',
      gradStart: '#A59FE6', // Using accentPri as gradStart
      gradStop: '#7869C4',  // Using bodyBackgroundColor as gradStop
    },
    appleII: {
      bodyBackgroundColor: '#000000',
      backgroundColor: '#1B1B1B',
      surface1: '#383838',
      surface2: '#555555',
      surface3:'#727272',
      backgroundColorInv: '#C0C0C0',
      headingColor: '#66FF66',
      textColor: '#66FF66',
      subtextColor: '#33CC33',
      textColorInv: '#000000',
      navBg:"#383838",
      accentPri: '#66FF66',
      accentSec: '#FF6666',
      textAccent:'#66FFFF',
      stateSuccessBackground:'#555555',
      gradStart: '#66FF66', // Using accentPri as gradStart
      gradStop: '#1B1B1B',  // Using bodyBackgroundColor as gradStop
    },
    zxSpectrum: {
      bodyBackgroundColor: '#000000',
      backgroundColor: '#0000D8',
      surface1: '#0000FF',
      surface2: '#00D8FF',
      surface3:'#00FFFF',
      backgroundColorInv: '#FFFFFF',
      headingColor: '#FFFF00',
      textColor: '#FFFFFF',
      subtextColor: '#FF00FF',
      textColorInv: '#000000',
      navBg:"#0000FF",
      accentPri: '#FFFF00',
      accentSec: '#FF00FF',
      textAccent:'#00FF00',
      stateSuccessBackground:'#00D8FF',
      gradStart: '#FFFF00', // Using accentPri as gradStart
      gradStop: '#0000D8',  // Using bodyBackgroundColor as gradStop
    },
    atari8bit: {
      bodyBackgroundColor: '#000000',
      backgroundColor: '#404040',
      surface1: '#686868',
      surface2: '#909090',
      surface3:'#B8B8B8',
      backgroundColorInv: '#E0E0E0',
      headingColor: '#F0F0F0',
      textColor: '#F0F0F0',
      subtextColor: '#D0D0D0',
      textColorInv: '#000000',
      navBg:"#686868",
      accentPri: '#50E080',
      accentSec: '#E05050',
      textAccent:'#E0E050',
      stateSuccessBackground:'#909090',
      gradStart: '#50E080', // Using accentPri as gradStart
      gradStop: '#404040',  // Using bodyBackgroundColor as gradStop
    },
    msdos: {
      bodyBackgroundColor: '#000000',
      backgroundColor: '#0000A8',
      surface1: '#0000D0',
      surface2: '#0000F8',
      surface3:'#2828FF',
      backgroundColorInv: '#FFFFFF',
      headingColor: '#FFFFFF',
      textColor: '#FFFFFF',
      subtextColor: '#A8A8FF',
      textColorInv: '#0000A8',
      navBg:"#0000D0",
      accentPri: '#FFFF00',
      accentSec: '#00FFFF',
      textAccent:'#FF00FF',
      stateSuccessBackground:'#0000F8',
      gradStart: '#FFFF00', // Using accentPri as gradStart
      gradStop: '#0000A8',  // Using bodyBackgroundColor as gradStop
    },
    amigaWorkbench: {
      bodyBackgroundColor: '#0055AA',
      backgroundColor: '#0077AA',
      surface1: '#0099AA',
      surface2: '#00BBAA',
      surface3:'#00DDAA',
      backgroundColorInv: '#FFFFFF',
      headingColor: '#FFFFFF',
      textColor: '#000000',
      subtextColor: '#0055AA',
      textColorInv: '#FFFFFF',
      navBg:"#0099AA",
      accentPri: '#FF8800',
      accentSec: '#FFAA00',
      textAccent:'#00FFFF',
      stateSuccessBackground:'#00BBAA',
      gradStart: '#FF8800', // Using accentPri as gradStart
      gradStop: '#0077AA',  // Using bodyBackgroundColor as gradStop
    },
    custom: {
      bodyBackgroundColor: '#F8FBF8',
      backgroundColor: '#4a484b',
      surface1: '#F8FBF8',
      surface2: '#F7FCFE',
      surface3:'#C0C6C9',
      backgroundColorInv: '#C0C6C9',
      headingColor: '#887F7A',
      textColor: '#887F7A',
      subtextColor: '#C0C6C9',
      textColorInv: '#887F7A',
      navBg:"#C0C6C9",
      accentPri: '#EF7801',
      accentSec: '#FCD00A',
      textAccent:'#BED3CD',
      stateSuccessBackground:'#BED3CD',
      gradStart: '#EF7801', // Using accentPri as gradStart
      gradStop: '#F8FBF8',  // Using bodyBackgroundColor as gradStop
    },
    nes: {
      bodyBackgroundColor: '#000000',
      backgroundColor: '#7C7C7C',
      surface1: '#BCBCBC',
      surface2: '#FC9838',
      surface3:'#F8D800',
      backgroundColorInv: '#FFFFFF',
      headingColor: '#FC9838',
      textColor: '#FFFFFF',
      subtextColor: '#BCBCBC',
      textColorInv: '#000000',
      navBg:"#7C7C7C",
      accentPri: '#FC9838',
      accentSec: '#F8D800',
      textAccent:'#00B800',
      stateSuccessBackground:'#00B800',
      gradStart: '#FC9838',
      gradStop: '#7C7C7C',
    },
    gameboy: {
      bodyBackgroundColor: '#0F380F',
      backgroundColor: '#306230',
      surface1: '#8BAC0F',
      surface2: '#9BBC0F',
      surface3:'#AAC0AA',
      backgroundColorInv: '#AAC0AA',
      headingColor: '#9BBC0F',
      textColor: '#0F380F',
      subtextColor: '#306230',
      textColorInv: '#AAC0AA',
      navBg:"#306230",
      accentPri: '#9BBC0F',
      accentSec: '#8BAC0F',
      textAccent:'#0F380F',
      stateSuccessBackground:'#8BAC0F',
      gradStart: '#9BBC0F', // Using accentPri as gradStart
      gradStop: '#306230',  // Using bodyBackgroundColor as gradStop
    },
    sega: {
      bodyBackgroundColor: '#000000',
      backgroundColor: '#0000FF',
      surface1: '#FF0000',
      surface2: '#FFFF00',
      surface3:'#00FF00',
      backgroundColorInv: '#FFFFFF',
      headingColor: '#FFFF00',
      textColor: '#FFFFFF',
      subtextColor: '#00FF00',
      textColorInv: '#000000',
      navBg:"#0000FF",
      accentPri: '#FFFF00',
      accentSec: '#00FF00',
      textAccent:'#FF00FF',
      stateSuccessBackground:'#00FF00',
      gradStart: '#FFFF00', // Using accentPri as gradStart
      gradStop: '#0000FF',  // Using bodyBackgroundColor as gradStop
    },
    mustang69: {
      bodyBackgroundColor: '#1C1C1C',
      backgroundColor: '#2E2E2E',
      surface1: '#4A4A4A',
      surface2: '#D4AF37',
      surface3: '#8B0000',
      backgroundColorInv: '#F5F5F5',
      headingColor: '#D4AF37',
      textColor: '#F5F5F5',
      subtextColor: '#BDBDBD',
      textColorInv: '#1C1C1C',
      navBg: '#2E2E2E',
      accentPri: '#D4AF37',
      accentSec: '#8B0000',
      textAccent: '#D4AF37',
      stateSuccessBackground: '#006400',
      gradStart: '#D4AF37', // Using accentPri as gradStart
      gradStop: '#2E2E2E',  // Using bodyBackgroundColor as gradStop
    },
    camaro69: {
      bodyBackgroundColor: '#0F0F0F',
      backgroundColor: '#1E1E1E',
      surface1: '#3D3D3D',
      surface2: '#FFA500',
      surface3: '#4682B4',
      backgroundColorInv: '#F0F0F0',
      headingColor: '#FFA500',
      textColor: '#F0F0F0',
      subtextColor: '#A9A9A9',
      textColorInv: '#0F0F0F',
      navBg: '#1E1E1E',
      accentPri: '#FFA500',
      accentSec: '#4682B4',
      textAccent: '#FFA500',
      stateSuccessBackground: '#228B22',
      gradStart: '#FFA500', // Using accentPri as gradStart
      gradStop: '#1E1E1E',  // Using bodyBackgroundColor as gradStop
    },
    corvette72: {
      bodyBackgroundColor: '#141414',
      backgroundColor: '#232323',
      surface1: '#3C3C3C',
      surface2: '#C41E3A',
      surface3: '#708090',
      backgroundColorInv: '#F8F8F8',
      headingColor: '#C41E3A',
      textColor: '#F8F8F8',
      subtextColor: '#B0B0B0',
      textColorInv: '#141414',
      navBg: '#232323',
      accentPri: '#C41E3A',
      accentSec: '#708090',
      textAccent: '#C41E3A',
      stateSuccessBackground: '#2E8B57',
      gradStart: '#C41E3A', // Using accentPri as gradStart
      gradStop: '#232323',  // Using bodyBackgroundColor as gradStop
    },
    beetle68: {
      bodyBackgroundColor: '#F2F2F2',
      backgroundColor: '#E0E0E0',
      surface1: '#CCCCCC',
      surface2: '#4D7EA8',
      surface3: '#D84B20',
      backgroundColorInv: '#333333',
      headingColor: '#4D7EA8',
      textColor: '#333333',
      subtextColor: '#666666',
      textColorInv: '#F2F2F2',
      navBg: '#E0E0E0',
      accentPri: '#4D7EA8',
      accentSec: '#D84B20',
      textAccent: '#4D7EA8',
      stateSuccessBackground: '#5CB85C',
      gradStart: '#4D7EA8', // Using accentPri as gradStart
      gradStop: '#E0E0E0',  // Using bodyBackgroundColor as gradStop
    },
    audi80: {
      bodyBackgroundColor: '#1A1A1A',
      backgroundColor: '#2B2B2B',
      surface1: '#3D3D3D',
      surface2: '#B30000',
      surface3: '#8C8C8C',
      backgroundColorInv: '#F0F0F0',
      headingColor: '#B30000',
      textColor: '#F0F0F0',
      subtextColor: '#A9A9A9',
      textColorInv: '#1A1A1A',
      navBg: '#2B2B2B',
      accentPri: '#B30000',
      accentSec: '#8C8C8C',
      textAccent: '#B30000',
      stateSuccessBackground: '#4CAF50',
      gradStart: '#B30000', // Using accentPri as gradStart
      gradStop: '#2B2B2B',  // Using bodyBackgroundColor as gradStop
    },
    porsche911: {
      bodyBackgroundColor: '#F0F0F0',
      backgroundColor: '#E6E6E6',
      surface1: '#D9D9D9',
      surface2: '#FF5722',
      surface3: '#795548',
      backgroundColorInv: '#212121',
      headingColor: '#FF5722',
      textColor: '#212121',
      subtextColor: '#757575',
      textColorInv: '#F0F0F0',
      navBg: '#E6E6E6',
      accentPri: '#FF5722',
      accentSec: '#795548',
      textAccent: '#FF5722',
      stateSuccessBackground: '#66BB6A',
      gradStart: '#FF5722', // Using accentPri as gradStart
      gradStop: '#E6E6E6',  // Using bodyBackgroundColor as gradStop
    },
    spiritedAway: {
      bodyBackgroundColor: '#E6D7B9', // Light sand color from the bathhouse
      backgroundColor: '#B9D7E6', // Soft sky blue from daytime scenes
      surface1: '#D1E8E2', // Pale teal from Haku's dragon form
      surface2: '#F1D4B3', // Warm light from lanterns
      surface3: '#E6C2C2', // Soft pink from Chihiro's clothes
      backgroundColorInv: '#1E434C', // Deep teal from night scenes
      headingColor: '#9B1B30', // Rich red from Yubaba's dress
      textColor: '#4A4737', // Earthy brown from wooden structures
      subtextColor: '#7A8C85', // Muted green from forest scenes
      textColorInv: '#F0EAD6', // Cream color from paper
      navBg: '#CDE6F5', // Light blue from sky scenes
      accentPri: '#8A9A5B', // Moss green from forest spirits
      accentSec: '#D4AF37', // Gold from the bathhouse details
      textAccent: '#7B3F00', // Rich brown from Kamaji's skin
      stateSuccessBackground: '#98D98E', // Soft green from grassy areas
      gradStart: '#D4AF37', // Using accentSec as gradStart
      gradStop: '#B9D7E6',  // Using bodyBackgroundColor as gradStop
    },
  
    myNeighborTotoro: {
      bodyBackgroundColor: '#E8F3E8', // Soft green from forest scenes
      backgroundColor: '#B5D8E6', // Light blue from sky scenes
      surface1: '#F3E8E8', // Pale pink from Mei's dress
      surface2: '#E6DFC8', // Light beige from Totoro's fur
      surface3: '#D1E8D1', // Pastel green from leaves
      backgroundColorInv: '#4C3228', // Dark brown from tree trunks
      headingColor: '#7BA05B', // Leaf green from forest canopy
      textColor: '#4F4A45', // Warm gray from house interiors
      subtextColor: '#8E9B97', // Muted teal from rainy scenes
      textColorInv: '#F4F1E0', // Cream color from clouds
      navBg: '#D6E6F2', // Soft blue from rainy skies
      accentPri: '#9ED2C6', // Teal from the Cat Bus
      accentSec: '#FAE03C', // Bright yellow from Mei's hat
      textAccent: '#A52A2A', // Reddish-brown from Satsuki's hair
      stateSuccessBackground: '#98FB98', // Pale green from grass
      gradStart: '#FAE03C', // Using accentSec as gradStart
      gradStop: '#B5D8E6',  // Using bodyBackgroundColor as gradStop
    },
  
    howlsMovingCastle: {
      bodyBackgroundColor: '#F0E6D2', // Soft beige from castle exterior
      backgroundColor: '#D6E6F2', // Light blue from sky scenes
      surface1: '#E6D2D2', // Pale pink from Sophie's dress
      surface2: '#D2E6D6', // Light green from meadow scenes
      surface3: '#E6E6D2', // Pale yellow from Howl's hair
      backgroundColorInv: '#4A4E69', // Deep blue-gray from night scenes
      headingColor: '#8E6C88', // Muted purple from Howl's jacket
      textColor: '#5D5C61', // Charcoal gray from castle interiors
      subtextColor: '#7D8491', // Cool gray from cloudy scenes
      textColorInv: '#F7F9F9', // Off-white from steam
      navBg: '#E6F2D6', // Pale green from countryside scenes
      accentPri: '#7FB7BE', // Teal from Calcifer
      accentSec: '#FDFD96', // Light yellow from magic spells
      textAccent: '#D64161', // Pink-red from Howl's pendant
      stateSuccessBackground: '#90EE90', // Light green from grassy hills
      gradStart: '#FDFD96', // Using accentSec as gradStart
      gradStop: '#D6E6F2',  // Using bodyBackgroundColor as gradStop
    },
  
    sakuraBreeze: {
      bodyBackgroundColor: '#FFF0F5', // Light pink
      backgroundColor: '#FFE4E1', // Misty rose
      surface1: '#FFF5EE', // Seashell
      surface2: '#F0FFF0', // Honeydew
      surface3: '#F0FFFF', // Azure
      backgroundColorInv: '#4B0082', // Indigo
      headingColor: '#DB7093', // Pale violet red
      textColor: '#696969', // Dim gray
      subtextColor: '#A9A9A9', // Dark gray
      textColorInv: '#FFFFFF', // White
      navBg: '#E6E6FA', // Lavender
      accentPri: '#DDA0DD', // Plum
      accentSec: '#98FB98', // Pale green
      textAccent: '#20B2AA', // Light sea green
      stateSuccessBackground: '#90EE90', // Light green
      gradStart: '#DDA0DD', // Using accentPri as gradStart
      gradStop: '#FFE4E1',  // Using bodyBackgroundColor as gradStop
    },
  
    zenGarden: {
      bodyBackgroundColor: '#F5F5F5', // White smoke
      backgroundColor: '#E0F0E0', // Light mint
      surface1: '#F0F8FF', // Alice blue
      surface2: '#F5FFFA', // Mint cream
      surface3: '#F0FFF0', // Honeydew
      backgroundColorInv: '#2F4F4F', // Dark slate gray
      headingColor: '#556B2F', // Dark olive green
      textColor: '#696969', // Dim gray
      subtextColor: '#808080', // Gray
      textColorInv: '#FFFFFF', // White
      navBg: '#E6E6FA', // Lavender
      accentPri: '#6B8E23', // Olive drab
      accentSec: '#7FFFD4', // Aquamarine
      textAccent: '#4682B4', // Steel blue
      stateSuccessBackground: '#98FB98', // Pale green
      gradStart: '#6B8E23', // Using accentPri as gradStart
      gradStop: '#E0F0E0',  // Using bodyBackgroundColor as gradStop
    },
  
    pastelAnime: {
      bodyBackgroundColor: '#FAFAFA', // Near white
      backgroundColor: '#FFE4E1', // Misty rose
      surface1: '#E6E6FA', // Lavender
      surface2: '#F0E6FF', // Light pastel purple
      surface3: '#FFE4B5', // Moccasin
      backgroundColorInv: '#4B0082', // Indigo
      headingColor: '#DDA0DD', // Plum
      textColor: '#708090', // Slate gray
      subtextColor: '#A9A9A9', // Dark gray
      textColorInv: '#FFFFFF', // White
      navBg: '#F0FFF0', // Honeydew
      accentPri: '#87CEFA', // Light sky blue
      accentSec: '#98FB98', // Pale green
      textAccent: '#FF69B4', // Hot pink
      stateSuccessBackground: '#90EE90', // Light green
      gradStart: '#87CEFA', // Using accentPri as gradStart
      gradStop: '#FFE4E1',  // Using bodyBackgroundColor as gradStop
    },
  
    deathNote: {
      bodyBackgroundColor: '#1A1A1A', // Dark gray background
      backgroundColor: '#2C2C2C', // Slightly lighter gray
      surface1: '#3D3D3D', // Medium gray
      surface2: '#4F4F4F', // Light gray
      surface3: '#616161', // Lighter gray
      backgroundColorInv: '#F0F0F0', // Off-white
      headingColor: '#C41E3A', // Blood red for headings
      textColor: '#D3D3D3', // Light gray text
      subtextColor: '#A9A9A9', // Dark gray subtext
      textColorInv: '#1A1A1A', // Dark gray on light background
      navBg: '#2C2C2C', // Same as backgroundColor
      accentPri: '#C41E3A', // Blood red primary accent
      accentSec: '#4B0082', // Indigo secondary accent
      textAccent: '#FFD700', // Gold for text accents
      stateSuccessBackground: '#006400', // Dark green for success states
      gradStart: '#C41E3A', // Using accentPri as gradStart
      gradStop: '#2C2C2C',  // Using bodyBackgroundColor as gradStop
    },
  
    attackOnTitan: {
      bodyBackgroundColor: '#2B2B2B', // Dark gray background
      backgroundColor: '#3C3C3C', // Slightly lighter gray
      surface1: '#4D4D4D', // Medium gray
      surface2: '#5E5E5E', // Light gray
      surface3: '#6F6F6F', // Lighter gray
      backgroundColorInv: '#E0E0E0', // Light gray
      headingColor: '#8B4513', // Saddle brown for headings
      textColor: '#D2B48C', // Tan text color
      subtextColor: '#A0522D', // Sienna subtext
      textColorInv: '#2B2B2B', // Dark gray on light background
      navBg: '#3C3C3C', // Same as backgroundColor
      accentPri: '#8B4513', // Saddle brown primary accent
      accentSec: '#D2691E', // Chocolate secondary accent
      textAccent: '#F4A460', // Sandy brown for text accents
      stateSuccessBackground: '#556B2F', // Dark olive green for success states
      gradStart: '#8B4513', // Using accentPri as gradStart
      gradStop: '#3C3C3C',  // Using bodyBackgroundColor as gradStop
    },
    tokyoGhoul: {
      bodyBackgroundColor: '#1C1C1C', // Very dark gray background
      backgroundColor: '#2D2D2D', // Dark gray
      surface1: '#3E3E3E', // Medium gray
      surface2: '#4F4F4F', // Light gray
      surface3: '#606060', // Lighter gray
      backgroundColorInv: '#E6E6E6', // Very light gray
      headingColor: '#DC143C', // Crimson for headings
      textColor: '#C0C0C0', // Silver text color
      subtextColor: '#A9A9A9', // Dark gray subtext
      textColorInv: '#1C1C1C', // Very dark gray on light background
      navBg: '#2D2D2D', // Same as backgroundColor
      accentPri: '#DC143C', // Crimson primary accent
      accentSec: '#8B0000', // Dark red secondary accent
      textAccent: '#00CED1', // Dark turquoise for text accents
      stateSuccessBackground: '#2E8B57', // Sea green for success states
      gradStart: '#DC143C', // Using accentPri as gradStart
      gradStop: '#2D2D2D',  // Using bodyBackgroundColor as gradStop
    },
  
    akc12: {
      bodyBackgroundColor: '#000000', // Black
      backgroundColor: '#1A1A1A', // Dark gray
      surface1: '#333333', // Medium gray
      surface2: '#4D4D4D', // Light gray
      surface3: '#666666', // Lighter gray
      backgroundColorInv: '#FFFFFF', // White
      headingColor: '#00FFFF', // Cyan
      textColor: '#00FF00', // Green
      subtextColor: '#008080', // Teal
      textColorInv: '#000000', // Black
      navBg: '#333333', // Medium gray
      accentPri: '#FF0000', // Red
      accentSec: '#0000FF', // Blue
      textAccent: '#FFFF00', // Yellow
      stateSuccessBackground: '#008000', // Dark green
      gradStart: '#FF0000', // Using accentPri as gradStart
      gradStop: '#1A1A1A',  // Using bodyBackgroundColor as gradStop
    },
  
    taikonColor24: {
      bodyBackgroundColor: '#1A1A1A', // Dark gray
      backgroundColor: '#2D2D2D', // Medium gray
      surface1: '#404040', // Light gray
      surface2: '#535353', // Lighter gray
      surface3: '#666666', // Even lighter gray
      backgroundColorInv: '#F0F0F0', // Very light gray
      headingColor: '#FF6B6B', // Soft red
      textColor: '#4ECDC4', // Turquoise
      subtextColor: '#45B7A0', // Dark turquoise
      textColorInv: '#1A1A1A', // Dark gray
      navBg: '#404040', // Light gray
      accentPri: '#FF6B6B', // Soft red
      accentSec: '#4ECDC4', // Turquoise
      textAccent: '#FF8C42', // Orange
      stateSuccessBackground: '#6BFF74', // Light green
      gradStart: '#FF6B6B', // Using accentPri as gradStart
      gradStop: '#2D2D2D',  // Using bodyBackgroundColor as gradStop
    },
  
    eightVision: {
      bodyBackgroundColor: '#000000', // Black
      backgroundColor: '#21211F', // Very dark gray
      surface1: '#3F3F3B', // Dark gray
      surface2: '#5D5D57', // Medium gray
      surface3: '#7B7B73', // Light gray
      backgroundColorInv: '#FFFFFF', // White
      headingColor: '#55FFFF', // Cyan
      textColor: '#55FF55', // Green
      subtextColor: '#FFFF55', // Yellow
      textColorInv: '#000000', // Black
      navBg: '#3F3F3B', // Dark gray
      accentPri: '#FF55FF', // Magenta
      accentSec: '#5555FF', // Blue
      textAccent: '#FFFFFF', // White
      stateSuccessBackground: '#00AA00', // Dark green
      gradStart: '#FF55FF', // Using accentPri as gradStart
      gradStop: '#21211F',  // Using bodyBackgroundColor as gradStop
    },
  
    cgaPalette0Low: {
      bodyBackgroundColor: '#000000', // Black
      backgroundColor: '#0000AA', // Blue
      surface1: '#00AA00', // Green
      surface2: '#00AAAA', // Cyan
      surface3: '#AA0000', // Red
      backgroundColorInv: '#FFFFFF', // White
      headingColor: '#AA00AA', // Magenta
      textColor: '#AAAAAA', // Light gray
      subtextColor: '#555555', // Dark gray
      textColorInv: '#000000', // Black
      navBg: '#0000AA', // Blue
      accentPri: '#AA0000', // Red
      accentSec: '#00AA00', // Green
      textAccent: '#AA00AA', // Magenta
      stateSuccessBackground: '#00AA00', // Green
      gradStart: '#AA0000', // Using accentPri as gradStart
      gradStop: '#0000AA',  // Using bodyBackgroundColor as gradStop
    },
    metallicChic: {
      bodyBackgroundColor: '#607D8B', // Blue gradient
      backgroundColor: '#D1C4E9', // Metallic touches
      surface1: '#7891A1', // Lighter blue gradient
      surface2: '#E0D6F2', // Lighter metallic
      surface3: '#4E6875', // Darker blue gradient
      backgroundColorInv: '#FFFFFF', // White
      headingColor: '#455A64', // Darker blue
      textColor: '#212121', // Almost black
      subtextColor: '#757575', // Gray
      textColorInv: '#FFFFFF', // White
      navBg: '#D1C4E9', // Metallic touches
      accentPri: '#3F51B5', // Indigo
      accentSec: '#7986CB', // Lighter indigo
      textAccent: '#5C6BC0', // Mid indigo
      stateSuccessBackground: '#81C784', // Light green
      gradStart: '#3F51B5', // Using accentPri as gradStart
      gradStop: '#D1C4E9',  // Using bodyBackgroundColor as gradStop
    },
  
    deepVintageMood: {
      bodyBackgroundColor: '#173F5F', // Deep blue gradient
      backgroundColor: '#D98E5D', // Earthy terracotta
      surface1: '#1D4E75', // Lighter deep blue
      surface2: '#E0A575', // Lighter terracotta
      surface3: '#B0A19D', // Metallic touches
      backgroundColorInv: '#FFFFFF', // White
      headingColor: '#000000', // Black
      textColor: '#FFFFFF', // White
      subtextColor: '#B0A19D', // Metallic touches
      textColorInv: '#000000', // Black
      navBg: '#173F5F', // Deep blue gradient
      accentPri: '#D98E5D', // Earthy terracotta
      accentSec: '#B0A19D', // Metallic touches
      textAccent: '#E0A575', // Lighter terracotta
      stateSuccessBackground: '#4CAF50', // Green
      gradStart: '#D98E5D', // Using accentPri as gradStart
      gradStop: '#D98E5D',  // Using bodyBackgroundColor as gradStop
    },
  
    coolAndCollected: {
      bodyBackgroundColor: '#004D4D', // Deep teal
      backgroundColor: '#C5CAE9', // Bright metallics
      surface1: '#006666', // Lighter deep teal
      surface2: '#D0D4F0', // Lighter bright metallics
      surface3: '#003333', // Darker deep teal
      backgroundColorInv: '#FFFFFF', // White
      headingColor: '#001F1F', // Darkest teal
      textColor: '#FFFFFF', // White
      subtextColor: '#A4A8C7', // Darker bright metallics
      textColorInv: '#004D4D', // Deep teal
      navBg: '#004D4D', // Deep teal
      accentPri: '#3F51B5', // Indigo
      accentSec: '#5C6BC0', // Lighter indigo
      textAccent: '#9FA8DA', // Light indigo
      stateSuccessBackground: '#4CAF50', // Green
      gradStart: '#3F51B5', // Using accentPri as gradStart
      gradStop: '#C5CAE9',  // Using bodyBackgroundColor as gradStop
    },
  
    earthyAndSerene: {
      bodyBackgroundColor: '#E0C097', // Sandy tones
      backgroundColor: '#6B6B6B', // Slate gray
      surface1: '#B37445', // Clay
      surface2: '#7EC8E3', // Sky blue
      surface3: '#3B7A57', // Fern green
      backgroundColorInv: '#FFFFFF', // White
      headingColor: '#4A4A4A', // Darker slate gray
      textColor: '#333333', // Dark gray
      subtextColor: '#555555', // Medium gray
      textColorInv: '#FFFFFF', // White
      navBg: '#6B6B6B', // Slate gray
      accentPri: '#B37445', // Clay
      accentSec: '#3B7A57', // Fern green
      textAccent: '#E0C097', // Sandy tones
      stateSuccessBackground: '#4CAF50', // Green
      gradStart: '#B37445', // Using accentPri as gradStart
      gradStop: '#6B6B6B',  // Using bodyBackgroundColor as gradStop
    },
  
    textureAndContrast: {
      bodyBackgroundColor: '#212121', // Dark gray
      backgroundColor:'#212121', // White
      surface1: '#D81B60', // Raspberry
      surface2: '#388E3C', // Green
      surface3: '#009688', // Teal
      backgroundColorInv: '#000000', // Black
      headingColor:  '#C0C6C9', // Pink
      textColor: '#FFFFFF', // Dark gray
      subtextColor: '#887F74', // Blue-gray
      textColorInv: '#FFFFFF', // White
      navBg: '#FFFFFF', // White
      accentPri: '#556B2F', // Olive green
      accentSec: '#556B2F', // Light orange
      textAccent: '#556B2F', // Teal
      stateSuccessBackground: '#4CAF50', // Green
      gradStart: '#556B2F', // Using accentPri as gradStart
      gradStop: '#212121',  // Using bodyBackgroundColor as gradStop
    },
  
    mechanicalAndFloaty: {
      bodyBackgroundColor: '#F5F5F5', // Light gray
      backgroundColor: '#212121', // Almost black
      surface1: '#E0E0E0', // Lighter gray
      surface2: '#424242', // Dark gray
      surface3: '#BDBDBD', // Medium gray
      backgroundColorInv: '#FFFFFF', // White
      headingColor: '#2979FF', // Bright blue accents
      textColor: '#F5F5F5', // Light gray
      subtextColor: '#9E9E9E', // Gray
      textColorInv: '#212121', // Almost black
      navBg: '#212121', // Almost black
      accentPri: '#448AFF', // Light blue
      accentSec: '#82B1FF', // Lighter blue
      textAccent: '#40C4FF', // Light blue
      stateSuccessBackground: '#4CAF50', // Green
      gradStart: '#82B1FF', // Using accentPri as gradStart
      gradStop: '#212121',  // Using bodyBackgroundColor as gradStop
    },
  
    pixelIntensity: {
      bodyBackgroundColor: '#000000', // Black
      backgroundColor: '#0D47A1', // Red
      surface1: '#0D47A1', // Blue
      surface2: '#8B0000', // Dark red
      surface3: '#B71C1C', // Darker red
      backgroundColorInv: '#FFFFFF', // White
      headingColor: '#FFFFFF', // White
      textColor: '#FFFFFF', // White
      subtextColor: '#BDBDBD', // Light gray
      textColorInv: '#000000', // Black
      navBg: '#000000', // Black
      accentPri: '#FF0000', // Red
      accentSec: '#0D47A1', // Blue
      textAccent: '#FFC107', // Amber
      stateSuccessBackground: '#4CAF50', // Green
      gradStart: '#0D47A1', // Using accentPri as gradStart
      gradStop: '#000000',  // Using bodyBackgroundColor as gradStop
    },
  
    gradientPop: {
      bodyBackgroundColor: '#87CEEB', // Sky blue
      backgroundColor: '#FF8A80', // Salmon-pink
      surface1: '#FF9800', // Bright orange
      surface2: '#000000', // Black
      surface3: '#39FF14', // Neon green
      backgroundColorInv: '#FFFFFF', // White
      headingColor: '#000000', // Black
      textColor: '#FFFFFF', // White
      subtextColor: '#BDBDBD', // Light gray
      textColorInv: '#000000', // Black
      navBg: '#87CEEB', // Sky blue
      accentPri: '#FF8A80', // Salmon-pink
      accentSec: '#FF9800', // Bright orange
      textAccent: '#FFC107', // Amber
      stateSuccessBackground: '#4CAF50', // Green
      gradStart: '#FF8A80', // Using accentPri as gradStart
      gradStop: '#FF8A80',  // Using bodyBackgroundColor as gradStop
    },
  
    cosmicArtistry: {
      bodyBackgroundColor: '#F5F5F5', // Gray-washed white
      backgroundColor: '#0D3B66', // Space blue
      surface1: '#708090', // Slate gray
      surface2: '#EAEAEA', // Soft gradients
      surface3: '#1A5F7A', // Darker space blue
      backgroundColorInv: '#FFFFFF', // White
      headingColor: '#0D3B66', // Space blue
      textColor: '#333333', // Dark gray
      subtextColor: '#708090', // Slate gray
      textColorInv: '#FFFFFF', // White
      navBg: '#F5F5F5', // Gray-washed white
      accentPri: '#0D3B66', // Space blue
      accentSec: '#708090', // Slate gray
      textAccent: '#4A90E2', // Light blue
      stateSuccessBackground: '#4CAF50', // Green
      gradStart: '#0D3B66', // Using accentPri as gradStart
      gradStop: '#0D3B66',  // Using bodyBackgroundColor as gradStop
    },
  
    vibrantButCalm: {
      bodyBackgroundColor: '#E0E0E0', // Creamy-gray
      backgroundColor: '#B71C1C', // Muted red
      surface1: '#FFC0CB', // Pink
      surface2: '#F5F5F5', // Off-white
      surface3: '#D32F2F', // Lighter muted red
      backgroundColorInv: '#FFFFFF', // White
      headingColor: '#B71C1C', // Muted red
      textColor: '#212121', // Almost black
      subtextColor: '#757575', // Gray
      textColorInv: '#FFFFFF', // White
      navBg: '#E0E0E0', // Creamy-gray
      accentPri: '#B71C1C', // Muted red
      accentSec: '#FFC0CB', // Pink
      textAccent: '#FF5252', // Light red
      stateSuccessBackground: '#4CAF50', // Green
      gradStart: '#B71C1C', // Using accentPri as gradStart
      gradStop: '#B71C1C',  // Using bodyBackgroundColor as gradStop
    },
  
    livelyAndInviting: {
      bodyBackgroundColor: '#FF69B4', // Candy pink
      backgroundColor: '#ADFF2F', // Green-yellow
      surface1: '#C8A2C8', // Lavender gray
      surface2: '#D2B48C', // Pastel brown
      surface3: '#FF1493', // Deep pink
      backgroundColorInv: '#FFFFFF', // White
      headingColor: '#8B4513', // Saddle brown
      textColor: '#333333', // Dark gray
      subtextColor: '#696969', // Dim gray
      textColorInv: '#FFFFFF', // White
      navBg: '#ADFF2F', // Green-yellow
      accentPri: '#C8A2C8', // Lavender gray
      accentSec: '#D2B48C', // Pastel brown
      textAccent: '#FF1493', // Deep pink
      mixBlendMode: 'color',
      stateSuccessBackground: '#4CAF50', // Green
      gradStart: '#C8A2C8', // Using accentPri as gradStart
      gradStop: '#ADFF2F',  // Using bodyBackgroundColor as gradStop
    },
  
    strikingAndSimple: {
      bodyBackgroundColor: '#2F2F2F', // Smoky black
      backgroundColor: '#2979FF', // Electric blue
      surface1: '#424242', // Dark gray
      surface2: '#82B1FF', // Light blue
      surface3: '#1565C0', // Darker blue
      backgroundColorInv: '#FFFFFF', // White
      headingColor: '#FFFFFF', // White
      textColor: '#FFFFFF', // White
      subtextColor: '#BDBDBD', // Light gray
      textColorInv: '#2F2F2F', // Smoky black
      navBg: '#2F2F2F', // Smoky black
      accentPri: '#2979FF', // Electric blue
      accentSec: '#82B1FF', // Light blue
      textAccent: '#40C4FF', // Light blue
      stateSuccessBackground: '#4CAF50', // Green
      gradStart: '#2979FF', // Using accentPri as gradStart
      gradStop: '#2979FF',  // Using bodyBackgroundColor as gradStop
    },
  
    redAndLively: {
      bodyBackgroundColor: '#8B0000', // Dark scarlet red
      backgroundColor: '#FF1493', // Dark pink
      surface1: '#D3D3D3', // Light gray
      surface2: '#FF69B4', // Hot pink
      surface3: '#DC143C', // Crimson
      backgroundColorInv: '#FFFFFF', // White
      headingColor: '#FFFFFF', // White
      textColor: '#FFFFFF', // White
      subtextColor: '#D3D3D3', // Light gray
      textColorInv: '#8B0000', // Dark scarlet red
      navBg: '#8B0000', // Dark scarlet red
      accentPri: '#FF1493', // Dark pink
      accentSec: '#FF69B4', // Hot pink
      textAccent: '#FFC0CB', // Pink
      stateSuccessBackground: '#4CAF50', // Green
      gradStart: '#FF1493', // Using accentPri as gradStart
      gradStop: '#FF1493',  // Using bodyBackgroundColor as gradStop
    },
  
    artsyAndCreative: {
      bodyBackgroundColor: '#EFDFBB', // Dutch white
      backgroundColor: '#DAA520', // Goldenrod
      surface1: '#E34234', // Vermillion
      surface2: '#00008B', // Dark blue
      surface3: '#CD853F', // Peru
      backgroundColorInv: '#FFFFFF', // White
      headingColor: '#00008B', // Dark blue
      textColor: '#333333', // Dark gray
      subtextColor: '#8B4513', // Saddle brown
      textColorInv: '#FFFFFF', // White
      navBg: '#EFDFBB', // Dutch white
      accentPri: '#DAA520', // Goldenrod
      accentSec: '#E34234', // Vermillion
      textAccent: '#00008B', // Dark blue
      stateSuccessBackground: '#4CAF50', // Green
      gradStart: '#DAA520', // Using accentPri as gradStart
      gradStop: '#DAA520',  // Using bodyBackgroundColor as gradStop
    },
  
    elegantYetApproachable: {
      bodyBackgroundColor: '#FFDAB9', // Skin tones
      backgroundColor: '#1C1C3B', // Dark imperial blue
      surface1: '#9B111E', // Ruby
      surface2: '#E6BE8A', // Lighter skin tone
      surface3: '#2E2E5F', // Lighter imperial blue
      backgroundColorInv: '#FFFFFF', // White
      headingColor: '#9B111E', // Ruby
      textColor: '#FFFFFF', // White
      subtextColor: '#D2B48C', // Tan
      textColorInv: '#1C1C3B', // Dark imperial blue
      navBg: '#1C1C3B', // Dark imperial blue
      accentPri: '#9B111E', // Ruby
      accentSec: '#FFDAB9', // Skin tones
      textAccent: '#FFB6C1', // Light pink
      stateSuccessBackground: '#4CAF50', // Green
      gradStart: '#9B111E', // Using accentPri as gradStart
      gradStop: '#1C1C3B',  // Using bodyBackgroundColor as gradStop
    },
  
    sleekAndFuturistic: {
      bodyBackgroundColor: '#0F4C81', // Blue sapphire
      backgroundColor: '#2F4F4F', // Gunmetal gray
      surface1: '#E5E4E2', // Platinum
      surface2: '#FFDAB9', // Peach-orange
      surface3: '#D2B48C', // Tan
      backgroundColorInv: '#FFFFFF', // White
      headingColor: '#E5E4E2', // Platinum
      textColor: '#FFFFFF', // White
      subtextColor: '#D2B48C', // Tan
      textColorInv: '#0F4C81', // Blue sapphire
      navBg: '#2F4F4F', // Gunmetal gray
      accentPri: '#0F4C81', // Blue sapphire
      accentSec: '#E5E4E2', // Platinum
      textAccent: '#87CEEB', // Sky blue
      stateSuccessBackground: '#4CAF50', // Green
      gradStart: '#0F4C81', // Using accentPri as gradStart
      gradStop: '#2F4F4F',  // Using bodyBackgroundColor as gradStop
    },
  
    innovativeAndAudacious: {
      bodyBackgroundColor: '#1C1C1C', // Dark gray, almost black
      backgroundColor: '#FF5A36', // Portland Orange
      surface1: '#FFEB3B', // Vivid yellow
      surface2: '#00A86B', // Jade
      surface3: '#FF8C69', // Salmon
      backgroundColorInv: '#FFFFFF', // White
      headingColor: '#FFEB3B', // Vivid yellow
      textColor: '#FFFFFF', // White
      subtextColor: '#BDBDBD', // Light gray
      textColorInv: '#1C1C1C', // Dark gray, almost black
      navBg: '#1C1C1C', // Dark gray, almost black
      accentPri: '#FF5A36', // Portland Orange
      accentSec: '#FFEB3B', // Vivid yellow
      textAccent: '#FF8C69', // Salmon
      stateSuccessBackground: '#4CAF50', // Green
      gradStart: '#FF5A36', // Using accentPri as gradStart
      gradStop: '#FF5A36',  // Using bodyBackgroundColor as gradStop
    },
  
  };
  
  
  // Text Animation themes
  export const gridThemes = {
    bento1: "bento1",
    list: "list",
  };
  
  
  // Text Animation themes
  export const textAnimationThemes = {
    none: "none",
    figma: "figma",
    linesup: "linesup",
    linefadein: "linefadein",
    charfade: "charfade",
    charblur: "charblur",
    charrandom: "charrandom",
    charcode: "charcode",
    wordx: "wordx",
  };
  
  export const textHighlightThemes = {
    text: "text",
    background: "background",
    underline: "underline",
    highlight: "highlight",
    figma:'figma',
    figmaNeumorphic: "figma-neumorphic",
    none: "none"
  };
  
  export const textHighlightOutlineThemes = {
    none: "none",
    shadow: "shadow",
    nuemorphic: "nuemorphic",
  };
  
  export const textHighlightOutlineNeumorphic = {
    size: "15px 15px 30px",
    startColor: "#FFFFFF",
    endColor: "#000000",
  };
  
  
  // Type Themes
  // using google fonts kndoif sucks really just need a way to select local dfonts and not include in prod
  export const typographyThemes = {
    sans: 'sans-serif',
    serif: 'serif',
    mono: 'monospace',
    interp: "interphase, sans-serif",
    tron: "Tronica Mono, sans-serif",
    aon: "Aeonik Pro, sans-serif",
    inter: 'inter', //Google/nextfont
    roboto: 'roboto', //Google/nextfont
    montserrat: 'Montserrat', //Google/nextfont
    poppins: 'Poppins', //Google/nextfont
  
  };
  
  // Type Themes
  export const fontScaleThemes = {
    fixed: 'fixed',
    fluid: 'fluid',
  };
  
  export const fluidFontSizeThemes = {
  fontSizeMin: '8',
  fontSizeMax: '16',
  fontRatioMin: 0.2,
  fontRatioMax: 1.1,
  fontWidthMin: '320',
  fontWidthMax: '1200',
  variableUnit: '1vw',
  };
  
  export const pageTransitionThemes = {
    tiltandwipe:'tilt and wipe',
    tilt:'tilt',
    fade:'fade',
    wipe:'wipe',
    pixel:'pixel',
    none:'none'
  };
  
  export const pageWidthThemes = {
    small:'small',
    large: 'large',
    fluid: 'fluid'
  };
  
  export const cursorThemes = {
    none: 'none',
    dot: 'dot',
    cta:'cta'
  };
  
  export const cardThemes = {
    formal: 'formal',
    funky: 'funky',
    monks: 'monks',
    reone: 'reone',
    img: 'img',
  };
  
  export const mixBlendThemes = {
    normal: 'normal',
    multiply: 'multiply',
    screen: 'screen',
    overlay: 'overlay',
    darken: 'darken',
    lighten: 'lighten',
    colordodge: 'color-dodge',
    colorburn: 'color-burn',
    hardlight: 'hard-light',
    softlight: 'soft-light',
    difference: 'difference',
    exclusion: 'exclusion',
    hue: 'hue',
    saturation: 'saturation',
    color: 'color',
    luminosity: 'luminosity',
  };
  
  export const cardHoverThemes = {
    none: 'none',
    zoom: 'zoom',
  };
  
  export const audioThemes = {
    audio: true,
    volume: 0.5,
  }
  
  export const navigationStyleThemes = {
    solid: 'solid',
    transparent: 'transparent',
  };
  
  export const navigationTextStyleThemes = {
    text: 'text',
    icons: 'icons',
  };
  
  export const logoBackground = {
    solid: 'solid',
    transparent: 'transparent',
  };
  
  
  export const navigationOptions = {
    logoFill:true,
    floating: true,
    fixed: true,
    bordered: false,
    shadowColor: {
      default: 'default',
      accent: 'accent',
    },
    shadowSize:{
      sm:'sm',
      md:'md',
      lg:'lg',
    },
    labelDisplay:{
      text:'text',
      icons:'icons',
      textAndIcons:'textAndIcons',
    }
  }
  
  export const navigationPositionThemes = {
    topLeft: 'top-left',
    topCenter: 'top-center',
    topRight: 'top-right',
    bottomLeft: 'bottom-left',
    bottomCenter: 'bottom-center',
    bottomRight: 'bottom-right',
    leftCenter: 'left-center',
    rightCenter: 'right-center',
  };
  
  export const footerOptions = {
    fixed: true,
  };
  
  
  export const heroHeightThemes = {
    full: 'full',
    half: 'half',
    auto: 'auto',
  };
  
  
  export const heroBackgroundThemes = {
    none: 'none',
    video: 'video',
    image: 'image',
    gradient: 'gradient',
    cssgradient: 'cssgradient',
    animatedGradient: 'animated-gradient',
    blob:'blob',
  };
  
  export const heroCssGradientThemes = {
    linearVertical: 'linear',
    radial: 'radial',
    conic: 'conic',
  };
  
  export const heroCssGradientRadialPositionThemes = {
    center: 'center',
    topLeft:'top-left',
    bottomLeft:'bottom-left',
    bottomCenter:'bottom-center',
    topCenter:'top-center',
    topRight:'top-right',
    bottomRight:'bottom-right',
  };
  
  export const heroTextPositionThemes = {
    center: 'center',
    left: 'left',
    topLeft:'top-left',
    bottomLeft:'bottom-left',
    topRight:'top-right',
    bottomRight:'bottom-right',
  };
  
  
  export const heroTypeThemes = {
    monks: 'monks',
    riki: 'riki',
  };
  
  export const heroGradThemes = {
    gradMidPoint: 0.5
  };
  
  export const heroTextCompositionThemes = {
    foo: 'foo',
    bar: 'bar',
  };
  
  export const heroTextImageThemes = {
    none: 'none2',
    inline: 'inline',
    hover: 'hover',
  };
  
  export const bodyTextAlign = {
    left: 'left',
    center: 'center',
    right: 'right',
    split:'split',
  };
  
  
  export const bodyTextThemes = {
    dropCap: false,
    indent: false,
    hightlight: false,
  };
  
  export const animationThemes = {
    inset:3,
    borderRadius:2,
  };
  
  
  export const helpers = {
      mousepos:false,
      grid:false,
  };
  
  const themeContent = {
    audioEnabled:false,
    audioVolume:0.5,
    fontFamilyPrimary:typographyThemes.sans,
    fontFamilySecondary:typographyThemes.sans,
    fontScale:fontScaleThemes.fluid,
    fluidFontSizeMin: fluidFontSizeThemes.fontSizeMin,
    fluidFontSizeMax: fluidFontSizeThemes.fontSizeMax,
    fluidFontRatioMin: fluidFontSizeThemes.fontRatioMin,
    fluidFontRatioMax: fluidFontSizeThemes.fontRatioMax,
    fluidFontWidthMin: fluidFontSizeThemes.fontWidthMin,
    fluidFontWidthMax: fluidFontSizeThemes.fontWidthMax,
    fluidVariableUnit: fluidFontSizeThemes.variableUnit,
    textHighlight:textHighlightThemes.text,
    textAnimation:textAnimationThemes.wordx,
    textAnimationSec:textAnimationThemes.none,
    pageTransition:pageTransitionThemes.fade,
    pageWidth:pageWidthThemes.fluid,
    cursor:cursorThemes.none,
    cardLayout:cardThemes.reone,
    cardHover:cardHoverThemes.none,
    cardGrid:gridThemes.bento1,
    imageParallax:false,
    imageMixBlendMode:mixBlendThemes.luminosity,
    heroHeight:heroHeightThemes.full,
    heroType:heroTypeThemes.riki,
    heroBackground:heroBackgroundThemes.cssgradient,
    heroTextImage:heroTextImageThemes.none,
    heroTextPosition:heroTextPositionThemes.center,
    heroGradMidPoint:heroGradThemes.gradMidPoint,
    heroCssGradient:heroCssGradientThemes.conic,
    heroCssGradientAngle:'45',
    heroCssGradientRadialPosition:heroCssGradientRadialPositionThemes.center,
    heroTextLayout:heroTextCompositionThemes.foo,
    navPosition:navigationPositionThemes.topCenter,
    navStyle:navigationStyleThemes.solid,
    navTextStyle:navigationTextStyleThemes.icons,
    navFloating: navigationOptions.floating,
    navFixed: navigationOptions.fixed,
    navBorder: navigationOptions.bordered,
    navLabelDisplay:navigationOptions.labelDisplay.text,
    navShadow: false,
    navShadowColor: navigationOptions.shadowColor.default,
    navShadowSize:navigationOptions.shadowSize.sm,
    logoBackground:logoBackground.solid,
    footerFixed: footerOptions.fixed,
    bodyTextDropCap: bodyTextThemes.dropCap,
    bodyTextIndent: bodyTextThemes.indent,
    bodyTextHightlight: bodyTextThemes.hightlight,
    bodyTextAlign:bodyTextAlign.center,
    textHighlightOutline:textHighlightOutlineThemes.none,
    // textHighlightOutlineNeumorphicSize:textHighlightOutlineNeumorphic.size,
    textHighlightOutlineNeumorphicStartColor:'#FFFFFF',
    textHighlightOutlineNeumorphicEndColor:'#000000',
  }

  
  
  // Function to get theme by key
  export function getThemeByKey(themeKey: string) {
    return themes[themeKey as keyof typeof themes];
  }
  
  // Function to update theme
  export function updateTheme(themeKey: string, updates: Record<string, any>) {
    if (themes[themeKey as keyof typeof themes]) {
      Object.assign(themes[themeKey as keyof typeof themes], updates);
    }
  }
  
  // Function to get Leva controls for a theme
  export function getThemeLevaControls(themeKey: string) {
    const theme = getThemeByKey(themeKey);
    if (!theme) return {};
  
    const controls: Record<string, any> = {};
    Object.keys(theme).forEach(key => {
      // Add type assertion to access theme properties safely
      const themeAny = theme as any;
      if (typeof themeAny[key] === 'string' && themeAny[key].startsWith('#')) {
        controls[key] = { 
          value: themeAny[key], 
          onChange: (value: string) => updateTheme(themeKey, { [key]: value }) 
        };
      }
    });
  
    return controls;
  }
  
  export const getThemeValue = (key: string) => {
    const root = document.documentElement;
    const cssVarName = `--${key}`;
    const value = getComputedStyle(root).getPropertyValue(cssVarName).trim();
    return value || null;
  };
  
  export const themes = {
    light: {
      name: "light",
      data: {
        key: "light",
        ...colorThemes.light,
        ...themeContent,
      },
    },
    dark: {
      name: "dark",
      data: {
        key: "dark",
        ...colorThemes.dark,
        ...themeContent,
      },
    },
    tokyo: {
      name: "tokyo",
      data: {
        key: "tokyo",
        ...colorThemes.tokyo,
        ...themeContent,
      },
    },
    custom: {
      name: "custom",
      data: {
        key: "custom",
        ...colorThemes.custom,
        ...themeContent,
      },
    },
    amberMonochrome: {
      name: "amberMonochrome",
      data: {
        key: "amberMonochrome",
        ...colorThemes.amberMonochrome,
        ...themeContent,
      },
    },
    greenPhosphor: {
      name: "greenPhosphor",
      data: {
        key: "greenPhosphor",
        ...colorThemes.greenPhosphor,
        ...themeContent,
      },
    },
    ibmPcXt: {
      name: "ibmPcXt",
      data: {
        key: "ibmPcXt",
        ...colorThemes.ibmPcXt,
        ...themeContent,
      },
    },
    commodore64: {
      name: "commodore64",
      data: {
        key: "commodore64",
        ...colorThemes.commodore64,
        ...themeContent,
      },
    },
    appleII: {
      name: "appleII",
      data: {
        key: "appleII",
        ...colorThemes.appleII,
        ...themeContent,
      },
    },
    zxSpectrum: {
      name: "zxSpectrum",
      data: {
        key: "zxSpectrum",
        ...colorThemes.zxSpectrum,
        ...themeContent,
      },
    },
    atari8bit: {
      name: "atari8bit",
      data: {
        key: "atari8bit",
        ...colorThemes.atari8bit,
        ...themeContent,
      },
    },
    msdos: {
      name: "msdos",
      data: {
        key: "msdos",
        ...colorThemes.msdos,
        ...themeContent,
      },
    },
    amigaWorkbench: {
      name: "amigaWorkbench",
      data: {
        key: "amigaWorkbench",
        ...colorThemes.amigaWorkbench,
        ...themeContent,
      },
    },
    nes: {
      name: "nes",
      data: {
        key: "nes",
        ...colorThemes.nes,
        ...themeContent,
      },
    },
    gameboy: {
      name: "gameboy",
      data: {
        key: "gameboy",
        ...colorThemes.gameboy,
        ...themeContent,
      },
    },
    sega: {
      name: "sega",
      data: {
        key: "sega",
        ...colorThemes.sega,
        ...themeContent,
      },
    },
    mustang69: {
      name: "mustang69",
      data: {
        key: "mustang69",
        ...colorThemes.mustang69,
        ...themeContent,
      },
    },
    camaro69: {
      name: "camaro69",
      data: {
        key: "camaro69",
        ...colorThemes.camaro69,
        ...themeContent,
      },
    },
    corvette72: {
      name: "corvette72",
      data: {
        key: "corvette72",
        ...colorThemes.corvette72,
        ...themeContent,
      },
    },
    beetle68: {
      name: "beetle68",
      data: {
        key: "beetle68",
        ...colorThemes.beetle68,
        ...themeContent,
      },
    },
    audi80: {
      name: "audi80",
      data: {
        key: "audi80",
        ...colorThemes.audi80,
        ...themeContent,
      },
    },
    porsche911: {
      name: "porsche911",
      data: {
        key: "porsche911",
        ...colorThemes.porsche911,
        ...themeContent,
      },
    },
    spiritedAway: {
      name: "spiritedAway",
      data: {
        key: "spiritedAway",
        ...colorThemes.spiritedAway,
        ...themeContent,
      },
    },
    myNeighborTotoro: {
      name: "myNeighborTotoro",
      data: {
        key: "myNeighborTotoro",
        ...colorThemes.myNeighborTotoro,
        ...themeContent,
      },
    },
    howlsMovingCastle: {
      name: "howlsMovingCastle",
      data: {
        key: "howlsMovingCastle",
        ...colorThemes.howlsMovingCastle,
        ...themeContent,
      },
    },
    sakuraBreeze: {
      name: "sakuraBreeze",
      data: {
        key: "sakuraBreeze",
        ...colorThemes.sakuraBreeze,
        ...themeContent,
      },
    },
    zenGarden: {
      name: "zenGarden",
      data: {
        key: "zenGarden",
        ...colorThemes.zenGarden,
        ...themeContent,
      },
    },
    pastelAnime: {
      name: "pastelAnime",
      data: {
        key: "pastelAnime",
        ...colorThemes.pastelAnime,
        ...themeContent,
      },
    },
    deathNote: {
      name: "deathNote",
      data: {
        key: "deathNote",
        ...colorThemes.deathNote,
        ...themeContent,
      },
    },
    attackOnTitan: {
      name: "attackOnTitan",
      data: {
        key: "attackOnTitan",
        ...colorThemes.attackOnTitan,
        ...themeContent,
      },
    },
    tokyoGhoul: {
      name: "tokyoGhoul",
      data: {
        key: "tokyoGhoul",
        ...colorThemes.tokyoGhoul,
        ...themeContent,
      },
    },
    akc12: {
      name: "akc12",
      data: {
        key: "akc12",
        ...colorThemes.akc12,
        ...themeContent,
      },
    },
    taikonColor24: {
      name: "taikonColor24",
      data: {
        key: "taikonColor24",
        ...colorThemes.taikonColor24,
        ...themeContent,
      },
    },
    eightVision: {
      name: "eightVision",
      data: {
        key: "eightVision",
        ...colorThemes.eightVision,
        ...themeContent,
      },
    },
    cgaPalette0Low: {
      name: "cgaPalette0Low",
      data: {
        key: "cgaPalette0Low",
        ...colorThemes.cgaPalette0Low,
        ...themeContent,
      },
    },
    metallicChic: {
      name: "metallicChic",
      data: {
        key: "metallicChic",
        ...colorThemes.metallicChic,
        ...themeContent,
      },
    },
    deepVintageMood: {
      name: "deepVintageMood",
      data: {
        key: "deepVintageMood",
        ...colorThemes.deepVintageMood,
        ...themeContent,
      },
    },
    coolAndCollected: {
      name: "coolAndCollected",
      data: {
        key: "coolAndCollected",
        ...colorThemes.coolAndCollected,
        ...themeContent,
      },
    },
    earthyAndSerene: {
      name: "earthyAndSerene",
      data: {
        key: "earthyAndSerene",
        ...colorThemes.earthyAndSerene,
        ...themeContent,
      },
    },
    textureAndContrast: {
      name: "textureAndContrast",
      data: {
        key: "textureAndContrast",
        ...colorThemes.textureAndContrast,
        ...themeContent,
      },
    },
    mechanicalAndFloaty: {
      name: "mechanicalAndFloaty",
      data: {
        key: "mechanicalAndFloaty",
        ...colorThemes.mechanicalAndFloaty,
        ...themeContent,
      },
    },
    pixelIntensity: {
      name: "pixelIntensity",
      data: {
        key: "pixelIntensity",
        ...colorThemes.pixelIntensity,
        ...themeContent,
      },
    },
    gradientPop: {
      name: "gradientPop",
      data: {
        key: "gradientPop",
        ...colorThemes.gradientPop,
        ...themeContent,
      },
    },
    cosmicArtistry: {
      name: "cosmicArtistry",
      data: {
        key: "cosmicArtistry",
        ...colorThemes.cosmicArtistry,
        ...themeContent,
      },
    },
    vibrantButCalm: {
      name: "vibrantButCalm",
      data: {
        key: "vibrantButCalm",
        ...colorThemes.vibrantButCalm,
        ...themeContent,
      },
    },
    livelyAndInviting: {
      name: "livelyAndInviting",
      data: {
        key: "livelyAndInviting",
        ...colorThemes.livelyAndInviting,
        ...themeContent,
      },
    },
    strikingAndSimple: {
      name: "strikingAndSimple",
      data: {
        key: "strikingAndSimple",
        ...colorThemes.strikingAndSimple,
        ...themeContent,
      },
    },
    redAndLively: {
      name: "redAndLively",
      data: {
        key: "redAndLively",
        ...colorThemes.redAndLively,
        ...themeContent,
      },
    },
    artsyAndCreative: {
      name: "artsyAndCreative",
      data: {
        key: "artsyAndCreative",
        ...colorThemes.artsyAndCreative,
        ...themeContent,
      },
    },
    elegantYetApproachable: {
      name: "elegantYetApproachable",
      data: {
        key: "elegantYetApproachable",
        ...colorThemes.elegantYetApproachable,
        ...themeContent,
      },
    },
    sleekAndFuturistic: {
      name: "sleekAndFuturistic",
      data: {
        key: "sleekAndFuturistic",
        ...colorThemes.sleekAndFuturistic,
        ...themeContent,
      },
    },
    innovativeAndAudacious: {
      name: "innovativeAndAudacious",
      data: {
        key: "innovativeAndAudacious",
        ...colorThemes.innovativeAndAudacious,
        ...themeContent,
      },
    },
  };