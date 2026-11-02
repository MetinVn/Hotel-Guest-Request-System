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
    <header className="flex flex-col gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Guest Requests</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{activeTab === "dashboard" ? "Live guest service dashboard and room dispatch" : "Completed requests saved on this device"}</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            aria-pressed={theme === "dark"}
            className="inline-flex items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-2 text-neutral-700 dark:text-neutral-200 shadow-sm transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {activeTab === "dashboard" && (
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors group"
            >
              <RefreshCw className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors" />
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
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeTab === "dashboard" ? "bg-neutral-900 text-white dark:bg-primary-600" : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"}`}
        >
          Live Dashboard
        </button>
        <button
          type="button"
          onClick={() => onTabChange("history")}
          aria-current={activeTab === "history" ? "page" : undefined}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeTab === "history" ? "bg-neutral-900 text-white dark:bg-primary-600" : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"}`}
        >
          History
        </button>
      </nav>
    </header>
  );
}
