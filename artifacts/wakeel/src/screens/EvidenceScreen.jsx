import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Pressable, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppHeader } from '../components/AppHeader';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { UpgradeModal } from '../components/UpgradeModal';
import { C } from '../theme/colors';
import { FONTS, SIZES, toArabicNumerals } from '../theme/typography';
import { getAllEvidence, insertEvidence } from '../db/queries';
import { usePro } from '../context/ProContext';

const CATEGORIES = ['تعميم', 'محضر', 'صورة', 'مستند', 'أخرى'];

export function EvidenceScreen() {
  const { canAddEvidence } = usePro();
  const [items, setItems] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ category: 'مستند' });
  const [upgrade, setUpgrade] = useState(false);

  const load = useCallback(async () => setItems(await getAllEvidence()), []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.6 });
    if (!res.canceled && res.assets?.[0]) setForm((p) => ({ ...p, file_uri: res.assets[0].uri }));
  };

  const onSave = async () => {
    if (!form.title) { Alert.alert('تنبيه', 'الرجاء إدخال عنوان الدليل'); return; }
    if (!canAddEvidence(items.length)) { setAddOpen(false); setUpgrade(true); return; }
    await insertEvidence(form);
    setForm({ category: 'مستند' });
    setAddOpen(false);
    load();
  };

  return (
    <ScreenContainer edges={['top']}>
      <AppHeader title="الأدلة والمرفقات" subtitle={`${toArabicNumerals(items.length)} عنصر`} showBack
        right={<TouchableOpacity onPress={() => setAddOpen(true)} hitSlop={10}><Ionicons name="add" size={24} color="#fff" /></TouchableOpacity>}
      />
      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="folder-open-outline" title="لا توجد أدلة بعد" subtitle="أضف التعاميم والمحاضر والصور لحفظها كمرجع" />}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            {item.file_uri ? (
              <Image source={{ uri: item.file_uri }} style={styles.thumb} />
            ) : (
              <View style={styles.thumbPlaceholder}><Ionicons name="document-text" size={24} color={C.primary} /></View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.catTag}><Text style={styles.catText}>{item.category}</Text></View>
              {item.description ? <Text style={styles.desc} numberOfLines={2}>{item.description}</Text> : null}
            </View>
          </Card>
        )}
      />

      <Modal visible={addOpen} transparent animationType="slide" onRequestClose={() => setAddOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setAddOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>إضافة دليل</Text>
            <Field field={{ key: 'title', label: 'العنوان', type: 'text', required: true }} value={form.title} onChange={(v) => setForm((p) => ({ ...p, title: v }))} />
            <Field field={{ key: 'category', label: 'التصنيف', type: 'select', options: CATEGORIES }} value={form.category} onChange={(v) => setForm((p) => ({ ...p, category: v }))} />
            <Field field={{ key: 'description', label: 'الوصف', type: 'textarea', rows: 3 }} value={form.description} onChange={(v) => setForm((p) => ({ ...p, description: v }))} />
            <Button title={form.file_uri ? 'تم اختيار صورة' : 'إرفاق صورة'} variant="outline" icon="image-outline" onPress={pickImage} />
            <View style={{ height: 12 }} />
            <Button title="حفظ" icon="checkmark" onPress={onSave} />
          </Pressable>
        </Pressable>
      </Modal>

      <UpgradeModal visible={upgrade} onClose={() => setUpgrade(false)} message="وصلت إلى حد الأدلة في النسخة المجانية (١٠ عناصر)" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, flexGrow: 1 },
  card: { flexDirection: 'row', marginBottom: 10 },
  thumb: { width: 56, height: 56, borderRadius: 12, marginStart: 12 },
  thumbPlaceholder: { width: 56, height: 56, borderRadius: 12, backgroundColor: C.blueBg, alignItems: 'center', justifyContent: 'center', marginStart: 12 },
  title: { fontFamily: FONTS.bold, fontSize: SIZES.md, color: C.text, textAlign: 'right' },
  catTag: { alignSelf: 'flex-end', backgroundColor: C.amberBg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginTop: 4 },
  catText: { fontFamily: FONTS.semibold, fontSize: SIZES.xs, color: C.amber },
  desc: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: C.textLight, textAlign: 'right', marginTop: 6 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: C.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '88%' },
  sheetTitle: { fontFamily: FONTS.bold, fontSize: SIZES.xl, color: C.text, marginBottom: 16, textAlign: 'right' },
});

export default EvidenceScreen;
