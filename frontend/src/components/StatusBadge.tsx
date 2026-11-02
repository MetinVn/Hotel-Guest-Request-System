import { ChevronDown } from "lucide-react";
import { isRequestStatus, REQUEST_STATUSES, type RequestStatus } from "../types/RequestType";

interface IStatusBadgeProps {
  status: RequestStatus;
  onChange?: (nextStatus: RequestStatus) => void;
  disabled?: boolean;
}

const STATUS_CONFIG: Record<RequestStatus, { styles: string; label: string }> = {
  Completed: {
    styles: "bg-success-50 dark:bg-success-950/50 text-success-700 dark:text-success-300 border-success-200 dark:border-success-900 hover:border-success-300 dark:hover:border-success-800",
    label: "Completed",
  },
  "In Progress": {
    styles: "bg-warning-50 dark:bg-warning-950/50 text-warning-700 dark:text-warning-300 border-warning-200 dark:border-warning-900 hover:border-warning-300 dark:hover:border-warning-800",
    label: "In Progress",
  },
  Pending: {
    styles: "bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 border-neutral-200 dark:border-neutral-600 hover:border-neutral-300 dark:hover:border-neutral-500",
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
          <option key={option} value={option} className="bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100">
            {option}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -tranneutral-y-1/2 w-3 h-3 text-current opacity-60" />
    </div>
  );
}
