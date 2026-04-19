import { useContext } from "react";
import { ThemeContext } from "@/providers/ThemeProvider";

export const useTheme = () => {
  return useContext(ThemeContext);
};
