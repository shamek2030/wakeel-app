import React, { createContext, useContext, useMemo } from 'react';
import { useSettings } from './SettingsContext';

const FREE_LIMITS = {
  students: 30,
  recordsPerForm: 5,
  evidence: 10,
};

const ProContext = createContext({
  isPro: false,
  expiry: null,
  limits: FREE_LIMITS,
  activate: async () => {},
  deactivate: async () => {},
  canAddStudent: () => true,
  canAddRecord: () => true,
  canAddEvidence: () => true,
});

export function ProProvider({ children }) {
  const { settings, save } = useSettings();

  const isPro = useMemo(() => {
    if (!settings?.is_pro) return false;
    if (settings.pro_expiry) {
      return new Date(settings.pro_expiry).getTime() > Date.now();
    }
    return true;
  }, [settings]);

  const value = useMemo(() => ({
    isPro,
    expiry: settings?.pro_expiry || null,
    limits: FREE_LIMITS,
    activate: async (months = 12) => {
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + months);
      await save({ is_pro: 1, pro_expiry: expiry.toISOString() });
    },
    deactivate: async () => {
      await save({ is_pro: 0, pro_expiry: null });
    },
    canAddStudent: (count) => isPro || count < FREE_LIMITS.students,
    canAddRecord: (countForForm) => isPro || countForForm < FREE_LIMITS.recordsPerForm,
    canAddEvidence: (count) => isPro || count < FREE_LIMITS.evidence,
  }), [isPro, settings, save]);

  return <ProContext.Provider value={value}>{children}</ProContext.Provider>;
}

export function usePro() {
  return useContext(ProContext);
}

export { FREE_LIMITS };
export default ProContext;
