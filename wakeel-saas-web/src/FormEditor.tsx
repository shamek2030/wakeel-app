import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  Download,
  FileImage,
  FileText,
  Palette,
  Paperclip,
  PenLine,
  Printer,
  Type,
  Upload,
  X,
} from "lucide-react";

type Props = { go: (view: "app") => void };
type UploadItem = {
  name: string;
  url?: string;
  kind: "image" | "report" | "signature";
};

export default function EnhancedFormEditor({ go }: Props) {
  const [name, setName] = useState("سعد أحمد محمد القحطاني");
  const [saved, setSaved] = useState(false);
  const [primary, setPrimary] = useState("#00843d");
  const [secondary, setSecondary] = useState("#00a6a6");
  const [font, setFont] = useState("'Tajawal', sans-serif");
  const [evidence, setEvidence] = useState<UploadItem[]>([]);
  const [reports, setReports] = useState<UploadItem[]>([]);
  const [signature, setSignature] = useState<UploadItem | null>(null);
  const read = (files: FileList | null, kind: UploadItem["kind"]) => {
    if (!files) return;
    const items = Array.from(files).map((file) => ({
      name: file.name,
      url: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
      kind,
    }));
    if (kind === "image") setEvidence((p) => [...p, ...items]);
    else if (kind === "report") setReports((p) => [...p, ...items]);
    else setSignature(items[0] ?? null);
  };
  const style = {
    "--form-primary": primary,
    "--form-secondary": secondary,
    fontFamily: font,
  } as React.CSSProperties;
  return (
    <div className="enhanced-editor" style={style}>
      <header>
        <button className="ghost" onClick={() => go("app")}>
          <ArrowLeft /> رجوع للنماذج
        </button>
        <div>
          <h1>محرر النموذج التفاعلي</h1>
          <p>{saved ? "تم الحفظ الآن" : "التغييرات تحفظ تلقائيًا"}</p>
        </div>
        <div>
          <button className="ghost" onClick={() => window.print()}>
            <Printer /> طباعة
          </button>
          <button className="ghost" onClick={() => window.print()}>
            <Download /> تصدير PDF
          </button>
          <button
            className="primary"
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 2200);
            }}
          >
            <Check /> حفظ
          </button>
        </div>
      </header>
      <main>
        <aside className="form-customizer">
          <h2>
            <Palette /> مظهر النموذج
          </h2>
          <p>خصص النسخة التي ستطبعها وتحفظها.</p>
          <label>
            اللون الأساسي
            <div className="color-control">
              <input
                type="color"
                value={primary}
                onChange={(e) => setPrimary(e.target.value)}
              />
              <span>{primary}</span>
            </div>
          </label>
          <div className="swatches">
            {["#00843d", "#006c35", "#1d4ed8", "#334155", "#7c3aed"].map(
              (c) => (
                <button
                  aria-label={c}
                  key={c}
                  style={{ background: c }}
                  className={primary === c ? "selected" : ""}
                  onClick={() => setPrimary(c)}
                />
              ),
            )}
          </div>
          <label>
            اللون المساند
            <div className="color-control">
              <input
                type="color"
                value={secondary}
                onChange={(e) => setSecondary(e.target.value)}
              />
              <span>{secondary}</span>
            </div>
          </label>
          <label>
            <Type /> نوع الخط
            <select value={font} onChange={(e) => setFont(e.target.value)}>
              <option value="'Tajawal', sans-serif">تجوال — واضح وحديث</option>
              <option value="'IBM Plex Sans Arabic', sans-serif">
                IBM Plex Arabic — رسمي
              </option>
              <option value="'Noto Kufi Arabic', sans-serif">
                Noto Kufi — هندسي
              </option>
              <option value="Arial, sans-serif">Arial — متوافق</option>
            </select>
          </label>
          <hr />
          <h2>إرفاقات النموذج</h2>
          <label className="attach-action">
            <FileImage /> إضافة صور الشواهد
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => read(e.target.files, "image")}
            />
          </label>
          <label className="attach-action">
            <FileText /> رفع تقرير أو مستند
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              multiple
              onChange={(e) => read(e.target.files, "report")}
            />
          </label>
          <label className="attach-action">
            <PenLine /> رفع صورة التوقيع
            <input
              type="file"
              accept="image/*"
              onChange={(e) => read(e.target.files, "signature")}
            />
          </label>
          <div className="attachment-summary">
            <span>
              <FileImage />
              {evidence.length} شواهد
            </span>
            <span>
              <Paperclip />
              {reports.length} تقارير
            </span>
            <span>
              <PenLine />
              {signature ? "توقيع مرفوع" : "لا يوجد توقيع"}
            </span>
          </div>
        </aside>
        <section className="official-paper">
          <div className="ministry-stripe">
            <i />
            <i />
          </div>
          <div className="official-head">
            <div>
              إدارة التعليم بمنطقة الرياض
              <br />
              مكتب التعليم بشمال الرياض
              <br />
              <b>مدرسة الهدى الثانوية</b>
            </div>
            <div className="ministry-title">
              <span>وزارة التعليم</span>
              <small>Ministry of Education</small>
            </div>
            <div>
              الرقم: ............
              <br />
              التاريخ: ............
              <br />
              المرفقات: {evidence.length + reports.length}
            </div>
          </div>
          <h2>نموذج تحويل طالب إلى وكيل شؤون الطلاب</h2>
          <div className="form-section">
            <h3>أولًا: بيانات الطالب</h3>
            <div className="smart-fields four">
              <label>
                اسم الطالب
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label>
                الصف
                <select defaultValue="الثاني الثانوي">
                  <option>الأول المتوسط</option>
                  <option>الثاني المتوسط</option>
                  <option>الثالث المتوسط</option>
                  <option>الأول الثانوي</option>
                  <option>الثاني الثانوي</option>
                  <option>الثالث الثانوي</option>
                </select>
              </label>
              <label>
                الشعبة
                <select>
                  <option>أ</option>
                  <option>ب</option>
                  <option>ج</option>
                  <option>د</option>
                </select>
              </label>
              <label>
                المسار
                <select>
                  <option>المسار العام</option>
                  <option>علوم الحاسب والهندسة</option>
                  <option>الصحة والحياة</option>
                  <option>إدارة الأعمال</option>
                  <option>الشرعي</option>
                </select>
              </label>
              <label>
                الجنس
                <select>
                  <option>ذكر</option>
                  <option>أنثى</option>
                </select>
              </label>
              <label>
                الجنسية
                <select>
                  <option>سعودي</option>
                  <option>غير سعودي</option>
                </select>
              </label>
              <label>
                رقم الهوية
                <input inputMode="numeric" defaultValue="1101234567" />
              </label>
              <label>
                رقم الجوال
                <input inputMode="tel" defaultValue="05XXXXXXXX" />
              </label>
            </div>
          </div>
          <div className="form-section">
            <h3>ثانيًا: تفاصيل التحويل</h3>
            <div className="rules-source">
              <BookOpen />
              <span>
                القوائم مستندة إلى «قواعد السلوك والمواظبة — الإصدار الخامس
                1447هـ»
              </span>
            </div>
            <div className="smart-fields two">
              <label>
                سبب التحويل *
                <select defaultValue="التأخر الصباحي">
                  <option>التأخر الصباحي</option>
                  <option>الغياب المتكرر</option>
                  <option>مخالفة سلوكية</option>
                  <option>تدني المستوى الدراسي</option>
                  <option>طلب متابعة حالة</option>
                  <option>أخرى</option>
                </select>
              </label>
              <label>
                درجة المشكلة السلوكية
                <select>
                  <option>الدرجة الأولى</option>
                  <option>الدرجة الثانية</option>
                  <option>الدرجة الثالثة</option>
                  <option>الدرجة الرابعة</option>
                  <option>الدرجة الخامسة</option>
                </select>
              </label>
              <label>
                المشكلة السلوكية
                <select>
                  <option>التأخر الصباحي</option>
                  <option>الغياب دون عذر</option>
                  <option>عدم الالتزام بالزي المدرسي</option>
                  <option>إثارة الفوضى داخل الصف</option>
                  <option>الإساءة اللفظية</option>
                  <option>الاعتداء أو المشاجرة</option>
                  <option>مخالفة رقمية أو إلكترونية</option>
                  <option>أخرى</option>
                </select>
              </label>
              <label>
                نوع الشاهد المضبوط
                <select>
                  <option>لا يوجد</option>
                  <option>صور</option>
                  <option>مقاطع فيديو</option>
                  <option>محادثات</option>
                  <option>إفادة شاهد</option>
                  <option>أخرى</option>
                </select>
              </label>
              <label>
                الإجراء المقترح
                <select>
                  <option>تنبيه شفهي</option>
                  <option>إنذار كتابي</option>
                  <option>استدعاء ولي الأمر</option>
                  <option>تعهد خطي من الطالب</option>
                  <option>إحالة للجنة التوجيه</option>
                  <option>إشعار ولي الأمر</option>
                  <option>استدعاء ولي الأمر</option>
                  <option>إعداد خطة تعديل سلوك</option>
                </select>
              </label>
              <label>
                تاريخ الإحالة
                <input type="date" />
              </label>
            </div>
            <label className="long-note">
              ملاحظات إضافية
              <textarea placeholder="اكتب تفاصيل إضافية عند الحاجة..." />
            </label>
          </div>
          {(evidence.length > 0 || reports.length > 0) && (
            <div className="form-section evidence-section">
              <h3>ثالثًا: الشواهد والمرفقات</h3>
              {evidence.length > 0 && (
                <div className="evidence-grid">
                  {evidence.map((item, i) => (
                    <figure key={`${item.name}-${i}`}>
                      {item.url ? (
                        <img src={item.url} alt={item.name} />
                      ) : (
                        <FileImage />
                      )}
                      <figcaption>{item.name}</figcaption>
                      <button
                        onClick={() =>
                          setEvidence((p) => p.filter((_, j) => j !== i))
                        }
                      >
                        <X />
                      </button>
                    </figure>
                  ))}
                </div>
              )}
              {reports.map((item, i) => (
                <div className="report-row" key={`${item.name}-${i}`}>
                  <FileText />
                  <span>{item.name}</span>
                  <b>مرفق بالتقرير</b>
                  <button
                    onClick={() =>
                      setReports((p) => p.filter((_, j) => j !== i))
                    }
                  >
                    <X />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="form-section">
            <h3>
              {evidence.length || reports.length ? "رابعًا" : "ثالثًا"}:
              الاعتماد والتوقيع
            </h3>
            <div className="approval-grid">
              <span>
                اسم الوكيل
                <br />
                <b>محمد الزهراني</b>
              </span>
              <span>
                الصفة
                <br />
                <select>
                  <option>وكيل شؤون الطلاب</option>
                  <option>وكيل الشؤون المدرسية</option>
                  <option>وكيل الشؤون التعليمية</option>
                </select>
              </span>
              <span className="signature-cell">
                التوقيع
                <br />
                {signature?.url ? (
                  <img src={signature.url} alt="التوقيع المرفوع" />
                ) : (
                  <label>
                    <Upload /> رفع التوقيع
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => read(e.target.files, "signature")}
                    />
                  </label>
                )}
              </span>
              <span>
                تاريخ الاعتماد
                <br />
                <input type="date" />
              </span>
            </div>
          </div>
          <footer>
            نموذج إلكتروني أُعد بواسطة «مساعد وكيل المدرسة» — لا يمثل اعتمادًا
            رسميًا من وزارة التعليم.
          </footer>
        </section>
      </main>
      {saved && (
        <div className="toast">
          <Check /> تم حفظ النموذج بنجاح
        </div>
      )}
    </div>
  );
}
