import { useCallback, useRef, useState } from "react";
import { z } from "zod";
import { PRIORITY_LEVELS, REQUEST_STATUSES, REQUEST_TYPES, type IRequest } from "../types/RequestType";

const STORAGE_KEY = "guest_request_history";
const HistoryRequestSchema = z.object({
  id: z.number(),
  roomNumber: z.string(),
  guestName: z.string(),
  requestType: z.enum(REQUEST_TYPES),
  requestPriority: z.enum(PRIORITY_LEVELS),
  description: z.string(),
  requestStatus: z.enum(REQUEST_STATUSES),
  createdAt: z.string(),
  updatedAt: z.string(),
});
const HistorySchema = z.array(HistoryRequestSchema);

interface IHistoryState {
  requests: IRequest[];
  error: string | null;
}

function readHistory(): IHistoryState {
  try {
    const storedHistory = localStorage.getItem(STORAGE_KEY);
    if (!storedHistory) return { requests: [], error: null };

    const result = HistorySchema.safeParse(JSON.parse(storedHistory));
    if (!result.success) {
      return { requests: [], error: "Saved request history is invalid and could not be loaded." };
    }
    return { requests: result.data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown storage error";
    return { requests: [], error: `Could not read saved request history: ${message}` };
  }
}

export function useHistory() {
  const [state, setState] = useState<IHistoryState>(readHistory);
  const historyRef = useRef(state.requests);

  const updateHistory = useCallback((update: (requests: IRequest[]) => IRequest[]) => {
    const requests = update(historyRef.current);
    historyRef.current = requests;

    setState((current) => ({
      ...current,
      requests: update(current.requests),
      error: null,
    }));

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown storage error";
      setState((current) => ({ ...current, error: `Could not save request history: ${message}` }));
    }
  }, []);

  const addToHistory = useCallback(
    (request: IRequest) => {
      updateHistory((requests) => [request, ...requests.filter((item) => item.id !== request.id)]);
    },
    [updateHistory],
  );

  const removeFromHistory = useCallback(
    (id: IRequest["id"]) => {
      updateHistory((requests) => requests.filter((request) => request.id !== id));
    },
    [updateHistory],
  );

  return {
    history: state.requests,
    error: state.error,
    addToHistory,
    removeFromHistory,
  };
}
