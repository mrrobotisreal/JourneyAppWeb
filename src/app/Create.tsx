import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router";
// import { useAuth } from "@/context/AuthContext";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Strikethrough,
  Underline,
  CodeXmlIcon,
  BaselineIcon,
  List,
  ListOrderedIcon,
  ListTodoIcon,
  ImagePlusIcon,
  TagsIcon,
  MapPinPlusIcon,
  TypeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
} from "lucide-react";
import AppTopNav from "@/components/app-top-nav";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const textStyleShortcuts = [
  { label: "Bold", key: "b", shortcut: "⌘B or ^B" },
  { label: "Italic", key: "i", shortcut: "⌘I or ^I" },
  { label: "Strikethrough", key: "x", shortcut: "⌘⇧X or ^⇧X", shift: true },
  { label: "Underline", key: "u", shortcut: "⌘U or ^U" },
  { label: "Code", key: "e", shortcut: "⌘E or ^E" },
  { label: "Highlight/Color", key: "h", shortcut: "⌘H or ^H" },
  { label: "Font Family", key: "f", shortcut: "⌘F or ^F" },
];

const COLOR_PALETTE = [
  "#000000",
  "#434343",
  "#666666",
  "#999999",
  "#b7b7b7",
  "#cccccc",
  "#d9d9d9",
  "#efefef",
  "#f3f3f3",
  "#ffffff",
  "#ff0000",
  "#ff9900",
  "#ffff00",
  "#00ff00",
  "#00ffff",
  "#4a86e8",
  "#0000ff",
  "#9900ff",
  "#ff00ff",
  "#ff0080",
];

const FONT_FAMILIES = [
  "Advent_Pro",
  "DM_Sans",
  "Grandstander",
  "Josefin_Slab",
  "Saira",
  "Shantell_Sans",
  "Sour_Gummy",
  "Texturina",
];

function htmlToCustomMarkup(html: string): string {
  function processNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || "";
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const el = node as HTMLElement;
    let text = Array.from(el.childNodes).map(processNode).join("");
    const tag = el.tagName.toLowerCase();

    const fg = el.style.color;
    const bg = el.style.backgroundColor;

    if (tag === "b" || tag === "strong") text = `*${text}*`;
    if (tag === "i" || tag === "em") text = `~${text}~`;
    if (tag === "u") text = `_${text}_`;
    if (tag === "s" || tag === "strike" || tag === "del") text = `-${text}-`;
    if (tag === "code" || tag === "pre") text = `\`${text}\``;

    if (fg) text = `{fg:${cssColorToHex(fg)}}${text}{fg}`;
    if (bg) text = `{bg:${cssColorToHex(bg)}}${text}{bg}`;
    return text;
  }

  function cssColorToHex(color: string): string {
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return color;
    ctx.fillStyle = color;
    return ctx.fillStyle;
  }

  const container = document.createElement("div");
  container.innerHTML = html;
  return Array.from(container.childNodes).map(processNode).join("");
}

function getSelectionFormatState() {
  return {
    bold: document.queryCommandState("bold"),
    italic: document.queryCommandState("italic"),
    strikethrough: document.queryCommandState("strikeThrough"),
    underline: document.queryCommandState("underline"),
  };
}

function getSelectionColorState() {
  const selection = document.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return { textColor: null, highlightColor: null };
  }

  let textColor = null;
  let highlightColor = null;

  try {
    const foreColor = document.queryCommandValue("foreColor");
    const hiliteColor = document.queryCommandValue("hiliteColor");

    if (
      foreColor &&
      foreColor !== "rgb(0, 0, 0)" &&
      foreColor !== "rgb(255, 255, 255)"
    ) {
      textColor = rgbToHex(foreColor);
    }

    if (hiliteColor && hiliteColor !== "transparent") {
      highlightColor = rgbToHex(hiliteColor);
    }

    if (!textColor || !highlightColor) {
      const range = selection.getRangeAt(0);
      const parentElement = range.commonAncestorContainer.parentElement;

      if (parentElement) {
        const styles = window.getComputedStyle(parentElement);

        const computedColor = styles.color;
        const isExplicitColor = COLOR_PALETTE.some(
          (c) => normalizeColor(c) === normalizeColor(computedColor)
        );

        if (isExplicitColor) {
          textColor = rgbToHex(computedColor);
        }

        const computedBgColor = styles.backgroundColor;
        if (computedBgColor && computedBgColor !== "transparent") {
          const isExplicitBgColor = COLOR_PALETTE.some(
            (c) => normalizeColor(c) === normalizeColor(computedBgColor)
          );

          if (isExplicitBgColor) {
            highlightColor = rgbToHex(computedBgColor);
          }
        }
      }
    }
  } catch (e) {
    console.error("Error getting selection color state:", e);
  }

  return { textColor, highlightColor };
}

function normalizeColor(color: string | null): string | null {
  if (!color) return null;

  const hex = rgbToHex(color);
  if (!hex) return color.toLowerCase();

  return hex.toLowerCase();
}

function rgbToHex(rgb: string): string | null {
  if (!rgb || rgb === "transparent") return null;

  const rgbMatch = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);

    return (
      "#" +
      ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
    );
  }

  return rgb;
}

const Create: React.FC = () => {
  // const navigate = useNavigate();
  // const { user } = useAuth();
  const [activeTextStyles, setActiveTextStyles] = useState<string[]>([]);
  const [textColor, setTextColor] = useState<string | null>(null);
  const [highlightColor, setHighlightColor] = useState<string | null>(null);
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false);
  const [fontPopoverOpen, setFontPopoverOpen] = useState(false);
  const [selectedFont, setSelectedFont] = useState("Sour_Gummy");
  const [hoveredFont, setHoveredFont] = useState<string | null>(null);
  const colorPopoverRef = useRef<HTMLDivElement | null>(null);
  const colorButtonRef = useRef<HTMLButtonElement | null>(null);
  const fontPopoverRef = useRef<HTMLDivElement | null>(null);
  const fontButtonRef = useRef<HTMLButtonElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [isEditorFocused, setIsEditorFocused] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      for (const { label, key, shift } of textStyleShortcuts) {
        const lower = label.toLowerCase();
        if (
          ((isMac && e.metaKey) || (!isMac && e.ctrlKey)) &&
          e.key.toLowerCase() === key &&
          !!shift === e.shiftKey
        ) {
          e.preventDefault();
          if (lower === "highlight/color") {
            setColorPopoverOpen((open) => !open);
          } else if (lower === "font family") {
            setFontPopoverOpen((open) => !open);
          } else {
            toggleFormat(lower);
          }
          break;
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!colorPopoverOpen) return;
    function handleClickOutside(e: MouseEvent) {
      const popover = colorPopoverRef.current;
      const button = colorButtonRef.current;
      if (
        popover &&
        !popover.contains(e.target as Node) &&
        button &&
        !button.contains(e.target as Node)
      ) {
        setColorPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [colorPopoverOpen]);

  useEffect(() => {
    if (!fontPopoverOpen) return;
    function handleClickOutside(e: MouseEvent) {
      const popover = fontPopoverRef.current;
      const button = fontButtonRef.current;
      if (
        popover &&
        !popover.contains(e.target as Node) &&
        button &&
        !button.contains(e.target as Node)
      ) {
        setFontPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [fontPopoverOpen]);

  function renderColorGrid(
    selectedColor: string | null,
    type: "text" | "highlight"
  ) {
    return (
      <div className="grid grid-cols-5 gap-1">
        {COLOR_PALETTE.map((color) => {
          const isSelected =
            selectedColor &&
            normalizeColor(selectedColor) === normalizeColor(color);

          return (
            <button
              key={color}
              type="button"
              className={`w-6 h-6 rounded border flex items-center justify-center ${
                isSelected ? "ring-2 ring-blue-500" : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => toggleColor(type, color)}
              aria-label={color}
            >
              {isSelected && (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  function isEditorEmpty() {
    const el = editorRef.current;
    if (!el) return true;

    return el.innerText.trim() === "";
  }

  function updateActiveStyles() {
    if (!editorRef.current || !document.getSelection()?.rangeCount) return;

    const formatState = getSelectionFormatState();
    const colorState = getSelectionColorState();
    const styles: string[] = [];

    if (formatState.bold) styles.push("bold");
    if (formatState.italic) styles.push("italic");
    if (formatState.strikethrough) styles.push("strikethrough");
    if (formatState.underline) styles.push("underline");

    // Check if the selection is inside a code element
    const selection = document.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const parentElement = range.commonAncestorContainer.parentElement;
      if (
        parentElement &&
        (parentElement.classList.contains("code-format") ||
          parentElement.closest(".code-format"))
      ) {
        styles.push("code");
      }
    }

    setTextColor(colorState.textColor);
    setHighlightColor(colorState.highlightColor);

    if (colorState.textColor || colorState.highlightColor) {
      styles.push("highlight/color");
    }

    const otherStyles = activeTextStyles.filter(
      (style) =>
        ![
          "bold",
          "italic",
          "strikethrough",
          "underline",
          "highlight/color",
          "code",
        ].includes(style)
    );

    setActiveTextStyles([...styles, ...otherStyles]);
  }

  function toggleFormat(style: string) {
    if (!editorRef.current) return;
    editorRef.current.focus();

    let selection, range, parentElement;

    if (style === "code") {
      // Get current selection
      selection = document.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      // Get selection range and parent element
      range = selection.getRangeAt(0);
      parentElement = range.commonAncestorContainer.parentElement;

      // Check if we're inside a code span and should remove it
      if (
        parentElement &&
        (parentElement.classList.contains("code-format") ||
          parentElement.closest(".code-format"))
      ) {
        // We're inside a code block, so remove the formatting
        const codeSpan = parentElement.classList.contains("code-format")
          ? parentElement
          : parentElement.closest(".code-format");

        if (codeSpan) {
          // Extract the text content
          const textContent = codeSpan.textContent;
          const newTextNode = document.createTextNode(textContent || "");

          // Replace the code span with the text
          codeSpan.parentNode?.replaceChild(newTextNode, codeSpan);

          // Update active styles
          const codeIndex = activeTextStyles.indexOf("code");
          if (codeIndex !== -1) {
            const newStyles = [...activeTextStyles];
            newStyles.splice(codeIndex, 1);
            setActiveTextStyles(newStyles);
          }
        }
      } else {
        // Apply code formatting
        // Create a span with the appropriate styling
        const codeSpan = document.createElement("span");
        codeSpan.className = "code-format";
        codeSpan.style.fontFamily = "monospace";
        codeSpan.style.backgroundColor = "var(--secondary)";
        codeSpan.style.color = "var(--secondary-foreground)";
        codeSpan.style.padding = "0.1em 0.4em";
        codeSpan.style.borderRadius = "3px";

        // Apply the span to the selection
        const selectedContent = range.extractContents();
        codeSpan.appendChild(selectedContent);
        range.insertNode(codeSpan);

        // Set the selection after the inserted node
        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(codeSpan);
        newRange.collapse(false); // Collapse to end
        selection.addRange(newRange);

        // Add to active styles if not already there
        if (!activeTextStyles.includes("code")) {
          setActiveTextStyles([...activeTextStyles, "code"]);
        }
      }

      setTimeout(updateActiveStyles, 0);
      return;
    }

    switch (style) {
      case "bold":
        document.execCommand("bold", false);
        break;
      case "italic":
        document.execCommand("italic", false);
        break;
      case "strikethrough":
        document.execCommand("strikeThrough", false);
        break;
      case "underline":
        document.execCommand("underline", false);
        break;
    }

    setTimeout(updateActiveStyles, 0);
  }

  useEffect(() => {
    function handleSelectionChange() {
      updateActiveStyles();
    }

    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  function toggleColor(type: "text" | "highlight", color: string) {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const colorState = getSelectionColorState();
    const currentColor =
      type === "text" ? colorState.textColor : colorState.highlightColor;

    const isCurrentColor =
      currentColor && currentColor.toLowerCase() === color.toLowerCase();

    if (isCurrentColor) {
      if (type === "text") {
        document.execCommand("removeFormat", false, "foreColor");
        setTextColor(null);
      } else {
        document.execCommand("hiliteColor", false, "transparent");
        setHighlightColor(null);
      }
    } else {
      // Apply the new color
      if (type === "text") {
        document.execCommand("foreColor", false, color);
        setTextColor(color);
      } else {
        document.execCommand("hiliteColor", false, color);
        setHighlightColor(color);
      }
    }

    setTimeout(updateActiveStyles, 10);
  }

  function applyFormatting(style: string) {
    if (!editorRef.current) return;
    editorRef.current.focus();
    switch (style) {
      case "bold":
        document.execCommand("bold");
        break;
      case "italic":
        document.execCommand("italic");
        break;
      case "strikethrough":
        document.execCommand("strikeThrough");
        break;
      case "underline":
        document.execCommand("underline");
        break;
      case "code":
        toggleFormat("code");
        break;
      case "highlight/color":
        if (highlightColor) {
          document.execCommand("hiliteColor", false, highlightColor);
        } else if (textColor) {
          document.execCommand("foreColor", false, textColor);
        }
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if (!colorPopoverOpen && (textColor || highlightColor)) {
      applyFormatting("highlight/color");
    }
    // eslint-disable-next-line
  }, [textColor, highlightColor, colorPopoverOpen]);

  function applyFont(fontFamily: string) {
    if (!editorRef.current) return;
    editorRef.current.focus();

    // Save the current selection
    const selection = document.getSelection();
    if (!selection || selection.rangeCount === 0) {
      // No selection, apply to entire editor
      editorRef.current.style.fontFamily = fontFamily;
      setSelectedFont(fontFamily);
      return;
    }

    // Check if there's a selection or we should apply to the entire editor
    if (selection.toString().trim() === "") {
      // No text selected, apply to entire editor
      editorRef.current.style.fontFamily = fontFamily;
    } else {
      // Text selected, apply font to selection
      document.execCommand("fontName", false, fontFamily);
    }

    setSelectedFont(fontFamily);
  }

  // TODO: Add this to the save button
  // const html = editorRef.current?.innerHTML || "";
  // const markup = htmlToCustomMarkup(html);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AppTopNav />

      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto h-full flex flex-col px-4 min-h-0">
          <Card className="flex flex-col flex-1 min-h-0 p-0">
            <div className="flex-1 flex flex-col min-h-0 relative">
              {/* Placeholder for contentEditable */}
              {!isEditorFocused && isEditorEmpty() && (
                <div
                  className="absolute left-0 top-0 w-full h-full pointer-events-none text-lg p-6 text-muted-foreground select-none"
                  style={{ zIndex: 1 }}
                >
                  What's on your mind...
                </div>
              )}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="flex-1 resize-none border-none outline-none bg-transparent text-lg p-6 placeholder:text-muted-foreground focus:ring-0 focus:outline-none min-h-[200px] relative z-10"
                style={{
                  boxShadow: "none",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontFamily: selectedFont,
                }}
                onInput={() => {
                  updateActiveStyles();
                }}
                onFocus={() => setIsEditorFocused(true)}
                onBlur={() => setIsEditorFocused(false)}
              />
            </div>
            <div className="border-t px-4 py-2 bg-card flex flex-col gap-2 relative">
              {/* First Toggle Group: Text Style */}
              <div className="flex justify-center">
                <ToggleGroup
                  type="multiple"
                  className="gap-1"
                  value={activeTextStyles}
                  onValueChange={setActiveTextStyles}
                >
                  {textStyleShortcuts.map(({ label, shortcut }, idx) => {
                    const Icon = [
                      Bold,
                      Italic,
                      Strikethrough,
                      Underline,
                      CodeXmlIcon,
                      BaselineIcon,
                      TypeIcon,
                    ][idx];
                    // Special handling for BaselineIcon (color/highlight)
                    if (label === "Highlight/Color") {
                      return (
                        <Tooltip key={label} delayDuration={200}>
                          <TooltipTrigger asChild>
                            <ToggleGroupItem
                              value={label.toLowerCase()}
                              aria-label={label}
                              className={
                                colorPopoverOpen
                                  ? "ring-2 ring-blue-500 bg-blue-50"
                                  : ""
                              }
                              onClick={() =>
                                setColorPopoverOpen((open) => !open)
                              }
                              ref={colorButtonRef}
                            >
                              <Icon
                                className={
                                  "transition-colors " +
                                  (colorPopoverOpen ? "text-blue-600" : "")
                                }
                              />
                            </ToggleGroupItem>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            {label}{" "}
                            <span className="ml-2 text-xs text-muted-foreground">
                              {shortcut}
                            </span>
                          </TooltipContent>
                        </Tooltip>
                      );
                    }
                    // Special handling for TypeIcon (font family)
                    if (label === "Font Family") {
                      return (
                        <Tooltip key={label} delayDuration={200}>
                          <TooltipTrigger asChild>
                            <ToggleGroupItem
                              value={label.toLowerCase()}
                              aria-label={label}
                              className={
                                fontPopoverOpen
                                  ? "ring-2 ring-blue-500 bg-blue-50"
                                  : ""
                              }
                              onClick={() =>
                                setFontPopoverOpen((open) => !open)
                              }
                              ref={fontButtonRef}
                            >
                              <Icon
                                className={
                                  "transition-colors " +
                                  (fontPopoverOpen ? "text-blue-600" : "")
                                }
                              />
                            </ToggleGroupItem>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            {label}{" "}
                            <span className="ml-2 text-xs text-muted-foreground">
                              {shortcut}
                            </span>
                          </TooltipContent>
                        </Tooltip>
                      );
                    }
                    return (
                      <Tooltip key={label} delayDuration={200}>
                        <TooltipTrigger asChild>
                          <ToggleGroupItem
                            value={label.toLowerCase()}
                            aria-label={label}
                            className={
                              activeTextStyles.includes(label.toLowerCase())
                                ? "ring-2 ring-blue-500 bg-blue-50"
                                : ""
                            }
                            onClick={() => {
                              const style = label.toLowerCase();
                              toggleFormat(style);
                            }}
                          >
                            <Icon
                              className={
                                "transition-colors " +
                                (activeTextStyles.includes(label.toLowerCase())
                                  ? "text-blue-600"
                                  : "")
                              }
                            />
                          </ToggleGroupItem>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          {label}{" "}
                          <span className="ml-2 text-xs text-muted-foreground">
                            {shortcut}
                          </span>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </ToggleGroup>
                {/* Color Popover */}
                {colorPopoverOpen && (
                  <div
                    ref={colorPopoverRef}
                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 bg-white dark:bg-gray-800 border rounded shadow-lg p-4 flex gap-8"
                    style={{ minWidth: 320 }}
                  >
                    <div>
                      <div className="font-semibold mb-2 text-sm">Text</div>
                      {renderColorGrid(textColor, "text")}
                    </div>
                    <div>
                      <div className="font-semibold mb-2 text-sm">
                        Highlight
                      </div>
                      {renderColorGrid(highlightColor, "highlight")}
                    </div>
                  </div>
                )}
                {/* Font Popover */}
                {fontPopoverOpen && (
                  <div
                    ref={fontPopoverRef}
                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 bg-white dark:bg-gray-800 border rounded shadow-lg p-4"
                    style={{ minWidth: 320 }}
                  >
                    <div className="mb-4">
                      <div className="font-semibold mb-2 text-sm">
                        Current Font
                      </div>
                      <div
                        className="flex flex-col border rounded p-3 mb-3"
                        style={{ fontFamily: hoveredFont || selectedFont }}
                      >
                        <span>
                          Normal{" "}
                          {(hoveredFont || selectedFont).replace(
                            /[_-]/g,
                            " "
                          ) ||
                            hoveredFont ||
                            selectedFont}
                        </span>
                        <span style={{ fontWeight: "bold" }}>
                          Bold{" "}
                          {(hoveredFont || selectedFont).replace(
                            /[_-]/g,
                            " "
                          ) ||
                            hoveredFont ||
                            selectedFont}
                        </span>
                        <span style={{ fontStyle: "italic" }}>
                          Italic{" "}
                          {(hoveredFont || selectedFont).replace(
                            /[_-]/g,
                            " "
                          ) ||
                            hoveredFont ||
                            selectedFont}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {FONT_FAMILIES.map((fontFamily) => {
                          const label =
                            fontFamily.replace(/[_-]/g, " ") || fontFamily;
                          return (
                            <button
                              key={fontFamily}
                              type="button"
                              className={`p-2 text-left border rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                selectedFont === fontFamily
                                  ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900"
                                  : ""
                              }`}
                              style={{ fontFamily }}
                              onClick={() => {
                                applyFont(fontFamily);
                                setFontPopoverOpen(false);
                              }}
                              onMouseEnter={() => setHoveredFont(fontFamily)}
                              onMouseLeave={() => setHoveredFont(null)}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Second Toggle Group: Headings & Lists */}
              <div className="flex justify-center">
                <ToggleGroup type="single" className="gap-1">
                  {[
                    { icon: Heading1Icon, label: "Heading 1" },
                    { icon: Heading2Icon, label: "Heading 2" },
                    { icon: Heading3Icon, label: "Heading 3" },
                    { icon: List, label: "Bullet List" },
                    { icon: ListOrderedIcon, label: "Numbered List" },
                    { icon: ListTodoIcon, label: "Todo List" },
                  ].map(({ icon: Icon, label }) => (
                    <Tooltip key={label} delayDuration={200}>
                      <TooltipTrigger asChild>
                        <ToggleGroupItem
                          value={label.toLowerCase().replace(/ /g, "-")}
                          aria-label={label}
                        >
                          <Icon />
                        </ToggleGroupItem>
                      </TooltipTrigger>
                      <TooltipContent side="top">{label}</TooltipContent>
                    </Tooltip>
                  ))}
                </ToggleGroup>
              </div>
              {/* Third Toggle Group: Media & Tags */}
              <div className="flex justify-center">
                <ToggleGroup type="multiple" className="gap-1">
                  {[
                    { icon: ImagePlusIcon, label: "Add Image" },
                    { icon: MapPinPlusIcon, label: "Add Location" },
                    { icon: TagsIcon, label: "Add Tags" },
                  ].map(({ icon: Icon, label }) => (
                    <Tooltip key={label} delayDuration={200}>
                      <TooltipTrigger asChild>
                        <ToggleGroupItem
                          value={label.toLowerCase().replace(/ /g, "-")}
                          aria-label={label}
                        >
                          <Icon />
                        </ToggleGroupItem>
                      </TooltipTrigger>
                      <TooltipContent side="top">{label}</TooltipContent>
                    </Tooltip>
                  ))}
                </ToggleGroup>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Create;
