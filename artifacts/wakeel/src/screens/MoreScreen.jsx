import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppHeader } from '../components/AppHeader';
import { Card } from '../components/Card';
import { C } from '../theme/colors';
import { FONTS, SIZES } from '../theme/typography';
import { usePro } from '../context/ProContext';

const ITEMS = [
  { key: 'evidence', label: 'الأدلة والمرفقات', icon: 'folder-open', color: C.amber, bg: C.amberBg, route: '/evidence' },
  { key: 'settings', label: 'إعدادات المدرسة', icon: 'settings', color: C.blue, bg: C.blueBg, route: '/settings' },
  { key: 'subscription', label: 'الاشتراك (برو)', icon: 'star', color: C.green, bg: C.greenBg, route: '/subscription' },
  { key: 'privacy', label: 'الخصوصية والبيانات', icon: 'shield-checkmark', color: C.purple, bg: C.purpleBg, route: '/privacy' },
];

export function MoreScreen() {
  const router = useRouter();
  const { isPro } = usePro();

  return (
    <ScreenContainer edges={['top']}>
      <AppHeader title="المزيد" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <LinearGradient colors={[C.primary, C.primaryDark]} style={styles.profile}>
          <View style={styles.profileIcon}>
            <Ionicons name="shield-checkmark" size={32} color={C.accent} />
          </View>
          <Text style={styles.profileTitle}>وكيل شؤون الطلاب</Text>
          <View style={[styles.planBadge, isPro && styles.planPro]}>
            <Ionicons name={isPro ? 'star' : 'flash-outline'} size={12} color={isPro ? C.primaryDark : '#fff'} />
            <Text style={[styles.planText, isPro && styles.planTextPro]}>
              {isPro ? 'مشترك برو' : 'النسخة المجانية'}
            </Text>
          </View>
        </LinearGradient>

        {ITEMS.map((it) => (
          <Card key={it.key} style={styles.row} onPress={() => router.push(it.route)}>
            <View style={[styles.rowIcon, { backgroundColor: it.bg }]}>
              <Ionicons name={it.icon} size={22} color={it.color} />
            </View>
            <Text style={styles.rowLabel}>{it.label}</Text>
            <Ionicons name="chevron-back" size={20} color={C.textLight} />
          </Card>
        ))}

        <Text style={styles.version}>وكيل · الإصدار ١٫٠٫٠</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 32 },
  profile: { alignItems: 'center', borderRadius: 20, padding: 24, marginBottom: 20 },
  profileIcon: { width: 72, height: 72, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  profileTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: '#fff' },
  planBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginTop: 10 },
  planPro: { backgroundColor: C.accent },
  planText: { fontFamily: FONTS.semibold, fontSize: SIZES.xs, color: '#fff', marginStart: 5 },
  planTextPro: { color: C.primaryDark },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  rowIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginStart: 12 },
  rowLabel: { fontFamily: FONTS.semibold, fontSize: SIZES.md, color: C.text, flex: 1, textAlign: 'right' },
  version: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: C.textLight, textAlign: 'center', marginTop: 20 },
});

export default MoreScreen;
