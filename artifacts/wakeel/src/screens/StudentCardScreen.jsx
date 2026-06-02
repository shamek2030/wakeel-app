import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppHeader } from '../components/AppHeader';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { C } from '../theme/colors';
import { FONTS, SIZES, toArabicNumerals } from '../theme/typography';
import { getStudent } from '../db/queries';
import { getFormMeta } from '../db/formSchemas';

const DEGREE_COLORS = { 1: C.amber, 2: C.amber, 3: C.red, 4: C.red, 5: C.red, 6: C.red };

export function StudentCardScreen() {
  const { id } = useLocalSearchParams();
  const [student, setStudent] = useState(null);

  useFocusEffect(useCallback(() => {
    let active = true;
    (async () => {
      const s = await getStudent(Number(id));
      if (active) setStudent(s);
    })();
    return () => { active = false; };
  }, [id]));

  if (!student) {
    return (
      <ScreenContainer edges={['top']}>
        <AppHeader title="بطاقة الطالب" showBack />
        <EmptyState icon="person-outline" title="جارٍ التحميل..." />
      </ScreenContainer>
    );
  }

  const info = [
    { label: 'السجل المدني', value: student.national_id ? toArabicNumerals(student.national_id) : '—' },
    { label: 'الصف', value: student.grade || '—' },
    { label: 'الفصل', value: student.section || '—' },
    { label: 'ولي الأمر', value: student.guardian_name || '—' },
    { label: 'جوال ولي الأمر', value: student.guardian_phone ? toArabicNumerals(student.guardian_phone) : '—' },
  ];

  return (
    <ScreenContainer edges={['top']}>
      <AppHeader title="بطاقة الطالب" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(student.name || '؟').charAt(0)}</Text>
          </View>
          <Text style={styles.name}>{student.name}</Text>
          <Text style={styles.sub}>{[student.grade, student.section].filter(Boolean).join(' - ') || 'بدون صف'}</Text>
        </Card>

        <Card style={styles.section}>
          {info.map((row, i) => (
            <View key={row.label} style={[styles.infoRow, i === info.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={styles.infoValue}>{row.value}</Text>
              <Text style={styles.infoLabel}>{row.label}</Text>
            </View>
          ))}
        </Card>

        <Text style={styles.sectionTitle}>المخالفات ({toArabicNumerals(student.violations.length)})</Text>
        {student.violations.length === 0 ? (
          <Card style={styles.emptyCard}><Text style={styles.emptyText}>لا توجد مخالفات مسجلة</Text></Card>
        ) : (
          student.violations.map((v) => (
            <Card key={v.id} style={styles.violationCard}>
              <View style={[styles.degreeBadge, { backgroundColor: DEGREE_COLORS[v.degree] || C.amber }]}>
                <Text style={styles.degreeText}>د {toArabicNumerals(v.degree)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.violationDesc}>{v.description || 'مخالفة سلوكية'}</Text>
                {v.deduct_points ? (
                  <Text style={styles.violationMeta}>حسم {toArabicNumerals(v.deduct_points)} درجة من {v.deduct_type}</Text>
                ) : null}
              </View>
            </Card>
          ))
        )}

        <Text style={styles.sectionTitle}>السجلات ({toArabicNumerals(student.records.length)})</Text>
        {student.records.length === 0 ? (
          <Card style={styles.emptyCard}><Text style={styles.emptyText}>لا توجد سجلات مرتبطة</Text></Card>
        ) : (
          student.records.map((r) => {
            const meta = getFormMeta(r.form_number);
            return (
              <Card key={r.id} style={styles.recordCard}>
                <Ionicons name="document-text-outline" size={22} color={C.primary} />
                <View style={{ flex: 1, marginStart: 10 }}>
                  <Text style={styles.recordTitle}>{r.title}</Text>
                  <Text style={styles.recordMeta}>{meta?.code || ''} · {r.status === 'final' ? 'نهائي' : 'مسودة'}</Text>
                </View>
              </Card>
            );
          })
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 32 },
  header: { alignItems: 'center', marginBottom: 16 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontFamily: FONTS.black, fontSize: SIZES.xxl, color: '#fff' },
  name: { fontFamily: FONTS.bold, fontSize: SIZES.xl, color: C.text },
  sub: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: C.textLight, marginTop: 4 },
  section: { marginBottom: 8, paddingVertical: 4 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  infoLabel: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: C.textLight },
  infoValue: { fontFamily: FONTS.semibold, fontSize: SIZES.sm, color: C.text },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: C.text, textAlign: 'right', marginTop: 18, marginBottom: 12 },
  emptyCard: { alignItems: 'center', paddingVertical: 20 },
  emptyText: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: C.textLight },
  violationCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  degreeBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, marginStart: 12 },
  degreeText: { fontFamily: FONTS.bold, fontSize: SIZES.xs, color: '#fff' },
  violationDesc: { fontFamily: FONTS.semibold, fontSize: SIZES.sm, color: C.text, textAlign: 'right' },
  violationMeta: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: C.textLight, textAlign: 'right', marginTop: 3 },
  recordCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  recordTitle: { fontFamily: FONTS.semibold, fontSize: SIZES.sm, color: C.text, textAlign: 'right' },
  recordMeta: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: C.textLight, textAlign: 'right', marginTop: 3 },
});

export default StudentCardScreen;
