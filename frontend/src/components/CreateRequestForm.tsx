import { useState, type ChangeEvent, type SubmitEvent } from "react";
import z from "zod";
import { FormRequestSchema } from "../schema/FormRequestSchemaZod";
import { PRIORITY_LEVELS, REQUEST_TYPES, type CreateRequest } from "../types/RequestType";

interface ICreateRequestFormProps {
  onSubmit: (data: CreateRequest) => Promise<void>;
}
type FieldErrors = Partial<Record<keyof CreateRequest, string>>;
type RequestFormInput = z.input<typeof FormRequestSchema>;

const InitialFormRequestObject = {
  guestName: "",
  roomNumber: "",
  requestType: "",
  requestPriority: "NORMAL",
  description: "",
} satisfies z.input<typeof FormRequestSchema>;

export function CreateRequestForm({ onSubmit }: ICreateRequestFormProps) {
  const [formData, setFormData] = useState<RequestFormInput>(InitialFormRequestObject);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const result = FormRequestSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      setErrors({
        guestName: fieldErrors.guestName?.[0],
        roomNumber: fieldErrors.roomNumber?.[0],
        requestType: fieldErrors.requestType?.[0],
        requestPriority: fieldErrors.requestPriority?.[0],
        description: fieldErrors.description?.[0],
      });
      return;
    }

    setErrors({});
    setServerError("");
    setSubmitting(true);

    try {
      await onSubmit(result.data);
      setFormData(InitialFormRequestObject);
    } catch {
      setServerError("Failed to save request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (hasError?: string) =>
    `w-full text-xs rounded-lg border px-3 py-2 outline-none transition-colors placeholder:text-slate-300 dark:placeholder:text-slate-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white ${hasError ? "border-rose-300 dark:border-rose-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500" : "border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-slate-400"}`;

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="flex flex-col">
          <label htmlFor="guestName" className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
            Guest Name
            <span className="block text-[10px] font-normal text-slate-500 dark:text-slate-400 mt-0.5">Who is making the request?</span>
          </label>
          <input id="guestName" type="text" name="guestName" value={formData.guestName} onChange={handleChange} placeholder="e.g. John Doe" className={inputClass(errors.guestName)} />
          {errors.guestName && (
            <p id="guestName-error" className="text-[11px] text-rose-600 mt-1">
              {errors.guestName}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="roomNumber" className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
            Room Number
            <span className="block text-[10px] font-normal text-slate-500 dark:text-slate-400 mt-0.5">Where to dispatch?</span>
          </label>
          <input id="roomNumber" type="text" name="roomNumber" value={formData.roomNumber} onChange={handleChange} placeholder="e.g. 104" className={inputClass(errors.roomNumber)} />
          {errors.roomNumber && (
            <p id="roomNumber-error" className="text-[11px] text-rose-600 mt-1">
              {errors.roomNumber}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="requestPriority" className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
            Priority
            <span className="block text-[10px] font-normal text-slate-500 dark:text-slate-400 mt-0.5">How urgently is this needed?</span>
          </label>
          <select id="requestPriority" name="requestPriority" value={formData.requestPriority} onChange={handleChange} className={inputClass(errors.requestPriority)}>
            {PRIORITY_LEVELS.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
          {errors.requestPriority && (
            <p id="requestPriority-error" className="text-[11px] text-rose-600 mt-1">
              {errors.requestPriority}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="requestType" className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
            Request Type
            <span className="block text-[10px] font-normal text-slate-500 dark:text-slate-400 mt-0.5">Category of the service.</span>
          </label>
          <select id="requestType" name="requestType" value={formData.requestType} onChange={handleChange} className={inputClass(errors.requestType)}>
            <option value="">Select request type...</option>
            {REQUEST_TYPES.map((requestType) => (
              <option key={requestType} value={requestType}>
                {requestType}
              </option>
            ))}
          </select>
          {errors.requestType && (
            <p id="requestType-error" className="text-[11px] text-rose-600 mt-1">
              {errors.requestType}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="description" className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
            Description
            <span className="block text-[10px] font-normal text-slate-500 dark:text-slate-400 mt-0.5">Specific details or items needed.</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g. Extra pillows, AC not working..."
            className={`${inputClass(errors.description)} min-h-9.5 resize-y`}
          />
          {errors.description && (
            <p id="description-error" className="text-[11px] text-rose-600 mt-1">
              {errors.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
        {serverError ? <p className="text-xs text-rose-600">{serverError}</p> : <span />}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium rounded-lg text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 disabled:opacity-60 transition-colors shadow-sm"
        >
          {submitting ? "Adding..." : "Add Request"}
        </button>
      </div>
    </form>
  );
}
