import { useState } from "react";
import { type IRequest, type RequestStatus } from "../types/RequestType";
import { RequestCard } from "./RequestCard";
import { LayoutGrid, StretchHorizontal } from "lucide-react";

interface IRequestListProps {
  requests: IRequest[];
  loading: boolean;
  onStatusChange: (request: IRequest, status: RequestStatus) => Promise<void>;
  onDelete: (id: IRequest["id"]) => Promise<void>;
}

export function RequestList({ requests, loading, onStatusChange, onDelete }: IRequestListProps) {
  const [listLayout, setListLayout] = useState<"grid" | "list">("grid");

  if (loading) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-slate-400 dark:text-slate-500 animate-pulse">Fetching request queue...</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">No active requests</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">All guest inquiries are currently cleared.</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col items-stretch w-full">
      <div className="flex gap-1 mb-4 border p-1 rounded-lg border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 self-end shadow-sm">
        <button
          type="button"
          onClick={() => setListLayout("grid")}
          aria-label="Show requests in grid layout"
          aria-pressed={listLayout === "grid"}
          className={`p-1.5 rounded transition-colors ${listLayout === "grid" ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"}`}
        >
          <LayoutGrid size={18} />
        </button>

        <button
          type="button"
          onClick={() => setListLayout("list")}
          aria-label="Show requests in list layout"
          aria-pressed={listLayout === "list"}
          className={`p-1.5 rounded transition-colors ${listLayout === "list" ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"}`}
        >
          <StretchHorizontal size={18} />
        </button>
      </div>

      <div className={listLayout === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-3 w-full"}>
        {requests.map((request) => (
          <RequestCard key={request.id} request={request} layout={listLayout} onStatusChange={onStatusChange} onDelete={onDelete} />
        ))}
      </div>
    </section>
  );
}
