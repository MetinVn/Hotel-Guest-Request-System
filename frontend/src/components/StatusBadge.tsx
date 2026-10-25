import { ChevronDown } from "lucide-react";
import { isRequestStatus, REQUEST_STATUSES, type RequestStatus } from "../types/RequestType";

interface IStatusBadgeProps {
  status: RequestStatus;
  onChange?: (nextStatus: RequestStatus) => void;
  disabled?: boolean;
}

const STATUS_CONFIG: Record<RequestStatus, { styles: string; label: string }> = {
  Completed: {
    styles: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900 hover:border-emerald-300 dark:hover:border-emerald-800",
    label: "Completed",
  },
  "In Progress": {
    styles: "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900 hover:border-amber-300 dark:hover:border-amber-800",
    label: "In Progress",
  },
  Pending: {
    styles: "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500",
    label: "Pending",
  },
};

export function StatusBadge({ status, onChange, disabled }: IStatusBadgeProps) {
  const current = STATUS_CONFIG[status] ?? STATUS_CONFIG.Pending;

  if (!onChange) {
    return <span className={`inline-flex items-center text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${current.styles}`}>{current.label}</span>;
  }

  return (
    <div className="relative flex items-center">
      <select
        value={status}
        disabled={disabled}
        onChange={(e) => {
          const value = e.currentTarget.value;
          if (isRequestStatus(value)) onChange(value);
        }}
        aria-label="Update ticket status"
        className={`appearance-none cursor-pointer text-[11px] font-medium pl-2.5 pr-6 py-0.5 rounded-full border outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${current.styles}`}
      >
        {REQUEST_STATUSES.map((option) => (
          <option key={option} value={option} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100">
            {option}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-current opacity-60" />
    </div>
  );
}
