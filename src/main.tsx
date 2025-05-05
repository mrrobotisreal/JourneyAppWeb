import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./AppRouter";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <AuthProvider>
      <AppRouter />
      <Toaster richColors closeButton />
    </AuthProvider>
  </ThemeProvider>
);
