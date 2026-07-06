import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
  onSubmit: (values: ManualLeadFormValues) => void
  isSubmitting?: boolean
}

export function ManualLeadForm({ onSubmit, isSubmitting }: ManualLeadFormProps) {
  const form = useForm<ManualLeadFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", whatsappNumber: "", address: "" },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Nairobi Coffee Shop" {...field} />
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
                <Input placeholder="E.g., 254712345678 or 0712345678" {...field} />
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
                <Input placeholder="E.g., Ngong Road, Nairobi, Kenya" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-2">
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium w-full sm:w-auto"
          >
            {isSubmitting ? "Saving..." : "Add Lead"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
