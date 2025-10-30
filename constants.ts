
import { Teacher, Staff, Notice, GalleryImage, Subject, DailyInspiration } from './types';

export const MADRASAH_INFO = {
  name: { en: "Madrasah Madinatul Uloom", bn: "মাদ্রাসা মদিনাতুল উলূম" },
  address: { en: "Village: Arampur, Gosaba, South 24 Parganas, West Bengal, India. PIN: 743370", bn: "গ্রাম: আরামপুর, গোসাবা, দক্ষিণ ২৪ পরগনা, পশ্চিমবঙ্গ, ভারত। পিন: ৭৪৩৩৭০" },
  phone: "+91 7679116671",
  whatsapp: "https://wa.me/917679116671",
  email: "kcmcentre0@gmail.com",
  qrCodeUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgjzzuJqwo5z9tIb3zQsduaJ2U8e5cZa2N3OAAuC_x6p-67TlkJJ8_eZQzNIlTuAPtfzCLcisqQnD-NGUdXabFATHxYPO0gqG_EZGf1jsrZYnn_A2D5fM2UY_fBxCjlyZ7ruIi-_HCpWDsdKlCMWlYdNIr0fnxyyCDLY_BZsIorWfX8tmHX2xGBHqjbDK4/s1280/WhatsApp%20Image%202025-07-27%20at%201.19.14%20PM.jpeg",
};

export const LANG_STRINGS = {
  en: {
    // Header & Nav
    home: "Home",
    about: "About Us",
    administration: "Administration",
    gallery: "Gallery",
    checkResult: "Check Result",
    contact: "Contact Us",
    studentArea: "Student Area",
    donate: "Donate",
    results: "Results",
    teachers: "Teachers",
    // Home Page
    welcomeMessage: "To spread Islamic knowledge through Qur’an, Hadith, and Arabic education.",
    verseOfTheDay: "Verse of the Day",
    duaOfTheDay: "Dua of the Day",
    noticeBoard: "Notice Board",
    // About Page
    aboutTitle: "About Madrasah Madinatul Uloom",
    aboutDesc: "Established with the vision of nurturing a generation grounded in Islamic principles and modern education, Madrasah Madinatul Uloom is a beacon of light in the community. We strive to provide a holistic educational experience.",
    missionVision: "Mission & Vision",
    missionVisionDesc: "Our mission is to cultivate knowledgeable and pious individuals who can serve the Ummah and humanity. Our vision is to become a leading center for Islamic education, fostering spiritual growth and academic excellence.",
    statistics: "Our Statistics",
    residentialStudents: "Residential Students",
    nonResidentialStudents: "Non-residential Students",
    staffMembers: "Staff Members",
    scanToContact: "Scan to contact or donate via WhatsApp",
    // Administration
    teachersAndStaff: "Administration and Teachers",
    staff: "Staff Members",
    name: "Name",
    designation: "Designation",
    qualification: "Qualification",
    description: "Description",
    role: "Role",
    // Result Page
    findYourResult: "Find Your Result",
    enterRoll: "Enter Roll Number",
    search: "Search",
    // Contact
    leaveMessage: "Leave a Message",
    yourName: "Your Name",
    yourEmail: "Your Email",
    yourMessage: "Your Message",
    sendMessage: "Send Message",
    // Footer
    copyright: "Copyright © Madrasah Madinatul Uloom 2025",
    developerCredit: "Developed with Google AI Studio",
  },
  bn: {
    // Header & Nav
    home: "হোম",
    about: "আমাদের সম্পর্কে",
    administration: "প্রশাসন",
    gallery: "গ্যালারি",
    checkResult: "ফলাফল দেখুন",
    contact: "যোগাযোগ",
    studentArea: "ছাত্র এলাকা",
    donate: "দান করুন",
    results: "ফলাফল",
    teachers: "শিক্ষক",
    // Home Page
    welcomeMessage: "কুরআন, হাদিস এবং আরবি শিক্ষার মাধ্যমে ইসলামী জ্ঞান ছড়িয়ে দেওয়া।",
    verseOfTheDay: "দিনের আয়াত",
    duaOfTheDay: "দিনের দোয়া",
    noticeBoard: "নোটিশ বোর্ড",
    // About Page
    aboutTitle: "মাদ্রাসা মদিনাতুল উলূম সম্পর্কে",
    aboutDesc: "ইসলামী নীতি এবং আধুনিক শিক্ষায় ভিত্তি করে একটি প্রজন্মকে লালন-পালনের লক্ষ্যে প্রতিষ্ঠিত, মাদ্রাসা মদিনাতুল উলূম সম্প্রদায়ের জন্য একটি আলোর দিশারী। আমরা একটি সামগ্রিক শিক্ষাগত অভিজ্ঞতা প্রদানের জন্য সচেষ্ট।",
    missionVision: "লক্ষ্য ও উদ্দেশ্য",
    missionVisionDesc: "আমাদের লক্ষ্য হলো জ্ঞানী ও ধার্মিক ব্যক্তি তৈরি করা যারা উম্মাহ ও মানবতার সেবা করতে পারে। আমাদের উদ্দেশ্য হলো ইসলামী শিক্ষার একটি শীর্ষস্থানীয় কেন্দ্র হয়ে ওঠা, যা আধ্যাত্মিক বৃদ্ধি এবং অ্যাকাডেমিক শ্রেষ্ঠত্বকে উৎসাহিত করে।",
    statistics: "আমাদের পরিসংখ্যান",
    residentialStudents: "আবাসিক ছাত্র",
    nonResidentialStudents: "অনাবাসিক ছাত্র",
    staffMembers: "কর্মী",
    scanToContact: "যোগাযোগ বা হোয়াটসঅ্যাপে দান করতে স্ক্যান করুন",
    // Administration
    teachersAndStaff: "প্রশাসন এবং শিক্ষক",
    staff: "কর্মী",
    name: "নাম",
    designation: "পদবী",
    qualification: "যোগ্যতা",
    description: "বিবরণ",
    role: "ভূমিকা",
    // Result Page
    findYourResult: "আপনার ফলাফল খুঁজুন",
    enterRoll: "রোল নম্বর লিখুন",
    search: "অনুসন্ধান",
    // Contact
    leaveMessage: "একটি বার্তা দিন",
    yourName: "আপনার নাম",
    yourEmail: "আপনার ই-মেইল",
    yourMessage: "আপনার বার্তা",
    sendMessage: "বার্তা পাঠান",
    // Footer
    copyright: "কপিরাইট © মাদ্রাসা মদিনাতুল উলূম ২০২৫",
    developerCredit: "Google AI Studio দিয়ে তৈরি",
  },
};

export const TEACHERS_DATA: Teacher[] = [
    { id: 1, name: "Maulana Belal Uddin Mondal", designation: { en: "Muhtamim (Head of Institution)", bn: "মুহতামিম (প্রতিষ্ঠান প্রধান)" }, qualification: { en: "M.A. in Arabic, Certified Islamic Scholar", bn: "এম.এ. আরবি, প্রত্যয়িত ইসলামী পণ্ডিত" }, description: { en: "Founder and Head of Madrasah, teaches Tafsir, Hadith, and Arabic grammar.", bn: "মাদ্রাসার প্রতিষ্ঠাতা ও প্রধান, তাফসীর, হাদীস এবং আরবি ব্যাকরণ পড়ান।" } },
    { id: 2, name: "Hafiz Maulana Sahabuddin Mondal", designation: { en: "President", bn: "সভাপতি" }, qualification: { en: "Mufti, Darul Uloom Graduate", bn: "মুফতি, দারুল উলূম স্নাতক" }, description: { en: "Supervises all administrative and educational activities.", bn: "সমস্ত প্রশাসনিক ও শিক্ষাগত কার্যক্রম তত্ত্বাবধান করেন।" } },
    { id: 3, name: "Maulana Mohammad Sekh", designation: { en: "Senior Teacher", bn: "সিনিয়র শিক্ষক" }, qualification: { en: "M.A. in Arabic Literature", bn: "এম.এ. আরবি সাহিত্য" }, description: { en: "Specializes in Fiqh and Balagha.", bn: "ফিকহ ও বালাগাতে বিশেষজ্ঞ।" } },
    { id: 4, name: "Maulana Joynal Sekh", designation: { en: "Teacher", bn: "শিক্ষক" }, qualification: { en: "Alim, Fazil", bn: "আলিম, ফাজিল" }, description: { en: "Teaches Arabic and Islamic Studies.", bn: "আরবি এবং ইসলামিক স্টাডিজ পড়ান।" } },
    { id: 5, name: "Hafiz Joynal Abedin", designation: { en: "Teacher", bn: "শিক্ষক" }, qualification: { en: "Hafiz-e-Qur’an", bn: "হাফিজ-ই-কুরআন" }, description: { en: "Teaches Hifz and Tajweed.", bn: "হিফজ ও তাজবীদ পড়ান।" } },
    { id: 6, name: "Maulana Rehsan Ali Saheb", designation: { en: "Teacher", bn: "শিক্ষক" }, qualification: { en: "Alim", bn: "আলিম" }, description: { en: "Teaches basic Arabic, Hadith, and Akhlaq.", bn: "মৌলিক আরবি, হাদীস এবং আখলাক পড়ান।" } },
    { id: 7, name: "Ustadh Hafiz Saiful Sheikh", designation: { en: "Qur’an Teacher", bn: "কুরআন শিক্ষক" }, qualification: { en: "Hafiz-e-Qur’an", bn: "হাফিজ-ই-কুরআন" }, description: { en: "Dedicated teacher of Hifz section, trains students in correct recitation (Tajweed) and memorization.", bn: "হিফজ বিভাগের নিবেদিত শিক্ষক, ছাত্রদের সঠিক তেলাওয়াত (তাজবীদ) এবং মুখস্থে প্রশিক্ষণ দেন।" } },
];

export const STAFF_DATA: Staff[] = [
    { id: 1, name: "Kowsar Sekh", role: { en: "Office Administrator", bn: "অফিস প্রশাসক" } },
    { id: 2, name: "Esar Ali Sekh", role: { en: "Hostel Incharge", bn: "হোস্টেল ইনচার্জ" } },
    { id: 3, name: "Joygun Laskar", role: { en: "Cook", bn: "বাবুর্চি" } },
    { id: 4, name: "Chabed Molla", role: { en: "Maintenance & Security", bn: "রক্ষণাবেক্ষণ ও নিরাপত্তা" } },
    { id: 5, name: "Monajat Laskar", role: { en: "Assistant Worker", bn: "সহকারী কর্মী" } },
    { id: 6, name: "Khoter Molla", role: { en: "Staff Member", bn: "কর্মী" } },
];

export const NOTICES_DATA: Notice[] = [
    { id: 1, text: { en: "Annual exams will commence from December 15th, 2025. All students are advised to prepare well.", bn: "বার্ষিক পরীক্ষা ১৫ই ডিসেম্বর, ২০২৫ থেকে শুরু হবে। সকল ছাত্রকে ভালোভাবে প্রস্তুতি নেওয়ার পরামর্শ দেওয়া হচ্ছে।" } },
    { id: 2, text: { en: "The Madrasah will remain closed for Eid-ul-Adha from 10th to 15th of Dhul Hijjah.", bn: "ঈদুল আযহা উপলক্ষে মাদ্রাসা যুল হিজ্জার ১০ থেকে ১৫ তারিখ পর্যন্ত বন্ধ থাকবে।" } },
    { id: 3, text: { en: "Admission for the new academic year is now open. Contact the office for more details.", bn: "নতুন শিক্ষাবর্ষের জন্য ভর্তি চলছে। আরও তথ্যের জন্য অফিসে যোগাযোগ করুন।" } },
];

export const GALLERY_DATA: GalleryImage[] = [
    { id: 1, album: { en: "Annual Function", bn: "বার্ষিক অনুষ্ঠান" }, src: "https://picsum.photos/800/600?random=1", caption: { en: "Students performing at the annual event.", bn: "বার্ষিক অনুষ্ঠানে ছাত্ররা পরিবেশন করছে।" }, date: "2025-03-20" },
    { id: 2, album: { en: "Hifz Ceremony", bn: "হিফজ অনুষ্ঠান" }, src: "https://picsum.photos/800/600?random=2", caption: { en: "Graduating Huffaz receiving their certificates.", bn: "স্নাতক হাফেজরা তাদের সনদ গ্রহণ করছে।" }, date: "2025-05-10" },
    { id: 3, album: { en: "Student Life", bn: "ছাত্র জীবন" }, src: "https://picsum.photos/800/600?random=3", caption: { en: "Students in the library.", bn: "লাইব্রেরিতে ছাত্ররা।" }, date: "2025-02-15" },
    { id: 4, album: { en: "Campus View", bn: "ক্যাম্পাসের দৃশ্য" }, src: "https://picsum.photos/800/600?random=4", caption: { en: "A serene view of the Madrasah grounds.", bn: "মাদ্রাসার মাঠের একটি নির্মল দৃশ্য।" }, date: "2025-01-01" },
    { id: 5, album: { en: "Annual Function", bn: "বার্ষিক অনুষ্ঠান" }, src: "https://picsum.photos/800/600?random=5", caption: { en: "Guest speaker addressing the audience.", bn: "অতিথি বক্তা দর্শকদের উদ্দেশে ভাষণ দিচ্ছেন।" }, date: "2025-03-20" },
    { id: 6, album: { en: "Student Life", bn: "ছাত্র জীবন" }, src: "https://picsum.photos/800/600?random=6", caption: { en: "Daily assembly.", bn: "দৈনিক সমাবেশ।" }, date: "2025-04-05" },
];

export const INITIAL_SUBJECTS: Subject[] = [
    {id: 'sub1', name: {en: "Qur'an", bn: "কুরআন"}},
    {id: 'sub2', name: {en: "Hadith", bn: "হাদিস"}},
    {id: 'sub3', name: {en: "Fiqh", bn: "ফিকহ"}},
    {id: 'sub4', name: {en: "Arabic Grammar", bn: "আরবি ব্যাকরণ"}},
    {id: 'sub5', name: {en: "English", bn: "ইংরেজি"}},
    {id: 'sub6', name: {en: "Mathematics", bn: "গণিত"}},
];

export const FALLBACK_INSPIRATION: DailyInspiration = {
    verse: {
      arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
      english: "For indeed, with hardship [will be] ease.",
      bengali: "নিশ্চয়ই কষ্টের সাথে স্বস্তি রয়েছে।",
      reference: "Qur'an 94:5"
    },
    dua: {
      arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      english: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.",
      bengali: "হে আমাদের প্রতিপালক, আমাদেরকে দুনিয়াতে কল্যাণ দান করুন এবং আখেরাতেও কল্যাণ দান করুন এবং আমাদেরকে আগুনের عذاب থেকে রক্ষা করুন।"
    }
};
