import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { C } from "../../src/theme/colors";
import { FONTS } from "../../src/theme/typography";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.primary,
        tabBarInactiveTintColor: C.textLight,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: C.border,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontFamily: FONTS.semibold, fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: "الرئيسية", tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="students"
        options={{ title: "الطلاب", tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="records"
        options={{ title: "النماذج", tabBarIcon: ({ color, size }) => <Ionicons name="documents" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="reports"
        options={{ title: "التقارير", tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="more"
        options={{ title: "المزيد", tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} /> }}
      />
    </Tabs>
  );
}
