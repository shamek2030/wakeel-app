import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppHeader } from '../components/AppHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { EmptyState } from '../components/EmptyState';
import { UpgradeModal } from '../components/UpgradeModal';
import { C } from '../theme/colors';
import { FONTS, SIZES, toArabicNumerals } from '../theme/typography';
import { getStudents, insertViolation, insertRecord, getStudentViolations } from '../db/queries';
import { usePro } from '../context/ProContext';
import { useSettings } from '../context/SettingsContext';
import { useAI } from '../hooks/useAI';
import { buildHtmlFromSections } from '../utils/pdf';

const DEGREES = [
  { degree: 1, label: 'الدرجة الأولى', desc: 'مخالفات بسيطة', deduct: 'السلوك', points: 0, color: C.green,
    samples: ['التأخر الصباحي المتكرر', 'عدم إحضار الكتب', 'إهمال الواجبات'] },
  { degree: 2, label: 'الدرجة الثانية', desc: 'مخالفات متوسطة', deduct: 'السلوك', points: 1, color: C.amber,
    samples: ['الخروج من الفصل دون إذن', 'إساءة استخدام ممتلكات المدرسة'] },
  { degree: 3, label: 'الدرجة الثالثة', desc: 'مخالفات متوسطة الخطورة', deduct: 'السلوك', points: 3, color: C.amber,
    samples: ['الغش في الاختبارات', 'التلفظ بألفاظ غير لائقة'] },
  { degree: 4, label: 'الدرجة الرابعة', desc: 'مخالفات خطيرة', deduct: 'السلوك', points: 5, color: C.red,
    samples: ['الاعتداء اللفظي على زميل', 'إتلاف ممتلكات المدرسة'] },
  { degree: 5, label: 'الدرجة الخامسة', desc: 'مخالفات بالغة الخطورة', deduct: 'السلوك', points: 10, color: C.red,
    samples: ['الاعتداء الجسدي', 'حيازة أدوات حادة'] },
  { degree: 6, label: 'الدرجة السادسة', desc: 'مخالفات جسيمة', deduct: 'السلوك', points: 15, color: C.red,
    samples: ['الاعتداء على منسوبي المدرسة', 'الترويج للممنوعات'] },
];

const STEPS = ['الطالب', 'الدرجة', 'الوصف', 'الإجراءات', 'الحسم', 'الخطاب', 'المراجعة'];

export function Form31Screen() {
  const { isPro } = usePro();
  const { settings } = useSettings();
  const { generate, loading: aiLoading } = useAI();

  const [step, setStep] = useState(0);
  const [students, setStudents] = useState([]);
  const [data, setData] = useState({
    student: null, degree: null, description: '', procedure: '',
    deductType: 'السلوك', deductPoints: '0', letter: '',
  });
  const [upgrade, setUpgrade] = useState(false);
  const [upgradeMsg, setUpgradeMsg] = useState('صياغة الخطابات بالذكاء الاصطناعي متاحة في وكيل برو');
  const [saved, setSaved] = useState(false);

  useEffect(() => { (async () => setStudents(await getStudents()))(); }, []);

  const update = (k, v) => setData((p) => ({ ...p, [k]: v }));

  const canNext = () => {
    if (step === 0) return !!data.student;
    if (step === 1) return !!data.degree;
    if (step === 2) return !!data.description.trim();
    return true;
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const onGenerateLetter = async () => {
    if (!isPro) { setUpgradeMsg('صياغة الخطابات بالذكاء الاصطناعي متاحة في وكيل برو'); setUpgrade(true); return; }
    try {
      const history = await getStudentViolations(data.student.id);
      const system = 'أنت مساعد إداري متخصص في صياغة الخطابات الرسمية لوكيل شؤون الطلاب في مدرسة سعودية. اكتب بأسلوب رسمي مهني مختصر وفق لوائح وزارة التعليم، دون مقدمات زائدة.';
      const prompt = `اكتب خطاب تحويل طالب لوكيل شؤون الطلاب بالتفاصيل التالية:
- اسم الطالب: ${data.student.name}
- الصف: ${data.student.grade || 'غير محدد'}
- درجة المخالفة: ${DEGREES.find((d) => d.degree === data.degree)?.label}
- وصف المخالفة: ${data.description}
- الإجراءات المتخذة: ${data.procedure || 'لا يوجد'}
- الحسم المقترح: ${data.deductPoints} درجة من ${data.deductType}
- عدد المخالفات السابقة: ${history.length}
الخطاب موجه من ${settings.vice_principal || 'وكيل شؤون الطلاب'} إلى مدير المدرسة. اجعله جاهزاً للطباعة.`;
      const text = await generate({ system, prompt, maxTokens: 1000 });
      update('letter', text);
    } catch (e) {
      Alert.alert('تعذر إنشاء الخطاب', e.message || 'حدث خطأ أثناء الاتصال بالخدمة');
    }
  };

  const onSave = async () => {
    try {
      const degMeta = DEGREES.find((d) => d.degree === data.degree);
      await insertViolation({
        student_id: data.student.id,
        degree: data.degree,
        description: data.description,
        deduct_type: data.deductType,
        deduct_points: Number(data.deductPoints) || 0,
        procedure_text: data.procedure,
      });
      await insertRecord({
        form_code: 'و.ط.ع.ن 04-03',
        form_number: 11,
        title: `تحويل طالب لوكيل شؤون الطلاب — ${data.student.name}`,
        student_id: data.student.id,
        body_json: JSON.stringify({ ...data, student: data.student.name, degreeLabel: degMeta?.label }),
        ai_body: data.letter || null,
        status: 'final',
      });
      setSaved(true);
      Alert.alert('تم الحفظ', 'تم تسجيل التحويل والمخالفة بنجاح');
    } catch (e) {
      Alert.alert('خطأ', 'تعذر حفظ التحويل');
    }
  };

  const onExport = async () => {
    if (!isPro) { setUpgradeMsg('تصدير ملفات PDF متاح في وكيل برو'); setUpgrade(true); return; }
    try {
      const degMeta = DEGREES.find((d) => d.degree === data.degree);
      const sections = [
        { label: 'بيانات الطالب', rows: [['اسم الطالب', data.student?.name], ['الصف', data.student?.grade || '—']] },
        { label: 'المخالفة', rows: [['الدرجة', degMeta?.label], ['الوصف', data.description], ['الإجراءات', data.procedure || '—']] },
        { label: 'الحسم', rows: [['نوع الحسم', data.deductType], ['عدد الدرجات', data.deductPoints]] },
      ];
      if (data.letter) sections.push({ label: 'خطاب التحويل', rows: [['', data.letter]] });
      const html = buildHtmlFromSections({ title: 'تحويل طالب لوكيل شؤون الطلاب', code: 'و.ط.ع.ن 04-03', settings, sections });
      const { uri } = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
    } catch (e) {
      Alert.alert('خطأ', 'تعذر إنشاء ملف PDF');
    }
  };

  return (
    <ScreenContainer edges={['top']}>
      <AppHeader title="تحويل طالب للوكيل" subtitle={`الخطوة ${toArabicNumerals(step + 1)} من ${toArabicNumerals(STEPS.length)}`} showBack />

      <View style={styles.progress}>
        {STEPS.map((s, i) => (
          <View key={s} style={styles.progressItem}>
            <View style={[styles.dot, i <= step && styles.dotActive]}>
              {i < step ? <Ionicons name="checkmark" size={12} color="#fff" /> : <Text style={[styles.dotNum, i <= step && styles.dotNumActive]}>{toArabicNumerals(i + 1)}</Text>}
            </View>
            {i < STEPS.length - 1 ? <View style={[styles.bar, i < step && styles.barActive]} /> : null}
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.stepTitle}>{STEPS[step]}</Text>

        {step === 0 && (
          students.length === 0 ? (
            <EmptyState icon="people-outline" title="لا يوجد طلاب" subtitle="أضف طلاباً أولاً من شاشة الطلاب" />
          ) : (
            students.map((s) => (
              <Card key={s.id} style={[styles.pick, data.student?.id === s.id && styles.pickActive]} onPress={() => update('student', s)}>
                <View style={styles.avatar}><Text style={styles.avatarText}>{(s.name || '؟').charAt(0)}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pickName}>{s.name}</Text>
                  <Text style={styles.pickMeta}>{[s.grade, s.section].filter(Boolean).join(' - ') || 'بدون صف'}</Text>
                </View>
                {data.student?.id === s.id ? <Ionicons name="checkmark-circle" size={22} color={C.green} /> : null}
              </Card>
            ))
          )
        )}

        {step === 1 && DEGREES.map((d) => (
          <Card key={d.degree} style={[styles.pick, data.degree === d.degree && styles.pickActive]}
            onPress={() => { update('degree', d.degree); update('deductType', d.deduct); update('deductPoints', String(d.points)); }}>
            <View style={[styles.degreeDot, { backgroundColor: d.color }]}><Text style={styles.degreeNum}>{toArabicNumerals(d.degree)}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pickName}>{d.label}</Text>
              <Text style={styles.pickMeta}>{d.desc} · حسم {toArabicNumerals(d.points)} درجة</Text>
            </View>
            {data.degree === d.degree ? <Ionicons name="checkmark-circle" size={22} color={C.green} /> : null}
          </Card>
        ))}

        {step === 2 && (
          <View>
            {data.degree ? (
              <View style={styles.samples}>
                {(DEGREES.find((d) => d.degree === data.degree)?.samples || []).map((s) => (
                  <TouchableOpacity key={s} style={styles.sampleChip} onPress={() => update('description', s)}>
                    <Text style={styles.sampleText}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}
            <Field field={{ key: 'description', label: 'وصف المخالفة', type: 'textarea', rows: 4 }} value={data.description} onChange={(v) => update('description', v)} />
          </View>
        )}

        {step === 3 && (
          <Field field={{ key: 'procedure', label: 'الإجراءات المتخذة', type: 'textarea', rows: 5, placeholder: 'مثال: تم استدعاء ولي الأمر وأخذ التعهد...' }} value={data.procedure} onChange={(v) => update('procedure', v)} />
        )}

        {step === 4 && (
          <View>
            <Field field={{ key: 'deductType', label: 'نوع الحسم', type: 'select', options: ['السلوك', 'المواظبة'] }} value={data.deductType} onChange={(v) => update('deductType', v)} />
            <Field field={{ key: 'deductPoints', label: 'عدد الدرجات المحسومة', type: 'number' }} value={data.deductPoints} onChange={(v) => update('deductPoints', v)} />
          </View>
        )}

        {step === 5 && (
          <View>
            <Card style={styles.aiCard}>
              <View style={styles.aiHeader}>
                <Ionicons name="sparkles" size={20} color={C.purple} />
                <Text style={styles.aiTitle}>مساعد صياغة الخطاب</Text>
                {!isPro ? <View style={styles.proTag}><Text style={styles.proTagText}>برو</Text></View> : null}
              </View>
              <Text style={styles.aiDesc}>يقوم المساعد بصياغة خطاب تحويل رسمي بناءً على البيانات المدخلة.</Text>
              <Button title={data.letter ? 'إعادة إنشاء الخطاب' : 'إنشاء الخطاب'} icon="create-outline" loading={aiLoading} onPress={onGenerateLetter} />
            </Card>
            {aiLoading ? <ActivityIndicator color={C.primary} style={{ marginTop: 16 }} /> : null}
            {data.letter ? (
              <Field field={{ key: 'letter', label: 'نص الخطاب (قابل للتعديل)', type: 'textarea', rows: 10 }} value={data.letter} onChange={(v) => update('letter', v)} />
            ) : null}
          </View>
        )}

        {step === 6 && (
          <View>
            <ReviewRow label="الطالب" value={data.student?.name} />
            <ReviewRow label="الدرجة" value={DEGREES.find((d) => d.degree === data.degree)?.label} />
            <ReviewRow label="الوصف" value={data.description} />
            <ReviewRow label="الإجراءات" value={data.procedure || '—'} />
            <ReviewRow label="الحسم" value={`${toArabicNumerals(data.deductPoints)} درجة من ${data.deductType}`} />
            <ReviewRow label="الخطاب" value={data.letter ? 'تم إنشاؤه' : 'لم يُنشأ'} />
            <View style={{ height: 16 }} />
            {!saved ? (
              <Button title="حفظ واعتماد التحويل" icon="checkmark-done" onPress={onSave} />
            ) : (
              <Button title="تصدير PDF" icon="document-outline" variant="secondary" onPress={onExport} />
            )}
          </View>
        )}
      </ScrollView>

      {step < 6 ? (
        <View style={styles.nav}>
          {step > 0 ? <Button title="السابق" variant="outline" onPress={back} style={{ flex: 1 }} /> : <View style={{ flex: 1 }} />}
          <View style={{ width: 12 }} />
          <Button title="التالي" icon="arrow-back" onPress={next} disabled={!canNext()} style={{ flex: 1 }} />
        </View>
      ) : (
        <View style={styles.nav}>
          <Button title="السابق" variant="outline" onPress={back} style={{ flex: 1 }} />
        </View>
      )}

      <UpgradeModal visible={upgrade} onClose={() => setUpgrade(false)} message={upgradeMsg} />
    </ScreenContainer>
  );
}

function ReviewRow({ label, value }) {
  return (
    <View style={styles.reviewRow}>
      <Text style={styles.reviewLabel}>{label}</Text>
      <Text style={styles.reviewValue}>{value || '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  progress: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: C.border },
  progressItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  dot: { width: 26, height: 26, borderRadius: 13, backgroundColor: C.border, alignItems: 'center', justifyContent: 'center' },
  dotActive: { backgroundColor: C.primary },
  dotNum: { fontFamily: FONTS.bold, fontSize: SIZES.xs, color: C.textLight },
  dotNumActive: { color: '#fff' },
  bar: { flex: 1, height: 2, backgroundColor: C.border, marginHorizontal: 2 },
  barActive: { backgroundColor: C.primary },
  scroll: { padding: 16, paddingBottom: 24 },
  stepTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: C.text, textAlign: 'right', marginBottom: 16 },
  pick: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  pickActive: { borderColor: C.green, borderWidth: 1.5 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginStart: 12 },
  avatarText: { fontFamily: FONTS.bold, fontSize: SIZES.md, color: '#fff' },
  pickName: { fontFamily: FONTS.bold, fontSize: SIZES.md, color: C.text, textAlign: 'right' },
  pickMeta: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: C.textLight, textAlign: 'right', marginTop: 3 },
  degreeDot: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginStart: 12 },
  degreeNum: { fontFamily: FONTS.black, fontSize: SIZES.lg, color: '#fff' },
  samples: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  sampleChip: { backgroundColor: C.blueBg, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 16 },
  sampleText: { fontFamily: FONTS.medium, fontSize: SIZES.xs, color: C.primary },
  aiCard: { marginBottom: 16, backgroundColor: C.purpleBg, borderColor: C.purple },
  aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  aiTitle: { fontFamily: FONTS.bold, fontSize: SIZES.md, color: C.purple, marginStart: 8, flex: 1, textAlign: 'right' },
  proTag: { backgroundColor: C.purple, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  proTagText: { fontFamily: FONTS.bold, fontSize: SIZES.xs, color: '#fff' },
  aiDesc: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: C.text, textAlign: 'right', marginBottom: 14, lineHeight: 22 },
  reviewRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  reviewLabel: { fontFamily: FONTS.semibold, fontSize: SIZES.sm, color: C.textLight, width: 90 },
  reviewValue: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: C.text, flex: 1, textAlign: 'left' },
  nav: { flexDirection: 'row', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: C.border },
});

export default Form31Screen;
