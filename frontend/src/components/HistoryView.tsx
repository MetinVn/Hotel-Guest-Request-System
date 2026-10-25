import { useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { FilterSortPanel } from "./FilterSortPanel";
import { RequestCard } from "./RequestCard";
import { type IRequest, type RequestPriority } from "../types/RequestType";

type HistorySortField = "createdAt" | "id" | "priority";
type SortOrder = "asc" | "desc";

interface IHistoryViewProps {
  history: IRequest[];
  error: string | null;
  onRemove: (id: IRequest["id"]) => void;
}

const priorityRank: Record<RequestPriority, number> = {
  URGENT: 0,
  NORMAL: 1,
  LOW: 2,
};

export function HistoryView({ history, error, onRemove }: IHistoryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<RequestPriority | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<HistorySortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const filteredHistory = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return history
      .filter(
        (request) =>
          (!normalizedQuery || request.roomNumber.toLowerCase().includes(normalizedQuery) || String(request.id).includes(normalizedQuery)) &&
          (filterPriority === "ALL" || request.requestPriority === filterPriority),
      )
      .sort((left, right) => {
        let comparison = 0;
        if (sortBy === "createdAt") comparison = left.createdAt.localeCompare(right.createdAt);
        if (sortBy === "id") comparison = left.id - right.id;
        if (sortBy === "priority") comparison = priorityRank[left.requestPriority] - priorityRank[right.requestPriority];
        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [filterPriority, history, searchQuery, sortBy, sortOrder]);

  return (
    <section className="space-y-6">
      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900 p-4 text-sm text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{error}</p>
        </div>
      )}

      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Completed Request History</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">History is stored in this browser and is not synchronized with the server.</p>
        </div>
        {history.length > 0 && (
          <FilterSortPanel
            showStatusFilter={false}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by room or ticket ID..."
            priorityValue={filterPriority}
            onPriorityChange={setFilterPriority}
            sortValue={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={() => setSortOrder((order) => (order === "asc" ? "desc" : "asc"))}
          />
        )}
      </section>

      {filteredHistory.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{history.length === 0 ? "No completed requests saved" : "No requests match these filters"}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {history.length === 0 ? "Requests completed from the live dashboard will appear here." : "Try changing or clearing your history filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHistory.map((request) => (
            <RequestCard key={request.id} request={request} layout="grid" onDelete={async (id) => onRemove(id)} readOnlyStatus deleteLabel="Remove from history" />
          ))}
        </div>
      )}
    </section>
  );
}
