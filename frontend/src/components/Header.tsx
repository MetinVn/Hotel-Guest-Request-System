import { Moon, RefreshCw, Sun } from "lucide-react";

export type AppTab = "dashboard" | "history";

interface IHeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onRefresh: () => void;
}

export function Header({ activeTab, onTabChange, theme, onToggleTheme, onRefresh }: IHeaderProps) {
  return (
    <header className="flex flex-col gap-4 pb-6 border-b border-slate-200 dark:border-slate-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Guest Requests</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{activeTab === "dashboard" ? "Live guest service dashboard and room dispatch" : "Completed requests saved on this device"}</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            aria-pressed={theme === "dark"}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-700 dark:text-slate-200 shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {activeTab === "dashboard" && (
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
              Refresh
            </button>
          )}
        </div>
      </div>

      <nav aria-label="Request views" className="flex gap-2">
        <button
          type="button"
          onClick={() => onTabChange("dashboard")}
          aria-current={activeTab === "dashboard" ? "page" : undefined}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeTab === "dashboard" ? "bg-slate-900 text-white dark:bg-blue-600" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
        >
          Live Dashboard
        </button>
        <button
          type="button"
          onClick={() => onTabChange("history")}
          aria-current={activeTab === "history" ? "page" : undefined}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeTab === "history" ? "bg-slate-900 text-white dark:bg-blue-600" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
        >
          History
        </button>
      </nav>
    </header>
  );
}
