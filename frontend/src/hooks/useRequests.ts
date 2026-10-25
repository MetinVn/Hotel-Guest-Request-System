import { useState, useEffect, useCallback, useRef } from "react";
import { type CreateRequest, type IRequest, type RequestPriority, type RequestSortField, type RequestSortOrder, type RequestStatus } from "../types/RequestType";
import { requestsService } from "../services/RequestsService";

const getErrorMessage = (error: unknown, fallback: string) => (error instanceof Error ? error.message : fallback);

const PAGE_SIZE = 10;

interface IUseRequestsOptions {
  page: number;
  onPageChange: (page: number) => void;
  status: RequestStatus | "ALL";
  priority: RequestPriority | "ALL";
  search: string;
  sortBy: RequestSortField;
  sortOrder: RequestSortOrder;
}

export function useRequests({ page, onPageChange, status, priority, search, sortBy, sortOrder }: IUseRequestsOptions) {
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchSequence = useRef(0);

  const fetchRequests = useCallback(async () => {
    const sequence = ++fetchSequence.current;
    setLoading(true);
    setError(null);

    try {
      const result = await requestsService.getAll({
        page,
        size: PAGE_SIZE,
        status,
        priority,
        search,
        sortBy,
        sortOrder,
      });
      if (sequence === fetchSequence.current) {
        setRequests(result.content);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
        setCurrentPage(result.currentPage);
        if (result.totalPages === 0 && page !== 0) {
          onPageChange(0);
        } else if (result.totalPages > 0 && page >= result.totalPages) {
          onPageChange(result.totalPages - 1);
        }
      }
    } catch (err) {
      if (sequence === fetchSequence.current) {
        setError(getErrorMessage(err, "Failed to load requests"));
      }
    } finally {
      if (sequence === fetchSequence.current) {
        setLoading(false);
      }
    }
  }, [onPageChange, page, priority, search, sortBy, sortOrder, status]);

  const addRequest = useCallback(
    async (request: CreateRequest) => {
      await requestsService.create(request);
      await fetchRequests();
    },
    [fetchRequests],
  );

  const changeStatus = useCallback(
    async (id: IRequest["id"], status: IRequest["requestStatus"]) => {
      const updatedRequest = await requestsService.updateStatus(id, status);
      await fetchRequests();
      return updatedRequest;
    },
    [fetchRequests],
  );

  const removeRequest = useCallback(
    async (id: IRequest["id"]) => {
      setError(null);
      try {
        await requestsService.delete(id);
        await fetchRequests();
      } catch (err) {
        setError(getErrorMessage(err, "Failed to delete request"));
      }
    },
    [fetchRequests],
  );

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) void fetchRequests();
    });
    return () => {
      active = false;
      fetchSequence.current += 1;
    };
  }, [fetchRequests]);

  return {
    requests,
    totalPages,
    totalElements,
    currentPage,
    loading,
    error,
    refresh: fetchRequests,
    addRequest,
    removeRequest,
    changeStatus,
  };
}
