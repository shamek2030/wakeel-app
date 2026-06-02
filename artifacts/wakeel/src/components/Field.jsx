import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme/colors';
import { FONTS, SIZES } from '../theme/typography';

export function Field({ field, value, onChange }) {
  const { label, type, required, options, placeholder, rows } = field;
  const [pickerOpen, setPickerOpen] = useState(false);

  const labelNode = (
    <Text style={styles.label}>
      {label}
      {required ? <Text style={styles.req}> *</Text> : null}
    </Text>
  );

  if (type === 'checkbox') {
    return (
      <TouchableOpacity activeOpacity={0.8} style={styles.checkRow} onPress={() => onChange(!value)}>
        <View style={[styles.checkbox, value && styles.checkboxOn]}>
          {value ? <Ionicons name="checkmark" size={16} color="#fff" /> : null}
        </View>
        <Text style={styles.checkLabel}>{label}</Text>
      </TouchableOpacity>
    );
  }

  if (type === 'select') {
    return (
      <View style={styles.group}>
        {labelNode}
        <TouchableOpacity style={styles.input} onPress={() => setPickerOpen(true)} activeOpacity={0.8}>
          <Text style={[styles.inputText, !value && styles.placeholder]}>
            {value || placeholder || 'اختر...'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={C.textLight} />
        </TouchableOpacity>
        <Modal visible={pickerOpen} transparent animationType="fade" onRequestClose={() => setPickerOpen(false)}>
          <Pressable style={styles.backdrop} onPress={() => setPickerOpen(false)}>
            <View style={styles.sheet}>
              <Text style={styles.sheetTitle}>{label}</Text>
              <ScrollView>
                {(options || []).map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={styles.option}
                    onPress={() => { onChange(opt); setPickerOpen(false); }}
                  >
                    <Text style={[styles.optionText, value === opt && styles.optionSelected]}>{opt}</Text>
                    {value === opt ? <Ionicons name="checkmark-circle" size={20} color={C.green} /> : null}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
      </View>
    );
  }

  const multiline = type === 'textarea';
  const keyboardType = type === 'number' ? 'numeric' : type === 'phone' ? 'phone-pad' : 'default';

  return (
    <View style={styles.group}>
      {labelNode}
      <TextInput
        style={[styles.input, multiline && { minHeight: (rows || 3) * 26, textAlignVertical: 'top', paddingVertical: 12 }]}
        value={value != null ? String(value) : ''}
        onChangeText={onChange}
        placeholder={placeholder || (type === 'date' ? '١٤٤٦/٠١/٠١' : '')}
        placeholderTextColor={C.textLight}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlign="right"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  group: { marginBottom: 14 },
  label: { fontFamily: FONTS.semibold, fontSize: SIZES.sm, color: C.text, marginBottom: 6, textAlign: 'right' },
  req: { color: C.red },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: C.border, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, fontFamily: FONTS.regular, fontSize: SIZES.md,
    color: C.text, textAlign: 'right', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  inputText: { fontFamily: FONTS.regular, fontSize: SIZES.md, color: C.text, flex: 1, textAlign: 'right' },
  placeholder: { color: C.textLight },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  checkbox: {
    width: 24, height: 24, borderRadius: 7, borderWidth: 1.5, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center', marginStart: 10, backgroundColor: '#fff',
  },
  checkboxOn: { backgroundColor: C.green, borderColor: C.green },
  checkLabel: { fontFamily: FONTS.regular, fontSize: SIZES.md, color: C.text, flex: 1, textAlign: 'right' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '70%' },
  sheetTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: C.text, marginBottom: 12, textAlign: 'right' },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  optionText: { fontFamily: FONTS.regular, fontSize: SIZES.md, color: C.text, textAlign: 'right', flex: 1 },
  optionSelected: { fontFamily: FONTS.bold, color: C.primary },
});

export default Field;
