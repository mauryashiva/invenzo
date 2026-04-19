// src/common/specs/tablet.ts

export const TABLET_SUGGESTIONS: Record<string, string[]> = {
  // 📺 DISPLAY
  "Display Size": [
    "8.3 inch (Mini)",
    "10.9 inch",
    "11.0 inch",
    "12.4 inch",
    "12.9 inch",
    "13.0 inch",
    "14.6 inch (Ultra)",
  ],
  Resolution: [
    "2266 x 1488 (Retina)",
    "2360 x 1640 (Liquid Retina)",
    "2420 x 1668 (Ultra Retina Tandem OLED)",
    "2800 x 1752 (WQXGA+)",
    "2752 x 2064 (Ultra Retina XDR)",
    "2960 x 1848 (Dynamic AMOLED 2X)",
  ],
  "Display Type": [
    "IPS LCD",
    "Tandem OLED",
    "Dynamic AMOLED 2X",
    "Liquid Retina (LED)",
    "Super AMOLED",
  ],
  "Refresh Rate": ["60Hz", "90Hz", "120Hz (ProMotion)", "144Hz"],
  Brightness: [
    "500 nits",
    "600 nits",
    "1000 nits (HBM)",
    "1600 nits (Peak HDR)",
  ],

  // ⚙️ PERFORMANCE
  Processor: [
    "Apple M4 Chip",
    "Apple M2 Chip",
    "Apple A18 Pro",
    "Snapdragon 8 Gen 3 for Galaxy",
    "Snapdragon 8 Gen 2",
    "Snapdragon X Plus (Tablet Edition)",
    "MediaTek Dimensity 9300",
  ],
  "CPU Speed": ["Up to 3.2 GHz", "Up to 3.4 GHz", "Up to 4.0 GHz"],
  GPU: ["10-Core GPU (M4)", "Adreno 750", "Adreno 740", "Immortalis-G720"],
  "RAM Size": ["4GB", "8GB", "12GB", "16GB", "24GB"],
  "Storage Capacity": ["64GB", "128GB", "256GB", "512GB", "1TB", "2TB"],
  "Expandable Storage": ["No", "Up to 1TB (microSD)", "Up to 2TB (microSD)"],

  // 📸 CAMERA
  "Rear Camera": [
    "8MP Wide",
    "12MP Wide (f/1.8)",
    "13MP Wide + 8MP Ultra Wide",
    "50MP Main Sensor",
  ],
  "Front Camera": [
    "12MP Ultra Wide (Center Stage)",
    "12MP Landscape Ultra Wide",
    "8MP Standard",
  ],
  "Video Recording": [
    "1080p @ 30fps",
    "1080p @ 60fps",
    "4K @ 30fps",
    "4K @ 60fps (ProRes)",
  ],

  // 🔋 BATTERY & POWER
  "Battery Capacity": ["5000mAh", "7600mAh", "8000mAh", "10090mAh", "11200mAh"],
  Charging: [
    "15W Standard",
    "20W USB-C",
    "30W Fast Charging",
    "45W Super Fast Charging 2.0",
    "67W HyperCharge",
  ],

  // 💻 SOFTWARE
  "Operating System": [
    "iPadOS 17",
    "iPadOS 18 (Beta)",
    "Android 14 (One UI 6.1)",
    "Android 13",
    "Windows 11 (Arm)",
  ],

  // 🌐 CONNECTIVITY
  "Wi-Fi": ["Wi-Fi 6", "Wi-Fi 6E", "Wi-Fi 7"],
  Bluetooth: ["5.2", "5.3", "5.4"],
  Connectivity: [
    "Wi-Fi Only",
    "Wi-Fi + Cellular (5G)",
    "Wi-Fi + Cellular (4G LTE)",
  ],
  "SIM Type": ["eSIM Only", "Nano-SIM + eSIM", "Nano-SIM", "No SIM"],

  // ✍️ ACCESSORIES
  "Stylus Support": [
    "Apple Pencil Pro",
    "Apple Pencil (USB-C)",
    "S Pen (Included)",
    "S Pen Creator Edition",
    "No Support",
  ],
  "Keyboard Support": [
    "Magic Keyboard",
    "Smart Keyboard Folio",
    "Book Cover Keyboard",
    "Universal Bluetooth Keyboard",
  ],

  // 🔊 AUDIO
  Speakers: ["Dual Stereo Speakers", "Quad Speakers (Stereo)", "Dual Speakers"],
  Audio: ["Dolby Atmos", "Tuned by AKG", "Hi-Res Audio"],

  // 🔐 SECURITY
  "Fingerprint Sensor": [
    "Touch ID (Top Button)",
    "In-display Fingerprint",
    "Side-mounted",
    "No",
  ],
  "Face Unlock": ["Face ID", "AI Face Unlock", "No"],

  // 🔌 PORTS
  "USB Type": [
    "USB-C (USB 2.0)",
    "USB-C (USB 3.1 Gen 1)",
    "Thunderbolt / USB 4",
  ],
  "Audio Jack": ["3.5mm Jack", "No"],

  // 🏗️ BUILD & DESIGN
  "Build Material": [
    "Aluminum Body",
    "Recycled Aluminum",
    "Plastic / Polycarbonate",
    "Glass Front / Aluminum Back",
  ],
  "Water Resistance": ["IP68", "IP65", "No"],
  Color: [
    "Space Gray",
    "Silver",
    "Sky Blue",
    "Graphite",
    "Rose Gold",
    "Obsidian",
  ],

  // 📏 SIZE
  Weight: ["293g (Mini)", "444g", "462g", "580g", "732g (Ultra)"],

  // 📅 OTHER
  "Release Year": ["2023", "2024", "2025", "2026"],
  Warranty: [
    "1 Year AppleCare+",
    "1 Year Standard Warranty",
    "2 Year Extended Warranty",
  ],
};

// Keys for the property dropdown
export const TABLET_KEYS = Object.keys(TABLET_SUGGESTIONS);
