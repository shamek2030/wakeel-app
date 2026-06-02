import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme/colors';
import { FONTS, SIZES } from '../theme/typography';

export function Button({ title, onPress, variant = 'primary', icon, loading, disabled, style }) {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';

  const bg = isPrimary ? C.primary : isDanger ? C.red : isOutline ? 'transparent' : C.accent;
  const fg = isPrimary || isDanger ? '#fff' : isOutline ? C.primary : C.primaryDark;
  const borderColor = isOutline ? C.primary : 'transparent';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.btn, { backgroundColor: bg, borderColor, borderWidth: isOutline ? 1.5 : 0 }, (disabled || loading) && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={styles.content}>
          {icon ? <Ionicons name={icon} size={18} color={fg} style={styles.icon} /> : null}
          <Text style={[styles.text, { color: fg }]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { borderRadius: 14, paddingVertical: 14, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center' },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  icon: { marginStart: 8 },
  text: { fontFamily: FONTS.bold, fontSize: SIZES.md },
  disabled: { opacity: 0.5 },
});

export default Button;
