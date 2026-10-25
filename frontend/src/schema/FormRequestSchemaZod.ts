import { z } from "zod";
import { isRequestType, PRIORITY_LEVELS } from "../types/RequestType";

export const FormRequestSchema = z.object({
  guestName: z.string().trim().min(1, "Guest name is required.").max(100, "Guest name must be at most 100 characters long."),
  roomNumber: z.string().trim().min(1, "Room number is required.").max(10, "Room number must be at most 10 characters long."),
  requestType: z.string().refine(isRequestType, "Select a valid request type."),
  requestPriority: z.enum(PRIORITY_LEVELS, {
    error: "Select a valid priority.",
  }),
  description: z.string().trim().min(1, "Description is required.").max(1000, "Description must be at most 1000 characters long."),
});

export type RequestFormSchema = z.infer<typeof FormRequestSchema>;
