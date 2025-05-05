import { createRoot } from "react-dom/client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./index.css";
import AppRouter from "./AppRouter";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true, // this is already true by default, but leaving here as a reminder to come back and configure this
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={client}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <AppRouter />
        <Toaster richColors closeButton />
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
