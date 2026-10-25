import { ArrowDown, ArrowUp, Filter, Search } from "lucide-react";
import { isRequestPriority, isRequestStatus, PRIORITY_LEVELS, REQUEST_STATUSES, type RequestPriority, type RequestSortField, type RequestSortOrder, type RequestStatus } from "../types/RequestType";

interface IFilterSortPanelProps {
  visible?: boolean;
  showStatusFilter?: boolean;
  searchValue: string;
  onSearchChange: (search: string) => void;
  searchPlaceholder?: string;
  statusValue?: RequestStatus | "ALL";
  onStatusChange?: (status: RequestStatus | "ALL") => void;
  priorityValue: RequestPriority | "ALL";
  onPriorityChange: (priority: RequestPriority | "ALL") => void;
  sortValue: RequestSortField;
  onSortByChange: (sortBy: RequestSortField) => void;
  sortOrder: RequestSortOrder;
  onSortOrderChange: () => void;
}

const SORT_FIELDS: RequestSortField[] = ["id", "createdAt", "priority"];

function isSortField(value: string): value is RequestSortField {
  return SORT_FIELDS.includes(value as RequestSortField);
}

export function FilterSortPanel({
  visible = true,
  showStatusFilter = true,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search by guest name or room...",
  statusValue = "ALL",
  onStatusChange,
  priorityValue,
  onPriorityChange,
  sortValue,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}: IFilterSortPanelProps) {
  if (!visible) return null;

  return (
    <section className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
        <Filter className="w-3.5 h-3.5 text-slate-400" />
        <h2 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Filter &amp; Sort</h2>
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap items-end gap-3 lg:gap-4 w-full">
        <div className="relative w-full sm:w-full lg:flex-1 lg:min-w-62.5">
          <label htmlFor="request-search" className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 ml-0.5 uppercase tracking-wider">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="request-search"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              type="text"
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {showStatusFilter && onStatusChange && (
          <div className="w-full sm:flex-1">
            <label htmlFor="request-status-filter" className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 ml-0.5 uppercase tracking-wider">
              Status
            </label>
            <select
              id="request-status-filter"
              value={statusValue}
              onChange={(event) => {
                const value = event.currentTarget.value;
                if (value === "ALL" || isRequestStatus(value)) onStatusChange(value);
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              {REQUEST_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="w-full sm:flex-1">
          <label htmlFor="request-priority-filter" className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 ml-0.5 uppercase tracking-wider">
            Priority
          </label>
          <select
            id="request-priority-filter"
            value={priorityValue}
            onChange={(event) => {
              const value = event.currentTarget.value;
              if (value === "ALL" || isRequestPriority(value)) onPriorityChange(value);
            }}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            {PRIORITY_LEVELS.map((priority) => (
              <option key={priority} value={priority}>
                {priority.charAt(0) + priority.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:flex-1 lg:min-w-70">
          <label htmlFor="request-sort-field" className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 ml-0.5 uppercase tracking-wider">
            Sort By
          </label>
          <div className="flex gap-2">
            <select
              id="request-sort-field"
              value={sortValue}
              onChange={(event) => {
                if (isSortField(event.currentTarget.value)) onSortByChange(event.currentTarget.value);
              }}
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-sm cursor-pointer"
            >
              <option value="createdAt">Date created</option>
              <option value="id">Ticket ID</option>
              <option value="priority">Priority Level</option>
            </select>
            <button
              type="button"
              onClick={onSortOrderChange}
              aria-label={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
              className="flex items-center justify-center px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0"
            >
              <span className="hidden sm:inline">{sortOrder === "asc" ? "Ascending" : "Descending"}</span>
              {sortOrder === "asc" ? <ArrowUp className="ml-0 sm:ml-1.5 h-4 w-4" aria-hidden="true" /> : <ArrowDown className="ml-0 sm:ml-1.5 h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
