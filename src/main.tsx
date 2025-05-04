import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./AppRouter";
import { ThemeProvider } from "@/components/theme-provider";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <AppRouter />
  </ThemeProvider>
);
