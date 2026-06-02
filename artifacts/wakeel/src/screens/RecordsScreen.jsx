import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppHeader } from '../components/AppHeader';
import { Card } from '../components/Card';
import { C } from '../theme/colors';
import { FONTS, SIZES, toArabicNumerals } from '../theme/typography';
import { FORMS_META, CATEGORIES } from '../db/formSchemas';

const CAT_COLORS = {
  reg: { color: C.blue, bg: C.blueBg, icon: 'school' },
  att: { color: C.amber, bg: C.amberBg, icon: 'time' },
  ben: { color: C.green, bg: C.greenBg, icon: 'heart' },
  act: { color: C.purple, bg: C.purpleBg, icon: 'football' },
};

export function RecordsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [cat, setCat] = useState('all');

  const forms = cat === 'all' ? FORMS_META : FORMS_META.filter((f) => f.category === cat);

  return (
    <ScreenContainer edges={['top']}>
      <AppHeader title="النماذج الرسمية" subtitle="١٥ نموذجاً معتمداً" />
      <View style={styles.chipsWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c.key}
              style={[styles.chip, cat === c.key && styles.chipActive]}
              onPress={() => setCat(c.key)}
            >
              <Text style={[styles.chipText, cat === c.key && styles.chipTextActive]}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={forms}
        keyExtractor={(item) => String(item.number)}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 80 }]}
        renderItem={({ item }) => {
          const cc = CAT_COLORS[item.category] || CAT_COLORS.reg;
          const isDeep = item.deep;
          return (
            <Card
              style={styles.formCard}
              onPress={() => (isDeep ? router.push('/form31') : router.push(`/record/${item.number}`))}
            >
              <View style={[styles.formIcon, { backgroundColor: cc.bg }]}>
                <Ionicons name={cc.icon} size={22} color={cc.color} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.formTitleRow}>
                  <Text style={styles.formNum}>{toArabicNumerals(item.number)}</Text>
                  <Text style={styles.formTitle} numberOfLines={2}>{item.title}</Text>
                </View>
                <Text style={styles.formMeta}>{item.code} · {item.supervisor}</Text>
                {isDeep ? (
                  <View style={styles.deepBadge}>
                    <Ionicons name="git-branch" size={12} color={C.purple} />
                    <Text style={styles.deepText}>نموذج تفاعلي متقدم</Text>
                  </View>
                ) : null}
              </View>
              <Ionicons name="chevron-back" size={20} color={C.textLight} />
            </Card>
          );
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  chipsWrap: { paddingVertical: 12 },
  chips: { paddingHorizontal: 16, gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: C.border },
  chipActive: { backgroundColor: C.primary, borderColor: C.primary },
  chipText: { fontFamily: FONTS.semibold, fontSize: SIZES.sm, color: C.textLight },
  chipTextActive: { color: '#fff' },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  formCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  formIcon: { width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginStart: 12 },
  formTitleRow: { flexDirection: 'row', alignItems: 'flex-start' },
  formNum: { fontFamily: FONTS.black, fontSize: SIZES.sm, color: C.primary, backgroundColor: C.greenBg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginStart: 8, overflow: 'hidden' },
  formTitle: { fontFamily: FONTS.bold, fontSize: SIZES.md, color: C.text, textAlign: 'right', flex: 1, lineHeight: 22 },
  formMeta: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: C.textLight, textAlign: 'right', marginTop: 4 },
  deepBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginTop: 6, backgroundColor: C.purpleBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  deepText: { fontFamily: FONTS.semibold, fontSize: SIZES.xs, color: C.purple, marginStart: 4 },
});

export default RecordsScreen;
