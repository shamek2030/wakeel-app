import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppHeader } from '../components/AppHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { C } from '../theme/colors';
import { FONTS, SIZES, toArabicNumerals } from '../theme/typography';
import { usePro, FREE_LIMITS } from '../context/ProContext';

const PRO_FEATURES = [
  'عدد غير محدود من الطلاب والسجلات',
  'مساعد الذكاء الاصطناعي لصياغة الخطابات الرسمية',
  'أدلة ومرفقات غير محدودة',
  'تصدير PDF لكل النماذج الرسمية',
  'دعم فني ذو أولوية',
];

export function SubscriptionScreen() {
  const { isPro, expiry, activate, deactivate } = usePro();

  const onSubscribe = () => {
    Alert.alert(
      'تفعيل وكيل برو',
      'سيتم تفعيل اشتراك تجريبي لمدة سنة. (في النسخة النهائية يتم الربط ببوابة الدفع).',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'تفعيل', onPress: async () => { await activate(12); Alert.alert('تم', 'تم تفعيل وكيل برو بنجاح'); } },
      ]
    );
  };

  return (
    <ScreenContainer edges={['top']}>
      <AppHeader title="الاشتراك" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        <LinearGradient colors={isPro ? [C.green, C.accentDark] : [C.primary, C.primaryDark]} style={styles.hero}>
          <Ionicons name={isPro ? 'star' : 'rocket-outline'} size={40} color="#fff" />
          <Text style={styles.heroTitle}>{isPro ? 'أنت مشترك في وكيل برو' : 'وكيل برو'}</Text>
          {isPro && expiry ? (
            <Text style={styles.heroSub}>ساري حتى {toArabicNumerals(new Date(expiry).toLocaleDateString('ar'))}</Text>
          ) : (
            <Text style={styles.heroSub}>أطلق كامل إمكانات التطبيق</Text>
          )}
        </LinearGradient>

        {!isPro ? (
          <Card style={styles.limitsCard}>
            <Text style={styles.limitsTitle}>حدود النسخة المجانية</Text>
            <LimitRow label="الطلاب" value={`${toArabicNumerals(FREE_LIMITS.students)} طالب`} />
            <LimitRow label="السجلات لكل نموذج" value={`${toArabicNumerals(FREE_LIMITS.recordsPerForm)} سجلات`} />
            <LimitRow label="الأدلة" value={`${toArabicNumerals(FREE_LIMITS.evidence)} عناصر`} />
            <LimitRow label="مساعد الذكاء الاصطناعي" value="غير متاح" />
          </Card>
        ) : null}

        <Card style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>مزايا برو</Text>
          {PRO_FEATURES.map((f) => (
            <View key={f} style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color={C.green} />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </Card>

        {!isPro ? (
          <Button title="الاشتراك الآن" icon="star" onPress={onSubscribe} />
        ) : (
          <Button title="إلغاء الاشتراك" variant="outline" onPress={async () => { await deactivate(); Alert.alert('تم', 'تم إلغاء الاشتراك'); }} />
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

function LimitRow({ label, value }) {
  return (
    <View style={styles.limitRow}>
      <Text style={styles.limitValue}>{value}</Text>
      <Text style={styles.limitLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 32 },
  hero: { alignItems: 'center', borderRadius: 20, paddingVertical: 32, marginBottom: 16 },
  heroTitle: { fontFamily: FONTS.black, fontSize: SIZES.xl, color: '#fff', marginTop: 12 },
  heroSub: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: 'rgba(255,255,255,0.85)', marginTop: 6 },
  limitsCard: { marginBottom: 16 },
  limitsTitle: { fontFamily: FONTS.bold, fontSize: SIZES.md, color: C.text, textAlign: 'right', marginBottom: 12 },
  limitRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  limitLabel: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: C.textLight },
  limitValue: { fontFamily: FONTS.semibold, fontSize: SIZES.sm, color: C.text },
  featuresCard: { marginBottom: 16 },
  featuresTitle: { fontFamily: FONTS.bold, fontSize: SIZES.md, color: C.primary, textAlign: 'right', marginBottom: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  featureText: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: C.text, marginStart: 10, flex: 1, textAlign: 'right' },
});

export default SubscriptionScreen;
