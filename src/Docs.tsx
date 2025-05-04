import React from "react";
import { Button } from "./components/ui/button";
import TopNav from "@/components/top-nav";
import mainLogo from "@/assets/1024.png";

const Docs: React.FC = () => {
  return (
    <div className="min-h-screen w-full">
      <TopNav />

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-4 py-16 text-center">
        {/* Title */}
        <h1
          className="text-4xl md:text-6xl font-bold text-blue-darkest dark:text-blue-lightest mb-2"
          style={{ fontFamily: "Sour_Gummy", fontWeight: "bolder" }}
        >
          JourneyApp.me Documentation
        </h1>

        {/* Subtitle */}
        <h2 className="text-xl md:text-2xl text-blue-semi-dark dark:text-blue-lightest mb-2">
          Your Guide to Introspection and Creativity
        </h2>

        {/* App Icon */}
        <div className="mb-4">
          <div className="w-32 h-32 md:w-64 md:h-64 rounded-3xl bg-gradient-to-br from-blue-lightest to-blue-semi-light p-6 flex items-center justify-center">
            <img
              width="90%"
              height="90%"
              src={mainLogo}
              alt="App Icon"
              style={{ borderRadius: 12 }}
            />
          </div>
        </div>

        {/* Description */}
        <p className="max-w-3xl text-lg md:text-xl text-muted-foreground mb-8">
          Explore the features, setup guides, and best practices for using
          JourneyApp.me effectively. Feel free to check them out{" "}
          <a
            href="https://vigorous-helicona-f1e.notion.site/JourneyApp-me-Official-Documentation-18426f695b8e805ab8efc17f6634877d?pvs=4"
            className="text-blue-semi-dark dark:text-blue-semi-light font-bold hover:text-blue-semi-light dark:hover:text-blue-lightest"
            target="_blank"
            rel="noopener noreferrer"
          >
            {"here on Notion "}
          </a>
          while we work on the documentation for this website.
        </p>

        {/* CTA Button */}
        <Button
          asChild
          size="lg"
          className="bg-blue-semi-light hover:bg-blue-semi-dark text-white px-12 py-4 text-lg font-semibold shadow-lg"
        >
          <a href="/get-started">Get Started</a>
        </Button>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>&copy; 2025 JourneyApp.me. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Docs;
