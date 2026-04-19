import { useReducer } from "react";
import type {
  InventoryProduct,
  CategoryType,
  Variant,
  SpecEntry,
  StockUnit, // Ensure this is exported from your types
} from "@/types/inventory";

type Action =
  | { type: "SET_CATEGORY"; payload: CategoryType }
  | { type: "UPDATE_BASE_INFO"; payload: Partial<InventoryProduct> }
  | { type: "SET_SPECS"; payload: SpecEntry[] }
  | { type: "ADD_VARIANT" }
  | { type: "REMOVE_VARIANT"; index: number }
  | { type: "UPDATE_VARIANT"; index: number; data: Partial<Variant> };

const initialState: InventoryProduct = {
  brandId: "",
  name: "",
  modelNumber: "",
  categoryId: "electronics",
  category: "smartphone",
  warranty: 12,
  purchaseGst: 18,
  salesGst: 18,
  features: [],
  specs: [
    { key: "Display", value: "" },
    { key: "Processor", value: "" },
    { key: "Battery", value: "" },
  ],
  variants: [
    {
      sku: `SKU-${Date.now()}`,
      color: "#000000",
      colorName: "Black",
      ram: "8GB",
      storage: "128GB",
      baseCost: 0,
      sellingPrice: 0,
      stock: 0,
      reorderLevel: 5,
      images: [],
    },
  ],
  stockUnits: [], // Initialized for IMEI/Serial tracking
};

export function useProductForm() {
  const [state, dispatch] = useReducer(
    (state: InventoryProduct, action: Action): InventoryProduct => {
      switch (action.type) {
        case "SET_CATEGORY":
          return { ...state, category: action.payload };

        case "UPDATE_BASE_INFO":
          return { ...state, ...action.payload };

        case "SET_SPECS":
          return { ...state, specs: action.payload };

        case "UPDATE_VARIANT": {
          const newVariants = [...state.variants];
          newVariants[action.index] = {
            ...newVariants[action.index],
            ...action.data,
          };
          return { ...state, variants: newVariants };
        }

        case "ADD_VARIANT":
          return {
            ...state,
            variants: [
              ...state.variants,
              {
                ...initialState.variants[0],
                sku: `SKU-${Date.now()}-${state.variants.length}`,
              },
            ],
          };

        case "REMOVE_VARIANT":
          if (state.variants.length <= 1) return state;
          const removedSku = state.variants[action.index].sku;
          return {
            ...state,
            variants: state.variants.filter((_, i) => i !== action.index),
            // Clean up stock units associated with the removed variant
            stockUnits: state.stockUnits.filter(
              (u) => u.variantId !== removedSku,
            ),
          };

        default:
          return state;
      }
    },
    initialState,
  );

  return { state, dispatch };
}
