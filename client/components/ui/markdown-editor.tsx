"use client";

import React, { useRef, useState } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  FileCode,
  Quote,
  List,
  ListOrdered,
  ListTodo,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Minus,
  Heading1,
  Heading2,
  Heading3,
  Eye,
  Edit3,
  Columns2,
  Sparkles,
} from "lucide-react";
import { Markdown } from "@/components/ui/markdown";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;
  error?: string;
  id?: string;
  className?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write in Markdown format...",
  minHeight = "min-h-[260px]",
  disabled = false,
  error,
  id,
  className,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [viewMode, setViewMode] = useState<"write" | "preview" | "split">("write");

  // Helper to insert markdown tags at cursor/selection
  const insertFormatting = (prefix: string, suffix = "", defaultText = "") => {
    if (disabled || !textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    const replacement = selectedText
      ? `${prefix}${selectedText}${suffix}`
      : `${prefix}${defaultText}${suffix}`;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start, start + replacement.length);
      } else {
        textarea.setSelectionRange(
          start + prefix.length,
          start + prefix.length + defaultText.length
        );
      }
    }, 0);
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border border-border/80 bg-card overflow-hidden transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20",
        error && "border-destructive/60 focus-within:border-destructive",
        disabled && "opacity-60 cursor-not-allowed",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 bg-muted/30 px-3 py-2">
        <div className="flex flex-wrap items-center gap-1">
          <div className="flex items-center gap-0.5 border-r border-border/60 pr-1.5 mr-0.5">
            <button
              type="button"
              disabled={disabled || viewMode === "preview"}
              onClick={() => insertFormatting("# ", "", "Heading 1")}
              title="Heading 1"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground transition-all disabled:opacity-40"
            >
              <Heading1 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={disabled || viewMode === "preview"}
              onClick={() => insertFormatting("## ", "", "Heading 2")}
              title="Heading 2"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground transition-all disabled:opacity-40"
            >
              <Heading2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={disabled || viewMode === "preview"}
              onClick={() => insertFormatting("### ", "", "Heading 3")}
              title="Heading 3"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground transition-all disabled:opacity-40"
            >
              <Heading3 className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-0.5 border-r border-border/60 pr-1.5 mr-0.5">
            <button
              type="button"
              disabled={disabled || viewMode === "preview"}
              onClick={() => insertFormatting("**", "**", "bold text")}
              title="Bold (Ctrl+B)"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground transition-all disabled:opacity-40"
            >
              <Bold className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={disabled || viewMode === "preview"}
              onClick={() => insertFormatting("*", "*", "italic text")}
              title="Italic (Ctrl+I)"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground transition-all disabled:opacity-40"
            >
              <Italic className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={disabled || viewMode === "preview"}
              onClick={() => insertFormatting("~~", "~~", "strikethrough")}
              title="Strikethrough"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground transition-all disabled:opacity-40"
            >
              <Strikethrough className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-0.5 border-r border-border/60 pr-1.5 mr-0.5">
            <button
              type="button"
              disabled={disabled || viewMode === "preview"}
              onClick={() => insertFormatting("`", "`", "code")}
              title="Inline Code"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground transition-all disabled:opacity-40"
            >
              <Code className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={disabled || viewMode === "preview"}
              onClick={() => insertFormatting("```typescript\n", "\n```", "// write code here")}
              title="Code Block"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground transition-all disabled:opacity-40"
            >
              <FileCode className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-0.5 border-r border-border/60 pr-1.5 mr-0.5">
            <button
              type="button"
              disabled={disabled || viewMode === "preview"}
              onClick={() => insertFormatting("- ", "", "List item")}
              title="Bulleted List"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground transition-all disabled:opacity-40"
            >
              <List className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={disabled || viewMode === "preview"}
              onClick={() => insertFormatting("1. ", "", "First item")}
              title="Numbered List"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground transition-all disabled:opacity-40"
            >
              <ListOrdered className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={disabled || viewMode === "preview"}
              onClick={() => insertFormatting("- [ ] ", "", "Todo item")}
              title="Task Checklist"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground transition-all disabled:opacity-40"
            >
              <ListTodo className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={disabled || viewMode === "preview"}
              onClick={() => insertFormatting("> ", "", "Quote text")}
              title="Blockquote"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground transition-all disabled:opacity-40"
            >
              <Quote className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              disabled={disabled || viewMode === "preview"}
              onClick={() => insertFormatting("[", "](https://example.com)", "link title")}
              title="Insert Link"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground transition-all disabled:opacity-40"
            >
              <LinkIcon className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={disabled || viewMode === "preview"}
              onClick={() => insertFormatting("![", "](https://images.unsplash.com/...)", "Alt image")}
              title="Insert Image"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground transition-all disabled:opacity-40"
            >
              <ImageIcon className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={disabled || viewMode === "preview"}
              onClick={() =>
                insertFormatting(
                  "| Column 1 | Column 2 |\n|---|---|\n| Item 1 | Item 2 |\n",
                  ""
                )
              }
              title="Insert Table"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground transition-all disabled:opacity-40"
            >
              <TableIcon className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={disabled || viewMode === "preview"}
              onClick={() => insertFormatting("\n---\n", "")}
              title="Horizontal Divider"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground transition-all disabled:opacity-40"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center rounded-xl border border-border/80 bg-background/80 p-0.5 shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode("write")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
              viewMode === "write"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Edit3 className="h-3 w-3" />
            Write
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
              viewMode === "preview"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Eye className="h-3 w-3" />
            Preview
          </button>
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={cn(
              "hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
              viewMode === "split"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Columns2 className="h-3 w-3" />
            Split
          </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0 relative">
        {(viewMode === "write" || viewMode === "split") && (
          <div className={cn("flex-1 flex flex-col min-h-0", viewMode === "split" && "border-r border-border/60")}>
            <textarea
              ref={textareaRef}
              id={id}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "w-full flex-1 p-4 bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground/60 resize-none outline-none leading-relaxed",
                minHeight
              )}
            />
          </div>
        )}

        {(viewMode === "preview" || viewMode === "split") && (
          <div
            className={cn(
              "flex-1 overflow-y-auto p-5 bg-zinc-950/40",
              minHeight
            )}
          >
            {value.trim() ? (
              <Markdown content={value} />
            ) : (
              <div className="flex h-full min-h-[160px] items-center justify-center text-xs text-muted-foreground/60 italic">
                Live Markdown preview will appear here...
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-3.5 py-1.5 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-medium text-foreground/70">
            <Sparkles className="h-3 w-3 text-primary/70" />
            Markdown Supported
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} chars</span>
          <span>•</span>
          <span>~{readingTime} min read</span>
        </div>
      </div>
    </div>
  );
}
