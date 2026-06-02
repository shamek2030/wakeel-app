import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppHeader } from '../components/AppHeader';
import { Card } from '../components/Card';
import { C } from '../theme/colors';
import { FONTS, SIZES, toArabicNumerals } from '../theme/typography';
import { getStudentsCount, getRecordsCount, getViolationsCount, getRecords } from '../db/queries';
import { FORMS_META } from '../db/formSchemas';

export function ReportsScreen() {
  const [stats, setStats] = useState({ students: 0, records: 0, violations: 0 });
  const [byForm, setByForm] = useState([]);

  useFocusEffect(useCallback(() => {
    let active = true;
    (async () => {
      const [students, records, violations, all] = await Promise.all([
        getStudentsCount(), getRecordsCount(), getViolationsCount(), getRecords(),
      ]);
      if (!active) return;
      setStats({ students, records, violations });
      const counts = {};
      all.forEach((r) => { counts[r.form_number] = (counts[r.form_number] || 0) + 1; });
      const list = FORMS_META
        .map((f) => ({ ...f, count: counts[f.number] || 0 }))
        .filter((f) => f.count > 0)
        .sort((a, b) => b.count - a.count);
      setByForm(list);
    })();
    return () => { active = false; };
  }, []));

  const maxCount = byForm.length ? byForm[0].count : 1;

  return (
    <ScreenContainer edges={['top']}>
      <AppHeader title="التقارير والإحصاءات" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.statsRow}>
          <Stat label="إجمالي الطلاب" value={stats.students} icon="people" color={C.blue} bg={C.blueBg} />
          <Stat label="إجمالي السجلات" value={stats.records} icon="document-text" color={C.green} bg={C.greenBg} />
        </View>
        <View style={styles.statsRow}>
          <Stat label="المخالفات المسجلة" value={stats.violations} icon="warning" color={C.red} bg={C.redBg} />
          <Stat label="النماذج المستخدمة" value={byForm.length} icon="albums" color={C.purple} bg={C.purpleBg} />
        </View>

        <Text style={styles.sectionTitle}>السجلات حسب النموذج</Text>
        {byForm.length === 0 ? (
          <Card style={styles.empty}>
            <Ionicons name="bar-chart-outline" size={32} color={C.textLight} />
            <Text style={styles.emptyText}>لا توجد سجلات لعرض إحصاءاتها بعد</Text>
          </Card>
        ) : (
          <Card>
            {byForm.map((f) => (
              <View key={f.number} style={styles.barRow}>
                <View style={styles.barHeader}>
                  <Text style={styles.barCount}>{toArabicNumerals(f.count)}</Text>
                  <Text style={styles.barLabel} numberOfLines={1}>{f.title}</Text>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${(f.count / maxCount) * 100}%` }]} />
                </View>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

function Stat({ label, value, icon, color, bg }) {
  return (
    <Card style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{toArabicNumerals(value)}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 32 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  statCard: { flex: 1, padding: 16 },
  statIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statValue: { fontFamily: FONTS.black, fontSize: SIZES.xxl, color: C.text, textAlign: 'right' },
  statLabel: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: C.textLight, textAlign: 'right', marginTop: 2 },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: C.text, textAlign: 'right', marginTop: 16, marginBottom: 14 },
  barRow: { marginBottom: 16 },
  barHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  barLabel: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: C.text, flex: 1, textAlign: 'right' },
  barCount: { fontFamily: FONTS.bold, fontSize: SIZES.sm, color: C.primary, marginStart: 10 },
  barTrack: { height: 10, backgroundColor: C.border, borderRadius: 6, overflow: 'hidden' },
  barFill: { height: 10, backgroundColor: C.accentDark, borderRadius: 6 },
  empty: { alignItems: 'center', paddingVertical: 32 },
  emptyText: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: C.textLight, marginTop: 10 },
});

export default ReportsScreen;
