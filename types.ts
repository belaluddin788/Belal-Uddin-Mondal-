

export type Language = 'en' | 'bn';
export type UserRole = 'super-admin' | 'content-manager' | 'finance-manager' | 'teacher' | null;


export enum Page {
  Home = 'Home',
  About = 'About',
  Administration = 'Administration',
  Gallery = 'Gallery',
  CheckResult = 'CheckResult',
  Contact = 'Contact',
  Login = 'Login',
  Dashboard = 'Dashboard',
  StudentArea = 'StudentArea', // A public alias for login/dashboard
}

export interface Teacher {
  id: number;
  name: string;
  designation: { en: string; bn: string };
  qualification: { en: string; bn: string };
  description: { en: string; bn: string };
}

export interface Staff {
  id: number;
  name: string;
  role: { en: string; bn: string };
}

export interface Student {
  id: string; // Using string for UUID or similar
  name: string;
  rollNo: number;
  class: string;
  section: string;
  guardianName: string;
  admissionDate: string; // ISO format
  contact: string;
  type: 'Residential' | 'Non-Residential';
  photoUrl?: string; // URL to student's photo
}

export interface Subject {
  id: string;
  name: { en: string; bn: string };
}

export interface Result {
  id: string;
  studentId: string;
  examName: string; // e.g., "Annual Exam 2025"
  marks: { subjectId: string; score: number }[];
  teacherRemarks?: string;
  date: string; // ISO format
}

export interface Donation {
  id: string;
  donorName: string;
  amount: number;
  purpose: string;
  date: string; // ISO format
}

export interface Expense {
    id: string;
    category: { en: string; bn: string };
    description: string;
    amount: number;
    date: string;
}

export interface Income {
    id: string;
    source: { en: string; bn: string };
    description: string;
    amount: number;
    date: string;
}

export interface Notice {
  id: number;
  text: { en: string; bn: string };
}

export interface GalleryImage {
  id: number;
  album: { en: string; bn: string };
  src: string;
  caption: { en: string; bn: string };
  date: string; // ISO format
}

export interface DailyInspiration {
  verse: {
    arabic: string;
    english: string;
    bengali: string;
    reference: string;
  };
  dua: {
    arabic: string;
    english: string;
    bengali: string;
  };
}

export interface Feedback {
    id: string;
    name: string;
    email: string;
    message: string;
    date: string; // ISO format
}