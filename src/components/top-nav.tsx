import React from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { useTheme } from "./theme-provider";
import mainLogo from "@/assets/1024.png";

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

const TopNav: React.FC = () => {
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
          <div className="hidden md:flex items-center justify-between w-full">
            <div className="ml-8">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="/features"
                      className="px-4 py-2 text-foreground hover:text-blue-semi-dark dark:hover:text-blue-lightest"
                    >
                      Features
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="/about"
                      className="px-4 py-2 text-foreground hover:text-blue-semi-dark dark:hover:text-blue-lightest"
                    >
                      About
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="/docs"
                      className="px-4 py-2 text-foreground hover:text-blue-semi-dark dark:hover:text-blue-lightest"
                    >
                      Documentation
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Large spacer */}
            <div className="flex-grow" />

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <a
                href="/signin"
                className="text-foreground hover:text-blue-semi-dark dark:hover:text-blue-lightest"
              >
                Sign In
              </a>
              <Button
                asChild
                className="bg-blue-semi-light hover:bg-blue-semi-dark text-white"
              >
                <a href="/get-started">Get Started</a>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
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
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-4 py-4 space-y-4">
            <a
              href="/features"
              className="block text-foreground hover:text-blue-semi-dark dark:hover:text-blue-lightest"
            >
              Features
            </a>
            <a
              href="/about"
              className="block text-foreground hover:text-blue-semi-dark dark:hover:text-blue-lightest"
            >
              About
            </a>
            <a
              href="/docs"
              className="block text-foreground hover:text-blue-semi-dark dark:hover:text-blue-lightest"
            >
              Documentation
            </a>
            <a
              href="/signin"
              className="block text-foreground hover:text-blue-semi-dark dark:hover:text-blue-lightest"
            >
              Sign In
            </a>
            <Button
              asChild
              className="w-full bg-blue-semi-light hover:bg-blue-semi-dark text-white"
            >
              <a href="/get-started">Get Started</a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNav;
