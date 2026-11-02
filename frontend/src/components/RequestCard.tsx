import { useState } from "react";
import { type IRequest, type RequestPriority, type RequestStatus } from "../types/RequestType";
import { StatusBadge } from "./StatusBadge";
import { AlertCircle, ArrowDownToLine, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

interface IRequestCardProps {
  request: IRequest;
  layout: "grid" | "list";
  onStatusChange?: (request: IRequest, status: RequestStatus) => Promise<void>;
  onDelete: (id: IRequest["id"]) => Promise<void>;
  readOnlyStatus?: boolean;
  deleteLabel?: string;
}

export function RequestCard({ request, layout, onStatusChange, onDelete, readOnlyStatus = false, deleteLabel = "Delete" }: IRequestCardProps) {
  const [updating, setUpdating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusChange = async (nextStatus: RequestStatus) => {
    if (!onStatusChange) return;
    try {
      setUpdating(true);
      await onStatusChange(request, nextStatus);
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update status on the server.");
    } finally {
      setUpdating(false);
    }
  };

  const getCardStyles = (priority: RequestPriority) => {
    switch (priority) {
      case "URGENT":
        return "border-danger-200 dark:border-danger-900 bg-gradient-to-r from-danger-50/70 to-white dark:from-danger-950/50 dark:to-neutral-800 shadow-sm shadow-danger-100/50 dark:shadow-danger-950/20 hover:border-danger-300 dark:hover:border-danger-800 hover:shadow-md hover:shadow-danger-100 dark:hover:shadow-danger-950/30 transition-all duration-200";
      case "LOW":
        return "border-neutral-300 dark:border-neutral-600 border-dashed bg-neutral-50/50 dark:bg-neutral-800/50 opacity-90 hover:opacity-100 hover:border-solid hover:shadow-sm text-neutral-500 dark:text-neutral-400 transition-all";
      case "NORMAL":
      default:
        return "border-neutral-200/80 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow transition-all";
    }
  };

  const getPriorityConfig = (priority: RequestPriority) => {
    switch (priority) {
      case "URGENT":
        return {
          style: "text-danger-700 dark:text-danger-300 bg-danger-100/80 dark:bg-danger-950/60 font-bold border border-danger-200 dark:border-danger-900",
          icon: <AlertCircle className="w-3 h-3 mr-1 shrink-0 text-danger-600" />,
        };
      case "LOW":
        return {
          style: "text-neutral-500 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600",
          icon: <ArrowDownToLine className="w-3 h-3 mr-1 shrink-0 text-neutral-400" />,
        };
      case "NORMAL":
      default:
        return {
          style: "text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-900",
          icon: <CheckCircle2 className="w-3 h-3 mr-1 shrink-0 text-primary-500" />,
        };
    }
  };

  const priorityConfig = getPriorityConfig(request.requestPriority);

  const layoutClasses = layout === "list" ? `flex-col sm:flex-row ${isExpanded ? "sm:items-start" : "sm:items-center"} rounded-md px-4` : "flex-col rounded-2xl items-start";

  const actionContainerClasses =
    layout === "list"
      ? `flex shrink-0 items-center gap-2 ${isExpanded ? "mt-2 sm:mt-0" : ""}`
      : "flex shrink-0 items-center justify-between w-full mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-700";

  const CHAR_THRESHOLD = layout === "list" ? 90 : 50;
  const isLongDescription = request.description.length > CHAR_THRESHOLD;

  const displayDescription = isLongDescription && !isExpanded ? `${request.description.slice(0, CHAR_THRESHOLD).trim()}...` : request.description;

  return (
    <article className={`group relative flex gap-3 border p-3 transition-all ${layoutClasses} ${getCardStyles(request.requestPriority)}`}>
      <div className="flex min-w-0 items-center gap-3 w-full sm:w-auto">
        <span className="flex shrink-0 flex-col items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-700 px-3 py-1.5 text-neutral-900 dark:text-neutral-100">
          <span className="text-[9px] font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-300">Room</span>
          <span className="text-lg font-bold leading-tight tracking-tight">{request.roomNumber}</span>
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-neutral-800 dark:text-neutral-100">{request.guestName}</p>
          <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">{request.requestType}</p>
          <p className="truncate text-[10px] text-neutral-400 dark:text-neutral-500">
            #{request.id} · Updated{" "}
            {new Date(request.updatedAt).toLocaleString(undefined, {
              hour: "numeric",
              minute: "2-digit",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className={`min-w-0 flex-1 ${layout === "list" ? "px-0 sm:px-4" : "w-full mt-2 mb-2"}`}>
        <div className={layout === "list" && !isExpanded ? "flex items-center gap-2" : ""}>
          <p
            className={`text-neutral-600 dark:text-neutral-300 leading-relaxed ${layout === "list" ? "text-xs" : "text-sm"} ${!isExpanded && layout === "list" ? "truncate" : "wrap-break-word whitespace-pre-wrap"}`}
          >
            {displayDescription}
          </p>

          {isLongDescription && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex shrink-0 items-center gap-1 font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors ${layout === "list" && !isExpanded ? "text-[10px]" : "text-[11px] mt-1"}`}
            >
              {isExpanded ? (
                <>
                  Show less <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  Read more <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className={actionContainerClasses}>
        <div className="flex gap-2 items-center">
          <span className={`flex h-7 items-center justify-center rounded-full px-2.5 text-[10px] font-semibold uppercase leading-none tracking-wider ${priorityConfig.style}`}>
            {priorityConfig.icon}
            {request.requestPriority}
          </span>
          <StatusBadge status={request.requestStatus} onChange={readOnlyStatus ? undefined : handleStatusChange} disabled={updating} />
        </div>

        <button
          type="button"
          onClick={() => void onDelete(request.id)}
          className={`text-[11px] font-medium text-neutral-400 dark:text-neutral-500 transition-colors hover:text-danger-600 dark:hover:text-danger-400 hover:underline ${layout === "list" ? "ml-2" : ""}`}
        >
          {deleteLabel}
        </button>
      </div>
    </article>
  );
}
