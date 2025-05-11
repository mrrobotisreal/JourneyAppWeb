import React from "react";
import {
  Sun,
  Menu,
  X,
  Search,
  SlidersHorizontal,
  Settings,
} from "lucide-react";
import { MoonIcon as Moon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useTheme } from "./theme-provider";
import mainLogo from "@/assets/1024.png";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-800 [&]:bg-transparent"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all text-gray-700 dark:text-gray-200 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all text-gray-700 dark:text-gray-200 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

const AppTopNav: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and App Name */}
          <div className="flex items-center space-x-3">
            <a href="/" className="flex items-center space-x-3">
              <img src={mainLogo} width="32" height="32" />
              <span
                className="text-xl font-bold text-blue-darkest dark:text-blue-lightest"
                style={{ fontFamily: "Sour_Gummy" }}
              >
                JourneyApp.me
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="flex items-center gap-2">
              {/* Search input with icon */}
              <div className="relative w-80">
                <Input placeholder="Search entries…" className="pr-10" />
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>

              {/* Filters button */}
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
            <a
              onClick={() => {
                signOut(auth);
              }}
              className="text-foreground hover:text-blue-semi-dark dark:hover:text-blue-lightest"
            >
              Sign Out
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-8 w-8"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && <div className="md:hidden border-t"></div>}
    </nav>
  );
};

export default AppTopNav;
