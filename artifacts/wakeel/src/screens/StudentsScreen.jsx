import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Modal, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppHeader } from '../components/AppHeader';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { UpgradeModal } from '../components/UpgradeModal';
import { C } from '../theme/colors';
import { FONTS, SIZES, toArabicNumerals } from '../theme/typography';
import { getStudents, addStudent, importStudents, getStudentsCount } from '../db/queries';
import { usePro, FREE_LIMITS } from '../context/ProContext';

const NEW_FIELDS = [
  { key: 'name', label: 'اسم الطالب', type: 'text', required: true },
  { key: 'national_id', label: 'رقم السجل المدني', type: 'text' },
  { key: 'grade', label: 'الصف', type: 'text' },
  { key: 'section', label: 'الفصل', type: 'text' },
  { key: 'guardian_name', label: 'اسم ولي الأمر', type: 'text' },
  { key: 'guardian_phone', label: 'جوال ولي الأمر', type: 'phone' },
];

export function StudentsScreen() {
  const router = useRouter();
  const { canAddStudent, isPro } = usePro();
  const [query, setQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({});
  const [upgrade, setUpgrade] = useState(false);

  const load = useCallback(async (q) => {
    setStudents(await getStudents(q));
  }, []);

  useFocusEffect(useCallback(() => { load(query); }, [load, query]));

  const onAdd = async () => {
    if (!form.name) { Alert.alert('تنبيه', 'الرجاء إدخال اسم الطالب'); return; }
    const count = await getStudentsCount();
    if (!canAddStudent(count)) { setAddOpen(false); setUpgrade(true); return; }
    await addStudent(form);
    setForm({});
    setAddOpen(false);
    load(query);
  };

  const onImport = async () => {
    try {
      const count = await getStudentsCount();
      if (!canAddStudent(count)) { setUpgrade(true); return; }
      const res = await DocumentPicker.getDocumentAsync({
        type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'],
        copyToCacheDirectory: true,
      });
      if (res.canceled || !res.assets?.[0]) return;
      const uri = res.assets[0].uri;
      const b64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
      const wb = XLSX.read(b64, { type: 'base64' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      const mapped = rows.map((r) => ({
        name: r['الاسم'] || r['اسم الطالب'] || r['name'] || r['Name'] || '',
        national_id: String(r['السجل المدني'] || r['الهوية'] || r['national_id'] || r['ID'] || ''),
        grade: r['الصف'] || r['grade'] || '',
        section: r['الفصل'] || r['section'] || '',
        guardian_name: r['ولي الأمر'] || r['guardian_name'] || '',
        guardian_phone: String(r['الجوال'] || r['guardian_phone'] || ''),
      })).filter((r) => r.name);
      // Enforce the free-tier student quota across the whole import, not just
      // the first row, so the limit cannot be bypassed via Excel import.
      let toImport = mapped;
      let truncated = false;
      if (!isPro) {
        const remaining = Math.max(0, FREE_LIMITS.students - count);
        if (mapped.length > remaining) {
          toImport = mapped.slice(0, remaining);
          truncated = true;
        }
      }
      if (toImport.length === 0) { setUpgrade(true); return; }
      const n = await importStudents(toImport);
      if (truncated) {
        Alert.alert(
          'تم استيراد جزء من الطلاب',
          `تم استيراد ${toArabicNumerals(n)} طالباً فقط لبلوغ حد النسخة المجانية (${toArabicNumerals(FREE_LIMITS.students)}). للاستيراد الكامل، فعّل وكيل برو.`
        );
      } else {
        Alert.alert('تم الاستيراد', `تم استيراد ${toArabicNumerals(n)} طالباً بنجاح`);
      }
      load(query);
    } catch (e) {
      Alert.alert('خطأ', 'تعذر استيراد الملف. تأكد من تنسيق الجدول.');
    }
  };

  return (
    <ScreenContainer edges={['top']}>
      <AppHeader title="الطلاب" subtitle={`${toArabicNumerals(students.length)} طالب`} />
      <View style={styles.toolbar}>
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={C.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث بالاسم أو السجل المدني"
            placeholderTextColor={C.textLight}
            value={query}
            onChangeText={(t) => { setQuery(t); load(t); }}
            textAlign="right"
          />
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={onImport}>
          <Ionicons name="cloud-upload-outline" size={22} color={C.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconBtn, styles.addBtn]} onPress={() => setAddOpen(true)}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            title="لا يوجد طلاب بعد"
            subtitle="أضف الطلاب يدوياً أو استورد ملف Excel يحتوي على بياناتهم"
          />
        }
        renderItem={({ item }) => (
          <Card style={styles.studentCard} onPress={() => router.push(`/student/${item.id}`)}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{(item.name || '؟').charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.studentName}>{item.name}</Text>
              <Text style={styles.studentMeta}>
                {[item.grade, item.section].filter(Boolean).join(' - ') || 'بدون صف'}
                {item.national_id ? ` · ${toArabicNumerals(item.national_id)}` : ''}
              </Text>
            </View>
            <Ionicons name="chevron-back" size={20} color={C.textLight} />
          </Card>
        )}
      />

      <Modal visible={addOpen} transparent animationType="slide" onRequestClose={() => setAddOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setAddOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>إضافة طالب جديد</Text>
            {NEW_FIELDS.map((f) => (
              <Field key={f.key} field={f} value={form[f.key]} onChange={(v) => setForm((p) => ({ ...p, [f.key]: v }))} />
            ))}
            <Button title="حفظ الطالب" icon="checkmark" onPress={onAdd} />
          </Pressable>
        </Pressable>
      </Modal>

      <UpgradeModal visible={upgrade} onClose={() => setUpgrade(false)} message="وصلت إلى حد الطلاب في النسخة المجانية (٣٠ طالباً)" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  toolbar: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 10 },
  search: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: C.border, paddingHorizontal: 12 },
  searchInput: { flex: 1, fontFamily: FONTS.regular, fontSize: SIZES.md, color: C.text, paddingVertical: 10, marginStart: 8, textAlign: 'right' },
  iconBtn: { width: 46, height: 46, borderRadius: 12, backgroundColor: C.blueBg, alignItems: 'center', justifyContent: 'center' },
  addBtn: { backgroundColor: C.primary },
  list: { paddingHorizontal: 16, paddingBottom: 24, flexGrow: 1 },
  studentCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginStart: 12 },
  avatarText: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: '#fff' },
  studentName: { fontFamily: FONTS.bold, fontSize: SIZES.md, color: C.text, textAlign: 'right' },
  studentMeta: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: C.textLight, textAlign: 'right', marginTop: 3 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: C.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '88%' },
  sheetTitle: { fontFamily: FONTS.bold, fontSize: SIZES.xl, color: C.text, marginBottom: 16, textAlign: 'right' },
});

export default StudentsScreen;
