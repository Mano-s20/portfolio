export type Lang = 'en' | 'ar'

export interface Copy {
  motionStatusOff: string
  motionStatusSystemOff: string
  pageTitle: string
  description: string
  ogTitle: string
  ogDescription: string
  nav: {
    about: string
    skills: string
    experience: string
    education: string
    safety: string
    contact: string
    skip: string
    primary: string
    language: string
    home: string
  }
  loader: {
    init: string
    calibrating: string
    scanning: string
    name: string
    skip: string
  }
  hero: {
    eyebrow: string
    title: string
    role: string
    tag: string
    tagline: string
    primary: string
    secondary: string
    meta: [string, string, string]
    scroll: string
    readoutScanning: string
    readoutReady: string
  }
  about: {
    label: string
    heading: string
    p1: string
    p2: string
    caption: string
    photoAction: string
  }
  skills: {
    label: string
    heading: string
    intro: string
    deviceTitle: string
    devices: [{ name: string; body: string }, { name: string; body: string }, { name: string; body: string }]
    skillTitle: string
    skills: Array<{ name: string; body: string }>
  }
  experience: {
    label: string
    heading: string
    intro: string
    items: Array<{
      org: string
      place: string
      duration: string
      role: string
      bullets: string[]
    }>
  }
  education: {
    label: string
    heading: string
    qualification: string
    institution: string
    years: string
  }
  safety: {
    label: string
    heading: string
    intro: string
    principle: string
    cards: Array<{ title: string; body: string }>
    closing: string
  }
  contact: {
    label: string
    heading: string
    intro: string
    primary: string
    call: string
    email: string
    location: string
    social: string
  }
  footer: {
    motion: string
    motionOff: string
    backToTop: string
    note: string
  }
  notFound: {
    code: string
    title: string
    body: string
    cta: string
  }
  waMessage: string
}

export const contactLinks = {
  phone: '+20 103 240 6961',
  tel: 'tel:+201032406961',
  whatsapp: 'https://wa.me/201032406961',
  email: 'momed.mido12@gmail.com',
  facebook: 'https://www.facebook.com/3bdo.mony/',
} as const

export const copy: Record<Lang, Copy> = {
  en: {
    motionStatusOff: "Motion off",
    motionStatusSystemOff: "Motion off (system setting)",
    pageTitle: "Abderahman Mostafa Fetieh — Radiologic Technologist | X-ray & Dental Imaging",
    description: "Abderahman Mostafa Fetieh — radiology and medical imaging graduate. X-ray & Dental Imaging Technician working with CBCT, panoramic and cephalometric systems, Romexis and SIDEXIS.",
    ogTitle: "Abderahman Mostafa Fetieh — Radiologic Technologist",
    ogDescription: "Dental and digital imaging. CBCT · Panoramic · Cephalometric. Based in Shibin El-Qanater, Egypt.",
    nav: {
      about: "About",
      skills: "Skills",
      experience: "Experience",
      education: "Education",
      safety: "Safety",
      contact: "Contact",
      skip: "Skip to content",
      primary: "Primary navigation",
      language: "Language",
      home: "Abderahman Mostafa Fetieh — home",
    },
    loader: {
      init: "INITIALISING IMAGING SESSION",
      calibrating: "CALIBRATING...",
      scanning: "SCANNING...",
      name: "ABDERAHMAN MOSTAFA",
      skip: "Skip intro",
    },
    hero: {
      eyebrow: "DIAGNOSTIC IMAGING · SHIBIN EL-QANATER, EGYPT",
      title: "Radiologic Technologist",
      role: "X-ray & Dental Imaging Technician",
      tag: "Dental & Digital Imaging",
      tagline: "From manual film to digital DR — images made with precision, patients treated with care.",
      primary: "Get in touch",
      secondary: "View experience",
      meta: ["CBCT · Panoramic · Cephalometric", "Romexis · SIDEXIS", "Radiation safety"],
      scroll: "Scroll to explore",
      readoutScanning: "SCANNING",
      readoutReady: "ABDERAHMAN MOSTAFA",
    },
    about: {
      label: "PROFILE",
      heading: "About",
      p1: "I'm Abderahman Mostafa Mohamed Fetieh, a radiology and medical imaging graduate of Badr University in Cairo (2021–2025). My work sits where dental imaging meets digital radiography: operating CBCT, panoramic and cephalometric machines, working in Romexis and SIDEXIS, and taking care with patient positioning and image quality.",
      p2: "I started on conventional X-ray machines with manual film development, then moved into digital dental radiography (DR). That path gave me a practical understanding of both sides of the job — what an image needs in order to be clear, and what a patient needs in order to feel safe. I take radiation protection standards seriously, and I value teamwork and steady, organised work.",
      caption: "Abderahman Mostafa — Shibin El-Qanater",
      photoAction: "Toggle X-ray negative view",
    },
    skills: {
      label: "CAPABILITIES",
      heading: "Skills & Equipment",
      intro: "The machines, software and habits behind the work.",
      deviceTitle: "Equipment",
      devices: [
        {
          name: "CBCT",
          body: "Cone beam computed tomography: a 3D X-ray used in dental imaging. I operate the unit and work with the digital images it produces.",
        },
        {
          name: "Panoramic",
          body: "A single wide view of the upper and lower jaws. I position the patient and operate the panoramic unit.",
        },
        {
          name: "Cephalometric",
          body: "A standardised side-view X-ray used in orthodontic assessment and planning. I operate the cephalometric machine.",
        },
      ],
      skillTitle: "Practice",
      skills: [
        {
          name: "Digital imaging software",
          body: "Romexis and SIDEXIS for viewing and working with digital dental images.",
        },
        {
          name: "Patient positioning & care",
          body: "Careful positioning is the first step to a clear image and a comfortable patient.",
        },
        {
          name: "Radiation protection",
          body: "Knowledge of radiation protection standards, applied in daily imaging work.",
        },
        {
          name: "Teamwork & time management",
          body: "Collaborating with colleagues and managing time in day-to-day department work.",
        },
      ],
    },
    experience: {
      label: "HISTORY",
      heading: "Experience",
      intro: "From manual film processing to digital dental radiography — three stops, one direction.",
      items: [
        {
          org: "Al-Mohammadi Charity Medical Center",
          place: "Kafr Sandouh",
          duration: "1.5 years",
          role: "X-ray & Dental Imaging Technician",
          bullets: [
            "Operated digital dental radiography (DR) systems for routine imaging procedures.",
            "Kept image quality and patient safety at the centre of the work.",
          ],
        },
        {
          org: "Al-Rahma Hospital",
          place: "Shibin Al-Qanater",
          duration: "2 months",
          role: "X-ray & Dental Imaging Technician",
          bullets: [
            "Provided full-shift coverage in the radiology department.",
            "Worked with conventional X-ray machines and manual film development.",
            "Handled daily patient cases.",
          ],
        },
        {
          org: "El-Shamla Governmental Hospital",
          place: "Shibin Al-Qanater",
          duration: "1 month",
          role: "Practical training · X-ray",
          bullets: [
            "Completed practical training in general and dental radiology.",
            "Practised manual film processing and radiation safety procedures.",
          ],
        },
      ],
    },
    education: {
      label: "FOUNDATION",
      heading: "Education",
      qualification: "Bachelor's Degree / Diploma in Health Sciences — Radiology and Medical Imaging",
      institution: "Badr University in Cairo (BUC)",
      years: "2021–2025",
    },
    safety: {
      label: "PRACTICE",
      heading: "Radiation Safety",
      intro: "Radiation protection isn't a final step. It's part of every image.",
      principle: "ALARA — As Low As Reasonably Achievable",
      cards: [
        { title: "Time", body: "Keep exposure time as short as the examination allows." },
        { title: "Distance", body: "Increase distance from the source whenever the procedure permits." },
        {
          title: "Shielding",
          body: "Use appropriate protective measures and follow department safety procedures.",
        },
      ],
      closing: "These are the habits I bring to every shift.",
    },
    contact: {
      label: "CONTACT",
      heading: "Contact",
      intro: "If you're hiring for a radiology department, dental clinic or imaging centre, I'd be glad to talk about how I work.",
      primary: "Message on WhatsApp",
      call: "Phone",
      email: "Email",
      location: "Shibin El-Qanater, Qalyubia, Egypt",
      social: "Facebook",
    },
    footer: {
      motion: "Reduce motion",
      motionOff: "Motion on",
      backToTop: "Back to top",
      note: "Content taken from the supplied CV. No patient images used.",
    },
    notFound: {
      code: "NO IMAGE FOUND",
      title: "This scan returned no result",
      body: "The page you're looking for isn't here. The scan is still running on the home page.",
      cta: "Back to home",
    },
    waMessage: "Hello Abderahman, I'd like to talk about an imaging role.",
  },

  ar: {
    motionStatusOff: "الحركة متوقفة",
    motionStatusSystemOff: "الحركة متوقفة (إعداد النظام)",
    pageTitle: "عبد الرحمن مصطفى فتية — فني أشعة تشخيصية | فني أشعة وتصوير سني",
    description: "عبد الرحمن مصطفى فتية، خريج الأشعة والتصوير الطبي، فني أشعة وتصوير سني يعمل على أجهزة CBCT والبانوراما والسيفالومتري وبرنامجي Romexis وSIDEXIS.",
    ogTitle: "عبد الرحمن مصطفى فتية — فني أشعة تشخيصية",
    ogDescription: "التصوير السني والرقمي. CBCT · بانوراما · سيفالومتري. من شبين القناطر، مصر.",
    nav: {
      about: "عنّي",
      skills: "المهام",
      experience: "الخبرة",
      education: "التعليم",
      safety: "السلامة",
      contact: "تواصل",
      skip: "تخطَّ إلى المحتوى",
      primary: "التنقل الرئيسي",
      language: "اللغة",
      home: "عبد الرحمن مصطفى فتية — الرئيسية",
    },
    loader: {
      init: "تهيئة جلسة التصوير",
      calibrating: "جارٍ المعايرة...",
      scanning: "جارٍ المسح...",
      name: "عبد الرحمن مصطفى",
      skip: "تخطي المقدمة",
    },
    hero: {
      eyebrow: "التصوير التشخيصي · شبين القناطر، مصر",
      title: "فني أشعة تشخيصية",
      role: "فني أشعة وتصوير سني",
      tag: "التصوير السني الرقمي",
      tagline: "من التحميل اليدوي للأفلام إلى التصوير السني الرقمي (DR): صورة دقيقة، ومريض يشعر بالأمان.",
      primary: "تواصل معي",
      secondary: "استعرض الخبرة",
      meta: ["CBCT · بانوراما · سيفالومتري", "Romexis · SIDEXIS", "الوقاية من الإشعاع"],
      scroll: "مرّر للاستكشاف",
      readoutScanning: "جارٍ المسح",
      readoutReady: "عبد الرحمن مصطفى",
    },
    about: {
      label: "نبذة",
      heading: "عنّي",
      p1: "أنا عبد الرحمن مصطفى محمد فتية، خريج علوم الصحة – الأشعة والتصوير الطبي من جامعة بدر بالقاهرة (2021–2025). أعمل عند نقطة التقاء التصوير السني والأشعة الرقمية: تشغيل أجهزة CBCT والبانوراما والسيفالومتري، والعمل على برنامجي Romexis وSIDEXIS، مع العناية بوضعية المريض وجودة الصورة.",
      p2: "بدأت على أجهزة الأشعة التقليدية والتحميل اليدوي للأفلام، ثم انتقلت إلى التصوير السني الرقمي (DR). منحني هذا المسار فهماً عملياً للجانبين: ما تحتاجه الصورة لتكون واضحة، وما يحتاجه المريض ليشعر بالأمان. ألتزم بمعايير الوقاية من الإشعاع، وأُقدّر العمل الجماعي وتنظيم الوقت في العمل اليومي.",
      caption: "عبد الرحمن مصطفى — شبين القناطر",
      photoAction: "تبديل عرض النيفاتج بالأشعة",
    },
    skills: {
      label: "القدرات",
      heading: "المهام والأجهزة",
      intro: "الأجهزة والبرامج والعادات التي يقوم عليها العمل.",
      deviceTitle: "الأجهزة",
      devices: [
        {
          name: "CBCT",
          body: "الأشعة المقطعية بالمخروط: تصوير ثلاثي الأبعاد يُستخدم في التصوير السني. أُشغّل الجهاز وأعمل على الصور الرقمية الناتجة.",
        },
        {
          name: "البانوراما",
          body: "صورة عريضة واحدة تُظهر الفكين العلوي والسفلي. أضبط وضعية المريض وأُشغّل جهاز البانوراما.",
        },
        {
          name: "السيفالومتري",
          body: "صورة جانبية قياسية تُستخدم في تقييم التقويم وتخطيط العلاج. أُشغّل جهاز السيفالومتري.",
        },
      ],
      skillTitle: "الممارسة",
      skills: [
        {
          name: "برامج التصوير الرقمي",
          body: "Romexis وSIDEXIS لعرض الصور السنية الرقمية والعمل عليها.",
        },
        {
          name: "وضعية المريض والعناية به",
          body: "الوضعية الدقيقة هي الخطوة الأولى إلى صورة واضحة ومريض مرتاح.",
        },
        {
          name: "الوقاية من الإشعاع",
          body: "معرفة بمعايير الوقاية من الإشعاع وتطبيقها في العمل اليومي.",
        },
        {
          name: "العمل الجماعي وإدارة الوقت",
          body: "التعاون مع الزملاء وتنظيم الوقت ضمن العمل اليومي بالقسم.",
        },
      ],
    },
    experience: {
      label: "السجل",
      heading: "الخبرة",
      intro: "من التحميل اليدوي للأفلام إلى التصوير السني الرقمي — ثلاث محطات واتجاه واحد.",
      items: [
        {
          org: "مركز المحمدي الخيري الطبي",
          place: "كفر سندوح",
          duration: "سنة ونصف",
          role: "فني أشعة وتصوير سني",
          bullets: [
            "شغّلت أنظمة التصوير السني الرقمي (DR) في الإجراءات الروتينية.",
            "ركّزت على جودة الصورة وسلامة المريض في العمل.",
          ],
        },
        {
          org: "مستشفى الرحمة",
          place: "شبين القناطر",
          duration: "شهران",
          role: "فني أشعة وتصوير سني",
          bullets: [
            "غطّيت الورديات الكاملة في قسم الأشعة.",
            "عملت على أجهزة الأشعة التقليدية والتحميل اليدوي للأفلام.",
            "تعاملت مع حالات المرضى اليومية.",
          ],
        },
        {
          org: "مستشفى الشملة الحكومي",
          place: "شبين القناطر",
          duration: "شهر واحد",
          role: "تدريب عملي · أشعة",
          bullets: [
            "أكملت تدريباً عملياً في الأشعة العامة والسنية.",
            "مارست التحميل اليدوي للأفلام وإجراءات الوقاية من الإشعاع.",
          ],
        },
      ],
    },
    education: {
      label: "الأساس",
      heading: "التعليم",
      qualification: "Bachelor's Degree / Diploma في علوم الصحة — الأشعة والتصوير الطبي",
      institution: "جامعة بدر بالقاهرة (BUC)",
      years: "2021–2025",
    },
    safety: {
      label: "الممارسة",
      heading: "الوقاية من الإشعاع",
      intro: "الوقاية من الإشعاع ليست خطوة أخيرة، بل جزء من كل صورة.",
      principle: "ALARA — بأقل قدر ممكن بما يتناسب مع الحاجة",
      cards: [
        { title: "الوقت", body: "تقليل زمن التعرّض إلى الحد الذي يسمح به الفحص." },
        { title: "المسافة", body: "زيادة المسافة عن المصدر كلما سمح الإجراء بذلك." },
        {
          title: "الدرع الوقائي",
          body: "استخدام وسائل الحماية المناسبة واتباع إجراءات السلامة في القسم.",
        },
      ],
      closing: "هذه هي العادات التي أحملها معي في كل وردية.",
    },
    contact: {
      label: "تواصل",
      heading: "تواصل",
      intro: "إذا كنت تبحث عن فني أشعة لقسم أشعة أو عيادة أسنان أو مركز تصوير، يسعدني أن أحدثك عن طريقي في العمل.",
      primary: "راسلني على واتساب",
      call: "الهاتف",
      email: "البريد الإلكتروني",
      location: "شبين القناطر، القليوبية، مصر",
      social: "فيسبوك",
    },
    footer: {
      motion: "تقليل الحركة",
      motionOff: "الحركة مفعّلة",
      backToTop: "العودة للأعلى",
      note: "المحتوى مأخوذ من السيرة الذاتية المقدّمة. لا توجد صور لمرضى.",
    },
    notFound: {
      code: "لا توجد صورة",
      title: "هذا المسح لم يُظهر نتيجة",
      body: "الصفحة التي تبحث عنها غير موجودة. المسح ما زال يعمل في الصفحة الرئيسية.",
      cta: "العودة إلى الرئيسية",
    },
    waMessage: "مرحباً عبد الرحمن، أود التحدث عن فرصة عمل في مجال التصوير.",
  },
}
