import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type MarkdownNode = {
  type:
    | "text"
    | "bold"
    | "italic"
    | "underline"
    | "strikethrough"
    | "code"
    | "color"
    | "highlight";
  value?: string; // for text
  children?: MarkdownNode[]; // for nested
  textColor?: string; // for text color
  highlightColor?: string; // for background color
};
