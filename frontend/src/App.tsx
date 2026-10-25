import { useState } from "react";
import { Header, type AppTab } from "./components/Header";
import { DashboardView } from "./components/DashboardView";
import { HistoryView } from "./components/HistoryView";
import { useDarkMode } from "./hooks/useDarkMode";
import { useHistory } from "./hooks/useHistory";

function App() {
  const { theme, toggleTheme } = useDarkMode();
  const [activeTab, setActiveTab] = useState<AppTab>("dashboard");
  const [refreshToken, setRefreshToken] = useState(0);
  const { history, error: historyError, addToHistory, removeFromHistory } = useHistory();

  return (
    <main className="min-h-screen bg-slate-50/50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">
        <Header activeTab={activeTab} onTabChange={setActiveTab} theme={theme} onToggleTheme={toggleTheme} onRefresh={() => setRefreshToken((token) => token + 1)} />
        <div className={`${activeTab === "dashboard" ? "block" : "hidden"}`}>
          <DashboardView refreshToken={refreshToken} addToHistory={addToHistory} removeFromHistory={removeFromHistory} />
        </div>
        <div className={`${activeTab === "history" ? "block" : "hidden"}`}>
          <HistoryView history={history} error={historyError} onRemove={removeFromHistory} />
        </div>
      </div>
    </main>
  );
}

export default App;
