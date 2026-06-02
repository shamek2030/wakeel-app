import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

let db = null;
let memoryStore = null;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  national_id TEXT UNIQUE,
  name TEXT NOT NULL,
  grade TEXT,
  section TEXT,
  guardian_name TEXT,
  guardian_phone TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  form_code TEXT NOT NULL,
  form_number INTEGER,
  title TEXT NOT NULL,
  student_id INTEGER,
  body_json TEXT,
  ai_body TEXT,
  status TEXT DEFAULT 'draft',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE IF NOT EXISTS violations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  degree INTEGER NOT NULL,
  description TEXT,
  deduct_type TEXT,
  deduct_points INTEGER,
  procedure_text TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE IF NOT EXISTS evidence (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT,
  file_uri TEXT,
  description TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  school_name TEXT DEFAULT '........',
  education_admin TEXT DEFAULT 'الإدارة العامة للتعليم بمكة المكرمة',
  vice_principal TEXT DEFAULT '',
  principal TEXT DEFAULT '',
  admin_assistant TEXT DEFAULT '',
  counselor TEXT DEFAULT '',
  logo_uri TEXT,
  school_level TEXT DEFAULT 'متوسطة',
  is_pro INTEGER DEFAULT 0,
  pro_expiry TEXT
);

INSERT OR IGNORE INTO settings (id) VALUES (1);
`;

const DEFAULT_SETTINGS = {
  id: 1,
  school_name: '........',
  education_admin: 'الإدارة العامة للتعليم بمكة المكرمة',
  vice_principal: '',
  principal: '',
  admin_assistant: '',
  counselor: '',
  logo_uri: null,
  school_level: 'متوسطة',
  is_pro: 0,
  pro_expiry: null,
};

function createMemoryStore() {
  return {
    students: [],
    records: [],
    violations: [],
    evidence: [],
    settings: { ...DEFAULT_SETTINGS },
    seq: { students: 0, records: 0, violations: 0, evidence: 0 },
  };
}

export async function initDatabase() {
  if (db || memoryStore) return;
  // On web, expo-sqlite requires a WASM build that isn't provisioned in the
  // preview environment and openDatabaseAsync can hang forever. Use the
  // in-memory store directly so the UI always renders in the web preview.
  if (Platform.OS === 'web') {
    memoryStore = createMemoryStore();
    return;
  }
  try {
    db = await SQLite.openDatabaseAsync('wakeel.db');
    await db.execAsync('PRAGMA journal_mode = WAL;');
    await db.execAsync(SCHEMA);
    // Lightweight migration for the counselor column added after first release.
    try {
      await db.execAsync('ALTER TABLE settings ADD COLUMN counselor TEXT DEFAULT \'\';');
    } catch {
      // Column already exists — ignore.
    }
  } catch (err) {
    // Fall back to an in-memory store (e.g. web preview without SQLite support)
    // so the UI still renders. Data will not persist in this mode.
    console.warn('[wakeel] SQLite unavailable, using in-memory store:', err?.message);
    db = null;
    memoryStore = createMemoryStore();
  }
}

export function getDb() {
  return db;
}

export function getMemoryStore() {
  return memoryStore;
}

export function isMemoryMode() {
  return !db && !!memoryStore;
}

export { DEFAULT_SETTINGS, Platform };
