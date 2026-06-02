import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppHeader } from '../components/AppHeader';
import { Button } from '../components/Button';
import { DynamicFormRenderer } from '../components/DynamicFormRenderer';
import { UpgradeModal } from '../components/UpgradeModal';
import { C } from '../theme/colors';
import { FONTS, SIZES } from '../theme/typography';
import { FORM_SCHEMAS, getFormMeta } from '../db/formSchemas';
import { insertRecord, getRecords } from '../db/queries';
import { usePro } from '../context/ProContext';
import { useSettings } from '../context/SettingsContext';
import { buildRecordHtml } from '../utils/pdf';

export function RecordDetailScreen() {
  const { formNumber } = useLocalSearchParams();
  const num = Number(formNumber);
  const meta = getFormMeta(num);
  const schema = FORM_SCHEMAS[num];
  const { settings } = useSettings();
  const { canAddRecord, isPro } = usePro();

  const [body, setBody] = useState({});
  const [saving, setSaving] = useState(false);
  const [upgrade, setUpgrade] = useState(false);
  const [upgradeMsg, setUpgradeMsg] = useState('');

  useEffect(() => { setBody({}); }, [num]);

  const guardLimit = async () => {
    const existing = await getRecords(num);
    if (!canAddRecord(existing.length)) {
      setUpgradeMsg('وصلت إلى حد السجلات لهذا النموذج في النسخة المجانية (٥ سجلات)');
      setUpgrade(true);
      return false;
    }
    return true;
  };

  const onSave = async (status = 'draft') => {
    if (!(await guardLimit())) return;
    setSaving(true);
    try {
      await insertRecord({
        form_code: meta?.code || '',
        form_number: num,
        title: meta?.title || `نموذج ${num}`,
        body_json: JSON.stringify(body),
        status,
      });
      Alert.alert('تم الحفظ', status === 'final' ? 'تم اعتماد السجل بنجاح' : 'تم حفظ المسودة');
    } catch (e) {
      Alert.alert('خطأ', 'تعذر حفظ السجل');
    } finally {
      setSaving(false);
    }
  };

  const onExport = async () => {
    if (!isPro) {
      setUpgradeMsg('تصدير ملفات PDF متاح في وكيل برو');
      setUpgrade(true);
      return;
    }
    try {
      const html = buildRecordHtml({ meta, schema, body, settings });
      const { uri } = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: meta?.title });
      } else {
        Alert.alert('تم الإنشاء', 'تم إنشاء ملف PDF بنجاح');
      }
    } catch (e) {
      Alert.alert('خطأ', 'تعذر إنشاء ملف PDF');
    }
  };

  return (
    <ScreenContainer edges={['top']}>
      <AppHeader title={meta?.title || 'سجل'} subtitle={meta?.code} showBack
        right={
          <TouchableOpacity onPress={onExport} hitSlop={10}>
            <Ionicons name="share-outline" size={22} color="#fff" />
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.supervisorTag}>
          <Ionicons name="person-circle-outline" size={16} color={C.primary} />
          <Text style={styles.supervisorText}>المسؤول: {meta?.supervisor}</Text>
        </View>

        <DynamicFormRenderer schema={schema} value={body} onChange={setBody} />

        <View style={styles.actions}>
          <Button title="اعتماد السجل" icon="checkmark-done" loading={saving} onPress={() => onSave('final')} />
          <View style={{ height: 10 }} />
          <Button title="حفظ كمسودة" variant="outline" onPress={() => onSave('draft')} />
          <View style={{ height: 10 }} />
          <Button title="تصدير PDF" variant="secondary" icon="document-outline" onPress={onExport} />
        </View>
      </ScrollView>

      <UpgradeModal visible={upgrade} onClose={() => setUpgrade(false)} message={upgradeMsg} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 40 },
  supervisorTag: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', backgroundColor: C.blueBg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 18 },
  supervisorText: { fontFamily: FONTS.semibold, fontSize: SIZES.xs, color: C.primary, marginStart: 6 },
  actions: { marginTop: 12 },
});

export default RecordDetailScreen;
