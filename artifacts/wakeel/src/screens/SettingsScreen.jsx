import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppHeader } from '../components/AppHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { C } from '../theme/colors';
import { FONTS, SIZES } from '../theme/typography';
import { useSettings } from '../context/SettingsContext';

const FIELDS = [
  { key: 'school_name', label: 'اسم المدرسة', type: 'text' },
  { key: 'education_admin', label: 'إدارة التعليم', type: 'text' },
  { key: 'school_level', label: 'المرحلة', type: 'select', options: ['ابتدائية', 'متوسطة', 'ثانوية'] },
  { key: 'vice_principal', label: 'وكيل شؤون الطلاب', type: 'text' },
  { key: 'principal', label: 'مدير المدرسة', type: 'text' },
  { key: 'admin_assistant', label: 'المساعد الإداري', type: 'text' },
  { key: 'counselor', label: 'الموجه الطلابي', type: 'text' },
];

export function SettingsScreen() {
  const { settings, save } = useSettings();
  const [form, setForm] = useState({});

  useEffect(() => { setForm(settings || {}); }, [settings]);

  const onSave = async () => {
    const fields = {};
    FIELDS.forEach((f) => { fields[f.key] = form[f.key] ?? ''; });
    await save(fields);
    Alert.alert('تم الحفظ', 'تم تحديث بيانات المدرسة بنجاح');
  };

  return (
    <ScreenContainer edges={['top']}>
      <AppHeader title="إعدادات المدرسة" showBack />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.hint}>تظهر هذه البيانات في ترويسة جميع النماذج والمستندات المصدّرة.</Text>
        <Card>
          {FIELDS.map((f) => (
            <Field key={f.key} field={f} value={form[f.key]} onChange={(v) => setForm((p) => ({ ...p, [f.key]: v }))} />
          ))}
        </Card>
        <View style={{ height: 16 }} />
        <Button title="حفظ الإعدادات" icon="save-outline" onPress={onSave} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 32 },
  hint: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: C.textLight, textAlign: 'right', marginBottom: 14, lineHeight: 22 },
});

export default SettingsScreen;
