import { type CreateRequest } from "../types/RequestType";
import { CreateRequestForm } from "./CreateRequestForm";

interface ICreateRequestFormCardProps {
  onSubmit: (data: CreateRequest) => Promise<void>;
}

export function CreateRequestFormCard({ onSubmit }: ICreateRequestFormCardProps) {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-sm p-6 transition-all">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-700">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">Create Request</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Log an incoming guest inquiry or room service order</p>
        </div>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">New</span>
      </div>

      <CreateRequestForm onSubmit={onSubmit} />
    </section>
  );
}
