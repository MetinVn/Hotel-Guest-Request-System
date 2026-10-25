import { ChevronLeft, ChevronRight, Dot } from "lucide-react";

interface IPaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, totalElements, loading, onPageChange }: IPaginationProps) {
  if (totalElements === 0) return null;

  return (
    <nav className="flex flex-col gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-center text-sm text-slate-600 dark:text-slate-300">
        Page {currentPage + 1} of {Math.max(totalPages, 1)}
        <span className="inline-flex items-center text-slate-400 dark:text-slate-500">
          <Dot className="h-4 w-4 mx-0.5 opacity-60" aria-hidden="true" />
          {totalElements} {totalElements < 2 ? "request" : "requests"}
        </span>
      </p>
      <div className="flex items-center justify-between gap-2 sm:justify-end">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0 || loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
          disabled={totalPages === 0 || currentPage >= totalPages - 1 || loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
