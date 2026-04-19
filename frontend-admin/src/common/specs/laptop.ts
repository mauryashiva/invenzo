// src/common/specs/laptop.ts

export const LAPTOP_SUGGESTIONS: Record<string, string[]> = {
  // 📺 DISPLAY
  "Display Size": [
    "13.3 inch",
    "13.6 inch",
    "14.2 inch",
    "15.3 inch",
    "15.6 inch",
    "16.2 inch",
    "17.3 inch",
  ],
  Resolution: [
    "1920 x 1080 (FHD)",
    "2560 x 1600 (QHD+)",
    "2880 x 1800 (2.8K OLED)",
    "3024 x 1964 (Liquid Retina)",
    "3456 x 2234 (Liquid Retina XDR)",
    "3840 x 2160 (4K UHD)",
  ],
  "Display Type": [
    "IPS LCD",
    "OLED",
    "Mini-LED",
    "Liquid Retina XDR",
    "LTPO OLED (120Hz)",
  ],
  "Refresh Rate": [
    "60Hz",
    "90Hz",
    "120Hz (ProMotion)",
    "144Hz",
    "165Hz",
    "240Hz",
  ],

  // ⚙️ PERFORMANCE
  Processor: [
    "Apple M4 Chip",
    "Apple M4 Pro",
    "Apple M4 Max",
    "Intel Core Ultra 7 155H",
    "Intel Core Ultra 9 185H",
    "Intel Core Ultra 7 (Series 2)",
    "AMD Ryzen AI 9 HX 370",
    "AMD Ryzen 7 8845HS",
    "Snapdragon X Elite",
  ],
  "CPU Speed": [
    "Up to 4.5 GHz",
    "Up to 5.0 GHz",
    "Up to 5.1 GHz",
    "Up to 5.4 GHz",
  ],
  GPU: [
    "10-Core GPU (M4)",
    "16-Core GPU (M4 Pro)",
    "40-Core GPU (M4 Max)",
    "NVIDIA RTX 4060 8GB",
    "NVIDIA RTX 4070 8GB",
    "NVIDIA RTX 4080 12GB",
    "NVIDIA RTX 4090 16GB",
    "Intel Arc Graphics",
    "AMD Radeon 890M",
  ],
  "RAM Size": [
    "8GB",
    "16GB",
    "24GB",
    "32GB",
    "36GB",
    "48GB",
    "64GB",
    "96GB",
    "128GB",
  ],
  "RAM Type": ["LPDDR5x", "DDR5", "Unified Memory (Apple)"],
  "Storage Type": ["NVMe Gen4 SSD", "NVMe Gen5 SSD", "Unified Storage"],
  "Storage Capacity": ["256GB", "512GB", "1TB", "2TB", "4TB", "8TB"],

  // 🔋 BATTERY & POWER
  "Battery Capacity": ["52Wh", "66Wh", "72Wh", "84Wh", "99.5Wh (Flight Limit)"],
  Charging: [
    "65W USB-C",
    "100W MagSafe/USB-C",
    "140W USB-C (PD 3.1)",
    "170W Proprietary",
    "240W GaN Fast Charger",
  ],
  "Power Adapter": ["70W USB-C", "96W USB-C", "140W Adapter", "240W Adapter"],

  // 💻 SOFTWARE
  "Operating System": [
    "Windows 11 Home",
    "Windows 11 Pro",
    "macOS Sequoia",
    "macOS Sonoma",
    "Fedora Workstation",
  ],

  // 🎮 FEATURES
  "Keyboard Type": [
    "Magic Keyboard",
    "Backlit Keyboard",
    "RGB Gaming Keyboard",
    "Mechanical (Cherry MX)",
  ],
  Touchscreen: ["Yes", "No"],

  // 🎧 AUDIO
  Speakers: [
    "Stereo Speakers",
    "High-Fidelity 6-Speaker System",
    "Quad Speakers",
  ],
  Audio: ["Dolby Atmos", "Spatial Audio", "Harman Kardon", "DTS:X Ultra"],

  // 📷 CAMERA
  Webcam: [
    "1080p FaceTime HD",
    "1080p Full HD",
    "1440p Quad HD",
    "5MP AI Camera",
  ],

  // 🔐 SECURITY
  "Fingerprint Sensor": ["Touch ID", "Power Button Integrated", "No"],
  "Face Unlock": ["Face ID", "Windows Hello (IR Camera)", "No"],

  // 🌐 CONNECTIVITY
  "Wi-Fi": ["Wi-Fi 6E", "Wi-Fi 7 (Ready)"],
  Bluetooth: ["5.3", "5.4"],

  // 🔌 PORTS
  Ports: [
    "3x Thunderbolt 4 (USB-C), HDMI 2.1, SDXC",
    "2x USB-C, 2x USB-A, HDMI, RJ45",
    "Thunderbolt 5 (Latest), USB-A, MagSafe 3",
  ],

  // 🏗️ BUILD & DESIGN
  "Build Material": [
    "100% Recycled Aluminum",
    "Magnesium Alloy",
    "Carbon Fiber",
    "Titanium Finish",
  ],
  Color: [
    "Space Black",
    "Silver",
    "Midnight",
    "Starlight",
    "Graphite",
    "Eclipse Gray",
  ],
  "Form Factor": [
    "Ultra-slim Clamshell",
    "2-in-1 Convertible",
    "Gaming Heavyweight",
  ],

  // 📏 SIZE
  Weight: ["1.1kg (Air)", "1.4kg", "1.6kg", "2.1kg", "2.5kg"],

  // 📅 OTHER
  "Release Year": ["2024", "2025", "2026"],
  Warranty: [
    "1 Year AppleCare",
    "1 Year Limited",
    "3 Year Next Business Day On-site",
  ],
};

// Keys for the property dropdown
export const LAPTOP_KEYS = Object.keys(LAPTOP_SUGGESTIONS);
