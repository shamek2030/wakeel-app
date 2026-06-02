import { getDb, getMemoryStore, isMemoryMode, DEFAULT_SETTINGS } from './database';

function nowStr() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

/* ----------------------------- SETTINGS ----------------------------- */

export async function getSettings() {
  if (isMemoryMode()) {
    return { ...DEFAULT_SETTINGS, ...getMemoryStore().settings };
  }
  const db = getDb();
  if (!db) return { ...DEFAULT_SETTINGS };
  const row = await db.getFirstAsync('SELECT * FROM settings WHERE id = 1');
  return row || { ...DEFAULT_SETTINGS };
}

export async function updateSettings(fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return;
  if (isMemoryMode()) {
    Object.assign(getMemoryStore().settings, fields);
    return;
  }
  const db = getDb();
  if (!db) return;
  const setClause = keys.map((k) => `${k} = ?`).join(', ');
  const values = keys.map((k) => fields[k]);
  await db.runAsync(`UPDATE settings SET ${setClause} WHERE id = 1`, values);
}

/* ----------------------------- STUDENTS ----------------------------- */

export async function importStudents(rows) {
  if (!rows || rows.length === 0) return 0;
  if (isMemoryMode()) {
    const store = getMemoryStore();
    let count = 0;
    for (const r of rows) {
      if (!r.name) continue;
      store.seq.students += 1;
      store.students.push({
        id: store.seq.students,
        national_id: r.national_id || null,
        name: r.name,
        grade: r.grade || null,
        section: r.section || null,
        guardian_name: r.guardian_name || null,
        guardian_phone: r.guardian_phone || null,
        created_at: nowStr(),
      });
      count += 1;
    }
    return count;
  }
  const db = getDb();
  if (!db) return 0;
  let count = 0;
  await db.withTransactionAsync(async () => {
    for (const r of rows) {
      if (!r.name) continue;
      await db.runAsync(
        `INSERT OR IGNORE INTO students (national_id, name, grade, section, guardian_name, guardian_phone)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [r.national_id || null, r.name, r.grade || null, r.section || null, r.guardian_name || null, r.guardian_phone || null]
      );
      count += 1;
    }
  });
  return count;
}

export async function addStudent(data) {
  if (isMemoryMode()) {
    const store = getMemoryStore();
    store.seq.students += 1;
    const student = { id: store.seq.students, created_at: nowStr(), ...data };
    store.students.push(student);
    return student.id;
  }
  const db = getDb();
  if (!db) return null;
  const res = await db.runAsync(
    `INSERT INTO students (national_id, name, grade, section, guardian_name, guardian_phone)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [data.national_id || null, data.name, data.grade || null, data.section || null, data.guardian_name || null, data.guardian_phone || null]
  );
  return res.lastInsertRowId;
}

export async function getStudents(searchQuery) {
  if (isMemoryMode()) {
    let list = [...getMemoryStore().students];
    if (searchQuery) {
      const q = searchQuery.trim();
      list = list.filter((s) => (s.name || '').includes(q) || (s.national_id || '').includes(q));
    }
    return list.sort((a, b) => b.id - a.id);
  }
  const db = getDb();
  if (!db) return [];
  if (searchQuery) {
    const like = `%${searchQuery.trim()}%`;
    return db.getAllAsync(
      'SELECT * FROM students WHERE name LIKE ? OR national_id LIKE ? ORDER BY id DESC',
      [like, like]
    );
  }
  return db.getAllAsync('SELECT * FROM students ORDER BY id DESC');
}

export async function getStudentsCount() {
  if (isMemoryMode()) return getMemoryStore().students.length;
  const db = getDb();
  if (!db) return 0;
  const row = await db.getFirstAsync('SELECT COUNT(*) AS c FROM students');
  return row?.c || 0;
}

export async function getStudent(id) {
  if (isMemoryMode()) {
    const store = getMemoryStore();
    const student = store.students.find((s) => s.id === id) || null;
    if (!student) return null;
    return {
      ...student,
      records: store.records.filter((r) => r.student_id === id).sort((a, b) => b.id - a.id),
      violations: store.violations.filter((v) => v.student_id === id).sort((a, b) => b.id - a.id),
    };
  }
  const db = getDb();
  if (!db) return null;
  const student = await db.getFirstAsync('SELECT * FROM students WHERE id = ?', [id]);
  if (!student) return null;
  const records = await db.getAllAsync('SELECT * FROM records WHERE student_id = ? ORDER BY id DESC', [id]);
  const violations = await db.getAllAsync('SELECT * FROM violations WHERE student_id = ? ORDER BY id DESC', [id]);
  return { ...student, records, violations };
}

/* ----------------------------- RECORDS ----------------------------- */

export async function insertRecord(data) {
  if (isMemoryMode()) {
    const store = getMemoryStore();
    store.seq.records += 1;
    const rec = {
      id: store.seq.records,
      form_code: data.form_code,
      form_number: data.form_number,
      title: data.title,
      student_id: data.student_id || null,
      body_json: data.body_json || null,
      ai_body: data.ai_body || null,
      status: data.status || 'draft',
      created_at: nowStr(),
    };
    store.records.push(rec);
    return rec.id;
  }
  const db = getDb();
  if (!db) return null;
  const res = await db.runAsync(
    `INSERT INTO records (form_code, form_number, title, student_id, body_json, ai_body, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [data.form_code, data.form_number, data.title, data.student_id || null, data.body_json || null, data.ai_body || null, data.status || 'draft']
  );
  return res.lastInsertRowId;
}

export async function getRecords(formNumber) {
  if (isMemoryMode()) {
    let list = [...getMemoryStore().records];
    if (formNumber != null) list = list.filter((r) => r.form_number === formNumber);
    return list.sort((a, b) => b.id - a.id);
  }
  const db = getDb();
  if (!db) return [];
  if (formNumber != null) {
    return db.getAllAsync('SELECT * FROM records WHERE form_number = ? ORDER BY id DESC', [formNumber]);
  }
  return db.getAllAsync('SELECT * FROM records ORDER BY id DESC');
}

export async function getRecordsCount() {
  if (isMemoryMode()) return getMemoryStore().records.length;
  const db = getDb();
  if (!db) return 0;
  const row = await db.getFirstAsync('SELECT COUNT(*) AS c FROM records');
  return row?.c || 0;
}

export async function updateRecord(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return;
  if (isMemoryMode()) {
    const rec = getMemoryStore().records.find((r) => r.id === id);
    if (rec) Object.assign(rec, fields);
    return;
  }
  const db = getDb();
  if (!db) return;
  const setClause = keys.map((k) => `${k} = ?`).join(', ');
  const values = keys.map((k) => fields[k]);
  values.push(id);
  await db.runAsync(`UPDATE records SET ${setClause} WHERE id = ?`, values);
}

/* ----------------------------- VIOLATIONS ----------------------------- */

export async function insertViolation(data) {
  if (isMemoryMode()) {
    const store = getMemoryStore();
    store.seq.violations += 1;
    const v = { id: store.seq.violations, created_at: nowStr(), ...data };
    store.violations.push(v);
    return v.id;
  }
  const db = getDb();
  if (!db) return null;
  const res = await db.runAsync(
    `INSERT INTO violations (student_id, degree, description, deduct_type, deduct_points, procedure_text)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [data.student_id, data.degree, data.description || null, data.deduct_type || null, data.deduct_points || null, data.procedure_text || null]
  );
  return res.lastInsertRowId;
}

export async function getStudentViolations(studentId) {
  if (isMemoryMode()) {
    return getMemoryStore().violations.filter((v) => v.student_id === studentId).sort((a, b) => b.id - a.id);
  }
  const db = getDb();
  if (!db) return [];
  return db.getAllAsync('SELECT * FROM violations WHERE student_id = ? ORDER BY id DESC', [studentId]);
}

export async function getViolationsCount() {
  if (isMemoryMode()) return getMemoryStore().violations.length;
  const db = getDb();
  if (!db) return 0;
  const row = await db.getFirstAsync('SELECT COUNT(*) AS c FROM violations');
  return row?.c || 0;
}

/* ----------------------------- EVIDENCE ----------------------------- */

export async function insertEvidence(data) {
  if (isMemoryMode()) {
    const store = getMemoryStore();
    store.seq.evidence += 1;
    const e = { id: store.seq.evidence, created_at: nowStr(), ...data };
    store.evidence.push(e);
    return e.id;
  }
  const db = getDb();
  if (!db) return null;
  const res = await db.runAsync(
    `INSERT INTO evidence (title, category, file_uri, description) VALUES (?, ?, ?, ?)`,
    [data.title, data.category || null, data.file_uri || null, data.description || null]
  );
  return res.lastInsertRowId;
}

export async function getAllEvidence() {
  if (isMemoryMode()) {
    return [...getMemoryStore().evidence].sort((a, b) => b.id - a.id);
  }
  const db = getDb();
  if (!db) return [];
  return db.getAllAsync('SELECT * FROM evidence ORDER BY id DESC');
}

/* ----------------------------- DESTRUCTIVE ----------------------------- */

export async function deleteAllData() {
  if (isMemoryMode()) {
    const store = getMemoryStore();
    store.students = [];
    store.records = [];
    store.violations = [];
    store.evidence = [];
    store.seq = { students: 0, records: 0, violations: 0, evidence: 0 };
    return;
  }
  const db = getDb();
  if (!db) return;
  await db.execAsync(`
    DELETE FROM students;
    DELETE FROM records;
    DELETE FROM violations;
    DELETE FROM evidence;
  `);
}
