"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getOrCreateAlias, regenerateAlias } from "@/lib/people/utils";
import { getLocalCores, setLocalCores } from "@/lib/people/supabase";
import { SEED_CORES } from "@/lib/people/seed";
import type { Core } from "@/lib/people/types";

interface PeopleState {
  alias: string;
  refreshAlias: () => string;
  cores: Core[];
  setCores: (cores: Core[]) => void;
  updateCore: (id: string, patch: Partial<Core>) => void;
  addCore: (core: Core) => void;
  removeCore: (id: string) => void;
  activeCoreId: string | null;
  setActiveCoreId: (id: string | null) => void;
  compactMode: boolean;
  setCompactMode: (v: boolean) => void;
  search: string;
  setSearch: (s: string) => void;
  adminUnlocked: boolean;
  setAdminUnlocked: (v: boolean) => void;
}

const PeopleContext = createContext<PeopleState | null>(null);

export function PeopleProvider({ children }: { children: React.ReactNode }) {
  const [alias, setAlias] = useState("Ghost-000");
  const [cores, setCoresState] = useState<Core[]>(SEED_CORES);
  const [activeCoreId, setActiveCoreId] = useState<string | null>(null);
  const [compactMode, setCompactMode] = useState(false);
  const [search, setSearch] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);

  useEffect(() => {
    setAlias(getOrCreateAlias());
    const local = getLocalCores() as Core[];
    if (Array.isArray(local) && local.length > 0) setCoresState(local);
    else setLocalCores(SEED_CORES);
    try {
      const cm = localStorage.getItem("people:compact");
      if (cm === "1") setCompactMode(true);
      const au = sessionStorage.getItem("people:admin");
      if (au === "1") setAdminUnlocked(true);
    } catch {}
  }, []);

  const refreshAlias = useCallback(() => {
    const next = regenerateAlias();
    setAlias(next);
    return next;
  }, []);

  const setCores = useCallback((next: Core[]) => {
    setCoresState(next);
    setLocalCores(next);
  }, []);

  const updateCore = useCallback(
    (id: string, patch: Partial<Core>) => {
      setCoresState((prev) => {
        const next = prev.map((c) => (c.id === id ? { ...c, ...patch } : c));
        setLocalCores(next);
        return next;
      });
    },
    []
  );

  const addCore = useCallback((core: Core) => {
    setCoresState((prev) => {
      const next = [...prev, core];
      setLocalCores(next);
      return next;
    });
  }, []);

  const removeCore = useCallback((id: string) => {
    setCoresState((prev) => {
      const next = prev.filter((c) => c.id !== id);
      setLocalCores(next);
      return next;
    });
  }, []);

  const handleCompact = useCallback((v: boolean) => {
    setCompactMode(v);
    try {
      localStorage.setItem("people:compact", v ? "1" : "0");
    } catch {}
  }, []);

  const handleAdmin = useCallback((v: boolean) => {
    setAdminUnlocked(v);
    try {
      if (v) sessionStorage.setItem("people:admin", "1");
      else sessionStorage.removeItem("people:admin");
    } catch {}
  }, []);

  const value = useMemo<PeopleState>(
    () => ({
      alias,
      refreshAlias,
      cores,
      setCores,
      updateCore,
      addCore,
      removeCore,
      activeCoreId,
      setActiveCoreId,
      compactMode,
      setCompactMode: handleCompact,
      search,
      setSearch,
      adminUnlocked,
      setAdminUnlocked: handleAdmin,
    }),
    [alias, refreshAlias, cores, setCores, updateCore, addCore, removeCore, activeCoreId, compactMode, handleCompact, search, adminUnlocked, handleAdmin]
  );

  return <PeopleContext.Provider value={value}>{children}</PeopleContext.Provider>;
}

export function usePeople(): PeopleState {
  const ctx = useContext(PeopleContext);
  if (!ctx) throw new Error("usePeople must be used within PeopleProvider");
  return ctx;
}
