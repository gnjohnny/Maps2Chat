import { useState, useEffect } from "react"

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

const INITIAL_MOCK_LEADS: Lead[] = [
  {
    id: "lead-1",
    placeId: "place-1",
    name: "Nairobi Java House (Grand Central)",
    address: "Grand Central Building, Nairobi, Kenya",
    whatsappNumber: "254711223344",
    status: "PENDING",
    fetchedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "lead-2",
    placeId: "place-2",
    name: "Savannah Coffee Lounge",
    address: "Loita Street, Nairobi, Kenya",
    whatsappNumber: "254722334455",
    status: "PENDING",
    fetchedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "lead-3",
    placeId: "place-3",
    name: "Kileleshwa Pharmacy",
    address: "Kenyatta Avenue, Nairobi, Kenya",
    whatsappNumber: "254733445566",
    status: "PENDING",
    fetchedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "lead-4",
    placeId: "place-4",
    name: "Westlands Auto Repair",
    address: "Ring Road Westlands, Nairobi, Kenya",
    whatsappNumber: "254700112233",
    status: "CONTACTED",
    fetchedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    contactedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
  {
    id: "lead-5",
    placeId: "place-5",
    name: "Mombasa Seafood Grill",
    address: "Nyali Road, Mombasa, Kenya",
    whatsappNumber: "254755667788",
    status: "CONTACTED",
    fetchedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    contactedAt: new Date(Date.now() - 3600000 * 40).toISOString(),
  },
  {
    id: "lead-6",
    placeId: "place-6",
    name: "Lavington Green Florist",
    address: "James Gichuru Road, Nairobi, Kenya",
    whatsappNumber: "254788990011",
    status: "ARCHIVED",
    fetchedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
]

export function useMockLeads() {
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem("mock_leads")
    return saved ? JSON.parse(saved) : INITIAL_MOCK_LEADS
  })

  useEffect(() => {
    localStorage.setItem("mock_leads", JSON.stringify(leads))
  }, [leads])

  const getLeadsByStatus = (status: "PENDING" | "CONTACTED" | "ARCHIVED") => {
    return leads.filter((l) => l.status === status)
  }

  const contactLead = (id: string) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status: "CONTACTED",
              contactedAt: new Date().toISOString(),
            }
          : l
      )
    )
  }

  const archiveLead = (id: string) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status: "ARCHIVED",
            }
          : l
      )
    )
  }

  const triggerMockScraper = async () => {
    // Simulate scraper daemon run adding leads
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newLeads: Lead[] = [
          {
            id: `lead-new-${Date.now()}-1`,
            placeId: `place-new-${Date.now()}-1`,
            name: "Kilimani Organic Grocery",
            address: "Chania Avenue, Nairobi, Kenya",
            whatsappNumber: `2547${Math.floor(10000000 + Math.random() * 90000000)}`,
            status: "PENDING",
            fetchedAt: new Date().toISOString(),
          },
          {
            id: `lead-new-${Date.now()}-2`,
            placeId: `place-new-${Date.now()}-2`,
            name: "Apex Dental Clinic",
            address: "Ngong Road, Nairobi, Kenya",
            whatsappNumber: `2547${Math.floor(10000000 + Math.random() * 90000000)}`,
            status: "PENDING",
            fetchedAt: new Date().toISOString(),
          },
        ]
        setLeads((prev) => [...newLeads, ...prev])
        resolve()
      }, 1500)
    })
  }

  const resetMockLeads = () => {
    setLeads(INITIAL_MOCK_LEADS)
  }

  return {
    leads,
    getLeadsByStatus,
    contactLead,
    archiveLead,
    triggerMockScraper,
    resetMockLeads,
  }
}
