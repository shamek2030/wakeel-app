// Builds printable RTL HTML for official records (used with expo-print).

function esc(v) {
  if (v === null || v === undefined) return '';
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function pageShell(settings, title, code, inner) {
  return `<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; font-family: 'Cairo','Tajawal','Segoe UI',sans-serif; }
    body { margin: 0; padding: 28px; color: #1F2933; direction: rtl; }
    .gov { text-align: center; margin-bottom: 6px; font-size: 13px; color: #6B7280; }
    .school { text-align: center; font-size: 18px; font-weight: 800; color: #0F3D5C; }
    .title { text-align: center; font-size: 16px; font-weight: 700; margin: 14px 0 4px; }
    .code { text-align: center; font-size: 11px; color: #6B7280; margin-bottom: 16px; }
    hr { border: none; border-top: 2px solid #95D4B5; margin: 10px 0 18px; }
    .section-title { font-size: 14px; font-weight: 700; color: #0F3D5C; margin: 16px 0 8px; border-right: 3px solid #95D4B5; padding-right: 8px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    td, th { border: 1px solid #E8EDF1; padding: 7px 9px; font-size: 12px; text-align: right; }
    th { background: #F2F7F5; font-weight: 700; }
    .kv td:first-child { width: 35%; font-weight: 600; background: #FAFCFB; }
    .footer { margin-top: 28px; display: flex; justify-content: space-between; font-size: 12px; }
    .sign { text-align: center; }
    .sign .line { margin-top: 36px; border-top: 1px solid #1F2933; padding-top: 4px; min-width: 150px; }
  </style></head><body>
  <div class="gov">المملكة العربية السعودية — وزارة التعليم</div>
  <div class="gov">${esc(settings?.education_admin || '')}</div>
  <div class="school">${esc(settings?.school_name && settings.school_name !== '........' ? settings.school_name : 'مدرسة .........')}</div>
  <div class="title">${esc(title)}</div>
  <div class="code">${esc(code || '')}</div>
  <hr/>
  ${inner}
  <div class="footer">
    <div class="sign"><div>وكيل شؤون الطلاب</div><div class="line">${esc(settings?.vice_principal || '')}</div></div>
    <div class="sign"><div>مدير المدرسة</div><div class="line">${esc(settings?.principal || '')}</div></div>
  </div>
  </body></html>`;
}

function kvTable(fields, values) {
  const rows = fields
    .filter((f) => f.type !== 'signature')
    .map((f) => `<tr><td>${esc(f.label)}</td><td>${esc(formatVal(f, values?.[f.key]))}</td></tr>`)
    .join('');
  return `<table class="kv">${rows}</table>`;
}

function formatVal(field, value) {
  if (field.type === 'checkbox') return value ? '✓' : '—';
  return value ?? '';
}

function rowsTable(fields, rows) {
  const cols = fields.filter((f) => f.type !== 'signature');
  const head = cols.map((f) => `<th>${esc(f.label)}</th>`).join('');
  const body = (rows || [])
    .map((r) => `<tr>${cols.map((f) => `<td>${esc(formatVal(f, r?.[f.key]))}</td>`).join('')}</tr>`)
    .join('');
  return `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

export function buildRecordHtml({ meta, schema, body, settings }) {
  let inner = '';
  if (!schema) {
    inner = '<p>لا يوجد محتوى.</p>';
  } else if (schema.type === 'flat') {
    inner = kvTable(schema.fields, body);
  } else if (schema.type === 'sections') {
    inner = schema.sections
      .map((sec) => `<div class="section-title">${esc(sec.label)}</div>${kvTable(sec.fields, body)}`)
      .join('');
  } else if (schema.type === 'table') {
    inner = '';
    if (schema.header_fields?.length) inner += kvTable(schema.header_fields, body);
    inner += rowsTable(schema.row_fields, Array.isArray(body.rows) ? body.rows : []);
    if (schema.footer_fields?.length) inner += kvTable(schema.footer_fields, body);
  } else if (schema.type === 'cards') {
    inner = rowsTable(schema.card_fields, Array.isArray(body.items) ? body.items : []);
  } else if (schema.type === 'report') {
    inner = '';
    if (schema.header_fields?.length) inner += kvTable(schema.header_fields, body);
    inner += schema.sections
      .map((sec) => `<div class="section-title">${esc(sec.label)}</div>${kvTable(sec.fields, body[sec.key] || {})}`)
      .join('');
    if (schema.footer_fields?.length) inner += kvTable(schema.footer_fields, body);
  }
  return pageShell(settings, meta?.title || 'سجل', meta?.code, inner);
}

export function buildHtmlFromSections({ title, code, settings, sections }) {
  const inner = sections
    .map((sec) => {
      const rows = sec.rows
        .map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`)
        .join('');
      return `<div class="section-title">${esc(sec.label)}</div><table class="kv">${rows}</table>`;
    })
    .join('');
  return pageShell(settings, title, code, inner);
}

export default buildRecordHtml;
