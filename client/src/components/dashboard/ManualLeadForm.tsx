import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, { message: "Business name must be at least 2 characters." }),
  whatsappNumber: z.string().regex(/^(254|0)?(7|1)\d{8}$/, {
    message: "Must be a valid Kenyan number (e.g., 0712345678 or 254712345678).",
  }),
  address: z.string()
    .min(5, { message: "Address must be at least 5 characters." })
    .refine((val) => val.toLowerCase().includes("kenya"), {
      message: "Address must explicitly contain 'Kenya'.",
    }),
})

export type ManualLeadFormValues = z.infer<typeof formSchema>

interface ManualLeadFormProps {
  onSubmit: (values: ManualLeadFormValues) => Promise<void>
  isSubmitting?: boolean
}

export function ManualLeadForm({ onSubmit, isSubmitting }: ManualLeadFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<ManualLeadFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", whatsappNumber: "", address: "" },
  })

  const handleSubmit = async (values: ManualLeadFormValues) => {
    try {
      setSubmitError(null)
      await onSubmit(values)
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.message || "Failed to save lead."
      setSubmitError(errMsg)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Nairobi Coffee Shop" disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="whatsappNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp Number</FormLabel>
              <FormControl>
                <Input placeholder="E.g., 254712345678 or 0712345678" disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Formatted Address</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Ngong Road, Nairobi, Kenya" disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {submitError && (
          <div className="bg-destructive/15 border border-destructive/30 text-destructive text-xs rounded-md p-3 font-medium animate-fade-in">
            {submitError}
          </div>
        )}
        <div className="flex justify-end pt-2">
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Add Lead"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
