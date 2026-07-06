import { useState } from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { LeadCard } from "@/components/dashboard/LeadCard"
import { ScraperTrigger } from "@/components/dashboard/ScraperTrigger"
import { useLeads, useContactLead, useArchiveLead, useCreateLead, useTriggerScraper } from "@/hooks/useLeads"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ManualLeadForm } from "@/components/dashboard/ManualLeadForm"

interface DashboardProps {
  onLogout: () => void
  user: { name: string; email: string }
}

export function Dashboard({ onLogout, user }: DashboardProps) {
  const [currentTab, setTab] = useState<string>("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  
  // Real TanStack Query queries and mutations
  const { data: leads = [], isLoading } = useLeads(currentTab)
  const contactMutation = useContactLead()
  const archiveMutation = useArchiveLead()
  const createLeadMutation = useCreateLead()
  const triggerScraperMutation = useTriggerScraper()

  // Filter based on search query
  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.whatsappNumber.includes(searchQuery)
  )

  const handleTriggerScraper = async () => {
    try {
      await triggerScraperMutation.mutateAsync(undefined)
    } catch (error) {
      console.error("Scraper execution failed:", error)
    }
  }

  const headerActions = (
    <>
      {currentTab === "pending" && (
        <ScraperTrigger onTrigger={handleTriggerScraper} />
      )}
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-2 h-9 cursor-pointer"
          >
            <Plus className="size-4" />
            Add Lead
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Manual Lead</DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Enter the business details. The address must contain 'Kenya' and the phone number will be E.164 normalized.
            </DialogDescription>
          </DialogHeader>
          <ManualLeadForm
            onSubmit={async (values) => {
              try {
                await createLeadMutation.mutateAsync({
                  name: values.name,
                  address: values.address,
                  whatsappNumber: values.whatsappNumber,
                })
                setIsAddDialogOpen(false)
              } catch (err) {
                console.error("Failed to add manual lead:", err)
              }
            }}
            isSubmitting={createLeadMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </>
  )

  return (
    <AppLayout
      currentTab={currentTab}
      setTab={setTab}
      userName={user.name}
      userEmail={user.email}
      onLogout={onLogout}
      headerActions={headerActions}
    >
      {/* Search Bar */}
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search leads by name, address, or number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-10 border-slate-200 dark:border-slate-800 bg-card rounded-md shadow-sm"
        />
      </div>

      {/* Leads Grid & Skeleton States */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-card p-6 h-48 animate-pulse flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-900">
                <div className="h-9 w-28 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-9 w-9 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredLeads.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onContact={(id) => contactMutation.mutate(id)}
              onArchive={(id) => archiveMutation.mutate(id)}
            />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center bg-card flex flex-col items-center justify-center gap-3 animate-fade-in">
          <div className="size-12 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-muted-foreground">
            <Search className="size-6" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-foreground text-base">No Leads Found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {searchQuery
                ? `No leads match search query "${searchQuery}" in this view.`
                : `No leads are currently marked as ${currentTab}.`}
            </p>
          </div>
          {!searchQuery && currentTab === "pending" && (
            <Button
              onClick={handleTriggerScraper}
              disabled={triggerScraperMutation.isPending}
              className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            >
              <Plus className="size-4 mr-2" />
              Scrape New Leads
            </Button>
          )}
        </div>
      )}
    </AppLayout>
  )
}
