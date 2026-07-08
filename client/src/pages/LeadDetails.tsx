import { useParams, useNavigate, Link } from "react-router-dom"
import { useLead, useContactLead, useArchiveLead, useDeleteLead } from "@/hooks/useLeads"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { ContactLink } from "@/components/ui/ContactLink"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MapPin, Phone, Calendar, ExternalLink, Trash2, Loader2, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"

export function LeadDetails() {
  const { id = "" } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const { data: lead, isLoading, error: fetchError } = useLead(id)

  const contactMutation = useContactLead()
  const archiveMutation = useArchiveLead()
  const deleteMutation = useDeleteLead()

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-KE", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateString
    }
  }

  const handleContact = () => {
    setError(null)
    contactMutation.mutate(id, {
      onError: (err: any) => {
        const errMsg = err.response?.data?.error || err.message || "Failed to update contact status."
        setError(`Failed to update contact status: ${errMsg}`)
      }
    })
  }

  const handleArchive = () => {
    setError(null)
    archiveMutation.mutate(id, {
      onError: (err: any) => {
        const errMsg = err.response?.data?.error || err.message || "Failed to archive lead."
        setError(`Failed to archive lead: ${errMsg}`)
      }
    })
  }

  const handleDeleteConfirm = () => {
    if (!lead) return
    setError(null)
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setShowConfirmDelete(false)
        navigate("/")
      },
      onError: (err: any) => {
        setShowConfirmDelete(false)
        const errMsg = err.response?.data?.error || err.message || "Failed to delete lead permanently."
        setError(`Failed to delete lead permanently: ${errMsg}`)
      }
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center font-sans">
        <div className="w-full max-w-2xl animate-pulse space-y-6">
          <div className="h-9 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          <div className="border border-slate-200 dark:border-slate-800 bg-card rounded-2xl p-6 space-y-6">
            <div className="space-y-3">
              <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
            </div>
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-900">
              <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
              <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
              <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
            </div>
            <div className="flex justify-end gap-2 pt-6 border-t border-slate-100 dark:border-slate-900">
              <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (fetchError || !lead) {
    return (
      <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center font-sans">
        <Card className="border border-slate-200 dark:border-slate-800 bg-card rounded-2xl max-w-md w-full p-6 text-center space-y-4">
          <h3 className="text-xl font-bold text-foreground">Lead Not Found</h3>
          <p className="text-sm text-muted-foreground">
            The lead details could not be retrieved. It may have been permanently deleted or does not exist.
          </p>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium cursor-pointer">
            <Link to="/">
              <ArrowLeft className="size-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </Card>
      </div>
    )
  }

  const isContacting = contactMutation.isPending
  const isArchiving = archiveMutation.isPending
  const isDeleting = deleteMutation.isPending

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    lead.name + ", " + lead.address
  )}&query_place_id=${lead.placeId}`

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center font-sans">
      <div className="w-full max-w-2xl space-y-6">
        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <Button
            asChild
            variant="outline"
            className="border-slate-200 dark:border-slate-800 bg-card hover:bg-accent text-foreground h-9 cursor-pointer"
          >
            <Link to="/">
              <ArrowLeft className="size-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {/* Error alert */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-4 flex items-center justify-between animate-fade-in">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-xs font-semibold underline hover:no-underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Lead Profile Card */}
        <Card className="border border-slate-200 dark:border-slate-800 bg-card shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-900 bg-slate-50/30 dark:bg-slate-950/10">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <CardTitle className="text-2xl font-bold text-foreground tracking-tight">
                  {lead.name}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Lead UUID: {lead.id}
                </CardDescription>
              </div>
              <StatusBadge status={lead.status} />
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Address</span>
                  <p className="text-sm text-foreground leading-relaxed">{lead.address}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">WhatsApp Contact</span>
                  <p className="text-sm text-foreground">
                    <a
                      href={`tel:+${lead.whatsappNumber}`}
                      className="hover:underline hover:text-emerald-600 dark:hover:text-emerald-400"
                    >
                      +{lead.whatsappNumber}
                    </a>
                  </p>
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-900">
                <div className="flex items-start gap-3">
                  <Calendar className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fetched Date</span>
                    <p className="text-sm text-foreground">{formatDate(lead.fetchedAt)}</p>
                  </div>
                </div>

                {lead.contactedAt && (
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Contacted Date</span>
                      <p className="text-sm text-foreground">{formatDate(lead.contactedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Google Maps link */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-900">
              <Button
                asChild
                variant="secondary"
                className="w-full justify-between h-10 border border-slate-200 dark:border-slate-800 cursor-pointer"
              >
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                  <span className="flex items-center gap-2">
                    <ExternalLink className="size-4" />
                    View on Google Maps
                  </span>
                  <span className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
                    Place ID: {lead.placeId}
                  </span>
                </a>
              </Button>
            </div>
          </CardContent>

          <CardFooter className="p-6 border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/20 flex flex-wrap gap-3 justify-end">
            {lead.status === "PENDING" && (
              <ContactLink
                whatsappNumber={lead.whatsappNumber}
                businessName={lead.name}
                onContactClicked={handleContact}
                isLoading={isContacting}
                disabled={isArchiving}
              />
            )}
            
            {lead.status !== "ARCHIVED" && (
              <Button
                variant="outline"
                onClick={handleArchive}
                disabled={isContacting || isArchiving}
                className="text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 border-slate-200 dark:border-slate-800 hover:text-red-600 h-10 px-4 rounded-md cursor-pointer flex items-center gap-2 font-medium"
              >
                {isArchiving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Archiving...
                  </>
                ) : (
                  <>
                    <Trash2 className="size-4" />
                    Archive Lead
                  </>
                )}
              </Button>
            )}

            {lead.status === "ARCHIVED" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => setShowConfirmDelete(true)}
                  disabled={isDeleting}
                  className="h-10 px-4 rounded-md cursor-pointer flex items-center gap-2 font-semibold"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="size-4" />
                      Delete Permanently
                    </>
                  )}
                </Button>
                <ConfirmDialog
                  isOpen={showConfirmDelete}
                  onOpenChange={setShowConfirmDelete}
                  title="Delete Lead Permanently"
                  description={`Are you sure you want to permanently delete "${lead.name}"? This action cannot be undone.`}
                  confirmText="Delete"
                  onConfirm={handleDeleteConfirm}
                  isLoading={isDeleting}
                  variant="destructive"
                />
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
