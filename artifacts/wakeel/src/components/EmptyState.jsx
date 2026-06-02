import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme/colors';
import { FONTS, SIZES } from '../theme/typography';

export function EmptyState({ icon = 'document-text-outline', title, subtitle }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={40} color={C.accentDark} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  iconWrap: {
    width: 88, height: 88, borderRadius: 44, backgroundColor: C.greenBg,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  title: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: C.text, textAlign: 'center' },
  subtitle: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: C.textLight, textAlign: 'center', marginTop: 8, lineHeight: 22 },
});

export default EmptyState;
