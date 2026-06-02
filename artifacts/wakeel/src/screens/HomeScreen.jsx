import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppHeader } from '../components/AppHeader';
import { Card } from '../components/Card';
import { C } from '../theme/colors';
import { FONTS, SIZES, toArabicNumerals, formatHijriDate } from '../theme/typography';
import { useSettings } from '../context/SettingsContext';
import { usePro } from '../context/ProContext';
import { getStudentsCount, getRecordsCount, getViolationsCount } from '../db/queries';

const QUICK = [
  { key: 'students', label: 'الطلاب', icon: 'people', color: C.blue, bg: C.blueBg, route: '/students' },
  { key: 'forms', label: 'النماذج', icon: 'documents', color: C.green, bg: C.greenBg, route: '/records' },
  { key: 'form31', label: 'تحويل طالب', icon: 'git-branch', color: C.purple, bg: C.purpleBg, route: '/form31' },
  { key: 'reports', label: 'التقارير', icon: 'bar-chart', color: C.amber, bg: C.amberBg, route: '/reports' },
];

export function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const { isPro } = usePro();
  const [stats, setStats] = useState({ students: 0, records: 0, violations: 0 });

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const [students, records, violations] = await Promise.all([
          getStudentsCount(), getRecordsCount(), getViolationsCount(),
        ]);
        if (active) setStats({ students, records, violations });
      })();
      return () => { active = false; };
    }, [])
  );

  return (
    <ScreenContainer edges={['top']}>
      <AppHeader
        title={settings.school_name && settings.school_name !== '........' ? settings.school_name : 'وكيل'}
        subtitle="لوحة المعلومات"
        right={
          <TouchableOpacity onPress={() => router.push('/settings')} hitSlop={10}>
            <Ionicons name="settings-outline" size={22} color="#fff" />
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 80 }]}>
        <Text style={styles.date}>{formatHijriDate()}</Text>

        {!isPro ? (
          <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/subscription')}>
            <LinearGradient colors={[C.accent, C.accentDark]} style={styles.proBanner}>
              <View style={{ flex: 1 }}>
                <Text style={styles.proTitle}>الترقية إلى وكيل برو</Text>
                <Text style={styles.proSub}>سجلات غير محدودة ومساعد ذكي للصياغة</Text>
              </View>
              <Ionicons name="star" size={28} color={C.primaryDark} />
            </LinearGradient>
          </TouchableOpacity>
        ) : null}

        <View style={styles.statsRow}>
          <StatCard label="الطلاب" value={stats.students} icon="people" color={C.blue} />
          <StatCard label="السجلات" value={stats.records} icon="document-text" color={C.green} />
          <StatCard label="المخالفات" value={stats.violations} icon="warning" color={C.red} />
        </View>

        <Text style={styles.sectionTitle}>إجراءات سريعة</Text>
        <View style={styles.quickGrid}>
          {QUICK.map((q) => (
            <Card key={q.key} style={styles.quickCard} onPress={() => router.push(q.route)}>
              <View style={[styles.quickIcon, { backgroundColor: q.bg }]}>
                <Ionicons name={q.icon} size={26} color={q.color} />
              </View>
              <Text style={styles.quickLabel}>{q.label}</Text>
            </Card>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <Card style={styles.statCard}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={styles.statValue}>{toArabicNumerals(value ?? 0)}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 32 },
  date: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: C.textLight, textAlign: 'right', marginBottom: 16 },
  proBanner: { flexDirection: 'row', alignItems: 'center', borderRadius: 18, padding: 18, marginBottom: 20 },
  proTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: C.primaryDark, textAlign: 'right' },
  proSub: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: C.primaryDark, textAlign: 'right', marginTop: 4, opacity: 0.8 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 18 },
  statValue: { fontFamily: FONTS.black, fontSize: SIZES.xxl, color: C.text, marginTop: 8 },
  statLabel: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: C.textLight, marginTop: 2 },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: C.text, textAlign: 'right', marginBottom: 14 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickCard: { width: '47%', alignItems: 'center', paddingVertical: 24 },
  quickIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  quickLabel: { fontFamily: FONTS.semibold, fontSize: SIZES.md, color: C.text },
});

export default HomeScreen;
