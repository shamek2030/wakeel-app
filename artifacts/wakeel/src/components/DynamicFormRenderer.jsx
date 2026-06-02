import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme/colors';
import { FONTS, SIZES, toArabicNumerals } from '../theme/typography';
import { Field } from './Field';
import { Card } from './Card';

function FieldList({ fields, values, onChange }) {
  return (
    <>
      {fields.map((f) => (
        <Field
          key={f.key}
          field={f}
          value={values?.[f.key]}
          onChange={(v) => onChange(f.key, v)}
        />
      ))}
    </>
  );
}

function RepeatableSection({ label, addLabel, items, rowFields, onChangeItem, onAdd, onRemove }) {
  return (
    <View style={styles.block}>
      {label ? <Text style={styles.blockTitle}>{label}</Text> : null}
      {items.map((item, idx) => (
        <Card key={idx} style={styles.itemCard}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemIndex}>{toArabicNumerals(idx + 1)}</Text>
            {items.length > 1 ? (
              <TouchableOpacity onPress={() => onRemove(idx)} hitSlop={10}>
                <Ionicons name="trash-outline" size={20} color={C.red} />
              </TouchableOpacity>
            ) : null}
          </View>
          <FieldList
            fields={rowFields}
            values={item}
            onChange={(key, v) => onChangeItem(idx, key, v)}
          />
        </Card>
      ))}
      <TouchableOpacity style={styles.addBtn} onPress={onAdd} activeOpacity={0.8}>
        <Ionicons name="add-circle-outline" size={20} color={C.primary} />
        <Text style={styles.addText}>{addLabel || 'إضافة'}</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Controlled renderer. `value` is the body object, `onChange` receives the full
 * updated body object. Supports schema types: flat, sections, table, cards,
 * report.
 */
export function DynamicFormRenderer({ schema, value, onChange }) {
  const body = value || {};

  const setField = (key, v) => onChange({ ...body, [key]: v });

  const setNested = (sectionKey, key, v) =>
    onChange({ ...body, [sectionKey]: { ...(body[sectionKey] || {}), [key]: v } });

  const getRows = (key) => (Array.isArray(body[key]) ? body[key] : [{}]);

  const changeRow = (key, idx, fieldKey, v) => {
    const rows = [...getRows(key)];
    rows[idx] = { ...rows[idx], [fieldKey]: v };
    onChange({ ...body, [key]: rows });
  };
  const addRow = (key) => onChange({ ...body, [key]: [...getRows(key), {}] });
  const removeRow = (key, idx) => {
    const rows = getRows(key).filter((_, i) => i !== idx);
    onChange({ ...body, [key]: rows.length ? rows : [{}] });
  };

  if (!schema) {
    return <Text style={styles.note}>لا يوجد نموذج لهذا السجل.</Text>;
  }

  if (schema.note) {
    // rendered below header at top
  }

  switch (schema.type) {
    case 'flat':
      return (
        <View>
          {schema.note ? <Text style={styles.note}>{schema.note}</Text> : null}
          <FieldList fields={schema.fields} values={body} onChange={setField} />
        </View>
      );

    case 'sections':
      return (
        <View>
          {schema.sections.map((sec) => (
            <View key={sec.key} style={styles.block}>
              <Text style={styles.blockTitle}>{sec.label}</Text>
              <FieldList fields={sec.fields} values={body} onChange={setField} />
            </View>
          ))}
        </View>
      );

    case 'table':
      return (
        <View>
          {schema.note ? <Text style={styles.note}>{schema.note}</Text> : null}
          {schema.header_fields?.length ? (
            <View style={styles.block}>
              <Text style={styles.blockTitle}>بيانات عامة</Text>
              <FieldList fields={schema.header_fields} values={body} onChange={setField} />
            </View>
          ) : null}
          <RepeatableSection
            label="السجلات"
            addLabel="إضافة صف"
            items={getRows('rows')}
            rowFields={schema.row_fields}
            onChangeItem={(idx, k, v) => changeRow('rows', idx, k, v)}
            onAdd={() => addRow('rows')}
            onRemove={(idx) => removeRow('rows', idx)}
          />
          {schema.footer_fields?.length ? (
            <View style={styles.block}>
              <Text style={styles.blockTitle}>الاعتماد والختام</Text>
              <FieldList fields={schema.footer_fields} values={body} onChange={setField} />
            </View>
          ) : null}
        </View>
      );

    case 'cards':
      return (
        <RepeatableSection
          label="الحالات"
          addLabel="إضافة حالة"
          items={getRows('items')}
          rowFields={schema.card_fields}
          onChangeItem={(idx, k, v) => changeRow('items', idx, k, v)}
          onAdd={() => addRow('items')}
          onRemove={(idx) => removeRow('items', idx)}
        />
      );

    case 'report':
      return (
        <View>
          {schema.header_fields?.length ? (
            <View style={styles.block}>
              <FieldList fields={schema.header_fields} values={body} onChange={setField} />
            </View>
          ) : null}
          {schema.sections.map((sec) => (
            <View key={sec.key} style={styles.block}>
              <Text style={styles.blockTitle}>{sec.label}</Text>
              <FieldList
                fields={sec.fields}
                values={body[sec.key] || {}}
                onChange={(k, v) => setNested(sec.key, k, v)}
              />
            </View>
          ))}
          {schema.footer_fields?.length ? (
            <View style={styles.block}>
              <Text style={styles.blockTitle}>الاعتماد</Text>
              <FieldList fields={schema.footer_fields} values={body} onChange={setField} />
            </View>
          ) : null}
        </View>
      );

    default:
      return <Text style={styles.note}>نوع النموذج غير مدعوم.</Text>;
  }
}

const styles = StyleSheet.create({
  block: { marginBottom: 20 },
  blockTitle: {
    fontFamily: FONTS.bold, fontSize: SIZES.md, color: C.primary, marginBottom: 12,
    textAlign: 'right', borderRightWidth: 3, borderRightColor: C.accent, paddingRight: 10,
  },
  itemCard: { marginBottom: 12, backgroundColor: C.bg },
  itemHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  itemIndex: {
    fontFamily: FONTS.bold, fontSize: SIZES.sm, color: C.primary,
    backgroundColor: C.greenBg, width: 28, height: 28, borderRadius: 14,
    textAlign: 'center', textAlignVertical: 'center', lineHeight: 28,
  },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: C.primary,
    borderStyle: 'dashed', backgroundColor: C.blueBg,
  },
  addText: { fontFamily: FONTS.bold, fontSize: SIZES.sm, color: C.primary, marginStart: 8 },
  note: {
    fontFamily: FONTS.regular, fontSize: SIZES.sm, color: C.amber, textAlign: 'right',
    backgroundColor: C.amberBg, padding: 12, borderRadius: 10, marginBottom: 16, lineHeight: 22,
  },
});

export default DynamicFormRenderer;
