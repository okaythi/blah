import type { Entry, XRef } from "./types";
import { parseEntry } from "./types";

export interface SearchResult extends Entry {
  xrefs?: XRef[];
}

export const DictionaryAPI = {
  search: async (query: string): Promise<SearchResult[]> => {
    if (!query.trim()) return [];
    try {
      const rs = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
      if (!rs.ok) return [];
      const d: Record<string, unknown>[] = await rs.json();
      return d.map(x => ({ ...parseEntry(x), xrefs: x.xrefs as XRef[] | undefined }));
    } catch {
      return [];
    }
  },

  getAll: async (): Promise<SearchResult[]> => {
    try {
      const rs = await fetch("/api/all");
      if (!rs.ok) return [];
      const d: Record<string, unknown>[] = await rs.json();
      return d.map(x => ({ ...parseEntry(x), xrefs: x.xrefs as XRef[] | undefined }));
    } catch {
      return [];
    }
  },

  getStats: async (): Promise<number | null> => {
    try {
      const rs = await fetch("/api/stats");
      if (!rs.ok) return null;
      const d: { count?: number } = await rs.json();
      return typeof d.count === 'number' ? d.count : null;
    } catch {
      return null;
    }
  }
};

export interface AuthRes {
  opts?: Record<string, unknown>;
  id?: string;
  uid?: string;
  sid?: string;
  c?: number;
}

export const AdminAPI = {
  auth: async (body: Record<string, unknown>): Promise<AuthRes | Response> => {
    return fetch("/api/admin/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  },
  
  getEntries: async (sid: string): Promise<{ r?: Record<string, unknown>[]; c?: number } | Response> => {
    return fetch("/api/admin/entries", { headers: { Authorization: `Bearer ${sid}` } });
  },

  saveEntry: async (sid: string, method: string, body: Record<string, unknown>): Promise<Response> => {
    return fetch("/api/admin/entries", {
      method,
      headers: { Authorization: `Bearer ${sid}`, "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  },

  deleteEntry: async (sid: string, id: string): Promise<Response> => {
    return fetch(`/api/admin/entries?id=${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${sid}` } });
  }
};
