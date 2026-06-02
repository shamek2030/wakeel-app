import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppHeader } from '../components/AppHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { C } from '../theme/colors';
import { FONTS, SIZES } from '../theme/typography';
import { deleteAllData } from '../db/queries';

const POINTS = [
  { icon: 'phone-portrait-outline', title: 'تخزين محلي بالكامل', text: 'تُحفظ جميع بيانات الطلاب والسجلات على جهازك فقط، ولا تُرسل إلى أي خادم.' },
  { icon: 'cloud-offline-outline', title: 'يعمل دون اتصال', text: 'لا يتطلب التطبيق اتصالاً بالإنترنت لإدارة السجلات وتعبئة النماذج.' },
  { icon: 'sparkles-outline', title: 'مساعد الذكاء الاصطناعي', text: 'عند استخدام مساعد الصياغة فقط، تُرسل تفاصيل الطلب لإنشاء النص ولا تُخزَّن.' },
  { icon: 'lock-closed-outline', title: 'لا مشاركة للبيانات', text: 'لا تتم مشاركة أي بيانات مع أطراف ثالثة لأغراض تجارية أو إعلانية.' },
];

export function PrivacyScreen() {
  const [busy, setBusy] = useState(false);

  const onDelete = () => {
    Alert.alert(
      'حذف جميع البيانات',
      'سيتم حذف جميع الطلاب والسجلات والمخالفات والأدلة نهائياً. لا يمكن التراجع عن هذا الإجراء.',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف نهائي', style: 'destructive',
          onPress: async () => {
            setBusy(true);
            await deleteAllData();
            setBusy(false);
            Alert.alert('تم', 'تم حذف جميع البيانات');
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer edges={['top']}>
      <AppHeader title="الخصوصية والبيانات" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        {POINTS.map((p) => (
          <Card key={p.title} style={styles.card}>
            <View style={styles.iconWrap}><Ionicons name={p.icon} size={22} color={C.primary} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{p.title}</Text>
              <Text style={styles.text}>{p.text}</Text>
            </View>
          </Card>
        ))}

        <Text style={styles.dangerTitle}>منطقة الخطر</Text>
        <Card style={styles.dangerCard}>
          <Text style={styles.dangerText}>حذف جميع البيانات المخزنة على الجهاز نهائياً.</Text>
          <View style={{ height: 12 }} />
          <Button title="حذف جميع البيانات" variant="danger" icon="trash-outline" loading={busy} onPress={onDelete} />
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 32 },
  card: { flexDirection: 'row', marginBottom: 10 },
  iconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: C.greenBg, alignItems: 'center', justifyContent: 'center', marginStart: 12 },
  title: { fontFamily: FONTS.bold, fontSize: SIZES.md, color: C.text, textAlign: 'right' },
  text: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: C.textLight, textAlign: 'right', marginTop: 4, lineHeight: 22 },
  dangerTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: C.red, textAlign: 'right', marginTop: 18, marginBottom: 12 },
  dangerCard: { borderColor: C.redBg, borderWidth: 1 },
  dangerText: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: C.textLight, textAlign: 'right', lineHeight: 22 },
});

export default PrivacyScreen;
