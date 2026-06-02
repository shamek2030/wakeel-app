import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/Button';
import { C } from '../theme/colors';
import { FONTS, SIZES } from '../theme/typography';

export function LoginScreen() {
  const router = useRouter();
  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scroll}>
        <LinearGradient colors={[C.primary, C.primaryDark]} style={styles.hero}>
          <View style={styles.logo}>
            <Ionicons name="shield-checkmark" size={48} color={C.accent} />
          </View>
          <Text style={styles.title}>وكيل</Text>
          <Text style={styles.subtitle}>مساعد وكيل شؤون الطلاب الذكي</Text>
        </LinearGradient>

        <View style={styles.body}>
          <Text style={styles.welcome}>أهلاً بك</Text>
          <Text style={styles.desc}>
            تطبيق يساعدك على إدارة سجلات الطلاب وتعبئة النماذج الرسمية لإدارة التعليم،
            مع حفظ البيانات على جهازك بالكامل دون اتصال.
          </Text>

          <View style={styles.features}>
            {[
              { icon: 'lock-closed-outline', text: 'بياناتك محفوظة على جهازك فقط' },
              { icon: 'documents-outline', text: '١٥ نموذجاً رسمياً جاهزاً' },
              { icon: 'sparkles-outline', text: 'مساعد ذكاء اصطناعي للصياغة' },
            ].map((f) => (
              <View key={f.icon} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons name={f.icon} size={20} color={C.primary} />
                </View>
                <Text style={styles.featureText}>{f.text}</Text>
              </View>
            ))}
          </View>

          <Button title="الدخول إلى التطبيق" icon="log-in-outline" onPress={() => router.replace('/home')} />
          <Text style={styles.legal}>بالدخول فإنك توافق على سياسة الخصوصية</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  hero: { alignItems: 'center', paddingVertical: 48, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  logo: {
    width: 88, height: 88, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  title: { fontFamily: FONTS.black, fontSize: SIZES.hero, color: '#fff' },
  subtitle: { fontFamily: FONTS.medium, fontSize: SIZES.md, color: C.accent, marginTop: 6 },
  body: { padding: 24 },
  welcome: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: C.text, textAlign: 'right' },
  desc: { fontFamily: FONTS.regular, fontSize: SIZES.md, color: C.textLight, textAlign: 'right', lineHeight: 26, marginTop: 10, marginBottom: 24 },
  features: { marginBottom: 28 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  featureIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: C.greenBg, alignItems: 'center', justifyContent: 'center', marginStart: 12 },
  featureText: { fontFamily: FONTS.medium, fontSize: SIZES.md, color: C.text, flex: 1, textAlign: 'right' },
  legal: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: C.textLight, textAlign: 'center', marginTop: 16 },
});

export default LoginScreen;
