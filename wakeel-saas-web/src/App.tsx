import { useMemo, useState } from "react";
import { AuthScreen, UserPortal, type Account } from "./Portal";
import EnhancedFormEditor from "./FormEditor";
import {
  ArrowLeft,
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  ChevronLeft,
  ClipboardCheck,
  Clock3,
  Download,
  FileText,
  FolderOpen,
  GraduationCap,
  Grid2X2,
  HelpCircle,
  Home,
  Lock,
  LogOut,
  Menu,
  MessageCircle,
  Printer,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Upload,
  UserCircle,
  Users,
  WalletCards,
  X,
} from "lucide-react";
type View = "site" | "auth" | "app" | "admin" | "form" | "profile";
const groups = [
  {
    title: "شؤون الطلاب",
    desc: "إدارة شؤون الطلاب اليومية بكفاءة",
    tone: "green",
    items: [
      "إشعار ولي أمر",
      "سجل الزيارات",
      "متابعة الغياب",
      "تحويل طالب",
      "سجل المخالفات",
      "إذن خروج",
    ],
  },
  {
    title: "النماذج الرسمية",
    desc: "نماذج مدرسية جاهزة وسريعة",
    tone: "blue",
    items: [
      "استمارة بيانات الطالب",
      "إخطار تعريف بالطالب",
      "طلب زيارة منشأة",
      "نموذج تحويل طالب",
      "خطاب تعريف بالطالب",
      "نموذج إحالة طالب",
    ],
  },
  {
    title: "التقارير والأدلة",
    desc: "تقارير دقيقة وأدلة منظمة",
    tone: "violet",
    items: [
      "خطة العمل",
      "دليل إجراءات وكيل المدرسة",
      "ملف الإنجاز",
      "تقرير أداء الطلاب",
      "التقرير الشهري",
      "التقرير الفصلي",
    ],
  },
];
const plans = [
  {
    n: "أساسي",
    p: "مجاني",
    d: "لبداية الوكيل أو الوكيلة",
    f: ["النماذج الأساسية", "الطباعة والتصدير", "حفظ ملفات الطلاب"],
  },
  {
    n: "احترافي",
    p: "49 ريال / شهر",
    d: "لمن يحتاج جميع الأدوات",
    f: ["جميع مزايا أساسي", "كل النماذج الاحترافية", "مساحة أكبر ودعم فني"],
  },
  {
    n: "سنوي",
    p: "399 ريال / سنة",
    d: "أفضل قيمة للاستخدام المستمر",
    f: ["جميع مزايا احترافي", "شهران مجانًا", "تحديثات النماذج المستمرة"],
  },
];
const tasks = [
  ["عالية", "طلب تصريح خروج", "سعد عبدالله العتيبي — 2/3", "اليوم 12:00 م"],
  ["عالية", "استمارة حالة سلوكية", "فهد خالد الشهراني — 1/2", "اليوم 11:59 م"],
  [
    "متوسطة",
    "طلب تحويل إلى المسار العام",
    "أحمد محمد الحربي — 1/3",
    "غدًا 12:00 م",
  ],
  ["منخفضة", "تحديث بيانات ولي الأمر", "ناصر عبدالله الدوسري — 2/1", "—"],
];
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
function Site({ go }: { go: (v: View) => void }) {
  const [q, setQ] = useState("");
  const visible = useMemo(
    () =>
      groups.map((g) => ({
        ...g,
        items: g.items.filter((i) => i.includes(q)),
      })),
    [q],
  );
  return (
    <div className="site">
      <header className="nav">
        <Logo />
        <nav>
          <a href="#top">الرئيسية</a>
          <a href="#solutions">الحلول</a>
          <a href="#forms">النماذج</a>
          <a href="#pricing">الأسعار</a>
          <a href="#faq">المعرفة</a>
        </nav>
        <div className="nav-actions">
          <button className="ghost" onClick={() => go("app")}>
            تسجيل الدخول
          </button>
          <button className="primary" onClick={() => go("app")}>
            ابدأ تجربتك
          </button>
        </div>
      </header>
      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <h1>
              كل أعمال وكيل المدرسة،
              <br />
              <em>في منصة واحدة</em>
            </h1>
            <p>
              أدر شؤون الطلاب، والنماذج الرسمية، والتقارير والمهام اليومية
              بكفاءة وموثوقية، من منصة واحدة مصممة لبيئة المدرسة.
            </p>
            <div className="hero-actions">
              <button className="primary large" onClick={() => go("app")}>
                ابدأ مجانًا <ChevronLeft />
              </button>
              <button
                className="ghost large"
                onClick={() =>
                  document
                    .querySelector("#solutions")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                استكشف المنصة <Grid2X2 />
              </button>
            </div>
            <div className="trust">
              <span>
                <ShieldCheck /> آمن وموثوق
              </span>
              <span>
                <Check /> متوافق مع اللوائح
              </span>
              <span>
                <Sparkles /> تجربة عربية متكاملة
              </span>
            </div>
          </div>
          <DashboardPreview />
        </section>
        <section className="finder">
          <Sparkles />
          <div>
            <Search />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن نموذج أو مهمة..."
            />
          </div>
          <small>
            ابحث سريعًا عن: سجل التأخر، إذن خروج، تحويل طالب، التقرير الفصلي
          </small>
        </section>
        <section id="solutions" className="solutions">
          {visible.map((g, i) => (
            <div
              className={`solution ${g.tone}`}
              id={i === 1 ? "forms" : undefined}
              key={g.title}
            >
              <div className="solution-head">
                <span className="solution-icon">
                  {i === 0 ? <Users /> : i === 1 ? <FileText /> : <BookOpen />}
                </span>
                <div>
                  <h2>{g.title}</h2>
                  <p>{g.desc}</p>
                </div>
                <button>
                  عرض كل الحلول <ChevronLeft />
                </button>
              </div>
              <div className="tool-grid">
                {g.items.map((item) => (
                  <button
                    key={item}
                    onClick={() => go(i === 1 ? "form" : "app")}
                  >
                    <span>
                      {i === 0 ? (
                        <Users />
                      ) : i === 1 ? (
                        <FileText />
                      ) : (
                        <ClipboardCheck />
                      )}
                    </span>
                    {item}
                    <ChevronLeft />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>
        <section className="feature-band">
          <div>
            <h2>
              من العمل الورقي المتكرر
              <br />
              إلى إجراء واضح وسريع
            </h2>
            <p>
              أنشئ النماذج وعدّلها مباشرة، تابع حالتها، واحتفظ بسجل مدرسي منظم
              يمكن الرجوع إليه في أي وقت.
            </p>
            <button className="primary" onClick={() => go("form")}>
              جرّب محرر النماذج
            </button>
          </div>
          <div className="paper-mini">
            <b>نموذج تحويل طالب</b>
            <span>بيانات الطالب</span>
            <i />
            <i />
            <span>سبب التحويل</span>
            <i className="wide" />
            <div>
              <Check /> تم الحفظ تلقائيًا
            </div>
          </div>
        </section>
        <section id="pricing" className="pricing">
          <h2>خطط مرنة تناسب احتياجات مدرستك</h2>
          <p>ابدأ مجانًا، وطوّر اشتراكك عندما تحتاج مزايا أكثر.</p>
          <div>
            {plans.map((p, i) => (
              <article className={i === 1 ? "popular" : ""} key={p.n}>
                {i === 1 && <small>الأكثر اختيارًا</small>}
                <h3>{p.n}</h3>
                <p>{p.d}</p>
                <strong>{p.p}</strong>
                <button
                  className={i === 1 ? "primary" : "ghost"}
                  onClick={() => go("app")}
                >
                  ابدأ الآن
                </button>
                <ul>
                  {p.f.map((x) => (
                    <li key={x}>
                      <Check />
                      {x}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
        <section id="faq" className="cta">
          <h2>ابدأ تنظيم يومك المدرسي من الآن</h2>
          <p>أنشئ حسابك التجريبي واستكشف منصة وكيل خلال دقائق.</p>
          <button className="primary large" onClick={() => go("app")}>
            ابدأ تجربتك المجانية <ArrowLeft />
          </button>
        </section>
      </main>
      <footer>
        <Logo />
        <p>منصة سعودية لإدارة أعمال وكيل المدرسة بكفاءة وموثوقية.</p>
        <span>© 2026 وكيل. جميع الحقوق محفوظة.</span>
      </footer>
    </div>
  );
}
function DashboardPreview() {
  return (
    <div className="preview">
      <aside>
        <Logo />
        <b>الرئيسية</b>
        <span>شؤون الطلاب</span>
        <span>النماذج الرسمية</span>
        <span>التقارير والأدلة</span>
        <span>المهام</span>
      </aside>
      <div className="preview-body">
        <h3>مرحبًا، وكيل المدرسة 👋</h3>
        <p>نظرة عامة على أعمال اليوم</p>
        <div className="mini-stats">
          <b>
            12<small>طالبًا متأخرًا</small>
          </b>
          <b>
            8<small>تصاريح خروج</small>
          </b>
          <b>
            24<small>مهمة قيد التنفيذ</small>
          </b>
        </div>
        <div className="chart">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="mini-list">
          <b>المهام القريبة</b>
          <p>
            <Check /> اعتماد طلب خروج طالب
          </p>
          <p>
            <Clock3 /> مراجعة التقرير الفصلي
          </p>
        </div>
      </div>
    </div>
  );
}
const navItems = [
  ["لوحة التحكم", Home],
  ["الطلاب", GraduationCap],
  ["النماذج الرسمية", FileText],
  ["التقارير", BarChart3],
  ["الأدلة", BookOpen],
  ["الإعدادات", Settings],
] as const;
const adminNav = [
  ["نظرة عامة", Home],
  ["المدارس", Building2],
  ["المستخدمون", Users],
  ["الاشتراكات", WalletCards],
  ["مكتبة النماذج", FileText],
  ["الدعم", MessageCircle],
  ["إعدادات المنصة", Settings],
] as const;
function Shell({
  admin = false,
  go,
}: {
  admin?: boolean;
  go: (v: View) => void;
}) {
  const [active, setActive] = useState(admin ? "نظرة عامة" : "لوحة التحكم");
  const [mobile, setMobile] = useState(false);
  const items = admin ? adminNav : navItems;
  return (
    <div className={`shell ${admin ? "admin" : ""}`}>
      <aside className={mobile ? "open" : ""}>
        <button className="close" onClick={() => setMobile(false)}>
          <X />
        </button>
        <Logo />
        <small>{admin ? "إدارة المنصة" : "منصة العمليات المدرسية"}</small>
        <nav>
          {items.map(([t, I]) => (
            <button
              className={active === t ? "active" : ""}
              onClick={() => {
                setActive(t);
                setMobile(false);
              }}
              key={t}
            >
              <I />
              {t}
            </button>
          ))}
        </nav>
        <button className="back-site" onClick={() => go("site")}>
          <LogOut /> العودة للموقع
        </button>
      </aside>
      <main>
        <header>
          <button className="mobile-menu" onClick={() => setMobile(true)}>
            <Menu />
          </button>
          <div>
            <h1>{active}</h1>
            <p>
              {admin
                ? "إدارة ومتابعة منصة وكيل"
                : "مدرسة الهدى الثانوية — الرياض"}
            </p>
          </div>
          <div>
            <button>
              <Search />
            </button>
            <button>
              <Bell />
              <i />
            </button>
            <span className="avatar">م</span>
          </div>
        </header>
        {admin ? <AdminContent /> : <UserContent active={active} go={go} />}
      </main>
    </div>
  );
}
function UserContent({
  active,
  go,
}: {
  active: string;
  go: (v: View) => void;
}) {
  if (active === "النماذج الرسمية")
    return (
      <section className="inner">
        <div className="inner-head">
          <div>
            <h2>النماذج الرسمية</h2>
            <p>أنشئ وعدّل واحفظ نماذج المدرسة بسهولة.</p>
          </div>
          <button className="primary" onClick={() => go("form")}>
            إنشاء نموذج جديد
          </button>
        </div>
        <div className="form-library">
          {[
            "تحويل طالب إلى وكيل شؤون الطلاب",
            "سجل الطلاب المتأخرين صباحًا",
            "استئذان طالب أثناء الدوام",
            "استمارة بيانات الطالب",
            "التقرير الفصلي للتوجيه الطلابي",
            "خطاب تعريف بالطالب",
          ].map((x, i) => (
            <article key={x}>
              <FileText />
              <small>نموذج {i + 1}</small>
              <h3>{x}</h3>
              <p>آخر تحديث: اليوم</p>
              <button onClick={() => go("form")}>
                فتح وتحرير <ChevronLeft />
              </button>
            </article>
          ))}
        </div>
      </section>
    );
  return (
    <section className="inner">
      <div className="welcome-row">
        <div>
          <h2>صباح الخير، أستاذ محمد</h2>
          <p>إليك ملخص أعمال المدرسة لهذا اليوم.</p>
        </div>
        <button className="primary" onClick={() => go("form")}>
          إجراء جديد
        </button>
      </div>
      <div className="kpis">
        {[
          ["الحضور اليوم", "612", "من 652 طالبًا"],
          ["الطلاب المتأخرون", "14", "طالبًا"],
          ["تصاريح الخروج", "8", "تصاريح اليوم"],
          ["النماذج المعلقة", "27", "بانتظار الإجراء"],
        ].map((x, i) => (
          <article key={x[0]}>
            <span>
              {i === 0 ? (
                <Users />
              ) : i === 1 ? (
                <Clock3 />
              ) : i === 2 ? (
                <LogOut />
              ) : (
                <ClipboardCheck />
              )}
            </span>
            <p>{x[0]}</p>
            <b>{x[1]}</b>
            <small>{x[2]}</small>
          </article>
        ))}
      </div>
      <div className="work">
        <div className="table-card">
          <div>
            <h3>قائمة العمل</h3>
            <button>عرض جميع المهام</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>الأولوية</th>
                <th>المهمة</th>
                <th>الطالب / الجهة</th>
                <th>الموعد</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t[1]}>
                  <td>
                    <i className={t[0]} />
                    {t[0]}
                  </td>
                  <td>{t[1]}</td>
                  <td>{t[2]}</td>
                  <td>{t[3]}</td>
                  <td>
                    <button>إجراء</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="side-card">
          <h3>إجراءات سريعة</h3>
          {[
            "إصدار تصريح خروج",
            "إحالة مهارة سلوكية",
            "إنشاء نموذج رسمي",
            "إشعار ولي الأمر",
          ].map((x) => (
            <button key={x} onClick={() => go("form")}>
              <FileText />
              {x}
              <ChevronLeft />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
function AdminContent() {
  return (
    <section className="inner">
      <div className="welcome-row">
        <div>
          <h2>نظرة عامة على المنصة</h2>
          <p>آخر تحديث: اليوم، 10:42 ص</p>
        </div>
        <button className="primary">إضافة مدرسة</button>
      </div>
      <div className="kpis admin-kpis">
        {[
          ["المدارس النشطة", "128", "+12 هذا الشهر"],
          ["إجمالي المستخدمين", "1,842", "+8.4%"],
          ["الاشتراكات المدفوعة", "94", "73.4% من المدارس"],
          ["الإيراد الشهري", "18,640 ر.س", "+11.2%"],
        ].map((x, i) => (
          <article key={x[0]}>
            <span>
              {i === 0 ? (
                <Building2 />
              ) : i === 1 ? (
                <Users />
              ) : i === 2 ? (
                <WalletCards />
              ) : (
                <BarChart3 />
              )}
            </span>
            <p>{x[0]}</p>
            <b>{x[1]}</b>
            <small>{x[2]}</small>
          </article>
        ))}
      </div>
      <div className="admin-grid">
        <div className="table-card">
          <div>
            <h3>المدارس المسجلة حديثًا</h3>
            <button>عرض الكل</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>المدرسة</th>
                <th>المدينة</th>
                <th>الخطة</th>
                <th>المستخدمون</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["ثانوية الهدى", "الرياض", "احترافي", "18"],
                ["متوسطة الريادة", "جدة", "أساسي", "7"],
                ["مدارس النخبة", "الدمام", "مؤسسي", "42"],
                ["ابتدائية المستقبل", "مكة", "تجريبي", "5"],
              ].map((r) => (
                <tr key={r[0]}>
                  {r.map((c, i) => (
                    <td key={c}>
                      {i === 4 ? <span className="live">نشط</span> : c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="side-card">
          <h3>حالة المنصة</h3>
          <div className="health">
            <b>99.98%</b>
            <span>وقت التشغيل</span>
          </div>
          {["الخدمات الأساسية", "قاعدة البيانات", "تصدير PDF", "الإشعارات"].map(
            (x) => (
              <p className="ok" key={x}>
                <Check />
                {x}
                <small>تعمل</small>
              </p>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
function FormEditor({ go }: { go: (v: View) => void }) {
  const [name, setName] = useState("سعد أحمد محمد القحطاني");
  const [reason, setReason] = useState(
    "تكرار التأخر الصباحي خلال الأسبوع الحالي",
  );
  const [saved, setSaved] = useState(false);
  return (
    <div className="editor">
      <header>
        <button className="ghost" onClick={() => go("app")}>
          <ArrowLeft /> رجوع
        </button>
        <div>
          <h1>محرر النماذج الرسمية</h1>
          <p>{saved ? "تم الحفظ منذ لحظات" : "يتم الحفظ تلقائيًا"}</p>
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
            <Check /> حفظ واعتماد
          </button>
        </div>
      </header>
      <main>
        <aside>
          <h3>حالة النموذج</h3>
          <div className="progress">
            <b>78%</b>
          </div>
          <p>10 من 13 حقل مكتمل</p>
          <hr />
          <h3>الحقول المطلوبة الناقصة (3)</h3>
          <ul>
            <li>توقيع ولي الأمر</li>
            <li>الإجراء المتخذ</li>
            <li>تاريخ الاعتماد</li>
          </ul>
          <hr />
          <h3>خصائص النموذج</h3>
          <small>
            نموذج رقم SW-F0-02
            <br />
            الإصدار 1.0
            <br />
            شؤون الطلاب
          </small>
        </aside>
        <div className="paper">
          <div className="paper-head">
            <div>
              إدارة التعليم بمنطقة الرياض
              <br />
              مكتب التعليم بشمال الرياض
              <br />
              مدرسة الهدى الثانوية
            </div>
            <div>
              <b>المملكة العربية السعودية</b>
              <br />
              وزارة التعليم
            </div>
            <div>
              الرقم: ............
              <br />
              التاريخ: ............
              <br />
              المرفقات: ............
            </div>
          </div>
          <h2>نموذج تحويل طالب إلى وكيل شؤون الطلاب</h2>
          <h3>أولًا: بيانات الطالب</h3>
          <div className="fields four">
            <label>
              اسم الطالب
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
              الصف
              <input defaultValue="الثاني الثانوي" />
            </label>
            <label>
              المسار / الشعبة
              <input defaultValue="علوم طبيعية / أ" />
            </label>
            <label>
              رقم الهوية
              <input defaultValue="1101234567" />
            </label>
            <label>
              رقم الطالب
              <input defaultValue="24151023" />
            </label>
            <label>
              تاريخ الميلاد
              <input defaultValue="15/06/1428 هـ" />
            </label>
            <label>
              الجنس
              <input defaultValue="ذكر" />
            </label>
            <label>
              رقم الجوال
              <input defaultValue="05XXXXXXXX" />
            </label>
          </div>
          <h3>ثانيًا: تفاصيل التحويل</h3>
          <div className="fields">
            <label>
              سبب التحويل *
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </label>
            <label>
              تاريخ الإحالة
              <input type="date" />
            </label>
          </div>
          <h3>ثالثًا: الإجراء المتخذ *</h3>
          <div className="checks">
            {[
              "تنبيه شفهي",
              "إنذار كتابي",
              "استدعاء ولي الأمر",
              "تعهد خطي من الطالب",
              "إحالة لجنة السلوك والانضباط",
              "أخرى",
            ].map((x) => (
              <label key={x}>
                <input type="checkbox" />
                {x}
              </label>
            ))}
          </div>
          <h3>رابعًا: ملاحظات إضافية</h3>
          <textarea
            className="notes"
            placeholder="اكتب أي ملاحظات إضافية إن وجدت..."
          />
          <h3>خامسًا: التوقيعات</h3>
          <div className="signatures">
            <span>
              اسم محول الطالب
              <br />
              <b>أ. محمد الزهراني</b>
            </span>
            <span>
              توقيعه
              <br />
              ــــــــــــــــــــ
            </span>
            <span>
              التاريخ
              <br />
              ــ / ــ / 1446 هـ
            </span>
            <span>
              توقيع ولي الأمر *<br />
              انقر للتوقيع
            </span>
          </div>
          <footer>* الحقول التي تحمل علامة النجمة إلزامية</footer>
        </div>
      </main>
      {saved && (
        <div className="toast">
          <Check /> تم حفظ النموذج واعتماده بنجاح
        </div>
      )}
    </div>
  );
}
export default function App() {
  const [view, setView] = useState<View>("site");
  const [account, setAccount] = useState<Account | null>(null);
  const go = (next: View) => {
    if (!account && (next === "app" || next === "form")) setView("auth");
    else setView(next);
  };
  return (
    <>
      {view === "site" && <Site go={go} />}{" "}
      {view === "auth" && (
        <AuthScreen
          go={go}
          onDone={(a) => {
            setAccount(a);
            setView("app");
          }}
        />
      )}{" "}
      {view === "app" && account && (
        <UserPortal
          account={account}
          go={go}
          onLogout={() => {
            setAccount(null);
            setView("site");
          }}
        />
      )}{" "}
      {view === "form" && account && <EnhancedFormEditor go={go} />}
    </>
  );
}
