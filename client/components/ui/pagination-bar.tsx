"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationBarProps {
  page: number;
  pageCount: number;
  total: number;
  itemLabel?: string;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
}

export function PaginationBar({
  page,
  pageCount,
  total,
  itemLabel = "Items",
  onPageChange,
  isLoading = false,
  className,
}: PaginationBarProps) {
  if (pageCount <= 1 && total <= 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-border/60",
        className
      )}
    >
      <p className="text-xs text-muted-foreground">
        Showing Page <strong className="text-foreground font-semibold">{page}</strong> of{" "}
        <strong className="text-foreground font-semibold">{Math.max(1, pageCount)}</strong>{" "}
        ({total} Total {itemLabel})
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1 || isLoading}
          className="h-8 px-3 text-xs gap-1"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Previous</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(pageCount, page + 1))}
          disabled={page >= pageCount || isLoading}
          className="h-8 px-3 text-xs gap-1"
        >
          <span>Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
