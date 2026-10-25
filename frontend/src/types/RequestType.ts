export const REQUEST_TYPES = ["House keeping", "Maintenance", "Room service", "Amenities", "VIP Service"] as const;

export const PRIORITY_LEVELS = ["URGENT", "NORMAL", "LOW"] as const;
export const REQUEST_STATUSES = ["Pending", "In Progress", "Completed"] as const;

export type RequestType = (typeof REQUEST_TYPES)[number];
export type RequestPriority = (typeof PRIORITY_LEVELS)[number];
export type RequestStatus = (typeof REQUEST_STATUSES)[number];
export type RequestSortField = "id" | "createdAt" | "priority";
export type RequestSortOrder = "asc" | "desc";

export function isRequestStatus(value: string): value is RequestStatus {
  return REQUEST_STATUSES.some((status) => status === value);
}

export function isRequestPriority(value: string): value is RequestPriority {
  return PRIORITY_LEVELS.some((priority) => priority === value);
}

export function isRequestType(value: string): value is RequestType {
  return REQUEST_TYPES.some((requestType) => requestType === value);
}

export interface IRequest {
  id: number;
  roomNumber: string;
  guestName: string;
  requestType: RequestType;
  requestPriority: RequestPriority;
  description: string;
  requestStatus: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IPaginatedResponse<T> {
  content: T[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
}

export type CreateRequest = Omit<IRequest, "id" | "requestStatus" | "createdAt" | "updatedAt">;
