// src/common/specs/smartphone.ts

export const SMARTPHONE_SUGGESTIONS: Record<string, string[]> = {
  // 📺 DISPLAY
  "Display Size": [
    "6.1 inch",
    "6.3 inch",
    "6.5 inch",
    "6.7 inch",
    "6.8 inch",
    "6.9 inch",
  ],
  "Display Type": [
    "AMOLED",
    "Super AMOLED",
    "OLED",
    "LTPO OLED",
    "IPS LCD",
    "TFT",
    "Dynamic AMOLED 2X",
  ],
  Resolution: ["Full HD+", "QHD+", "2340 x 1080 pixels", "2796 x 1290 pixels"],
  "Refresh Rate": ["60Hz", "90Hz", "120Hz", "144Hz", "165Hz"],
  "Pixel Density": ["393 PPI", "402 PPI", "460 PPI", "500+ PPI"],
  Brightness: ["800 nits", "1000 nits", "1200 nits", "1600 nits", "2000+ nits"],
  Protection: [
    "Gorilla Glass Victus",
    "Gorilla Glass Victus 2",
    "Ceramic Shield",
    "Dragontrail",
  ],

  // ⚙️ PERFORMANCE
  Processor: [
    "Snapdragon 8 Elite",
    "Snapdragon 8 Gen 3",
    "Exynos 1480",
    "Exynos 2400",
    "Dimensity 9400",
    "Apple A18 Pro",
  ],
  RAM: ["4GB", "6GB", "8GB", "12GB", "16GB", "24GB"],
  Storage: ["64GB", "128GB", "256GB", "512GB", "1TB"],
  "Expandable Storage": ["No", "Up to 1TB (microSD)", "Hybrid Slot"],

  // 📸 CAMERA
  "Rear Camera": ["12MP", "48MP", "50MP", "64MP", "108MP", "200MP"],
  "Front Camera": ["8MP", "12MP", "16MP", "32MP"],
  "Video Recording": [
    "1080p @ 30fps",
    "4K @ 30fps",
    "4K @ 60fps",
    "8K @ 24fps",
  ],

  // 🔋 BATTERY
  "Battery Capacity": ["4000mAh", "4500mAh", "5000mAh", "5500mAh", "6000mAh"],
  Charging: [
    "15W",
    "25W Fast Charging",
    "45W Fast Charging",
    "67W",
    "120W HyperCharge",
  ],
  "Wireless Charging": ["No", "15W Wireless", "MagSafe Supported"],

  // 🧠 SOFTWARE
  "Operating System": ["Android 15", "Android 14", "iOS 18", "HarmonyOS"],
  UI: ["One UI", "Stock Android", "HyperOS", "OxygenOS", "ColorOS"],

  // 🌐 CONNECTIVITY
  "Network Type": ["5G, 4G LTE, 3G, 2G", "4G LTE Only"],
  "Wi-Fi": ["Wi-Fi 5", "Wi-Fi 6", "Wi-Fi 6E", "Wi-Fi 7"],
  Bluetooth: ["5.0", "5.1", "5.2", "5.3", "5.4"],
  NFC: ["Yes", "No"],
  "USB Type": ["USB Type-C 2.0", "USB Type-C 3.2", "Lightning"],

  // 📶 SIM
  "SIM Type": ["Dual SIM (Nano + Nano)", "Nano + eSIM", "Single SIM"],
  "eSIM Support": ["Yes", "No"],

  // 🔊 AUDIO
  Speakers: ["Stereo Speakers", "Mono Speaker"],
  "Audio Jack": ["Yes", "No"],

  // 🔐 SECURITY
  "Fingerprint Sensor": [
    "In-display (Optical)",
    "In-display (Ultrasonic)",
    "Side-mounted",
    "Rear-mounted",
    "No (Face ID only)",
  ],
  "Face Unlock": ["Yes", "No"],

  // 🏗️ BUILD
  "Build Material": [
    "Plastic Back, Glass Front",
    "Glass Back, Aluminum Frame",
    "Titanium Frame, Glass Back",
    "Eco-Leather Back",
  ],
  "Water Resistance": ["IP67", "IP68", "IPX8", "IP54", "No"],

  // 📏 DIMENSIONS & DESIGN
  Color: [
    "Black",
    "White",
    "Silver",
    "Light Green",
    "Navy Blue",
    "Titanium Grey",
  ],
  "Form Factor": ["Bar", "Foldable (Flip)", "Foldable (Fold)"],

  // 📅 OTHER
  "Release Year": ["2023", "2024", "2025", "2026"],
  Warranty: [
    "1 Year Manufacturer Warranty",
    "2 Year Manufacturer Warranty",
    "No Warranty",
  ],
};

// This gives us the list of Keys for the first dropdown
export const SMARTPHONE_KEYS = Object.keys(SMARTPHONE_SUGGESTIONS);
