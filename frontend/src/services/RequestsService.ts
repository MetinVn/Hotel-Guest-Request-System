import {
  type CreateRequest,
  type IPaginatedResponse,
  type IRequest,
  REQUEST_STATUSES,
  REQUEST_TYPES,
  type RequestPriority,
  type RequestSortField,
  type RequestSortOrder,
  type RequestStatus,
} from "../types/RequestType";
import { z } from "zod";

const API_REQUEST_PRIORITIES = ["Urgent", "Normal", "Low"] as const;
const ApiRequestSchema = z.object({
  id: z.number(),
  roomNumber: z.string(),
  guestName: z.string(),
  requestType: z.enum(REQUEST_TYPES),
  requestPriority: z.enum(API_REQUEST_PRIORITIES),
  description: z.string(),
  status: z.enum(REQUEST_STATUSES),
  createdAt: z.string(),
  updatedAt: z.string(),
});
const RequestsPageSchema = z.object({
  content: z.array(ApiRequestSchema),
  currentPage: z.number(),
  totalPages: z.number(),
  totalElements: z.number(),
  hasNext: z.boolean(),
});
const ProblemDetailSchema = z.object({
  detail: z.string().optional(),
  message: z.string().optional(),
  title: z.string().optional(),
});

type ApiRequest = z.infer<typeof ApiRequestSchema>;
type ApiRequestPriority = (typeof API_REQUEST_PRIORITIES)[number];

interface IGetRequestsParams {
  page?: number;
  size?: number;
  status?: RequestStatus | "ALL";
  priority?: RequestPriority | "ALL";
  search?: string;
  sortBy?: RequestSortField;
  sortOrder?: RequestSortOrder;
}

const statusQueryValues: Record<RequestStatus, string> = {
  Pending: "PENDING",
  "In Progress": "IN_PROGRESS",
  Completed: "COMPLETED",
};

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1/requests").replace(/\/+$/, "");

async function sendRequest(url: string, options: RequestInit): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(url, options);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network request failed";
    throw new Error(`API request failed: ${message}`, { cause: error });
  }

  if (!response.ok) {
    const responseBody = await response.text();
    let message = responseBody || response.statusText || `HTTP ${response.status}`;

    if (responseBody) {
      try {
        const parsedProblem = ProblemDetailSchema.safeParse(JSON.parse(responseBody));
        if (parsedProblem.success) {
          message = parsedProblem.data.detail || parsedProblem.data.message || parsedProblem.data.title || message;
        }
      } catch (error) {
        if (!(error instanceof SyntaxError)) {
          throw error;
        }
      }
    }

    throw new Error(message);
  }

  return response;
}

function toRequest(request: ApiRequest): IRequest {
  const { status, requestPriority, ...fields } = request;
  const priorityByApiValue: Record<ApiRequestPriority, IRequest["requestPriority"]> = {
    Urgent: "URGENT",
    Normal: "NORMAL",
    Low: "LOW",
  };

  return {
    ...fields,
    requestStatus: status,
    requestPriority: priorityByApiValue[requestPriority],
  };
}

function toApiPriority(priority: CreateRequest["requestPriority"]): ApiRequestPriority {
  const priorityByUiValue: Record<CreateRequest["requestPriority"], ApiRequestPriority> = {
    URGENT: "Urgent",
    NORMAL: "Normal",
    LOW: "Low",
  };
  return priorityByUiValue[priority];
}

export const requestsService = {
  getAll: async ({ page = 0, size = 20, status = "ALL", priority = "ALL", search, sortBy = "id", sortOrder = "asc" }: IGetRequestsParams = {}): Promise<IPaginatedResponse<IRequest>> => {
    const query = new URLSearchParams({
      page: String(page),
      size: String(size),
      sortBy,
      sortOrder,
    });
    if (status !== "ALL") query.set("status", statusQueryValues[status]);
    if (priority !== "ALL") query.set("priority", priority);
    if (search?.trim()) query.set("search", search.trim());

    const response = await sendRequest(`${BASE_URL}?${query.toString()}`, {
      method: "GET",
    });
    const result = RequestsPageSchema.parse(await response.json());
    return {
      ...result,
      content: result.content.map(toRequest),
    };
  },

  create: async (request: CreateRequest): Promise<IRequest> => {
    const response = await sendRequest(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...request,
        requestPriority: toApiPriority(request.requestPriority),
      }),
    });
    return toRequest(ApiRequestSchema.parse(await response.json()));
  },

  delete: async (id: IRequest["id"]): Promise<void> => {
    await sendRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },

  updateStatus: async (id: IRequest["id"], status: IRequest["requestStatus"]): Promise<IRequest> => {
    const response = await sendRequest(`${BASE_URL}/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return toRequest(ApiRequestSchema.parse(await response.json()));
  },
};
