import { useCallback } from "react";
import type { IRequest, RequestStatus } from "../types/RequestType";

interface IRequestWorkflowDependencies {
  updateStatus: (id: IRequest["id"], status: RequestStatus) => Promise<IRequest>;
  addToHistory: (request: IRequest) => void;
  removeFromHistory: (id: IRequest["id"]) => void;
}

export function useRequestWorkflow({ updateStatus, addToHistory, removeFromHistory }: IRequestWorkflowDependencies) {
  const processStatusChange = useCallback(
    async (request: IRequest, newStatus: RequestStatus) => {
      await updateStatus(request.id, newStatus);

      if (newStatus === "Completed") {
        addToHistory({ ...request, requestStatus: newStatus });
      } else {
        removeFromHistory(request.id);
      }
    },
    [addToHistory, removeFromHistory, updateStatus],
  );

  return { processStatusChange };
}
