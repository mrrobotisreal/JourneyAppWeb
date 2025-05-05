import React from "react";

/**
 * Centers a spinning SVG on the viewport.
 * Uses Tailwind for layout and animation.
 */
const FullPageSpinner: React.FC = () => (
  <div className="grid h-screen w-screen place-items-center bg-background">
    <svg
      className="h-14 w-14 animate-spin text-blue-semi-dark dark:text-blue-semi-light"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  </div>
);

export default FullPageSpinner;
