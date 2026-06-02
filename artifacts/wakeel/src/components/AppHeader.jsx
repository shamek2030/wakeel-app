import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { C } from '../theme/colors';
import { FONTS, SIZES } from '../theme/typography';

export function AppHeader({ title, subtitle, showBack = false, right = null }) {
  const router = useRouter();
  return (
    <LinearGradient colors={[C.primary, C.primaryDark]} style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.side}>
          {showBack ? (
            <TouchableOpacity onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
              <Ionicons name="arrow-forward" size={24} color="#fff" />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.center}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
        </View>
        <View style={styles.side}>{right}</View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingVertical: 14 },
  row: { flexDirection: 'row', alignItems: 'center' },
  side: { width: 44, alignItems: 'center', justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center' },
  iconBtn: { padding: 6 },
  title: { color: '#fff', fontFamily: FONTS.bold, fontSize: SIZES.xl, textAlign: 'center' },
  subtitle: { color: C.accent, fontFamily: FONTS.regular, fontSize: SIZES.sm, marginTop: 2, textAlign: 'center' },
});

export default AppHeader;
