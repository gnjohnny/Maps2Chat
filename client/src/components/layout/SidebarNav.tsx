import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Inbox, CheckSquare, Archive, LogOut, User } from "lucide-react"

interface SidebarNavProps {
  currentTab: string
  setTab: (tab: string) => void
  userName?: string
  userEmail?: string
  onLogout?: () => void
  className?: string
}

export function SidebarNav({ currentTab, setTab, userName = "Operator", userEmail = "operator@maps2chat.com", onLogout, className }: SidebarNavProps) {
  const { theme, setTheme } = useTheme()

  const tabs = [
    { id: "pending", label: "Pending Queue", icon: Inbox },
    { id: "contacted", label: "Contacted Ledger", icon: CheckSquare },
    { id: "archived", label: "Archived Vault", icon: Archive },
  ]

  return (
    <aside className={`w-64 border-r bg-card text-card-foreground flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none ${className || ""}`}>
      <div className="flex flex-col gap-6 p-4">
        {/* Brand/Logo */}
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="size-6 rounded-md bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
            M
          </div>
          <span className="font-semibold text-lg tracking-tight text-foreground">
            Maps2Chat
          </span>
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = currentTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors w-full text-left cursor-pointer ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-slate-100 dark:hover:bg-slate-900 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Footer controls & user session */}
      <div className="flex flex-col gap-4 p-4 border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/20">
        {/* User Info */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
            <User className="size-4" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-semibold text-foreground truncate">{userName}</span>
            <span className="text-[10px] text-muted-foreground truncate">{userEmail}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-2 px-1">
          {/* Light/Dark Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground hover:text-foreground size-8"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          {/* Logout */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="text-muted-foreground hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 size-8"
            title="Log out"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </aside>
  )
}
