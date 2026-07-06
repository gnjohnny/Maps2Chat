import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: "PENDING" | "CONTACTED" | "ARCHIVED"
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/50",
    CONTACTED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/50",
    ARCHIVED: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-400 border-slate-200/50",
  }

  return (
    <Badge className={`${styles[status]} hover:${styles[status]} font-medium border`} variant="outline">
      {status}
    </Badge>
  )
}
