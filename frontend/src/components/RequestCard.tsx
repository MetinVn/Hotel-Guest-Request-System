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
        return "border-rose-200 dark:border-rose-900 bg-gradient-to-r from-rose-50/70 to-white dark:from-rose-950/50 dark:to-slate-800 shadow-sm shadow-rose-100/50 dark:shadow-rose-950/20 hover:border-rose-300 dark:hover:border-rose-800 hover:shadow-md hover:shadow-rose-100 dark:hover:shadow-rose-950/30 transition-all duration-200";
      case "LOW":
        return "border-slate-300 dark:border-slate-600 border-dashed bg-slate-50/50 dark:bg-slate-800/50 opacity-90 hover:opacity-100 hover:border-solid hover:shadow-sm text-slate-500 dark:text-slate-400 transition-all";
      case "NORMAL":
      default:
        return "border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 hover:shadow transition-all";
    }
  };

  const getPriorityConfig = (priority: RequestPriority) => {
    switch (priority) {
      case "URGENT":
        return {
          style: "text-rose-700 dark:text-rose-300 bg-rose-100/80 dark:bg-rose-950/60 font-bold border border-rose-200 dark:border-rose-900",
          icon: <AlertCircle className="w-3 h-3 mr-1 shrink-0 text-rose-600" />,
        };
      case "LOW":
        return {
          style: "text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600",
          icon: <ArrowDownToLine className="w-3 h-3 mr-1 shrink-0 text-slate-400" />,
        };
      case "NORMAL":
      default:
        return {
          style: "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900",
          icon: <CheckCircle2 className="w-3 h-3 mr-1 shrink-0 text-blue-500" />,
        };
    }
  };

  const priorityConfig = getPriorityConfig(request.requestPriority);

  const layoutClasses = layout === "list" ? `flex-col sm:flex-row ${isExpanded ? "sm:items-start" : "sm:items-center"} rounded-md px-4` : "flex-col rounded-2xl items-start";

  const actionContainerClasses =
    layout === "list"
      ? `flex shrink-0 items-center gap-2 ${isExpanded ? "mt-2 sm:mt-0" : ""}`
      : "flex shrink-0 items-center justify-between w-full mt-auto pt-3 border-t border-slate-100 dark:border-slate-700";

  const CHAR_THRESHOLD = layout === "list" ? 90 : 50;
  const isLongDescription = request.description.length > CHAR_THRESHOLD;

  const displayDescription = isLongDescription && !isExpanded ? `${request.description.slice(0, CHAR_THRESHOLD).trim()}...` : request.description;

  return (
    <article className={`group relative flex gap-3 border p-3 transition-all ${layoutClasses} ${getCardStyles(request.requestPriority)}`}>
      <div className="flex min-w-0 items-center gap-3 w-full sm:w-auto">
        <span className="flex shrink-0 flex-col items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 px-3 py-1.5 text-slate-900 dark:text-slate-100">
          <span className="text-[9px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-300">Room</span>
          <span className="text-lg font-bold leading-tight tracking-tight">{request.roomNumber}</span>
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{request.guestName}</p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{request.requestType}</p>
          <p className="truncate text-[10px] text-slate-400 dark:text-slate-500">
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
            className={`text-slate-600 dark:text-slate-300 leading-relaxed ${layout === "list" ? "text-xs" : "text-sm"} ${!isExpanded && layout === "list" ? "truncate" : "wrap-break-word whitespace-pre-wrap"}`}
          >
            {displayDescription}
          </p>

          {isLongDescription && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex shrink-0 items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors ${layout === "list" && !isExpanded ? "text-[10px]" : "text-[11px] mt-1"}`}
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
          className={`text-[11px] font-medium text-slate-400 dark:text-slate-500 transition-colors hover:text-rose-600 dark:hover:text-rose-400 hover:underline ${layout === "list" ? "ml-2" : ""}`}
        >
          {deleteLabel}
        </button>
      </div>
    </article>
  );
}
