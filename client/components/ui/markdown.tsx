"use client";

import React, { useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarkdownProps {
  content: string;
  className?: string;
}

interface ExtraCodeProps {
  inline?: boolean;
}

function CodeBlock({
  inline,
  className,
  children,
  ...props
}: React.ComponentProps<"code"> & ExtraCodeProps) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const codeText = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  if (inline || (!match && !codeText.includes("\n"))) {
    return (
      <code
        className={cn(
          "rounded-md bg-muted/80 px-1.5 py-0.5 font-mono text-[13px] text-primary border border-border/50 font-medium",
          className
        )}
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="relative my-4 overflow-hidden rounded-xl border border-border/80 bg-zinc-950 shadow-md">
      <div className="flex items-center justify-between border-b border-border/40 bg-zinc-900/90 px-4 py-2 text-xs text-zinc-400 font-mono">
        <span className="font-semibold uppercase tracking-wider text-[11px] text-zinc-300">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-[13px] leading-relaxed text-zinc-200 selection:bg-primary/30">
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
}

const markdownComponents: Components = {
  h1: (props) => (
    <h1
      className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground border-b border-border/60 pb-2 mt-6 mb-4 first:mt-0"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="text-xl sm:text-2xl font-bold tracking-tight text-foreground border-b border-border/40 pb-1.5 mt-6 mb-3"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="text-lg sm:text-xl font-bold tracking-tight text-foreground mt-5 mb-2"
      {...props}
    />
  ),
  h4: (props) => (
    <h4
      className="text-base font-semibold tracking-tight text-foreground mt-4 mb-2"
      {...props}
    />
  ),
  p: (props) => (
    <p className="leading-relaxed mb-4 text-foreground/90 last:mb-0" {...props} />
  ),
  ul: (props) => (
    <ul className="list-disc list-outside pl-6 space-y-1.5 my-4 marker:text-primary" {...props} />
  ),
  ol: (props) => (
    <ol className="list-decimal list-outside pl-6 space-y-1.5 my-4 marker:text-primary" {...props} />
  ),
  li: (props) => (
    <li className="leading-relaxed text-foreground/90" {...props} />
  ),
  blockquote: (props) => (
    <blockquote
      className="border-l-4 border-primary/60 bg-muted/30 pl-4 py-2 my-4 italic text-muted-foreground rounded-r-lg"
      {...props}
    />
  ),
  a: (props) => (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary font-medium underline underline-offset-4 hover:text-primary/80 transition-colors"
      {...props}
    />
  ),
  strong: (props) => (
    <strong className="font-bold text-foreground" {...props} />
  ),
  hr: (props) => (
    <hr className="my-6 border-border/60" {...props} />
  ),
  table: (props) => (
    <div className="my-6 w-full overflow-x-auto rounded-xl border border-border/80">
      <table className="w-full text-left text-sm" {...props} />
    </div>
  ),
  thead: (props) => (
    <thead className="border-b border-border/80 bg-muted/60 text-xs font-semibold uppercase text-foreground" {...props} />
  ),
  th: (props) => (
    <th className="px-4 py-3 font-bold" {...props} />
  ),
  td: (props) => (
    <td className="border-t border-border/40 px-4 py-3 text-muted-foreground" {...props} />
  ),
  code: (props) => <CodeBlock {...props} />,
};

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={cn("text-foreground/90 leading-relaxed space-y-4 text-sm sm:text-base", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
