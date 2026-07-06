import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Play } from "lucide-react"

interface ScraperTriggerProps {
  onTrigger: () => Promise<void>
}

export function ScraperTrigger({ onTrigger }: ScraperTriggerProps) {
  const [loading, setLoading] = useState(false)

  const handleTrigger = async () => {
    try {
      setLoading(true)
      await onTrigger()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleTrigger}
      disabled={loading}
      className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 font-medium"
    >
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Scraping...
        </>
      ) : (
        <>
          <Play className="size-4 fill-current" />
          Trigger Lead Sync
        </>
      )}
    </Button>
  )
}
