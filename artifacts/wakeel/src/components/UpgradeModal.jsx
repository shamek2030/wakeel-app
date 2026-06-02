import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { C } from '../theme/colors';
import { FONTS, SIZES } from '../theme/typography';
import { Button } from './Button';

const FEATURES = [
  'عدد غير محدود من الطلاب والسجلات',
  'مساعد الذكاء الاصطناعي لصياغة الخطابات',
  'الأدلة والمرفقات غير المحدودة',
  'تصدير PDF و Excel لكل النماذج',
];

export function UpgradeModal({ visible, onClose, message }) {
  const router = useRouter();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <LinearGradient colors={[C.accent, C.accentDark]} style={styles.badge}>
            <Ionicons name="star" size={30} color={C.primaryDark} />
          </LinearGradient>
          <Text style={styles.title}>وكيل برو</Text>
          <Text style={styles.subtitle}>{message || 'لقد وصلت إلى حد النسخة المجانية'}</Text>
          <View style={styles.features}>
            {FEATURES.map((f) => (
              <View key={f} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={18} color={C.green} />
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>
          <Button
            title="الترقية إلى برو"
            icon="rocket-outline"
            onPress={() => { onClose(); router.push('/subscription'); }}
          />
          <TouchableOpacity onPress={onClose} style={styles.later}>
            <Text style={styles.laterText}>ليس الآن</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(15,61,92,0.55)', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 24, alignItems: 'center' },
  badge: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  title: { fontFamily: FONTS.black, fontSize: SIZES.xxl, color: C.primary },
  subtitle: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: C.textLight, textAlign: 'center', marginTop: 6, marginBottom: 18 },
  features: { alignSelf: 'stretch', marginBottom: 20 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  featureText: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: C.text, marginStart: 10, flex: 1, textAlign: 'right' },
  later: { marginTop: 12, padding: 8 },
  laterText: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: C.textLight },
});

export default UpgradeModal;
