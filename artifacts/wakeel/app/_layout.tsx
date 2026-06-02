import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { I18nManager } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAppFonts } from "../src/hooks/useFonts";
import { initDatabase } from "../src/db/database";
import { SettingsProvider } from "../src/context/SettingsContext";
import { ProProvider } from "../src/context/ProContext";

// Force right-to-left layout for the Arabic-only UI.
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useAppFonts();
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initDatabase().finally(() => setDbReady(true));
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && dbReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, dbReady]);

  // Safety net: never let the native splash stay up indefinitely if fonts hang.
  useEffect(() => {
    const t = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  // Render as soon as the DB is ready; custom fonts swap in when available so
  // the UI is never blocked by font loading (which can hang on web).
  if (!dbReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <SettingsProvider>
            <ProProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="login" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="student/[id]" />
                <Stack.Screen name="record/[formNumber]" />
                <Stack.Screen name="form31" />
                <Stack.Screen name="evidence" />
                <Stack.Screen name="settings" />
                <Stack.Screen name="privacy" />
                <Stack.Screen name="subscription" />
              </Stack>
            </ProProvider>
          </SettingsProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
