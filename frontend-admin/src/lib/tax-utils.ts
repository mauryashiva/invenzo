// src/lib/tax-utils.ts

/**
 * 🏷️ HSN GENERATOR
 * Restored to fix the import error in ProductInfo.tsx
 */
export const generateHsn = (dept?: string, fashionType?: string, category?: string): string => {
  if (!dept) return "---";
  
  const d = dept.toLowerCase();
  const t = fashionType?.toLowerCase();
  const c = category?.toLowerCase();

  // Electronics Logic
  if (d === "electronics") {
    if (c === "smartphone") return "851710";
    if (c === "laptop" || c === "tablet") return "847110";
    return "850010";
  }

  // Fashion Logic
  if (d === "fashion") {
    if (t === "apparel") return "610910";
    if (t === "footwear") return "640310";
    return "620010";
  }

  return "999910";
};

/**
 * 💰 SALES GST CALCULATOR
 * Updated with your specific real-world slabs (Footwear > 1000 = 18%, etc.)
 */
export const calculateSalesGst = (
  dept?: string, 
  fashionType?: string, 
  price: number = 0, 
  category?: string
): number => {
  if (!dept) return 18;
  
  const d = dept.toLowerCase();
  const t = fashionType?.toLowerCase();
  const c = category?.toLowerCase();

  // 📱 ELECTRONICS: Standard Industry Rate
  if (d === "electronics") return 18;

  // 👗 FASHION: Complex Logic
  if (d === "fashion") {
    
    // 1. Jewelry (Special 3% Slab)
    if (c?.includes("jewelry") || t === "jewelry" || c?.includes("gold")) return 3;

    // 2. Footwear Logic (Threshold Based)
    if (t === "footwear") {
      // Per your requirement: Above 1000 is 18%
      return price > 1000 ? 18 : 5; 
    }

    // 3. Apparel Logic (Threshold Based)
    if (t === "apparel") {
      const threshold = 1000; 
      
      // Sportswear / Premium branded usually 12%
      if (c?.includes("sportswear")) return 12;
      // School uniforms / Innerwear usually 5%
      if (c?.includes("uniform") || c?.includes("innerwear")) return 5;

      return price > threshold ? 12 : 5;
    }

    // 4. Luxury & High-End Accessories (Fixed 18%)
    // Handbags, Watches, Sunglasses, Belts, Wallets, Leather goods
    const luxuryTypes = ["accessories", "watches", "bags", "sunglasses"];
    if (luxuryTypes.includes(t || "")) return 18;

    return 12; // Default Fashion Slab fallback
  }

  return 18; // Global Default
};