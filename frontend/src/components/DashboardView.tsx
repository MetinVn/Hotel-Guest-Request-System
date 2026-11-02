import { useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import { CreateRequestFormCard } from "./CreateRequestCard";
import { FilterSortPanel } from "./FilterSortPanel";
import { Pagination } from "./Pagination";
import { RequestList } from "./RequestList";
import { useDebounce } from "../hooks/useDebounce";
import { useRequests } from "../hooks/useRequests";
import { useRequestWorkflow } from "../hooks/useRequestWorkflow";
import type { IRequest, RequestPriority, RequestSortField, RequestSortOrder, RequestStatus } from "../types/RequestType";

interface DashboardViewProps {
  refreshToken: number;
  addToHistory: (request: IRequest) => void;
  removeFromHistory: (id: IRequest["id"]) => void;
}

export function DashboardView({ refreshToken, addToHistory, removeFromHistory }: DashboardViewProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "ALL">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<RequestPriority | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<RequestSortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<RequestSortOrder>("desc");
  const debouncedSearch = useDebounce(search, 500);
  const lastRefreshToken = useRef(refreshToken);

  useEffect(() => {
    const resetPageTimeout = window.setTimeout(() => setCurrentPage(0), 0);
    return () => window.clearTimeout(resetPageTimeout);
  }, [debouncedSearch, priorityFilter, sortBy, sortOrder, statusFilter]);

  const {
    requests,
    totalPages,
    totalElements,
    currentPage: responsePage,
    loading,
    error,
    refresh,
    addRequest,
    changeStatus,
    removeRequest,
  } = useRequests({
    page: currentPage,
    onPageChange: setCurrentPage,
    status: statusFilter,
    priority: priorityFilter,
    search: debouncedSearch,
    sortBy,
    sortOrder,
  });

  useEffect(() => {
    if (lastRefreshToken.current !== refreshToken) {
      lastRefreshToken.current = refreshToken;
      void refresh();
    }
  }, [refresh, refreshToken]);

  const { processStatusChange } = useRequestWorkflow({
    updateStatus: changeStatus,
    addToHistory,
    removeFromHistory,
  });

  const hasActiveFilters = search.trim() !== "" || debouncedSearch.trim() !== "" || statusFilter !== "ALL" || priorityFilter !== "ALL";
  const isInitialLoad = loading && totalElements === 0 && !hasActiveFilters;
  const isDatabaseCompletelyEmpty = totalElements === 0 && !hasActiveFilters && !loading && error === null;
  const shouldShowFilters = !isDatabaseCompletelyEmpty && error === null;

  return (
    <div className="space-y-8">
      <CreateRequestFormCard onSubmit={addRequest} />

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg bg-danger-50 dark:bg-danger-950/40 border border-danger-200/80 dark:border-danger-900 p-4 text-sm text-danger-700 dark:text-danger-300"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{error}</p>
        </div>
      )}

      {isInitialLoad ? (
        <div className="py-12 text-center text-sm font-medium text-neutral-500 dark:text-neutral-400 animate-pulse">Loading requests...</div>
      ) : (
        <>
          <FilterSortPanel
            visible={shouldShowFilters}
            searchValue={search}
            onSearchChange={setSearch}
            statusValue={statusFilter}
            onStatusChange={setStatusFilter}
            priorityValue={priorityFilter}
            onPriorityChange={setPriorityFilter}
            sortValue={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={() => setSortOrder((order) => (order === "asc" ? "desc" : "asc"))}
          />
          {shouldShowFilters && <Pagination currentPage={responsePage} totalPages={totalPages} totalElements={totalElements} loading={loading} onPageChange={setCurrentPage} />}
          {isDatabaseCompletelyEmpty ? (
            <div className="rounded-xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
              <h2 className="text-base font-semibold text-neutral-800 dark:text-neutral-100">No requests yet</h2>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Create your first guest request above to get started.</p>
            </div>
          ) : (
            <RequestList requests={requests} loading={loading} onStatusChange={processStatusChange} onDelete={removeRequest} />
          )}
        </>
      )}
    </div>
  );
}
