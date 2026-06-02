import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getSettings, updateSettings } from '../db/queries';
import { DEFAULT_SETTINGS } from '../db/database';

const SettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  ready: false,
  refresh: async () => {},
  save: async () => {},
});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const s = await getSettings();
    setSettings(s);
    return s;
  }, []);

  const save = useCallback(async (fields) => {
    await updateSettings(fields);
    setSettings((prev) => ({ ...prev, ...fields }));
  }, []);

  useEffect(() => {
    (async () => {
      await refresh();
      setReady(true);
    })();
  }, [refresh]);

  return (
    <SettingsContext.Provider value={{ settings, ready, refresh, save }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}

export default SettingsContext;
