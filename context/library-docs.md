# Library Documentation & Integration Patterns - Maps2Chat

This guide documents the exact usage, initialization, and patterns for the primary third-party libraries used in the Maps2Chat monolith.

---

## 1. Prisma Client & PostgreSQL (Neon)

### Prisma Initialization
```typescript
// api/src/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### Common Prisma Operation Patterns
```typescript
// Fetch pending leads
const pendingLeads = await prisma.lead.findMany({
  where: { status: 'PENDING' },
  orderBy: { fetchedAt: 'desc' },
});

// Update lead status to Contacted
const updatedLead = await prisma.lead.update({
  where: { id: leadId },
  data: {
    status: 'CONTACTED',
    contactedAt: new Date(),
  },
});
```

---

## 2. Google Places API (New Text Search SDK)

### Bounding Geopayload & Fetching
```typescript
// api/src/daemon/placesClient.ts
import axios from 'axios';

interface PlacesResponse {
  places?: Array<{
    id: string;
    displayName?: { text: string };
    formattedAddress?: string;
    internationalPhoneNumber?: string;
  }>;
}

export async function fetchKenyaPlaces(query: string): Promise<PlacesResponse> {
  const url = 'https://places.googleapis.com/v1/places:searchText';
  
  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
    // Request fields to retrieve to minimize cost/payload
    'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.internationalPhoneNumber',
  };

  const payload = {
    textQuery: query,
    // Restricting location search to Kenya bounding box
    locationRestriction: {
      rectangle: {
        low: {
          latitude: -4.71,
          longitude: 33.84
        },
        high: {
          latitude: 4.63,
          longitude: 41.92
        }
      }
    }
  };

  const response = await axios.post<PlacesResponse>(url, payload, { headers });
  return response.data;
}
```

---

## 3. Express Routing & Global Error Handler

### REST Endpoint Skeleton
```typescript
// api/src/controllers/leadController.ts
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db';

export async function getLeads(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.query;
    const filterStatus = status ? (String(status).toUpperCase() as any) : undefined;

    const leads = await prisma.lead.findMany({
      where: filterStatus ? { status: filterStatus } : undefined,
    });

    res.json({ success: true, data: leads });
  } catch (error) {
    next(error);
  }
}
```

### Global Express Error Middleware
```typescript
// api/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
}
```

---

## 4. TanStack React Query (`@tanstack/react-query`)

### Setup Client Context Provider
```typescript
// client/src/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* App Routes */}
    </QueryClientProvider>
  );
}
```

### Query Hook Pattern
```typescript
// client/src/hooks/useLeads.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiBase = import.meta.env.VITE_API_BASE_URL;

export function useLeads(status: string) {
  return useQuery({
    queryKey: ['leads', status],
    queryFn: async () => {
      const { data } = await axios.get(`${apiBase}/leads?status=${status}`);
      return data.data;
    },
  });
}

export function useContactLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.patch(`${apiBase}/leads/${id}/contact`);
      return data.data;
    },
    onSuccess: () => {
      // Invalidate both lists to trigger UI swap
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}
```

---

## 5. React Hook Form & Zod Forms (shadcn UI)

### Form Declaration Pattern
```typescript
// client/src/components/ManualLeadForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  whatsappNumber: z.string().regex(/^2547\d{8}$|^2541\d{8}$/, {
    message: "Must be a valid Kenyan phone number starting with 254 (e.g., 254712345678).",
  }),
  address: z.string().min(5, { message: "Address must contain country 'Kenya'." }),
});

export function ManualLeadForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", whatsappNumber: "254", address: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Submit</Button>
      </form>
    </Form>
  );
}
```
