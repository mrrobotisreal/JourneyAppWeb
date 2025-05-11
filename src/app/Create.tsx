import React, { useState, useEffect } from "react";
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

const Create: React.FC = () => {
  // const navigate = useNavigate();
  // const { user } = useAuth();
  const [activeTextStyles, setActiveTextStyles] = useState<string[]>([]);

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
          setActiveTextStyles((prev) =>
            prev.includes(lower)
              ? prev.filter((s) => s !== lower)
              : [...prev, lower]
          );
          break;
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AppTopNav />

      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto h-full flex flex-col px-4 min-h-0">
          <Card className="flex flex-col flex-1 min-h-0 p-0">
            <div className="flex-1 flex flex-col min-h-0">
              <textarea
                className="flex-1 resize-none border-none outline-none bg-transparent text-lg p-6 placeholder:text-muted-foreground focus:ring-0 focus:outline-none min-h-[200px]"
                placeholder="What's on your mind..."
                style={{ boxShadow: "none" }}
              />
            </div>
            <div className="border-t px-4 py-2 bg-card flex flex-col gap-2">
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
