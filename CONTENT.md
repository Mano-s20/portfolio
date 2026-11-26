# Content & Copy Deck — Abderahman Mostafa Mohamed Fetieh

**Phase 1 deliverable.** Source of truth: `CV_ANALYSIS.md`. Every claim below maps to the CV; no numbers, outcomes, credentials or results have been invented.

---

## 1. Audience, goal and tone

**Primary audiences**
1. Radiology centre owners and imaging department managers — need confidence in machine operation and patient safety.
2. Hospital HR / radiology department heads — need reliability, shift coverage, and verifiable experience.
3. Dental clinic owners and orthodontic practices — need CBCT / panoramic / cephalometric competence and software familiarity.
4. Recruiters and HR generalists — need a clear, scanable role history.

**Visitor goal:** understand exactly what he does, verify it against the roles, and contact him.
**Business goal:** start a WhatsApp message or a call/email enquiry.

**Tone:** confident, precise, human. Short sentences. Technical where it helps, plain where it matters. No hype, no superlatives, no unstated credentials.

**Title rule:** the CV headline **"Radiologist"** is retained as requested, always paired with the accurate descriptor **"X-ray & Dental Imaging Technician · Dental & Digital Imaging"**. Arabic uses **أخصائي أشعة** (not طبيب أشعة) plus **فني أشعة وتصوير سني رقمي**. Never "Dr.".

---

## 2. Flow and state matrix (UX skill applied)

```
GOAL: a hiring visitor contacts him

Entry:  hero → scan reveal → name + role
Step 1: About (who, training, focus)
Step 2: Skills & Equipment (what he can operate)
Step 3: Experience (proof, from film to digital)
Step 4: Education + Radiation Safety (foundation and mindset)
Step 5: Contact → WhatsApp / Call / Email / Facebook
Success: external handoff to WhatsApp, dialler or mail client

Branches / states designed:
- Arabic visitor        → full RTL mirror, Arabic typography, translated copy, persisted choice
- Reduced motion        → static reveal, no lens, no particle field, content first
- Low-power / no WebGL  → lightweight CSS/SVG background instead of canvas
- Slow connection       → scanner loader with progress, then content; no blank page
- No JS                 → semantic HTML still exposes all sections and contact links
- Contact app missing   → all options visible together (WhatsApp, tel, mail, Facebook), no single point of failure
- Wrong URL             → imaging-themed 404 with a route home
- Language switch       → instant, URL/localStorage persisted, focus retained, no layout jump
```

No forms in this site, so no form error states are needed. Contact uses direct links, which avoids collecting or storing visitor data.

---

## 3. Full copy — English

### Loader / scanner
- `INITIALISING IMAGING SESSION`
- `CALIBRATING...`
- `SCANNING...`
- `ABDERAHMAN MOSTAFA`

### Navigation
- About · Skills · Experience · Education · Safety · Contact
- Language label: `EN` / `AR`
- Skip link: `Skip to content`

### Hero
- **Eyebrow:** `DIAGNOSTIC IMAGING · SHIBIN EL-QANATER, EGYPT`
- **Headline:** `Radiologist`
- **Role line:** `X-ray & Dental Imaging Technician · Dental & Digital Imaging`
- **Tagline:** `From manual film to digital DR — images made with precision, patients treated with care.`
- **Primary CTA:** `Get in touch`
- **Secondary CTA:** `View experience`
- **Meta strip:** `CBCT · Panoramic · Cephalometric` / `Romexis · SIDEXIS` / `Radiation safety`
- **Scroll cue:** `Scroll to explore`

### About
**Heading:** `About`

**Body:**
> I'm Abderahman Mostafa Mohamed Fetieh, a radiology and medical imaging graduate of Badr University in Cairo (2021–2025). My work sits where dental imaging meets digital radiography: operating CBCT, panoramic and cephalometric machines, working in Romexis and SIDEXIS, and taking care with patient positioning and image quality.
>
> I started on conventional X-ray machines with manual film development, then moved into digital dental radiography (DR). That path gave me a practical understanding of both sides of the job — what an image needs in order to be clear, and what a patient needs in order to feel safe. I take radiation protection standards seriously, and I value teamwork and steady, organised work.

**Photo caption:** `Abderahman Mostafa — Shibin El-Qanater`

### Skills & Equipment
**Heading:** `Skills & Equipment`
**Intro:** `The machines, software and habits behind the work.`

**Equipment cards**
1. **CBCT** — `Cone beam computed tomography: a 3D X-ray used in dental imaging. I operate the unit and work with the digital images it produces.`
2. **Panoramic** — `A single wide view of the upper and lower jaws. I position the patient and operate the panoramic unit.`
3. **Cephalometric** — `A standardised side-view X-ray used in orthodontic assessment and planning. I operate the cephalometric machine.`

**Skill cards**
4. **Digital imaging software** — `Romexis and SIDEXIS for viewing and working with digital dental images.`
5. **Patient positioning & care** — `Careful positioning is the first step to a clear image and a comfortable patient.`
6. **Radiation protection** — `Knowledge of radiation protection standards, applied in daily imaging work.`
7. **Teamwork & time management** — `Collaborating with colleagues and managing time in day-to-day department work.`

*(Meter labels are the skill names; no numerical percentages are displayed — the meters are visual exposure-style indicators, not ratings.)*

### Experience
**Heading:** `Experience`
**Intro:** `From manual film processing to digital dental radiography — three stops, one direction.`

1. **Al-Mohammadi Charity Medical Center** — `Kafr Sandouh` — `1.5 years` — `X-ray & Dental Imaging Technician`
   - `Operated digital dental radiography (DR) systems for routine imaging procedures.`
   - `Kept image quality and patient safety at the centre of the work.`

2. **Al-Rahma Hospital** — `Shibin Al-Qanater` — `2 months` — `X-ray & Dental Imaging Technician`
   - `Provided full-shift coverage in the radiology department.`
   - `Worked with conventional X-ray machines and manual film development.`
   - `Handled daily patient cases.`

3. **El-Shamla Governmental Hospital** — `Shibin Al-Qanater` — `1 month` — `Practical training · X-ray`
   - `Completed practical training in general and dental radiology.`
   - `Practised manual film processing and radiation safety procedures.`

### Education
**Heading:** `Education`
**Qualification:** `Bachelor's Degree / Diploma in Health Sciences — Radiology and Medical Imaging`
**Institution:** `Badr University in Cairo (BUC)`
**Years:** `2021–2025`

### Radiation Safety Commitment
**Heading:** `Radiation Safety`
**Intro:** `Radiation protection isn't a final step. It's part of every image.`
**Principle label:** `ALARA — As Low As Reasonably Achievable`

1. **Time** — `Keep exposure time as short as the examination allows.`
2. **Distance** — `Increase distance from the source whenever the procedure permits.`
3. **Shielding** — `Use appropriate protective measures and follow department safety procedures.`

**Closing line:** `These are the habits I bring to every shift.`

### Contact
**Heading:** `Contact`
**Intro:** `If you're hiring for a radiology department, dental clinic or imaging centre, I'd be glad to talk about how I work.`
**Primary CTA:** `Message on WhatsApp`
**Contact rows:** `Phone` → `+20 103 240 6961` · `Email` → `momed.mido12@gmail.com` · `Facebook` → `3bdo.mony`
**Location:** `Shibin El-Qanater, Qalyubia, Egypt`
**Availability note:** none — do not invent availability or response times.

### 404 (imaging-themed)
- `NO IMAGE FOUND`
- `This scan returned no result. The page you're looking for isn't here.`
- `Back to home`

### Metadata
- **Title:** `Abderahman Mostafa Fetieh — Radiologist | X-ray & Dental Imaging`
- **Description:** `Abderahman Mostafa Fetieh — radiology and medical imaging graduate. X-ray & Dental Imaging Technician working with CBCT, panoramic and cephalometric systems, Romexis and SIDEXIS.`
- **OG title:** `Abderahman Mostafa Fetieh — Radiologist`
- **OG description:** `Dental and digital imaging. CBCT · Panoramic · Cephalometric. Based in Shibin El-Qanater, Egypt.`

---

## 4. نسخة عربية كاملة / Full copy — Arabic

> Arabic spelling of the family name is a transliteration and is listed in the final input checklist for confirmation.

### شاشة البدء /.Scanner
- `تهيئة جلسة التصوير`
- `جارٍ المعايرة...`
- `جارٍ المسح...`
- `عبد الرحمن مصطفى`

### التنقل
- عني · المهام · الخبرة · التعليم · السلامة · تواصل
- اللغة: `EN` / `AR`
- رابط تخطي: `تخطَّ إلى المحتوى`

### الواجهة الرئيسية / Hero
- **العنوان العلوي:** `التصوير التشخيصي · شبين القناطر، مصر`
- **العنوان:** `أخصائي أشعة`
- **وصف الدور:** `فني أشعة وتصوير سني رقمي`
- **الشعار:** `من التحميل اليدوي للأفلام إلى التصوير السني الرقمي (DR): صورة دقيقة، ومريض يشعر بالأمان.`
- **الزر الأساسي:** `تواصل معي`
- **الزر الثانوي:** `استعرض الخبرة`
- **الشريط:** `CBCT · بانوراما · سيفالومتري` / `Romexis · SIDEXIS` / `الوقاية من الإشعاع`
- **تلميح التمرير:** `مرّر للاستكشاف`

### عني / About
**العنوان:** `عنّي`

**النص:**
> أنا عبد الرحمن مصطفى محمد فتية، خريج علوم الصحة – الأشعة والتصوير الطبي من جامعة بدر بالقاهرة (2021–2025). أعمل عند نقطة التقاء التصوير السني والأشعة الرقمية: تشغيل أجهزة CBCT والبانوراما والسيفالومتري، والعمل على برنامجي Romexis وSIDEXIS، مع العناية بوضعية المريض وجودة الصورة.
>
> بدأت على أجهزة الأشعة التقليدية والتحميل اليدوي للأفلام، ثم انتقلت إلى التصوير السني الرقمي (DR). منحني هذا المسار فهماً عملياً للجانبين: ما تحتاجه الصورة لتكون واضحة، وما يحتاجه المريض ليشعر بالأمان. ألتزم بمعايير الوقاية من الإشعاع، وأُقدّر العمل الجماعي وتنظيم الوقت في العمل اليومي.

**وصف الصورة:** `عبد الرحمن مصطفى — شبين القناطر`

### المهام والأجهزة / Skills & Equipment
**العنوان:** `المهام والأجهزة`
**المقدمة:** `الأجهزة والبرامج والعادات التي يقوم عليها العمل.`

1. **CBCT** — `الأشعة المقطعية بالمخروط: تصوير ثلاثي الأبعاد يُستخدم في التصوير السني. أُشغّل الجهاز وأعمل على الصور الرقمية الناتجة.`
2. **البانوراما** — `صورة عريضة واحدة تُظهر الفكين العلوي والسفلي. أضبط وضعية المريض وأُشغّل جهاز البانوراما.`
3. **السيفالومتري** — `صورة جانبية قياسية تُستخدم في تقييم التقويم وتخطيط العلاج. أُشغّل جهاز السيفالومتري.`
4. **برامج التصوير الرقمي** — `Romexis وSIDEXIS لعرض الصور السنية الرقمية والعمل عليها.`
5. **وضعية المريض والعناية به** — `الوضعية الدقيقة هي الخطوة الأولى إلى صورة واضحة ومريض مرتاح.`
6. **الوقاية من الإشعاع** — `معرفة بمعايير الوقاية من الإشعاع وتطبيقها في العمل اليومي.`
7. **العمل الجماعي وإدارة الوقت** — `التعاون مع الزملاء وتنظيم الوقت ضمن العمل اليومي بالقسم.`

*(أشرطة المهام تحمل أسماء المهام فقط، دون نسب مئوية أو تقييمات رقمية.)*

### الخبرة / Experience
**العنوان:** `الخبرة`
**المقدمة:** `من التحميل اليدوي للأفلام إلى التصوير السني الرقمي — ثلاث محطات واتجاه واحد.`

1. **مركز المحمدي الخيري الطبي** — `كفر سندوح` — `سنة ونصف` — `فني أشعة وتصوير سني`
   - `شغّلت أنظمة التصوير السني الرقمي (DR) في الإجراءات الروتينية.`
   - `ركّزت على جودة الصورة وسلامة المريض في العمل.`

2. **مستشفى الرحمة** — `شبين القناطر` — `شهران` — `فني أشعة وتصوير سني`
   - `غطّيت الورديات الكاملة في قسم الأشعة.`
   - `عملت على أجهزة الأشعة التقليدية والتحميل اليدوي للأفلام.`
   - `تعاملت مع حالات المرضى اليومية.`

3. **مستشفى الشملة الحكومي** — `شبين القناطر` — `شهر واحد` — `تدريب عملي · أشعة`
   - `أكملت تدريباً عملياً في الأشعة العامة والسنية.`
   - `مارست التحميل اليدوي للأفلام وإجراءات الوقاية من الإشعاع.`

### التعليم / Education
**العنوان:** `التعليم`
**المؤهل:** `Bachelor's Degree / Diploma في علوم الصحة — الأشعة والتصوير الطبي`
**الجامعة:** `جامعة بدر بالقاهرة (BUC)`
**السنوات:** `2021–2025`

### الوقاية من الإشعاع / Radiation Safety
**العنوان:** `الوقاية من الإشعاع`
**المقدمة:** `الوقاية من الإشعاع ليست خطوة أخيرة، بل جزء من كل صورة.`
**المبدأ:** `ALARA — بأقل قدر ممكن بما يتناسب مع الحاجة`

1. **الوقت** — `تقليل زمن التعرّض إلى الحد الذي يسمح به الفحص.`
2. **المسافة** — `زيادة المسافة عن المصدر كلما سمح الإجراء بذلك.`
3. **الدرع الوقائي** — `استخدام وسائل الحماية المناسبة واتباع إجراءات السلامة في القسم.`

**الخاتمة:** `هذه هي العادات التي أحملها معي في كل وردية.`

### تواصل / Contact
**العنوان:** `تواصل`
**المقدمة:** `إذا كنت تبحث عن فني أشعة لقسم أشعة أو عيادة أسنان أو مركز تصوير، يسعدني أن أحدثك عن طريقي في العمل.`
**الزر الأساسي:** `راسلني على واتساب`
**صفوف التواصل:** `الهاتف` ← `+20 103 240 6961` · `البريد الإلكتروني` ← `momed.mido12@gmail.com` · `فيسبوك` ← `3bdo.mony`
**الموقع:** `شبين القناطر، القليوبية، مصر`

### صفحة غير موجودة / 404
- `لا توجد صورة`
- `هذا المسح لم يُظهر نتيجة. الصفحة التي تبحث عنها غير موجودة.`
- `العودة إلى الرئيسية`

### البيانات الوصفية / Metadata
- **العنوان:** `عبد الرحمن مصطفى فتية — أخصائي أشعة | فني أشعة وتصوير سني`
- **الوصف:** `عبد الرحمن مصطفى فتية، خريج الأشعة والتصوير الطبي، فني أشعة وتصوير سني يعمل على أجهزة CBCT والبانوراما والسيفالومتري وبرنامجي Romexis وSIDEXIS.`

---

## 5. Copy QA — fact check against CV

| Statement in copy | CV evidence |
|---|---|
| Degree, BUC, 2021–2025 | Education block |
| CBCT / Panoramic / Cephalometric operation | Skills block |
| Romexis, SIDEXIS | Skills block |
| Patient positioning & care | Skills block |
| Radiation protection knowledge | Skills block + El-Shamla entry |
| Teamwork & time management | Skills block |
| DR systems, image quality, patient safety, 1.5 y, Kafr Sandouh | Al-Mohammadi entry |
| Full-shift, conventional X-ray, manual film, daily cases, 2 m, Shibin Al-Qanater | Al-Rahma entry |
| Practical training, general & dental radiology, manual film, safety, 1 m | El-Shamla entry |
| Phone / email / location / Facebook | Contact + profile blocks |
| "Radiologist" headline | CV headline (owner-confirmed retention) |
| ALARA Time / Distance / Shielding | Requested safety framework; no claim of certification |
| No total years, no patient counts, no results, no certificates | Deliberately omitted |

**Removed from site:** date of birth, marital status, exact street address (none given), any physician or "Dr." claim.

---

## 6. Phase 1 skills applied
- **doc-coauthoring** — audience/impact/constraint framing, structured section drafting and a final consistency pass.
- **designing-user-experience** — user flow, state matrix (RTL, reduced motion, low power, slow connection, no JS, contact handoff, 404), action-led button copy.
