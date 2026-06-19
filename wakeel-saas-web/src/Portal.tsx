import { useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ClipboardCheck,
  Download,
  FileText,
  FolderOpen,
  Lock,
  LogOut,
  Printer,
  Search,
  ShieldCheck,
  Upload,
  UserCircle,
} from "lucide-react";

export type Account = {
  name: string;
  gender: "وكيل" | "وكيلة";
  specialty: "شؤون الطلاب" | "الشؤون المدرسية" | "الشؤون التعليمية";
};
type Nav = (view: "site" | "auth" | "app" | "form") => void;

function Logo() {
  return (
    <div className="logo">
      <span>
        <ShieldCheck />
      </span>
      مساعد وكيل المدرسة
    </div>
  );
}

export function AuthScreen({
  go,
  onDone,
}: {
  go: Nav;
  onDone: (a: Account) => void;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [gender, setGender] = useState<Account["gender"]>("وكيل");
  const [specialty, setSpecialty] =
    useState<Account["specialty"]>("شؤون الطلاب");
  const [name, setName] = useState("محمد الزهراني");
  return (
    <div className="auth-page">
      <div className="auth-brand">
        <button onClick={() => go("site")}>
          <ArrowLeft /> العودة للموقع
        </button>
        <Logo />
        <div>
          <h1>
            نماذجك وأعمالك،
            <br />
            <em>في مكان واحد</em>
          </h1>
          <p>عدّل النماذج، أدر ملفات الطلاب، واطبع مستنداتك خلال دقائق.</p>
        </div>
      </div>
      <div className="auth-card">
        <div className="auth-tabs">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            تسجيل الدخول
          </button>
          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            إنشاء حساب
          </button>
        </div>
        <h2>{mode === "login" ? "مرحبًا بعودتك" : "أنشئ حسابك الشخصي"}</h2>
        <p>
          {mode === "login"
            ? "أدخل بياناتك للوصول إلى ملفاتك ونماذجك."
            : "الحساب مخصص لك، وليس للمدرسة."}
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onDone({ name, gender, specialty });
          }}
        >
          {mode === "register" && (
            <>
              <label>
                الاسم الكامل
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label>
                الصفة
                <div className="choice-row">
                  <button
                    type="button"
                    className={gender === "وكيل" ? "selected" : ""}
                    onClick={() => setGender("وكيل")}
                  >
                    وكيل
                  </button>
                  <button
                    type="button"
                    className={gender === "وكيلة" ? "selected" : ""}
                    onClick={() => setGender("وكيلة")}
                  >
                    وكيلة
                  </button>
                </div>
              </label>
              <label>
                مجال الوكالة
                <select
                  value={specialty}
                  onChange={(e) =>
                    setSpecialty(e.target.value as Account["specialty"])
                  }
                >
                  <option>شؤون الطلاب</option>
                  <option>الشؤون المدرسية</option>
                  <option>الشؤون التعليمية</option>
                </select>
              </label>
            </>
          )}
          <label>
            البريد الإلكتروني
            <input required type="email" defaultValue="mohammed@example.com" />
          </label>
          <label>
            كلمة المرور
            <input required type="password" defaultValue="12345678" />
          </label>
          <button className="primary auth-submit">
            {mode === "login" ? "دخول إلى حسابي" : "إنشاء الحساب والمتابعة"}
          </button>
        </form>
        <small>بالمتابعة، أنت توافق على شروط الاستخدام وسياسة الخصوصية.</small>
      </div>
    </div>
  );
}

const forms = [
  {
    title: "نموذج تحويل طالب إلى وكيل شؤون الطلاب",
    cat: "شؤون الطلاب",
    plan: "مجاني",
  },
  { title: "سجل الطلاب المتأخرين صباحًا", cat: "شؤون الطلاب", plan: "مجاني" },
  { title: "استئذان طالب أثناء الدوام", cat: "شؤون الطلاب", plan: "احترافي" },
  { title: "استمارة بيانات الطالب", cat: "شؤون الطلاب", plan: "مجاني" },
  {
    title: "محضر اجتماع لجنة التوجيه الطلابي",
    cat: "شؤون الطلاب",
    plan: "احترافي",
  },
  { title: "خطة الإشراف اليومي", cat: "الشؤون المدرسية", plan: "مجاني" },
  {
    title: "نموذج متابعة المقصف المدرسي",
    cat: "الشؤون المدرسية",
    plan: "احترافي",
  },
  { title: "سجل الأمن والسلامة", cat: "الشؤون المدرسية", plan: "احترافي" },
  {
    title: "نموذج متابعة التحصيل الدراسي",
    cat: "الشؤون التعليمية",
    plan: "مجاني",
  },
  { title: "تقرير الزيارات الصفية", cat: "الشؤون التعليمية", plan: "احترافي" },
  { title: "تحليل نتائج الاختبارات", cat: "الشؤون التعليمية", plan: "احترافي" },
  { title: "التقرير الفصلي لأعمال الوكيل", cat: "عام", plan: "احترافي" },
];

export function UserPortal({
  account,
  go,
  onLogout,
}: {
  account: Account;
  go: Nav;
  onLogout: () => void;
}) {
  const [tab, setTab] = useState<"forms" | "students" | "work" | "profile">(
    "forms",
  );
  const [q, setQ] = useState("");
  const [uploads, setUploads] = useState([
    {
      name: "سجل متابعة.pdf",
      student: "سعد أحمد القحطاني",
      date: "اليوم، 09:40 ص",
    },
    {
      name: "تعهد سلوكي.docx",
      student: "تركي بندر المطيري",
      date: "أمس، 01:15 م",
    },
  ]);
  const visible = forms.filter(
    (f) =>
      (f.cat === account.specialty || f.cat === "عام") && f.title.includes(q),
  );
  const addFiles = (list: FileList | null) => {
    if (list)
      setUploads((p) => [
        ...Array.from(list).map((f) => ({
          name: f.name,
          student: "طالب جديد — انقر لتعديل الاسم",
          date: "الآن",
        })),
        ...p,
      ]);
  };
  return (
    <div className="personal-shell">
      <header>
        <Logo />
        <nav>
          <button
            className={tab === "forms" ? "active" : ""}
            onClick={() => setTab("forms")}
          >
            <FileText /> النماذج
          </button>
          <button
            className={tab === "students" ? "active" : ""}
            onClick={() => setTab("students")}
          >
            <FolderOpen /> ملفات الطلاب
          </button>
          <button
            className={tab === "work" ? "active" : ""}
            onClick={() => setTab("work")}
          >
            <ClipboardCheck /> أعمالي
          </button>
          <button
            className={tab === "profile" ? "active" : ""}
            onClick={() => setTab("profile")}
          >
            <UserCircle /> ملفي الشخصي
          </button>
        </nav>
        <div className="personal-user">
          <span>{account.name.charAt(0)}</span>
          <div>
            <b>
              {account.gender} {account.name}
            </b>
            <small>{account.specialty}</small>
          </div>
          <button onClick={onLogout}>
            <LogOut />
          </button>
        </div>
      </header>
      <main>
        {tab === "forms" && (
          <>
            <section className="personal-welcome">
              <div>
                <p>
                  مرحبًا، {account.gender} {account.name} 👋
                </p>
                <h1>ما النموذج الذي تريد إنجازه اليوم؟</h1>
                <span>
                  النماذج المناسبة لمجال: <b>{account.specialty}</b>
                </span>
              </div>
              <div className="subscription-mini">
                <small>باقتك الحالية</small>
                <b>الأساسية</b>
                <button onClick={() => setTab("profile")}>
                  ترقية الاشتراك
                </button>
              </div>
            </section>
            <div className="forms-toolbar">
              <div>
                <Search />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="ابحث في النماذج..."
                />
              </div>
              <span>{visible.length} نماذج متاحة لمجالك</span>
            </div>
            <section className="personal-forms">
              {visible.map((f, i) => (
                <article
                  className={f.plan === "احترافي" ? "locked" : ""}
                  key={f.title}
                >
                  <div className="form-cover">
                    <FileText />
                    {f.plan === "احترافي" && (
                      <span>
                        <Lock /> احترافي
                      </span>
                    )}
                  </div>
                  <small>{f.cat}</small>
                  <h3>{f.title}</h3>
                  <p>
                    {i % 2 === 0
                      ? "نموذج تفاعلي سريع التعديل والطباعة."
                      : "جاهز للتعبئة والتصدير بصيغة PDF."}
                  </p>
                  <button
                    onClick={() =>
                      f.plan === "مجاني" ? go("form") : setTab("profile")
                    }
                  >
                    {f.plan === "مجاني" ? (
                      <>
                        فتح النموذج <ChevronLeft />
                      </>
                    ) : (
                      <>
                        <Lock /> فتح بالترقية
                      </>
                    )}
                  </button>
                </article>
              ))}
            </section>
          </>
        )}
        {tab === "students" && (
          <section className="portal-section">
            <div className="portal-head">
              <div>
                <h1>ملفات الطلاب</h1>
                <p>ارفع أي ملف واحفظه باسم الطالب للتعديل اللحظي والطباعة.</p>
              </div>
              <label className="upload-btn">
                <Upload /> رفع ملفات
                <input
                  type="file"
                  multiple
                  onChange={(e) => addFiles(e.target.files)}
                />
              </label>
            </div>
            <div className="upload-zone">
              <Upload />
              <h3>اسحب ملفات الطلاب إلى هنا</h3>
              <p>PDF، Word، Excel أو صور — حتى 20 ميجابايت للملف</p>
            </div>
            <div className="student-files">
              <div className="file-head">
                <b>الملفات المحفوظة</b>
                <span>{uploads.length} ملفات</span>
              </div>
              {uploads.map((f, i) => (
                <article key={`${f.name}-${i}`}>
                  <span className="file-type">
                    <FileText />
                  </span>
                  <div>
                    <input
                      value={f.student}
                      onChange={(e) =>
                        setUploads((p) =>
                          p.map((x, j) =>
                            j === i ? { ...x, student: e.target.value } : x,
                          ),
                        )
                      }
                    />
                    <small>
                      {f.name} · {f.date}
                    </small>
                  </div>
                  <button onClick={() => go("form")}>
                    <FileText /> تعديل
                  </button>
                  <button onClick={() => window.print()}>
                    <Printer /> طباعة
                  </button>
                  <button
                    onClick={() => {
                      const url = URL.createObjectURL(
                        new Blob([`ملف الطالب: ${f.student}\n${f.name}`], {
                          type: "text/plain;charset=utf-8",
                        }),
                      );
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = `${f.student}.txt`;
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download /> تنزيل
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
        {tab === "work" && (
          <section className="portal-section">
            <div className="portal-head">
              <div>
                <h1>أعمالي الأخيرة</h1>
                <p>سجل النماذج والملفات التي أنجزتها من حسابك.</p>
              </div>
            </div>
            <div className="my-work">
              {[
                "تحويل طالب إلى وكيل شؤون الطلاب",
                "استمارة بيانات الطالب",
                "سجل الطلاب المتأخرين صباحًا",
                "التقرير الفصلي لأعمال الوكيل",
              ].map((x, i) => (
                <article key={x}>
                  <span>
                    <Check />
                  </span>
                  <div>
                    <h3>{x}</h3>
                    <p>
                      {i === 0
                        ? "تم التعديل اليوم، 10:25 ص"
                        : "آخر تعديل منذ يومين"}
                    </p>
                  </div>
                  <b>{i === 2 ? "مسودة" : "مكتمل"}</b>
                  <button onClick={() => go("form")}>فتح</button>
                </article>
              ))}
            </div>
          </section>
        )}
        {tab === "profile" && <Profile account={account} />}
      </main>
    </div>
  );
}

function Profile({ account }: { account: Account }) {
  return (
    <section className="profile-page">
      <div className="profile-hero">
        <span>{account.name.charAt(0)}</span>
        <div>
          <h1>
            {account.gender} {account.name}
          </h1>
          <p>{account.specialty} · حساب شخصي</p>
          <button>تعديل الملف التعريفي</button>
        </div>
      </div>
      <div className="profile-grid">
        <article>
          <h2>الملف التعريفي</h2>
          <dl>
            <div>
              <dt>الصفة</dt>
              <dd>{account.gender}</dd>
            </div>
            <div>
              <dt>مجال الوكالة</dt>
              <dd>{account.specialty}</dd>
            </div>
            <div>
              <dt>البريد</dt>
              <dd>mohammed@example.com</dd>
            </div>
            <div>
              <dt>رقم الجوال</dt>
              <dd>05XXXXXXXX</dd>
            </div>
          </dl>
        </article>
        <article className="plan-card">
          <small>الاشتراك الحالي</small>
          <h2>الباقة الأساسية</h2>
          <p>4 نماذج مجانية · 2 جيجابايت للملفات</p>
          <div>
            <span style={{ width: "42%" }} />
          </div>
          <b>استخدمت 840 ميجابايت من 2 جيجابايت</b>
          <button className="primary">الترقية إلى احترافي</button>
        </article>
        <article>
          <h2>مميزات حسابك</h2>
          <ul>
            <li>
              <Check /> تعديل النماذج تفاعليًا
            </li>
            <li>
              <Check /> الطباعة والتصدير PDF
            </li>
            <li>
              <Check /> حفظ ملفات الطلاب
            </li>
            <li className="muted">
              <Lock /> النماذج الاحترافية مقفلة
            </li>
          </ul>
        </article>
        <article>
          <h2>ملخص أعمالك</h2>
          <div className="profile-stats">
            <b>
              18<small>نموذجًا مكتملًا</small>
            </b>
            <b>
              12<small>ملف طالب</small>
            </b>
            <b>
              7<small>عمليات طباعة</small>
            </b>
          </div>
        </article>
      </div>
    </section>
  );
}
