import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Lead {
  id: string;
  placeId: string;
  name: string;
  address: string;
  whatsappNumber: string;
  status: "PENDING" | "CONTACTED" | "ARCHIVED";
  fetchedAt: string;
  contactedAt?: string | null;
}

export function useLeads(status: string) {
  return useQuery<Lead[]>({
    queryKey: ["leads", status.toUpperCase()],
    queryFn: async () => {
      const { data } = await api.get(`/leads?status=${status.toUpperCase()}`);
      return data.data;
    },
  });
}

export function useContactLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/leads/${id}/contact`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useArchiveLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/leads/${id}/archive`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

interface CreateLeadInput {
  name: string;
  address: string;
  whatsappNumber: string;
}

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateLeadInput) => {
      const { data } = await api.post("/leads", input);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useTriggerScraper() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (query?: string) => {
      const { data } = await api.post("/scraper/trigger", { query });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads", "PENDING"] });
    },
  });
}

export function useLead(id: string) {
  return useQuery<Lead>({
    queryKey: ["lead", id],
    queryFn: async () => {
      const { data } = await api.get(`/leads/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/leads/${id}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

