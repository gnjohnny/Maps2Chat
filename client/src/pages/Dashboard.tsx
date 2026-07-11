import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { LeadCard } from "@/components/dashboard/LeadCard";
import { ScraperTrigger } from "@/components/dashboard/ScraperTrigger";
import {
  useLeads,
  useContactLead,
  useArchiveLead,
  useCreateLead,
  useTriggerScraper,
  useDeleteLead,
} from "@/hooks/useLeads";
import { Button } from "@/components/ui/button";
import { Search, Plus, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ManualLeadForm } from "@/components/dashboard/ManualLeadForm";
import { type DateRange } from "@daypicker/react";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardProps {
  onLogout: () => void;
  user: { name: string; email: string };
}

export function Dashboard({ onLogout, user }: DashboardProps) {
  const [currentTab, setTab] = useState<string>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Contacted ledger filters, pagination, and sorting
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>("contactedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Set document title based on current tab
  useEffect(() => {
    const tabNames: Record<string, string> = {
      pending: "Pending Queue",
      contacted: "Contacted Ledger",
      archived: "Archived Vault",
    };
    const tabName = tabNames[currentTab] || "Dashboard";
    document.title = `${tabName} | Maps2Chat - Localized B2B Outreach CRM`;
  }, [currentTab]);

  // Reset pagination/filters when switching tabs
  useEffect(() => {
    setError(null);
    setPage(1);
    setDateRange(undefined);
    setSortBy("contactedAt");
    setSortOrder("desc");
  }, [currentTab]);

  // Compute local timezone boundary ISO strings for filtering
  let startDateISO: string | undefined = undefined;
  let endDateISO: string | undefined = undefined;

  if (dateRange?.from) {
    const start = new Date(dateRange.from);
    start.setHours(0, 0, 0, 0);
    startDateISO = start.toISOString();
  }
  if (dateRange?.from) {
    const end = new Date(dateRange.to || dateRange.from);
    end.setHours(23, 59, 59, 999);
    endDateISO = end.toISOString();
  }

  // Real TanStack Query queries and mutations
  const { data, isLoading } = useLeads(
    currentTab,
    currentTab === "contacted"
      ? {
          page,
          limit,
          startDate: startDateISO,
          endDate: endDateISO,
          sortBy,
          sortOrder,
        }
      : undefined,
  );

  const leads = data?.leads ?? [];
  const pagination = data?.pagination;
  const contactMutation = useContactLead();
  const archiveMutation = useArchiveLead();
  const createLeadMutation = useCreateLead();
  const triggerScraperMutation = useTriggerScraper();
  const deleteMutation = useDeleteLead();

  // Filter based on search query
  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.whatsappNumber.includes(searchQuery),
  );

  const handleTriggerScraper = async () => {
    try {
      setError(null);
      await triggerScraperMutation.mutateAsync(undefined);
    } catch (err: any) {
      console.error("Scraper execution failed:", err);
      const errMsg =
        err.response?.data?.error ||
        err.message ||
        "Failed to trigger lead sync.";
      setError(`Failed to sync leads: ${errMsg}`);
    }
  };

  const headerActions = (
    <>
      {currentTab === "pending" && (
        <ScraperTrigger onTrigger={handleTriggerScraper} />
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-2 h-9 cursor-pointer">
            <Plus className="size-4" />
            Add Lead
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Manual Lead</DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Enter the business details. The address must contain 'Kenya' and
              the phone number will be E.164 normalized.
            </DialogDescription>
          </DialogHeader>
          <ManualLeadForm
            onSubmit={async (values) => {
              try {
                await createLeadMutation.mutateAsync({
                  name: values.name,
                  address: values.address,
                  whatsappNumber: values.whatsappNumber,
                });
                setIsAddDialogOpen(false);
              } catch (err) {
                console.error("Failed to add manual lead:", err);
                throw err;
              }
            }}
            isSubmitting={createLeadMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </>
  );

  return (
    <AppLayout
      currentTab={currentTab}
      setTab={setTab}
      userName={user.name}
      userEmail={user.email}
      onLogout={onLogout}
      headerActions={headerActions}
    >
      {/* Error Alert Banner */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-4 flex items-center justify-between animate-fade-in mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Error:</span>
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-xs font-semibold underline hover:no-underline cursor-pointer transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between w-full">
        {/* Search Bar */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search leads by name, address, or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 border-slate-200 dark:border-slate-800 bg-card rounded-md shadow-sm w-full"
          />
        </div>

        {/* Contacted Ledger Filters & Sorting */}
        {currentTab === "contacted" && (
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <DatePickerWithRange
              value={dateRange}
              onChange={(range) => {
                setDateRange(range);
                setPage(1); // Reset page to 1 when date filter changes
              }}
            />

            {/* Sorting Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 border-slate-200 dark:border-slate-800 bg-card px-4 py-2 text-sm font-normal rounded-md shadow-sm cursor-pointer flex items-center gap-2"
                >
                  <span>Sort: </span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {sortBy === "contactedAt"
                      ? "Contact Date"
                      : sortBy === "fetchedAt"
                        ? "Ingested Date"
                        : "Name"}{" "}
                    ({sortOrder === "desc" ? "Desc" : "Asc"})
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-card border border-slate-200 dark:border-slate-800 rounded-md shadow-md p-1">
                <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  Sort By Field
                </DropdownMenuLabel>
                <DropdownMenuItem
                  className="px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-accent focus:bg-accent"
                  onClick={() => {
                    setSortBy("contactedAt");
                    setPage(1);
                  }}
                >
                  Contact Date
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-accent focus:bg-accent"
                  onClick={() => {
                    setSortBy("fetchedAt");
                    setPage(1);
                  }}
                >
                  Ingested Date
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-accent focus:bg-accent"
                  onClick={() => {
                    setSortBy("name");
                    setPage(1);
                  }}
                >
                  Business Name
                </DropdownMenuItem>
                <DropdownMenuSeparator className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
                <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  Order
                </DropdownMenuLabel>
                <DropdownMenuItem
                  className="px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-accent focus:bg-accent"
                  onClick={() => {
                    setSortOrder("desc");
                    setPage(1);
                  }}
                >
                  Descending (Newest / Z-A)
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-accent focus:bg-accent"
                  onClick={() => {
                    setSortOrder("asc");
                    setPage(1);
                  }}
                >
                  Ascending (Oldest / A-Z)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear Filters Button */}
            {(dateRange ||
              sortBy !== "contactedAt" ||
              sortOrder !== "desc") && (
              <Button
                variant="ghost"
                onClick={() => {
                  setDateRange(undefined);
                  setSortBy("contactedAt");
                  setSortOrder("desc");
                  setPage(1);
                }}
                className="h-10 text-xs font-medium text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Leads Grid & Skeleton States */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-card p-6 h-48 animate-pulse flex flex-col justify-between"
            >
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
              isContacting={
                contactMutation.isPending &&
                contactMutation.variables === lead.id
              }
              isArchiving={
                archiveMutation.isPending &&
                archiveMutation.variables === lead.id
              }
              isDeleting={
                deleteMutation.isPending && deleteMutation.variables === lead.id
              }
              onContact={(id) => {
                setError(null);
                contactMutation.mutate(id, {
                  onError: (err: any) => {
                    const errMsg =
                      err.response?.data?.error ||
                      err.message ||
                      "Failed to update contact status.";
                    setError(`Failed to update contact status: ${errMsg}`);
                  },
                });
              }}
              onArchive={(id) => {
                setError(null);
                archiveMutation.mutate(id, {
                  onError: (err: any) => {
                    const errMsg =
                      err.response?.data?.error ||
                      err.message ||
                      "Failed to archive lead.";
                    setError(`Failed to archive lead: ${errMsg}`);
                  },
                });
              }}
              onDelete={(id) => {
                setError(null);
                deleteMutation.mutate(id, {
                  onError: (err: any) => {
                    const errMsg =
                      err.response?.data?.error ||
                      err.message ||
                      "Failed to delete lead permanently.";
                    setError(`Failed to delete lead permanently: ${errMsg}`);
                  },
                });
              }}
            />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center bg-card flex flex-col items-center justify-center gap-3 animate-fade-in">
          <div className="size-12 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-muted-foreground">
            <Search className="size-6" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-foreground text-base">
              No Leads Found
            </h3>
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
              className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-2 cursor-pointer"
            >
              {triggerScraperMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  Scrape New Leads
                </>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {currentTab === "contacted" && pagination && pagination.total > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">{page}</span> to{" "}
            <span className="font-semibold text-foreground">
              {Math.min(page * limit, pagination.total)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {pagination.total}
            </span>{" "}
            leads
          </div>

          <div className="flex items-center gap-6">
            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Show</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="h-8 rounded border border-slate-200 dark:border-slate-800 bg-card text-xs px-2 focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {[6, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size} per page
                  </option>
                ))}
              </select>
            </div>

            {/* Previous / Next buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-8 px-3 cursor-pointer"
              >
                <ChevronLeft className="size-4 mr-1" />
                Previous
              </Button>
              <span className="text-xs font-medium">
                Page {page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={page === pagination.totalPages}
                className="h-8 px-3 cursor-pointer"
              >
                Next
                <ChevronRight className="size-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
