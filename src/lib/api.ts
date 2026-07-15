// ─────────────────────────────────────────────────────────────
// lib/api.ts — Axios instance & API service functions
// ─────────────────────────────────────────────────────────────
// Centralised HTTP client pointing at our Express backend.
// Every page/component imports from here — never raw axios.
// ─────────────────────────────────────────────────────────────

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

// ── Response types ───────────────────────────────────────────

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "Hot" | "Warm" | "Cold" | string;
  pipeline_stage?: string;
  notes?: string;
  created_at: string;
}

export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  status: "Available" | "Pending" | "Sold" | string;
  type: string;
  description?: string;
  image_url?: string;
  created_at: string;
}

export interface Showing {
  id: string;
  property_id: string;
  client_id: string;
  showing_date: string;
  notes?: string;
  status: "Scheduled" | "Completed" | "Cancelled" | string;
  created_at: string;
  properties?: { address: string };
  clients?: { name: string };
}

interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
}

// ── Service functions ────────────────────────────────────────

export async function getClients(): Promise<Client[]> {
  try {
    const { data } = await api.get<ApiResponse<Client[]>>("/clients");
    return data.data;
  } catch {
    console.error("Failed to fetch clients");
    return [];
  }
}

export async function createClient(payload: any): Promise<Client | null> {
  try {
    const { data } = await api.post<ApiResponse<Client>>("/clients", payload);
    return data.data;
  } catch {
    console.error("Failed to create client");
    return null;
  }
}

export async function getProperties(): Promise<Property[]> {
  try {
    const { data } = await api.get<ApiResponse<Property[]>>("/properties");
    return data.data;
  } catch {
    console.error("Failed to fetch properties");
    return [];
  }
}

export async function createProperty(payload: any): Promise<Property | null> {
  try {
    const { data } = await api.post<ApiResponse<Property>>("/properties", payload);
    return data.data;
  } catch {
    console.error("Failed to create property");
    return null;
  }
}

export async function getShowings(): Promise<Showing[]> {
  try {
    const { data } = await api.get<ApiResponse<Showing[]>>("/showings");
    return data.data;
  } catch {
    console.error("Failed to fetch showings");
    return [];
  }
}

export async function createShowing(payload: any): Promise<Showing | null> {
  try {
    const { data } = await api.post<ApiResponse<Showing>>("/showings", payload);
    return data.data;
  } catch {
    console.error("Failed to create showing");
    return null;
  }
}

export async function updateClientStage(id: string, pipeline_stage: string): Promise<Client | null> {
  try {
    const { data } = await api.patch<ApiResponse<Client>>(`/clients/${id}/stage`, { pipeline_stage });
    return data.data;
  } catch {
    console.error("Failed to update client stage");
    return null;
  }
}

export async function updateClientNotes(id: string, notes: string): Promise<Client | null> {
  try {
    const { data } = await api.patch<ApiResponse<Client>>(`/clients/${id}`, { notes });
    return data.data;
  } catch {
    console.error("Failed to update client notes");
    return null;
  }
}

export async function updateShowing(id: string, updates: Partial<Showing>): Promise<Showing | null> {
  try {
    const { data } = await api.patch<ApiResponse<Showing>>(`/showings/${id}`, updates);
    return data.data;
  } catch {
    console.error("Failed to update showing");
    return null;
  }
}

export async function reorderClients(updates: { id: string, position_index: number, pipeline_stage: string }[]): Promise<boolean> {
  try {
    await api.patch("/clients/reorder", { updates });
    return true;
  } catch {
    console.error("Failed to reorder clients");
    return false;
  }
}

export default api;
