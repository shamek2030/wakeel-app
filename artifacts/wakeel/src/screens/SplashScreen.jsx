import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { C } from '../theme/colors';
import { FONTS, SIZES } from '../theme/typography';

export function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.replace('/login'), 1600);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <LinearGradient colors={[C.primary, C.primaryDark]} style={styles.wrap}>
      <View style={styles.logo}>
        <Ionicons name="shield-checkmark" size={64} color={C.accent} />
      </View>
      <Text style={styles.title}>وكيل</Text>
      <Text style={styles.subtitle}>مساعد وكيل شؤون الطلاب</Text>
      <Text style={styles.footer}>للمرحلة المتوسطة — المملكة العربية السعودية</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: {
    width: 120, height: 120, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  title: { fontFamily: FONTS.black, fontSize: SIZES.hero, color: '#fff' },
  subtitle: { fontFamily: FONTS.semibold, fontSize: SIZES.lg, color: C.accent, marginTop: 8 },
  footer: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: 'rgba(255,255,255,0.6)', position: 'absolute', bottom: 48 },
});

export default SplashScreen;
