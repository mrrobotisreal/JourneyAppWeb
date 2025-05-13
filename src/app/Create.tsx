import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router";
// import { useAuth } from "@/context/AuthContext";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
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

const Create: React.FC = () => {
  // const navigate = useNavigate();
  // const { user } = useAuth();
  const [activeTextStyles, setActiveTextStyles] = useState<string[]>([]);
  const [textColor, setTextColor] = useState<string | null>(null);
  const [highlightColor, setHighlightColor] = useState<string | null>(null);
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false);
  const colorPopoverRef = useRef<HTMLDivElement | null>(null);
  const colorButtonRef = useRef<HTMLButtonElement | null>(null);
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
          } else {
            setActiveTextStyles((prev) =>
              prev.includes(lower)
                ? prev.filter((s) => s !== lower)
                : [...prev, lower]
            );
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

  // Helper for rendering color grid
  function renderColorGrid(
    selectedColor: string | null,
    onSelect: (color: string | null) => void
  ) {
    return (
      <div className="grid grid-cols-5 gap-1">
        {COLOR_PALETTE.map((color) => (
          <button
            key={color}
            type="button"
            className={`w-6 h-6 rounded border flex items-center justify-center ${
              selectedColor === color ? "ring-2 ring-blue-500" : ""
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onSelect(selectedColor === color ? null : color)}
            aria-label={color}
          >
            {selectedColor === color && (
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
        ))}
      </div>
    );
  }

  // Helper to check if the editor is empty
  function isEditorEmpty() {
    const el = editorRef.current;
    if (!el) return true;
    // Remove zero-width spaces and whitespace
    return el.innerText.trim() === "";
  }

  // Helper to apply formatting
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
        document.execCommand("formatBlock", false, "pre");
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

  // When activeTextStyles changes, apply the latest style
  useEffect(() => {
    if (activeTextStyles.length === 0) return;
    const lastStyle = activeTextStyles[activeTextStyles.length - 1];
    applyFormatting(lastStyle);
    // eslint-disable-next-line
  }, [activeTextStyles]);

  // When textColor or highlightColor changes, apply them if colorPopoverOpen is false (i.e., user picked a color)
  useEffect(() => {
    if (!colorPopoverOpen && (textColor || highlightColor)) {
      applyFormatting("highlight/color");
    }
    // eslint-disable-next-line
  }, [textColor, highlightColor, colorPopoverOpen]);

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
                }}
                onInput={() => {}}
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
                            onClick={() => applyFormatting(label)}
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
                      {renderColorGrid(textColor, setTextColor)}
                    </div>
                    <div>
                      <div className="font-semibold mb-2 text-sm">
                        Highlight
                      </div>
                      {renderColorGrid(highlightColor, setHighlightColor)}
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
