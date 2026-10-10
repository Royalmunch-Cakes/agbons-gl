"use client";

import { createContext, useContext } from "react";

import { siteConfig } from "@/config/site";
import { defaultUsdToNgnRate } from "@/lib/currency";

/** The admin-managed settings client components need. */
export type ClientSettings = {
  whatsapp: string;
  usdToNgnRate: number;
};

const SettingsContext = createContext<ClientSettings>({
  whatsapp: siteConfig.contact.whatsapp,
  usdToNgnRate: defaultUsdToNgnRate,
});

export function SettingsProvider({
  value,
  children,
}: {
  value: ClientSettings;
  children: React.ReactNode;
}) {
  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SettingsContext);
}
