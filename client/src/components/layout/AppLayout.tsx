import React, { useState } from "react"
import { SidebarNav } from "./SidebarNav"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface AppLayoutProps {
  currentTab: string
  setTab: (tab: string) => void
  userName?: string
  userEmail?: string
  onLogout?: () => void
  children: React.ReactNode
  headerActions?: React.ReactNode
}

export function AppLayout({
  currentTab,
  setTab,
  userName,
  userEmail,
  onLogout,
  children,
  headerActions,
}: AppLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const getTabTitle = () => {
    switch (currentTab) {
      case "pending":
        return "Pending Queue"
      case "contacted":
        return "Contacted Ledger"
      case "archived":
        return "Archived Vault"
      default:
        return "Dashboard"
    }
  }

  const getTabDescription = () => {
    switch (currentTab) {
      case "pending":
        return "Leads extracted from Google Maps awaiting outreach delivery."
      case "contacted":
        return "History of successfully contacted leads."
      case "archived":
        return "Vault containing leads flagged as irrelevant or invalid."
      default:
        return ""
    }
  }

  const handleTabChange = (tab: string) => {
    setTab(tab)
    setIsMobileOpen(false) // Close sheet on mobile click
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop Sidebar (visible on medium screens and up) */}
      <SidebarNav
        currentTab={currentTab}
        setTab={handleTabChange}
        userName={userName}
        userEmail={userEmail}
        onLogout={onLogout}
        className="hidden md:flex"
      />

      {/* Content Wrapper */}
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        {/* Header panel */}
        <header className="h-16 border-b border-slate-100 dark:border-slate-900 bg-card px-4 md:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger menu for mobile (hidden on medium screens and up) */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-muted-foreground hover:text-foreground shrink-0 size-9"
                >
                  <Menu className="size-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-r bg-card">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SidebarNav
                  currentTab={currentTab}
                  setTab={handleTabChange}
                  userName={userName}
                  userEmail={userEmail}
                  onLogout={onLogout}
                  className="h-full border-none"
                />
              </SheetContent>
            </Sheet>

            <div className="flex flex-col">
              <h1 className="text-base md:text-lg font-semibold text-foreground tracking-tight">
                {getTabTitle()}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {getTabDescription()}
              </p>
            </div>
          </div>

          {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
        </header>

        {/* Primary active layout viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
