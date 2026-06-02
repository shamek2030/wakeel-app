// All 15 official ministry registers. Each maps a form_number to its render spec.
// Field shape: { key, label, type, required?, options?, placeholder?, rows? }
// type = 'text' | 'textarea' | 'date' | 'select' | 'number' | 'phone' | 'checkbox' | 'signature'

export const FORMS_META = [
  { number: 1,  code: 'و.ط.ع.ن 01-01', title: 'تحويل من مدارس تحفيظ القرآن والمعاهد العلمية', category: 'reg', supervisor: 'المساعد الإداري' },
  { number: 2,  code: 'و.ط.ع.ن 01-02', title: 'استمارة البيانات الشخصية للطالب',              category: 'reg', supervisor: 'المساعد الإداري' },
  { number: 3,  code: 'و.ط.ع.ن 02-01', title: 'تسليم المقررات الدراسية للطالب',               category: 'reg', supervisor: 'المساعد الإداري' },
  { number: 4,  code: 'و.ط.ع.ن 03-01', title: 'سجل الطلاب المتأخرين صباحاً',                  category: 'att', supervisor: 'المساعد الإداري' },
  { number: 5,  code: 'و.ط.ع.ن 03-02', title: 'تحويل طالب متكرر الغياب للوكيل',               category: 'att', supervisor: 'المساعد الإداري' },
  { number: 6,  code: 'و.ط.ع.ن 03-03', title: 'كشف حضور وغياب طلاب المدرسة',                 category: 'att', supervisor: 'المساعد الإداري' },
  { number: 7,  code: 'و.ط.ع.ن 03-04', title: 'استئذان الطلاب أثناء الدوام الرسمي',           category: 'att', supervisor: 'المساعد الإداري' },
  { number: 8,  code: 'و.ط.ع.ن 04-01', title: 'كشف الطلاب المستحقين للإعانة والمكافأة',       category: 'ben', supervisor: 'الموجه الطلابي' },
  { number: 9,  code: 'و.ط.ع.ن 04-01', title: 'كشف الحالات المرضية في المدرسة',               category: 'ben', supervisor: 'الموجه الصحي' },
  { number: 10, code: 'و.ط.ع.ن 04-02', title: 'إبلاغ عن حالة طالب',                           category: 'ben', supervisor: 'الموجه الطلابي/الصحي' },
  { number: 11, code: 'و.ط.ع.ن 04-03', title: 'تحويل طالب لوكيل شؤون الطلاب',                category: 'ben', supervisor: 'وكيل شؤون الطلاب', deep: true },
  { number: 12, code: 'و.ط.ع.ن 04-04', title: 'البرامج الإرشادية المقدمة للطلاب',              category: 'ben', supervisor: 'الموجه الطلابي' },
  { number: 13, code: 'و.ط.ع.ن 04-05', title: 'التقرير الفصلي للتوجيه الطلابي',               category: 'ben', supervisor: 'الموجه الطلابي' },
  { number: 14, code: 'و.ط.ع.ن 05-01', title: 'حضور الطلاب لمجالات وجماعات النشاط',           category: 'act', supervisor: 'رائد النشاط' },
  { number: 15, code: 'و.ط.ع.ن 05-02', title: 'موافقة ولي أمر على مشاركة ابنه في نشاط',       category: 'act', supervisor: 'رائد النشاط' },
];

export const CATEGORIES = [
  { key: 'all', label: 'الكل' },
  { key: 'reg', label: 'القبول والتسجيل' },
  { key: 'att', label: 'الحضور والمواظبة' },
  { key: 'ben', label: 'الإعانات والرعاية' },
  { key: 'act', label: 'النشاط' },
];

const SHARED_SECTION_FIELDS = [
  { key: 'count',         label: 'عدد الطلاب',         type: 'number' },
  { key: 'programs',      label: 'البرامج المنفذة',    type: 'textarea', rows: 2 },
  { key: 'beneficiaries', label: 'عدد المستفيدين',     type: 'number' },
  { key: 'response',      label: 'مدى الاستجابة',      type: 'text' },
  { key: 'difficulties',  label: 'الصعوبات التي حدثت', type: 'textarea', rows: 2 },
  { key: 'suggestions',   label: 'المقترحات',          type: 'textarea', rows: 2 },
];

export const FORM_SCHEMAS = {
  1: {
    type: 'sections',
    sections: [
      {
        key: 'general', label: 'أولاً — بيانات عامة',
        fields: [
          { key: 'student_name',     label: 'الاسم رباعياً',              type: 'text',   required: true },
          { key: 'nationality',      label: 'الجنسية',                    type: 'text',   required: true },
          { key: 'birth_date',       label: 'تاريخ الميلاد',              type: 'date',   required: true },
          { key: 'grade',            label: 'الصف الدراسي',               type: 'text',   required: true },
          { key: 'last_certificate', label: 'آخر شهادة دراسية حصل عليها', type: 'text',   required: true },
          { key: 'cert_source',      label: 'مصدرها',                     type: 'text' },
          { key: 'cert_date',        label: 'تاريخ الحصول عليها',         type: 'date' },
          { key: 'transfer_from',    label: 'نقل من',                     type: 'text',   required: true },
          { key: 'specialization',   label: 'تخصص التعليم العام',         type: 'text' },
          { key: 'study_type',       label: 'نوع الدراسة المطلوبة',       type: 'select', required: true, options: ['نهاري', 'ليلي', 'منازل'] },
        ],
      },
      {
        key: 'academic', label: 'ثانياً — التحصيل الدراسي',
        fields: [
          { key: 'repeat_years',        label: 'عدد سنوات الإعادة في الصف الحالي', type: 'number' },
          { key: 'interruption_years',  label: 'عدد سنوات الانقطاع من الدراسة',    type: 'number' },
          { key: 'interruption_reason', label: 'أسباب الانقطاع',                   type: 'textarea', rows: 2 },
          { key: 'pass_grade1',         label: 'ناجح من الصف',                     type: 'text' },
          { key: 'pass_year1',          label: 'في العام الدراسي',                 type: 'text' },
          { key: 'pass_rating1',        label: 'تقديره العام',                     type: 'text' },
          { key: 'pass_grade2',         label: 'ناجح من الصف (2)',                 type: 'text' },
          { key: 'pass_year2',          label: 'في العام الدراسي (2)',             type: 'text' },
          { key: 'pass_rating2',        label: 'تقديره العام (2)',                 type: 'text' },
          { key: 'transfer_ref_no',     label: 'رقم التحويل لإدارة التعليم',       type: 'text' },
          { key: 'transfer_ref_date',   label: 'تاريخ التحويل',                    type: 'date' },
          { key: 'principal_name',      label: 'اسم مدير المدرسة',                 type: 'text',      required: true },
          { key: 'principal_sig',       label: 'التوقيع',                          type: 'signature', required: true },
        ],
      },
      {
        key: 'study', label: 'ثالثاً — دراسة وضع الطالب (وكيل شؤون الطلاب)',
        fields: [
          { key: 'student_reasons',      label: 'الأسباب التي أبداها الطالب للتحويل', type: 'textarea', required: true, rows: 2 },
          { key: 'real_motives',         label: 'التعرف على الدوافع الحقيقية',        type: 'textarea', required: true, rows: 2 },
          { key: 'guardian_approval',    label: 'مدى موافقة ولي أمر الطالب',          type: 'textarea', required: true, rows: 1 },
          { key: 'employer_approval',    label: 'مدى موافقة جهة عمله (إن وجدت)',      type: 'textarea', rows: 1 },
          { key: 'counseling_result',    label: 'نتائج الخدمات الإرشادية',            type: 'select',   required: true, options: ['تم إقناع الطالب ويواصل دراسته الحالية', 'لم يقتنع الطالب وهو يرغب في التحويل'] },
          { key: 'committee_view',       label: 'مرئيات اللجنة',                      type: 'select',   required: true, options: ['يسمح له بالتحويل', 'لا يسمح له'] },
          { key: 'student_services_ref', label: 'رقم الإحالة لقسم خدمات الطلاب',      type: 'text' },
          { key: 'director_general_view',label: 'مرئيات مدير عام التعليم بمنطقة',     type: 'textarea', rows: 2 },
        ],
      },
    ],
  },

  2: {
    type: 'flat',
    fields: [
      { key: 'stage',          label: 'المرحلة الدراسية',           type: 'text',   required: true },
      { key: 'grade',          label: 'الصف الدراسي',               type: 'text',   required: true },
      { key: 'section',        label: 'الفصل',                      type: 'text',   required: true },
      { key: 'nationality',    label: 'الجنسية',                    type: 'text',   required: true },
      { key: 'national_id',    label: 'رقم السجل المدني / الإقامة', type: 'text',   required: true },
      { key: 'student_number', label: 'رقم الطالب (خاص بالمدرسة)',  type: 'text' },
      { key: 'id_date',        label: 'تاريخ الهوية',               type: 'date' },
      { key: 'fname',          label: 'الاسم الأول',                type: 'text',   required: true },
      { key: 'father_name',    label: 'اسم الأب',                   type: 'text',   required: true },
      { key: 'grandfather',    label: 'اسم الجد',                   type: 'text',   required: true },
      { key: 'family_name',    label: 'العائلة (اللقب)',            type: 'text',   required: true },
      { key: 'passport_no',    label: 'رقم جواز السفر',             type: 'text' },
      { key: 'birth_date',     label: 'تاريخ الميلاد',              type: 'date',   required: true },
      { key: 'birth_place',    label: 'مكان الميلاد / المدينة',     type: 'text' },
      { key: 'birth_country',  label: 'الدولة',                     type: 'text' },
      { key: 'blood_type',     label: 'فئة الدم',                   type: 'select', options: ['A+','A-','B+','B-','AB+','AB-','O+','O-'] },
      { key: 'housing_type',   label: 'ملكية السكن',                type: 'select', options: ['ملك','إيجار','مجاني'] },
      { key: 'admin_region',   label: 'المنطقة الإدارية',           type: 'text' },
      { key: 'city',           label: 'المدينة',                    type: 'text' },
      { key: 'neighborhood',   label: 'الحي',                       type: 'text' },
      { key: 'main_street',    label: 'الشارع الرئيسي',             type: 'text' },
      { key: 'sub_street',     label: 'الشارع الفرعي',              type: 'text' },
      { key: 'house_number',   label: 'رقم المنزل',                 type: 'text' },
      { key: 'postal_code',    label: 'الرمز البريدي',              type: 'text' },
      { key: 'po_box',         label: 'صندوق البريد',               type: 'text' },
      { key: 'email',          label: 'البريد الإلكتروني',          type: 'text' },
      { key: 'guardian_name',  label: 'اسم ولي الأمر',              type: 'text',   required: true },
      { key: 'guardian_relation',    label: 'صلة القرابة',          type: 'text',   required: true },
      { key: 'guardian_nationality', label: 'جنسية ولي الأمر',      type: 'text' },
      { key: 'guardian_id_type',     label: 'نوع الهوية',           type: 'text' },
      { key: 'guardian_id_date',     label: 'تاريخ الهوية',         type: 'date' },
      { key: 'guardian_id_source',   label: 'مصدرها',               type: 'text' },
      { key: 'guardian_id_expiry',   label: 'نهايتها',              type: 'date' },
      { key: 'home_phone',     label: 'رقم هاتف المنزل',            type: 'phone' },
      { key: 'mobile',         label: 'رقم الهاتف الجوال',          type: 'phone',  required: true },
      { key: 'work_phone',     label: 'رقم هاتف العمل',             type: 'phone' },
      { key: 'relative1_name', label: 'اسم قريب للطالب (1)',        type: 'text' },
      { key: 'relative1_phone',label: 'هاتف القريب (1)',            type: 'phone' },
      { key: 'relative1_addr', label: 'عنوان القريب (1)',           type: 'text' },
      { key: 'relative2_name', label: 'اسم قريب للطالب (2)',        type: 'text' },
      { key: 'relative2_phone',label: 'هاتف القريب (2)',            type: 'phone' },
      { key: 'relative2_addr', label: 'عنوان القريب (2)',           type: 'text' },
    ],
  },

  3: {
    type: 'table',
    header_fields: [
      { key: 'grade',   label: 'الصف',    type: 'text' },
      { key: 'section', label: 'الفصل',   type: 'text' },
      { key: 'day',     label: 'اليوم',   type: 'text' },
      { key: 'date',    label: 'التاريخ', type: 'date' },
    ],
    row_fields: [
      { key: 'student_name',   label: 'اسم الطالب',               type: 'text' },
      { key: 'book_pledge',    label: 'وثيقة المحافظة على الكتب', type: 'text' },
      { key: 'receive_sig',    label: 'توقيع استلام الكتب',       type: 'signature' },
      { key: 'return_done',    label: 'تم استلامها',              type: 'checkbox' },
      { key: 'return_pending', label: 'لم يستلم',                 type: 'checkbox' },
      { key: 'return_sig',     label: 'توقيع نهاية الفصل',        type: 'signature' },
    ],
    footer_fields: [
      { key: 'unreturned_books', label: 'الكتب غير المسلمة', type: 'textarea' },
      { key: 'responsible_name', label: 'اسم المسؤول',       type: 'text' },
      { key: 'responsible_sig',  label: 'التوقيع',           type: 'signature' },
    ],
  },

  4: {
    type: 'table',
    header_fields: [
      { key: 'day',  label: 'اليوم',   type: 'text' },
      { key: 'date', label: 'التاريخ', type: 'date' },
    ],
    row_fields: [
      { key: 'student_name',  label: 'اسم الطالب',    type: 'text' },
      { key: 'grade_section', label: 'الصف / الشعبة', type: 'text' },
      { key: 'delay_amount',  label: 'مقدار التأخر',  type: 'text' },
      { key: 'delay_reason',  label: 'أسباب التأخير', type: 'text' },
      { key: 'student_sig',   label: 'توقيع الطالب',  type: 'signature' },
    ],
    footer_fields: [
      { key: 'responsible_name', label: 'اسم المسؤول', type: 'text' },
      { key: 'responsible_sig',  label: 'التوقيع',     type: 'signature' },
    ],
  },

  5: {
    type: 'table',
    header_fields: [
      { key: 'semester', label: 'الفصل الدراسي', type: 'text' },
    ],
    row_fields: [
      { key: 'student_name',  label: 'اسم الطالب',     type: 'text' },
      { key: 'grade',         label: 'الصف',           type: 'text' },
      { key: 'transfer_date', label: 'تاريخ التحويل',  type: 'date' },
      { key: 'period',        label: 'الحصة',          type: 'text' },
    ],
    footer_fields: [
      { key: 'referral_date', label: 'تاريخ الإحالة للوكيل',     type: 'date' },
      { key: 'end_date',      label: 'تم إنهاء الموقف بتاريخ',   type: 'date' },
      { key: 'deduct_type',   label: 'حسم من درجات',             type: 'select', options: ['السلوك','المواظبة'] },
      { key: 'deduct_points', label: 'عدد الدرجات',              type: 'number' },
      { key: 'deduct_date',   label: 'تاريخ الحسم',              type: 'date' },
      { key: 'counselor_followup',       label: 'آمل متابعة الطالب خلال الفترة القادمة', type: 'textarea', rows: 2 },
      { key: 'counselor_recommendation', label: 'رأي الموجه في تثبيت / إلغاء الحسم',     type: 'select', options: ['نرى تثبيت درجة الحسم لعدم استجابة الطالب','نرى إلغاء حسم الدرجة لتحسن مستوى الطالب'] },
    ],
  },

  6: {
    type: 'table',
    header_fields: [
      { key: 'grade', label: 'الصف',    type: 'text' },
      { key: 'day',   label: 'اليوم',   type: 'text' },
      { key: 'date',  label: 'التاريخ', type: 'date' },
    ],
    row_fields: [
      { key: 'section',          label: 'الفصل',        type: 'text' },
      { key: 'enrolled',         label: 'المسجّلون',     type: 'number' },
      { key: 'present',          label: 'الحضور',        type: 'number' },
      { key: 'absent',           label: 'الغياب',        type: 'number' },
      { key: 'student_name',     label: 'الاسم',         type: 'text' },
      { key: 'absence_excused',  label: 'بعذر',          type: 'checkbox' },
      { key: 'absence_no_excuse',label: 'بدون عذر',      type: 'checkbox' },
      { key: 'phone',            label: 'رقم الهاتف',    type: 'phone' },
      { key: 'contact_time',     label: 'الزمن',         type: 'text' },
      { key: 'contact_answer',   label: 'المجيب',        type: 'text' },
      { key: 'absence_reason',   label: 'سبب الغياب',    type: 'text' },
      { key: 'teacher_sig',      label: 'توقيع المعلم',  type: 'signature' },
    ],
    footer_fields: [
      { key: 'responsible_name', label: 'اسم المسؤول', type: 'text' },
      { key: 'responsible_sig',  label: 'التوقيع',     type: 'signature' },
    ],
  },

  7: {
    type: 'table',
    note: 'ملاحظة: لا بد من حضور ولي الأمر في حال خروج الطالب أثناء الدوام الرسمي، خلاف ذلك يمنع خروج الطالب من المدرسة حسب لوائح وزارة التعليم',
    row_fields: [
      { key: 'student_name',  label: 'اسم الطالب',          type: 'text' },
      { key: 'section',       label: 'الفصل',               type: 'text' },
      { key: 'date',          label: 'التاريخ',             type: 'date' },
      { key: 'exit_hour',     label: 'وقت الخروج (ساعة)',  type: 'number' },
      { key: 'exit_minute',   label: 'وقت الخروج (دقيقة)', type: 'number' },
      { key: 'leave_reason',  label: 'سبب الاستئذان',      type: 'text' },
      { key: 'sig',           label: 'التوقيع',             type: 'signature' },
      { key: 'guardian_name', label: 'اسم ولي الأمر',       type: 'text' },
    ],
  },

  8: {
    type: 'table',
    header_fields: [
      { key: 'semester', label: 'الفصل الدراسي', type: 'text' },
    ],
    row_fields: [
      { key: 'student_name', label: 'اسم الطالب',        type: 'text' },
      { key: 'national_id',  label: 'رقم السجل المدني',  type: 'text' },
      { key: 'grade',        label: 'الصف',              type: 'text' },
      { key: 'aid_type',     label: 'نوع الإعانة',       type: 'select', options: ['مكافأة','إعانة اجتماعية','إعانة مدرسية'] },
      { key: 'date',         label: 'التاريخ',           type: 'date' },
      { key: 'student_sig',  label: 'توقيع الطالب',      type: 'signature' },
      { key: 'bank_account', label: 'رقم الحساب البنكي', type: 'text' },
    ],
  },

  9: {
    type: 'cards',
    card_fields: [
      { key: 'student_name',    label: 'اسم الطالب',                         type: 'text',     required: true },
      { key: 'grade',           label: 'الصف',                               type: 'text',     required: true },
      { key: 'home_phone',      label: 'هاتف المنزل',                        type: 'phone' },
      { key: 'work_phone',      label: 'هاتف العمل',                         type: 'phone' },
      { key: 'mobile',          label: 'الجوال',                             type: 'phone',    required: true },
      { key: 'birth_year',      label: 'تاريخ الميلاد',                      type: 'date' },
      { key: 'condition_desc',  label: 'وصف الحالة المرضية',                 type: 'textarea', required: true, rows: 3 },
      { key: 'required_action', label: 'الإجراءات المطلوبة عند وقوع الحالة', type: 'textarea', required: true, rows: 2 },
      { key: 'recommendations', label: 'التوصيات',                           type: 'textarea', rows: 2 },
    ],
  },

  10: {
    type: 'table',
    header_fields: [
      { key: 'addressee', label: 'المكرم الأستاذ', type: 'text' },
    ],
    row_fields: [
      { key: 'student_name',    label: 'اسم الطالب',                       type: 'text' },
      { key: 'grade',           label: 'الصف',                             type: 'text' },
      { key: 'condition_desc',  label: 'وصف الحالة',                       type: 'textarea', rows: 2 },
      { key: 'required_action', label: 'الإجراء المطلوب عند وقوع الحالة',  type: 'textarea', rows: 2 },
      { key: 'recommendations', label: 'التوصيات',                         type: 'textarea', rows: 1 },
    ],
    footer_fields: [
      { key: 'counselor_name', label: 'الموجه الطلابي', type: 'text' },
      { key: 'principal_name', label: 'مدير المدرسة',   type: 'text' },
    ],
  },

  11: { type: 'workflow', handled_by: 'Form31Screen' },

  12: {
    type: 'table',
    header_fields: [
      { key: 'academic_year', label: 'العام الدراسي', type: 'text' },
    ],
    row_fields: [
      { key: 'program_name',  label: 'اسم البرنامج',    type: 'text' },
      { key: 'exec_date',     label: 'تاريخ التنفيذ',   type: 'date' },
      { key: 'occasion',      label: 'المناسبة',        type: 'text' },
      { key: 'beneficiaries', label: 'ع / المستفيدين',  type: 'number' },
    ],
    footer_fields: [
      { key: 'learning_center_admin', label: 'أمين مركز مصادر التعلم', type: 'text' },
      { key: 'admin_sig',             label: 'التوقيع',                 type: 'signature' },
    ],
  },

  13: {
    type: 'report',
    header_fields: [
      { key: 'month', label: 'الشهر',   type: 'text' },
      { key: 'date',  label: 'التاريخ', type: 'date' },
    ],
    sections: [
      { key: 'repeating_students',  label: 'رعاية الطلاب المعيدين',          fields: SHARED_SECTION_FIELDS },
      { key: 'weak_students',       label: 'رعاية الطلاب المتأخرين دراسياً', fields: SHARED_SECTION_FIELDS },
      { key: 'excellent_students',  label: 'رعاية الطلاب المتفوقين',         fields: SHARED_SECTION_FIELDS },
      { key: 'absence_cases',       label: 'حالات التأخر والغياب',           fields: SHARED_SECTION_FIELDS },
      { key: 'behavior_cases',      label: 'الحالات السلوكية',               fields: SHARED_SECTION_FIELDS },
      { key: 'awareness_programs',  label: 'البرامج والنشرات التوعوية',      fields: SHARED_SECTION_FIELDS },
    ],
    footer_fields: [
      { key: 'counselor_name', label: 'اسم الموجه الطلابي', type: 'text' },
      { key: 'counselor_sig',  label: 'التوقيع',            type: 'signature' },
      { key: 'date',           label: 'التاريخ',            type: 'date' },
    ],
  },

  14: {
    type: 'table',
    header_fields: [
      { key: 'academic_year',        label: 'العام الدراسي',        type: 'text' },
      { key: 'semester',             label: 'الفصل الدراسي',        type: 'text' },
      { key: 'activity_name',        label: 'اسم المجال / الجماعة', type: 'text' },
      { key: 'activity_supervisor',  label: 'مسؤول النشاط',         type: 'text' },
      { key: 'supervisor_name',      label: 'المشرف',               type: 'text' },
      { key: 'location',             label: 'المقر',                type: 'text' },
      { key: 'week_from',            label: 'الأسبوع من',           type: 'date' },
      { key: 'week_to',              label: 'إلى',                  type: 'date' },
    ],
    row_fields: [
      { key: 'student_name', label: 'اسم الطالب',  type: 'text' },
      { key: 'grade',        label: 'الصف',        type: 'text' },
      { key: 'sun_present',  label: 'الأحد ح',     type: 'checkbox' },
      { key: 'sun_absent',   label: 'الأحد غ',     type: 'checkbox' },
      { key: 'mon_present',  label: 'الاثنين ح',   type: 'checkbox' },
      { key: 'mon_absent',   label: 'الاثنين غ',   type: 'checkbox' },
      { key: 'tue_present',  label: 'الثلاثاء ح',  type: 'checkbox' },
      { key: 'tue_absent',   label: 'الثلاثاء غ',  type: 'checkbox' },
      { key: 'wed_present',  label: 'الأربعاء ح',  type: 'checkbox' },
      { key: 'wed_absent',   label: 'الأربعاء غ',  type: 'checkbox' },
      { key: 'thu_present',  label: 'الخميس ح',    type: 'checkbox' },
      { key: 'thu_absent',   label: 'الخميس غ',    type: 'checkbox' },
      { key: 'notes',        label: 'ملحوظات',     type: 'text' },
    ],
    footer_fields: [
      { key: 'activity_supervisor_name', label: 'مسؤول النشاط', type: 'text' },
      { key: 'activity_supervisor_sig',  label: 'التوقيع',      type: 'signature' },
      { key: 'activity_leader_name',     label: 'رائد النشاط',  type: 'text' },
      { key: 'activity_leader_sig',      label: 'التوقيع',      type: 'signature' },
    ],
  },

  15: {
    type: 'flat',
    note: 'يجب إعادة هذا الخطاب للمدرسة بعد اطلاع وتوقيع ولي الأمر',
    fields: [
      { key: 'academic_year', label: 'العام الدراسي',     type: 'text' },
      { key: 'semester',      label: 'الفصل الدراسي',     type: 'text' },
      { key: 'guardian_name', label: 'المكرم ولي الأمر',  type: 'text' },
      { key: 'activity_type', label: 'نوع النشاط',        type: 'select', options: ['رحلة','زيارة','مشاركة','أخرى'] },
      { key: 'activity_other',label: 'أخرى (تذكر)',       type: 'text' },
      { key: 'activity_day',  label: 'يوم النشاط',        type: 'text' },
      { key: 'activity_date', label: 'تاريخ النشاط',      type: 'date' },
      { key: 'start_time',    label: 'من الساعة',         type: 'text' },
      { key: 'end_time',      label: 'حتى الساعة',        type: 'text' },
      { key: 'student_name',  label: 'اسم الطالب المرشَّح', type: 'text' },
      { key: 'guardian_approval', label: 'رأي ولي الأمر',  type: 'select', options: ['موافق','غير موافق'] },
      { key: 'guardian_name_sig', label: 'اسم ولي الأمر',  type: 'text' },
      { key: 'guardian_sig',      label: 'التوقيع',        type: 'signature' },
    ],
  },
};

export function getFormMeta(formNumber) {
  return FORMS_META.find((f) => f.number === Number(formNumber)) || null;
}

export default FORM_SCHEMAS;
