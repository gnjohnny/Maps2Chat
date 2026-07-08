import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { ContactLink } from "@/components/ui/ContactLink"
import { Trash2, Phone, MapPin, Calendar, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"

export interface Lead {
  id: string
  placeId: string
  name: string
  address: string
  whatsappNumber: string
  status: "PENDING" | "CONTACTED" | "ARCHIVED"
  fetchedAt: string
  contactedAt?: string | null
}

interface LeadCardProps {
  lead: Lead
  onContact: (id: string) => void
  onArchive: (id: string) => void
  onDelete?: (id: string) => void
  isContacting?: boolean
  isArchiving?: boolean
  isDeleting?: boolean
}

export function LeadCard({ 
  lead, 
  onContact, 
  onArchive, 
  onDelete,
  isContacting = false, 
  isArchiving = false,
  isDeleting = false
}: LeadCardProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-KE", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateString
    }
  }

  return (
    <Card className="rounded-xl border border-slate-200 dark:border-slate-800 bg-card shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold text-foreground tracking-tight line-clamp-1">
            <Link to={`/leads/${lead.id}`} className="hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline transition-colors">
              {lead.name}
            </Link>
          </CardTitle>
          <StatusBadge status={lead.status} />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-3 flex flex-col gap-2.5">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0 mt-0.5" />
          <span className="line-clamp-2">{lead.address}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="size-4 shrink-0" />
          <span>+{lead.whatsappNumber}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <Calendar className="size-3.5 shrink-0" />
          <span>Fetched: {formatDate(lead.fetchedAt)}</span>
        </div>
        {lead.status === "CONTACTED" && lead.contactedAt && (
          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
            <span className="font-semibold">Contacted:</span>
            <span>{formatDate(lead.contactedAt)}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/20 flex gap-2 justify-end pt-3">
        {lead.status === "PENDING" && (
          <ContactLink
            whatsappNumber={lead.whatsappNumber}
            businessName={lead.name}
            onContactClicked={() => onContact(lead.id)}
            isLoading={isContacting}
            disabled={isArchiving}
          />
        )}
        {lead.status !== "ARCHIVED" && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => onArchive(lead.id)}
            disabled={isContacting || isArchiving}
            className="text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 border-slate-200 dark:border-slate-800 hover:text-red-600 size-9 rounded-md shrink-0 cursor-pointer"
            title="Archive Lead"
          >
            {isArchiving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
          </Button>
        )}
        {lead.status === "ARCHIVED" && (
          <>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowConfirmDelete(true)}
              disabled={isDeleting}
              className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold h-9 rounded-md"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="size-3.5" />
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
              onConfirm={() => {
                onDelete?.(lead.id)
              }}
              isLoading={isDeleting}
              variant="destructive"
            />
          </>
        )}
      </CardFooter>
    </Card>
  )
}
