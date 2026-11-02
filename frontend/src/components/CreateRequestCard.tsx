import { type CreateRequest } from "../types/RequestType";
import { CreateRequestForm } from "./CreateRequestForm";

interface ICreateRequestFormCardProps {
  onSubmit: (data: CreateRequest) => Promise<void>;
}

export function CreateRequestFormCard({ onSubmit }: ICreateRequestFormCardProps) {
  return (
    <section className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200/80 dark:border-neutral-700 shadow-sm p-6 transition-all">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-neutral-100 dark:border-neutral-700">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Create Request</h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Log an incoming guest inquiry or room service order</p>
        </div>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-600">New</span>
      </div>

      <CreateRequestForm onSubmit={onSubmit} />
    </section>
  );
}
