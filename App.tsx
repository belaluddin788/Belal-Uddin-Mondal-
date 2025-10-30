
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Page, Language, Teacher, Staff, Student, Subject, Result, Donation, Expense, Income, Notice, GalleryImage, DailyInspiration, Feedback, UserRole } from './types';
import { LANG_STRINGS, MADRASAH_INFO, TEACHERS_DATA, STAFF_DATA, NOTICES_DATA, GALLERY_DATA, INITIAL_SUBJECTS, FALLBACK_INSPIRATION } from './constants';
import { getDailyInspiration } from './services/geminiService';
import { IconBookOpen, IconDonate, IconChartBar, IconUsers, IconPhone, IconMenu, IconX, IconDashboard, IconCalculator, IconClock, IconImage, IconMessage, IconPlus, IconPencil, IconTrash } from './components/icons';

// A custom hook for state persistence in localStorage
const usePersistentState = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
};

// --- Main App Component ---
export default function App() {
  const [language, setLanguage] = usePersistentState<Language>('language', 'en');
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [isAuthenticated, setIsAuthenticated] = usePersistentState('isAuthenticated', false);
  const [userRole, setUserRole] = usePersistentState<UserRole>('userRole', null);
  const [dailyInspiration, setDailyInspiration] = useState<DailyInspiration>(FALLBACK_INSPIRATION);
  const [loadingInspiration, setLoadingInspiration] = useState(true);
  const [visitorCount, setVisitorCount] = usePersistentState('visitorCount', Math.floor(Math.random() * (2500 - 1500 + 1)) + 1500);

  const T = LANG_STRINGS[language];

  // Data states
  const [students, setStudents] = usePersistentState<Student[]>('students', [
    { id: 'std1', name: 'Ahmed Ali', rollNo: 101, class: 'Hifz', section: 'A', guardianName: 'Mohammed Ali', admissionDate: '2024-01-10', contact: '1234567890', type: 'Residential' },
    { id: 'std2', name: 'Fatima Begum', rollNo: 102, class: 'Alim', section: 'B', guardianName: 'Hussain Begum', admissionDate: '2024-01-12', contact: '0987654321', type: 'Non-Residential' },
    { id: 'std3', name: 'Yusuf Khan', rollNo: 103, class: 'Hifz', section: 'A', guardianName: 'Ibrahim Khan', admissionDate: '2024-01-15', contact: '1122334455', type: 'Residential' },
  ]);
  const [subjects, setSubjects] = usePersistentState<Subject[]>('subjects', INITIAL_SUBJECTS);
  const [results, setResults] = usePersistentState<Result[]>('results', []);
  const [donations, setDonations] = usePersistentState<Donation[]>('donations', []);
  const [incomes, setIncomes] = usePersistentState<Income[]>('incomes', []);
  const [expenses, setExpenses] = usePersistentState<Expense[]>('expenses', []);
  const [feedback, setFeedback] = usePersistentState<Feedback[]>('feedback', []);


  useEffect(() => {
    const fetchInspiration = async () => {
      setLoadingInspiration(true);
      const inspiration = await getDailyInspiration();
      setDailyInspiration(inspiration);
      setLoadingInspiration(false);
    };
    fetchInspiration();
  }, []);

  useEffect(() => {
    // Increment visitor count on first load of a session
    if(!sessionStorage.getItem('visited')) {
        setVisitorCount(prev => prev + 1);
        sessionStorage.setItem('visited', 'true');
    }
  }, [setVisitorCount]);
  
  // Sync donations to incomes
  useEffect(() => {
    setIncomes(prevIncomes => {
        const donationIncomes = donations.map(d => ({
            id: `don-${d.id}`,
            source: { en: 'Donation', bn: 'দান' },
            description: `From ${d.donorName} for ${d.purpose}`,
            amount: d.amount,
            date: d.date,
        }));
        
        const otherIncomes = prevIncomes.filter(i => !i.id.startsWith('don-'));
        const allIncomes = [...otherIncomes, ...donationIncomes];
        
        // Sort by date descending
        return allIncomes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }, [donations, setIncomes]);


  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    navigate(Page.Home);
  };

  const protectedPages: Page[] = [Page.Dashboard];

  const renderContent = () => {
     if (!isAuthenticated && protectedPages.includes(currentPage)) {
      return <LoginPage setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} navigate={navigate} T={T} />;
    }

    switch (currentPage) {
      case Page.Home:
        return <HomePage navigate={navigate} T={T} dailyInspiration={dailyInspiration} loadingInspiration={loadingInspiration} language={language} />;
      case Page.About:
        return <AboutPage T={T} />;
      case Page.Administration:
        return <AdministrationPage T={T} language={language} />;
      case Page.Gallery:
        return <GalleryPage T={T} language={language} />;
      case Page.CheckResult:
        return <CheckResultPage T={T} students={students} results={results} subjects={subjects} language={language} />;
      case Page.Contact:
        return <ContactPage T={T} setFeedback={setFeedback} />;
      case Page.Login:
      case Page.StudentArea:
        return <LoginPage setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} navigate={navigate} T={T} />;
      case Page.Dashboard:
        return <AdminDashboard 
          T={T} 
          language={language}
          userRole={userRole}
          studentsState={[students, setStudents]}
          subjectsState={[subjects, setSubjects]}
          resultsState={[results, setResults]}
          donationsState={[donations, setDonations]}
          incomeState={[incomes, setIncomes]}
          expenseState={[expenses, setExpenses]}
          feedback={feedback}
         />;
      default:
        return <HomePage navigate={navigate} T={T} dailyInspiration={dailyInspiration} loadingInspiration={loadingInspiration} language={language} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <Header navigate={navigate} currentLanguage={language} setLanguage={setLanguage} T={T} isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      <main className="pt-20">
        {renderContent()}
      </main>
      <Footer T={T} visitorCount={visitorCount} />
    </div>
  );
}

// --- Layout Components ---

const Header: React.FC<{ navigate: (page: Page) => void; currentLanguage: Language; setLanguage: (lang: Language) => void; T: typeof LANG_STRINGS.en; isAuthenticated: boolean; handleLogout: () => void; }> = ({ navigate, currentLanguage, setLanguage, T, isAuthenticated, handleLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navItems = [
        { label: T.home, page: Page.Home },
        { label: T.about, page: Page.About },
        { label: T.administration, page: Page.Administration },
        { label: T.gallery, page: Page.Gallery },
        { label: T.checkResult, page: Page.CheckResult },
        { label: T.contact, page: Page.Contact },
    ];

    const toggleLanguage = () => setLanguage(currentLanguage === 'en' ? 'bn' : 'en');
    
    const AuthButton = () => (
      isAuthenticated ? (
        <>
            <button onClick={() => navigate(Page.Dashboard)} className="bg-yellow-500 text-green-900 font-bold py-2 px-4 rounded-full hover:bg-yellow-400 transition-colors">Dashboard</button>
            <button onClick={handleLogout} className="bg-red-600 text-white font-bold py-2 px-4 rounded-full hover:bg-red-500 transition-colors">Logout</button>
        </>
      ) : (
        <button onClick={() => navigate(Page.StudentArea)} className="bg-yellow-500 text-green-900 font-bold py-2 px-4 rounded-full hover:bg-yellow-400 transition-colors">{T.studentArea}</button>
      )
    );

    return (
        <header className="bg-green-900/95 text-white shadow-lg fixed w-full top-0 z-50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate(Page.Home)}>
                    <img src="https://i.ibb.co/6rW8zL1/logo.png" alt="Logo" className="h-12 w-12 object-contain" />
                    <h1 className="text-xl md:text-2xl font-amiri font-bold text-white tracking-wider">{MADRASAH_INFO.name[currentLanguage]}</h1>
                </div>

                <nav className="hidden lg:flex items-center space-x-4">
                    {navItems.map(item => (
                        <button key={item.page} onClick={() => navigate(item.page)} className="py-2 px-3 hover:bg-white/10 rounded-md transition-colors font-medium">{item.label}</button>
                    ))}
                    <button onClick={toggleLanguage} className="py-2 px-3 hover:bg-white/10 rounded-md transition-colors font-bold">{currentLanguage === 'en' ? 'বাংলা' : 'English'}</button>
                    <AuthButton />
                </nav>

                <div className="lg:hidden flex items-center">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
                        {isMenuOpen ? <IconX /> : <IconMenu />}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="lg:hidden bg-green-900 absolute w-full left-0">
                    <nav className="flex flex-col items-center space-y-2 p-4">
                        {navItems.map(item => (
                            <button key={item.page} onClick={() => { navigate(item.page); setIsMenuOpen(false); }} className="py-2 w-full hover:bg-white/10 rounded-md transition-colors font-medium">{item.label}</button>
                        ))}
                         <button onClick={()=>{toggleLanguage(); setIsMenuOpen(false);}} className="py-2 w-full hover:bg-white/10 rounded-md transition-colors font-bold">{currentLanguage === 'en' ? 'বাংলা' : 'English'}</button>
                        <div className='flex space-x-2 pt-2'>
                           <AuthButton />
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

const Footer: React.FC<{ T: typeof LANG_STRINGS.en; visitorCount: number }> = ({ T, visitorCount }) => (
  <footer className="bg-green-900 text-white p-8">
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
      <div>
        <h3 className="font-amiri text-2xl font-bold mb-4">{MADRASAH_INFO.name[T.home === 'Home' ? 'en' : 'bn']}</h3>
        <p className="text-gray-300">{MADRASAH_INFO.address[T.home === 'Home' ? 'en' : 'bn']}</p>
      </div>
      <div>
        <h3 className="font-amiri text-2xl font-bold mb-4">{T.contact}</h3>
        <p className="text-gray-300">
          <a href={`tel:${MADRASAH_INFO.phone}`} className="hover:text-yellow-400">Phone/WhatsApp: {MADRASAH_INFO.phone}</a>
        </p>
        <p className="text-gray-300">
          <a href={`mailto:${MADRASAH_INFO.email}`} className="hover:text-yellow-400">Email: {MADRASAH_INFO.email}</a>
        </p>
        <p className="mt-2 text-gray-400">Live Visitors: {visitorCount.toLocaleString()}</p>
      </div>
      <div className="flex flex-col items-center md:items-start">
        <h3 className="font-amiri text-2xl font-bold mb-4">WhatsApp</h3>
        <a href={MADRASAH_INFO.whatsapp} target="_blank" rel="noopener noreferrer">
          <img src={MADRASAH_INFO.qrCodeUrl} alt="WhatsApp QR Code" className="w-24 h-24 rounded-lg border-2 border-yellow-400" />
        </a>
      </div>
    </div>
    <div className="container mx-auto text-center border-t border-gray-700 mt-8 pt-4">
      <p className="text-gray-400 text-sm">&copy; {T.copyright}</p>
      <p className="text-gray-500 text-xs mt-1">{T.developerCredit}</p>
    </div>
  </footer>
);

// --- Page Components ---

const HomePage: React.FC<{ navigate: (page: Page) => void; T: any; dailyInspiration: DailyInspiration; loadingInspiration: boolean; language: Language }> = ({ navigate, T, dailyInspiration, loadingInspiration, language }) => {
    const [currentNotice, setCurrentNotice] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentNotice(prev => (prev + 1) % NOTICES_DATA.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const QuickButton: React.FC<{ icon: React.ReactNode, label: string, page: Page }> = ({ icon, label, page }) => (
        <button onClick={() => navigate(page)} className="flex flex-col items-center justify-center space-y-2 bg-white p-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300 group">
            <div className="bg-green-100 text-green-800 rounded-full p-3 group-hover:bg-yellow-400 group-hover:text-green-900 transition-colors">
                {icon}
            </div>
            <span className="font-semibold text-gray-700">{label}</span>
        </button>
    );

    const InspirationCard: React.FC<{ title: string; arabic: string; translation: string; reference?: string; loading: boolean }> = ({ title, arabic, translation, reference, loading }) => (
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 h-full flex flex-col">
        <h3 className="text-2xl font-amiri font-bold text-green-900 mb-4">{title}</h3>
        {loading ? (
            <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
        ) : (
            <>
              <p className="text-2xl text-right font-amiri text-gray-800 leading-relaxed" dir="rtl">{arabic}</p>
              <p className="mt-4 text-gray-600 italic">{translation}</p>
              {reference && <p className="mt-2 text-sm text-green-700 font-semibold">{reference}</p>}
            </>
        )}
      </div>
    );
    
    return (
        <div>
            {/* Hero Section */}
            <section className="bg-cover bg-center h-[60vh] flex items-center justify-center text-white" style={{ backgroundImage: "linear-gradient(rgba(26, 77, 46, 0.7), rgba(26, 77, 46, 0.7)), url('https://picsum.photos/1600/900?random=0')" }}>
                <div className="text-center">
                    <h1 className="text-5xl md:text-7xl font-amiri font-bold drop-shadow-lg">{MADRASAH_INFO.name[language]}</h1>
                    <p className="text-xl md:text-2xl mt-4 max-w-2xl mx-auto">{T.welcomeMessage}</p>
                </div>
            </section>
            
            {/* Quick Links & Notice */}
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-12">
                        <QuickButton icon={<IconBookOpen />} label={T.studentArea} page={Page.StudentArea} />
                        <QuickButton icon={<IconDonate />} label={T.donate} page={Page.Contact} />
                        <QuickButton icon={<IconChartBar />} label={T.results} page={Page.CheckResult} />
                        <QuickButton icon={<IconUsers />} label={T.teachers} page={Page.Administration} />
                        <QuickButton icon={<IconPhone />} label={T.contact} page={Page.Contact} />
                    </div>
                    <div className="bg-green-800 text-white p-4 rounded-lg shadow-md flex items-center space-x-4">
                        <span className="font-bold bg-yellow-400 text-green-900 px-3 py-1 rounded">{T.noticeBoard}</span>
                        <p className="flex-grow">{NOTICES_DATA[currentNotice].text[language]}</p>
                    </div>
                </div>
            </section>

            {/* Daily Inspiration */}
            <section className="py-16" style={{backgroundImage: "url('/islamic-pattern.svg')", backgroundRepeat: 'repeat', backgroundSize: '400px'}}>
                 <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InspirationCard title={T.verseOfTheDay} arabic={dailyInspiration.verse.arabic} translation={dailyInspiration.verse[language]} reference={dailyInspiration.verse.reference} loading={loadingInspiration} />
                    <InspirationCard title={T.duaOfTheDay} arabic={dailyInspiration.dua.arabic} translation={dailyInspiration.dua[language]} loading={loadingInspiration} />
                </div>
            </section>
        </div>
    );
};

const AboutPage: React.FC<{ T: any }> = ({ T }) => (
    <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-amiri font-bold text-center text-green-900 mb-12">{T.aboutTitle}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">{T.aboutDesc}</p>
                <h3 className="text-2xl font-amiri font-bold text-green-800 mb-4">{T.missionVision}</h3>
                <p className="text-gray-700 leading-relaxed">{T.missionVisionDesc}</p>
            </div>
            <div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-8">
                    <div className="bg-green-100 p-6 rounded-lg">
                        <p className="text-4xl font-bold text-green-800">35</p>
                        <p className="text-gray-600">{T.residentialStudents}</p>
                    </div>
                    <div className="bg-green-100 p-6 rounded-lg">
                        <p className="text-4xl font-bold text-green-800">20</p>
                        <p className="text-gray-600">{T.nonResidentialStudents}</p>
                    </div>
                     <div className="bg-green-100 p-6 rounded-lg">
                        <p className="text-4xl font-bold text-green-800">12</p>
                        <p className="text-gray-600">{T.staffMembers}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                    <a href={MADRASAH_INFO.whatsapp} target="_blank" rel="noopener noreferrer">
                        <img src={MADRASAH_INFO.qrCodeUrl} alt="Contact and Donation QR" className="w-48 h-48 rounded-lg border-4 border-yellow-400 mb-4"/>
                    </a>
                    <p className="text-center font-semibold text-gray-700">{T.scanToContact}</p>
                </div>
            </div>
        </div>
    </div>
);

const AdministrationPage: React.FC<{ T: any, language: Language }> = ({ T, language }) => (
    <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-amiri font-bold text-center text-green-900 mb-12">{T.teachersAndStaff}</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg mb-12">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-green-100">
                        <tr>
                            <th className="p-4 font-semibold">{T.name}</th>
                            <th className="p-4 font-semibold">{T.designation}</th>
                            <th className="p-4 font-semibold">{T.qualification}</th>
                            <th className="p-4 font-semibold">{T.description}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {TEACHERS_DATA.map(teacher => (
                            <tr key={teacher.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium">{teacher.name}</td>
                                <td className="p-4">{teacher.designation[language]}</td>
                                <td className="p-4">{teacher.qualification[language]}</td>
                                <td className="p-4 text-sm text-gray-600">{teacher.description[language]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <h3 className="text-3xl font-amiri font-bold text-center text-green-900 mb-8">{T.staff}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {STAFF_DATA.map(staff => (
                <div key={staff.id} className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <p className="text-xl font-bold text-green-800">{staff.name}</p>
                    <p className="text-gray-600">{staff.role[language]}</p>
                </div>
            ))}
        </div>
    </div>
);

const GalleryPage: React.FC<{ T: any, language: Language }> = ({ T, language }) => {
    const albums = useMemo(() => [...new Set(GALLERY_DATA.map(img => img.album[language]))], [language]);
    const [selectedAlbum, setSelectedAlbum] = useState<string>(albums[0]);

    const filteredImages = GALLERY_DATA.filter(img => img.album[language] === selectedAlbum);

    return (
        <div className="container mx-auto px-4 py-16">
            <h2 className="text-4xl font-amiri font-bold text-center text-green-900 mb-12">{T.gallery}</h2>
            <div className="flex justify-center flex-wrap gap-2 mb-8">
                {albums.map(album => (
                    <button 
                        key={album} 
                        onClick={() => setSelectedAlbum(album)}
                        className={`px-4 py-2 rounded-full font-semibold transition-colors ${selectedAlbum === album ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        {album}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredImages.map(image => (
                    <div key={image.id} className="group relative overflow-hidden rounded-lg shadow-lg">
                        <img src={image.src} alt={image.caption[language]} loading="lazy" className="w-full h-72 object-cover transform group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
                            <p className="text-white font-bold">{image.caption[language]}</p>
                            <p className="text-gray-300 text-sm">{new Date(image.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CheckResultPage: React.FC<{ T: any; students: Student[]; results: Result[]; subjects: Subject[]; language: Language; }> = ({ T, students, results, subjects, language }) => {
    const [roll, setRoll] = useState('');
    const [foundResult, setFoundResult] = useState<any | null>(null);

    const handleSearch = () => {
        const student = students.find(s => s.rollNo.toString() === roll);
        if(student) {
            const result = results.find(r => r.studentId === student.id);
            if(result) {
                const totalMarks = result.marks.reduce((acc, m) => acc + m.score, 0);
                const totalSubjects = result.marks.length;
                const percentage = totalSubjects > 0 ? (totalMarks / (totalSubjects * 100)) * 100 : 0;
                
                let grade = 'F';
                if (percentage >= 90) grade = 'A+';
                else if (percentage >= 80) grade = 'A';
                else if (percentage >= 70) grade = 'B';
                else if (percentage >= 60) grade = 'C';
                else if (percentage >= 50) grade = 'D';

                setFoundResult({
                    student,
                    result,
                    totalMarks,
                    percentage: percentage.toFixed(2),
                    grade
                });
            } else {
                setFoundResult('no-result');
            }
        } else {
            setFoundResult('no-student');
        }
    };

    return <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-amiri font-bold text-center text-green-900 mb-8">{T.findYourResult}</h2>
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
            <div className="flex space-x-2">
                <input type="number" value={roll} onChange={e => setRoll(e.target.value)} placeholder={T.enterRoll} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"/>
                <button onClick={handleSearch} className="bg-green-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">{T.search}</button>
            </div>
            {foundResult && (
                <div className="mt-8 border-t pt-6">
                    {foundResult === 'no-student' && <p className="text-red-600">Student with this roll number not found.</p>}
                    {foundResult === 'no-result' && <p className="text-yellow-600">Result not yet published for this student.</p>}
                    {typeof foundResult === 'object' && (
                        <div className="p-4 border rounded-lg bg-gray-50">
                            <h3 className="text-2xl font-bold">{foundResult.student.name}</h3>
                            <p>Roll: {foundResult.student.rollNo}, Class: {foundResult.student.class}</p>
                            <table className="w-full mt-4 text-left">
                                <thead className="bg-gray-200">
                                    <tr><th className="p-2">Subject</th><th className="p-2">Marks</th></tr>
                                </thead>
                                <tbody>
                                    {foundResult.result.marks.map((m: any) => (
                                        <tr key={m.subjectId} className="border-b">
                                            <td className="p-2">{subjects.find(s => s.id === m.subjectId)?.name[language]}</td>
                                            <td className="p-2">{m.score}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-4 font-bold text-lg">
                                <p>Total: {foundResult.totalMarks}</p>
                                <p>Percentage: {foundResult.percentage}%</p>
                                <p>Grade: {foundResult.grade}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>;
};

const ContactPage: React.FC<{ T: any; setFeedback: React.Dispatch<React.SetStateAction<Feedback[]>> }> = ({ T, setFeedback }) => {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newFeedback: Feedback = {
            id: new Date().toISOString(),
            ...form,
            date: new Date().toISOString()
        };
        setFeedback(prev => [newFeedback, ...prev]);
        setForm({ name: '', email: '', message: '' });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-amiri font-bold text-center text-green-900 mb-8">{T.leaveMessage}</h2>
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        {submitted ? <p className="text-center text-green-600 font-bold">Thank you for your message!</p> : (
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder={T.yourName} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"/>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder={T.yourEmail} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"/>
                <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder={T.yourMessage} rows={5} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
                <button type="submit" className="w-full bg-green-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">{T.sendMessage}</button>
            </form>
        )}
        </div>
    </div>;
};

const LoginPage: React.FC<{ setIsAuthenticated: (val: boolean) => void; setUserRole: (role: UserRole) => void; navigate: (page: Page) => void; T: any; }> = ({ setIsAuthenticated, setUserRole, navigate, T }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        let role: UserRole = null;
        if (username === 'superadmin' && password === 'super123') role = 'super-admin';
        else if (username === 'content' && password === 'content123') role = 'content-manager';
        else if (username === 'finance' && password === 'finance123') role = 'finance-manager';
        else if (username === 'teacher' && password === 'teacher123') role = 'teacher';
        
        if (role) {
            setIsAuthenticated(true);
            setUserRole(role);
            navigate(Page.Dashboard);
        } else {
            setError('Invalid credentials');
        }
    }
    
    return <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-amiri font-bold text-center text-green-900 mb-6">{T.studentArea}</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-4">
                <input value={username} onChange={e => setUsername(e.target.value)} type="text" placeholder="Username (e.g. superadmin, content)" className="w-full px-4 py-2 border rounded-lg"/>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password (e.g. super123)" className="w-full px-4 py-2 border rounded-lg"/>
                <button type="submit" className="w-full bg-green-800 text-white py-2 rounded-lg font-semibold hover:bg-green-700">Login</button>
            </form>
        </div>
    </div>;
};


// --- Admin Dashboard Components ---

const DonationManagement: React.FC<{
  donations: Donation[];
  setDonations: React.Dispatch<React.SetStateAction<Donation[]>>;
}> = ({ donations, setDonations }) => {
  const [newDonation, setNewDonation] = useState({ donorName: '', amount: '', purpose: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDonation(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDonation.donorName || !newDonation.amount) {
      alert("Please fill in donor name and amount.");
      return;
    }
    const donationToAdd: Donation = {
      id: new Date().toISOString(),
      donorName: newDonation.donorName,
      amount: parseFloat(newDonation.amount),
      purpose: newDonation.purpose || 'General',
      date: new Date().toISOString(),
    };
    setDonations(prev => [donationToAdd, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setNewDonation({ donorName: '', amount: '', purpose: '' });
  };
  
  const totalDonations = useMemo(() => donations.reduce((sum, d) => sum + d.amount, 0), [donations]);
  
  const totalThisMonth = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return donations
      .filter(d => {
        const donationDate = new Date(d.date);
        return donationDate.getMonth() === currentMonth && donationDate.getFullYear() === currentYear;
      })
      .reduce((sum, d) => sum + d.amount, 0);
  }, [donations]);


  return (
    <div>
      <h3 className="text-2xl font-bold text-green-900 mb-6">Donation Management</h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-sm text-green-700 font-semibold">Total Collected This Month</p>
          <p className="text-3xl font-bold text-green-900">₹{totalThisMonth.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <p className="text-sm text-yellow-700 font-semibold">Total Donations (All Time)</p>
          <p className="text-3xl font-bold text-yellow-900">₹{totalDonations.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Add Donation Form */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8 border">
        <h4 className="text-xl font-semibold mb-4">Record a New Donation</h4>
        <form onSubmit={handleAddDonation} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1">
            <label htmlFor="donorName" className="block text-sm font-medium text-gray-700">Donor Name</label>
            <input type="text" name="donorName" id="donorName" value={newDonation.donorName} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" required />
          </div>
          <div className="md:col-span-1">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (₹)</label>
            <input type="number" name="amount" id="amount" value={newDonation.amount} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" required />
          </div>
          <div className="md:col-span-1">
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">Purpose (Optional)</label>
            <input type="text" name="purpose" id="purpose" value={newDonation.purpose} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" placeholder="e.g., Building Fund" />
          </div>
          <button type="submit" className="md:col-span-1 bg-green-800 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors h-fit">Add Donation</button>
        </form>
      </div>

      {/* Donations Table */}
      <h4 className="text-xl font-semibold mb-4">Donation History</h4>
      <div className="overflow-x-auto bg-white rounded-lg shadow max-h-96 overflow-y-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Donor Name</th>
              <th className="p-4 font-semibold">Amount</th>
              <th className="p-4 font-semibold">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {donations.length > 0 ? donations.map(donation => (
              <tr key={donation.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{new Date(donation.date).toLocaleDateString()}</td>
                <td className="p-4 font-medium">{donation.donorName}</td>
                <td className="p-4">₹{donation.amount.toLocaleString('en-IN')}</td>
                <td className="p-4 text-sm text-gray-600">{donation.purpose}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">No donations recorded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AccountsTracker: React.FC<{
    incomes: Income[];
    setIncomes: React.Dispatch<React.SetStateAction<Income[]>>;
    expenses: Expense[];
    setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
    language: Language;
}> = ({ incomes, setIncomes, expenses, setExpenses, language }) => {
    const [newIncome, setNewIncome] = useState({ source: '', description: '', amount: '' });
    const [newExpense, setNewExpense] = useState({ category: '', description: '', amount: '' });

    const handleAddIncome = (e: React.FormEvent) => {
        e.preventDefault();
        const incomeToAdd: Income = {
            id: new Date().toISOString(),
            source: { en: newIncome.source, bn: newIncome.source },
            description: newIncome.description,
            amount: parseFloat(newIncome.amount),
            date: new Date().toISOString()
        };
        setIncomes(prev => [...prev, incomeToAdd].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setNewIncome({ source: '', description: '', amount: '' });
    };

    const handleAddExpense = (e: React.FormEvent) => {
        e.preventDefault();
        const expenseToAdd: Expense = {
            id: new Date().toISOString(),
            category: { en: newExpense.category, bn: newExpense.category },
            description: newExpense.description,
            amount: parseFloat(newExpense.amount),
            date: new Date().toISOString()
        };
        setExpenses(prev => [...prev, expenseToAdd].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setNewExpense({ category: '', description: '', amount: '' });
    };

    const totalIncome = useMemo(() => incomes.reduce((sum, i) => sum + i.amount, 0), [incomes]);
    const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
    const balance = totalIncome - totalExpenses;

    return (
        <div>
            <h3 className="text-2xl font-bold text-green-900 mb-6">Accounts & Expense Tracker</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-green-100 p-4 rounded-lg">
                    <p className="text-sm text-green-700 font-semibold">Total Income</p>
                    <p className="text-3xl font-bold text-green-900">₹{totalIncome.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg">
                    <p className="text-sm text-red-700 font-semibold">Total Expenses</p>
                    <p className="text-3xl font-bold text-red-900">₹{totalExpenses.toLocaleString('en-IN')}</p>
                </div>
                 <div className="bg-blue-100 p-4 rounded-lg">
                    <p className="text-sm text-blue-700 font-semibold">Current Balance</p>
                    <p className={`text-3xl font-bold ${balance >= 0 ? 'text-blue-900' : 'text-red-900'}`}>₹{balance.toLocaleString('en-IN')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Income Section */}
                <div>
                    <h4 className="text-xl font-semibold mb-4 text-green-800">Income Management</h4>
                    <form onSubmit={handleAddIncome} className="bg-gray-50 p-4 rounded-lg border mb-4 space-y-3">
                        <input value={newIncome.source} onChange={e => setNewIncome({...newIncome, source: e.target.value})} placeholder="Source (e.g., Fees, Rent)" className="w-full p-2 border rounded" required />
                        <input value={newIncome.description} onChange={e => setNewIncome({...newIncome, description: e.target.value})} placeholder="Description" className="w-full p-2 border rounded" required />
                        <input value={newIncome.amount} onChange={e => setNewIncome({...newIncome, amount: e.target.value})} type="number" placeholder="Amount" className="w-full p-2 border rounded" required />
                        <button type="submit" className="w-full bg-green-700 text-white p-2 rounded font-semibold">Add Income</button>
                    </form>
                    <div className="max-h-80 overflow-y-auto bg-white rounded-lg shadow">
                         <table className="w-full text-left">
                            <thead className="bg-gray-100 sticky top-0"><tr className="border-b"><th className="p-2">Date</th><th className="p-2">Source</th><th className="p-2">Amount</th></tr></thead>
                            <tbody>{incomes.map(i => <tr key={i.id} className="border-b"><td className="p-2">{new Date(i.date).toLocaleDateString()}</td><td className="p-2">{i.source[language]}<p className="text-xs text-gray-500">{i.description}</p></td><td className="p-2">₹{i.amount.toLocaleString()}</td></tr>)}</tbody>
                        </table>
                    </div>
                </div>

                {/* Expense Section */}
                <div>
                    <h4 className="text-xl font-semibold mb-4 text-red-800">Expense Management</h4>
                     <form onSubmit={handleAddExpense} className="bg-gray-50 p-4 rounded-lg border mb-4 space-y-3">
                        <input value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})} placeholder="Category (e.g., Salary, Food)" className="w-full p-2 border rounded" required />
                        <input value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} placeholder="Description" className="w-full p-2 border rounded" required />
                        <input value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} type="number" placeholder="Amount" className="w-full p-2 border rounded" required />
                        <button type="submit" className="w-full bg-red-700 text-white p-2 rounded font-semibold">Add Expense</button>
                    </form>
                    <div className="max-h-80 overflow-y-auto bg-white rounded-lg shadow">
                        <table className="w-full text-left">
                            <thead className="bg-gray-100 sticky top-0"><tr className="border-b"><th className="p-2">Date</th><th className="p-2">Category</th><th className="p-2">Amount</th></tr></thead>
                            <tbody>{expenses.map(e => <tr key={e.id} className="border-b"><td className="p-2">{new Date(e.date).toLocaleDateString()}</td><td className="p-2">{e.category[language]}<p className="text-xs text-gray-500">{e.description}</p></td><td className="p-2">₹{e.amount.toLocaleString()}</td></tr>)}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ResultManagement: React.FC<{
  results: Result[];
  setResults: React.Dispatch<React.SetStateAction<Result[]>>;
  students: Student[];
  subjects: Subject[];
  language: Language;
}> = ({ results, setResults, students, subjects, language }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<Result | null>(null);

  const initialFormState = {
    studentId: '',
    examName: '',
    marks: [{ subjectId: '', score: '' }],
    teacherRemarks: '',
  };
  const [formData, setFormData] = useState(initialFormState);

  const handleOpenModal = (result: Result | null = null) => {
    if (result) {
      setEditingResult(result);
      setFormData({
        studentId: result.studentId,
        examName: result.examName,
        marks: result.marks.map(m => ({ ...m, score: String(m.score) })),
        teacherRemarks: result.teacherRemarks || '',
      });
    } else {
      setEditingResult(null);
      // Ensure there's at least one student and one subject to avoid empty dropdowns
      setFormData({
          ...initialFormState,
          studentId: students.length > 0 ? students[0].id : '',
          marks: [{ subjectId: subjects.length > 0 ? subjects[0].id : '', score: '' }],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMarksChange = (index: number, field: 'subjectId' | 'score', value: string) => {
    const newMarks = [...formData.marks];
    newMarks[index] = { ...newMarks[index], [field]: value };
    setFormData(prev => ({ ...prev, marks: newMarks }));
  };

  const addMarkField = () => {
    setFormData(prev => ({ ...prev, marks: [...prev.marks, { subjectId: subjects.length > 0 ? subjects[0].id : '', score: '' }] }));
  };

  const removeMarkField = (index: number) => {
    setFormData(prev => ({ ...prev, marks: prev.marks.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.examName || formData.marks.length === 0) {
      alert('Please fill all required fields.');
      return;
    }

    const resultData: Omit<Result, 'id' | 'date'> & { id?: string; date: string } = {
      studentId: formData.studentId,
      examName: formData.examName,
      teacherRemarks: formData.teacherRemarks,
      marks: formData.marks
        .filter(m => m.subjectId && m.score !== '')
        .map(m => ({ subjectId: m.subjectId, score: Number(m.score) })),
      date: new Date().toISOString(),
    };

    if (editingResult) {
      setResults(results.map(r => r.id === editingResult.id ? { ...editingResult, ...resultData } : r));
    } else {
      const newResult: Result = { ...resultData, id: new Date().toISOString() };
      setResults([newResult, ...results]);
    }
    handleCloseModal();
  };

  const handleDelete = (resultId: string) => {
    if (window.confirm('Are you sure you want to delete this result record?')) {
      setResults(results.filter(r => r.id !== resultId));
    }
  };

  const getStudentInfo = useCallback((studentId: string) => students.find(s => s.id === studentId), [students]);

  const calculateResultSummary = useCallback((marks: { subjectId: string; score: number }[]) => {
    const totalMarks = marks.reduce((acc, m) => acc + m.score, 0);
    const percentage = marks.length > 0 ? (totalMarks / (marks.length * 100)) * 100 : 0;
    let grade = 'F';
    if (percentage >= 90) grade = 'A+'; else if (percentage >= 80) grade = 'A'; else if (percentage >= 70) grade = 'B';
    return { percentage: percentage.toFixed(2), grade };
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-green-900">Result Management</h3>
        <button onClick={() => handleOpenModal()} className="flex items-center space-x-2 bg-green-800 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
          <IconPlus className="w-5 h-5" /><span>Add New Result</span>
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow max-h-[60vh] overflow-y-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="p-4 font-semibold">Student Name</th><th className="p-4 font-semibold">Roll</th>
              <th className="p-4 font-semibold">Exam Name</th><th className="p-4 font-semibold">Grade</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map(result => {
              const student = getStudentInfo(result.studentId);
              const summary = calculateResultSummary(result.marks);
              return (
                <tr key={result.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{student?.name || 'N/A'}</td>
                  <td className="p-4">{student?.rollNo || 'N/A'}</td>
                  <td className="p-4">{result.examName}</td>
                  <td className="p-4">{summary.grade} ({summary.percentage}%)</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button onClick={() => handleOpenModal(result)} className="text-blue-600 hover:text-blue-800"><IconPencil className="w-5 h-5" /></button>
                      <button onClick={() => handleDelete(result.id)} className="text-red-600 hover:text-red-800"><IconTrash className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-full overflow-y-auto">
            <h4 className="text-xl font-semibold mb-4">{editingResult ? 'Edit Result' : 'Add New Result'}</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label>Student</label>
                  <select name="studentId" value={formData.studentId} onChange={handleInputChange} disabled={!!editingResult} required className="w-full mt-1 p-2 border rounded-md">
                    {students.map(s => <option key={s.id} value={s.id}>{s.name} (Roll: {s.rollNo})</option>)}
                  </select>
                </div>
                <div>
                  <label>Exam Name</label>
                  <input name="examName" value={formData.examName} onChange={handleInputChange} required className="w-full mt-1 p-2 border rounded-md" />
                </div>
              </div>
              <hr/>
              <div>
                <h5 className="font-semibold mb-2">Marks</h5>
                {formData.marks.map((mark, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <select value={mark.subjectId} onChange={(e) => handleMarksChange(index, 'subjectId', e.target.value)} className="w-full p-2 border rounded-md">
                      {subjects.map(s => <option key={s.id} value={s.id}>{s.name[language]}</option>)}
                    </select>
                    <input type="number" placeholder="Score" value={mark.score} onChange={(e) => handleMarksChange(index, 'score', e.target.value)} required max="100" min="0" className="w-32 p-2 border rounded-md" />
                    <button type="button" onClick={() => removeMarkField(index)} className="text-red-500"><IconTrash className="w-5 h-5" /></button>
                  </div>
                ))}
                <button type="button" onClick={addMarkField} className="text-sm text-green-700 font-semibold">+ Add Subject</button>
              </div>
              <hr/>
              <div>
                <label>Teacher Remarks (Optional)</label>
                <textarea name="teacherRemarks" value={formData.teacherRemarks} onChange={handleInputChange} rows={3} className="w-full mt-1 p-2 border rounded-md"></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-green-800 text-white rounded-md font-semibold">Save Result</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};


const AdminDashboard: React.FC<{ T: any; language: Language; userRole: UserRole; [key: string]: any;}> = ({ T, language, userRole, studentsState, subjectsState, resultsState, donationsState, incomeState, expenseState, feedback }) => {
    
    const allTabs = useMemo(() => [
        { id: 'dashboard', label: 'Dashboard', icon: IconDashboard },
        { id: 'students', label: 'Students', icon: IconUsers },
        { id: 'results', label: 'Results', icon: IconChartBar },
        { id: 'donations', label: 'Donations', icon: IconDonate },
        { id: 'accounts', label: 'Accounts', icon: IconCalculator },
        { id: 'routine', label: 'Class Routine', icon: IconClock },
        { id: 'gallery', label: 'Gallery', icon: IconImage },
        { id: 'feedback', label: 'Feedback', icon: IconMessage },
    ], []);

    const PERMISSIONS: Record<NonNullable<UserRole>, string[]> = {
        'super-admin': ['dashboard', 'students', 'results', 'donations', 'accounts', 'routine', 'gallery', 'feedback'],
        'content-manager': ['dashboard', 'routine', 'gallery', 'feedback'],
        'finance-manager': ['dashboard', 'donations', 'accounts'],
        'teacher': ['dashboard', 'students', 'results'],
    };

    const accessibleTabs = useMemo(() => {
        if (!userRole) return [];
        const allowed = PERMISSIONS[userRole] || [];
        return allTabs.filter(tab => allowed.includes(tab.id));
    }, [userRole, allTabs]);

    const [activeTab, setActiveTab] = useState(accessibleTabs.length > 0 ? accessibleTabs[0].id : '');
    
    useEffect(() => {
      if (!accessibleTabs.find(t => t.id === activeTab)) {
        setActiveTab(accessibleTabs.length > 0 ? accessibleTabs[0].id : '');
      }
    }, [accessibleTabs, activeTab]);

    const PlaceholderContent: React.FC<{ title: string }> = ({ title }) => (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 min-h-[50vh]">
            <h3 className="text-2xl font-semibold mb-2">{title}</h3>
            <p>This feature is under construction. Please check back later.</p>
        </div>
    );
    
    const AccessDenied: React.FC = () => (
      <div className="flex flex-col items-center justify-center h-full text-center text-red-500 min-h-[50vh]">
          <h3 className="text-2xl font-semibold mb-2">Access Denied</h3>
          <p>You do not have permission to view this section.</p>
      </div>
    );

    const ViewFeedback: React.FC<{ feedback: Feedback[] }> = ({ feedback }) => (
      <div>
        <h3 className="text-2xl font-bold text-green-900 mb-6">User Feedback</h3>
        {feedback.length > 0 ? (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
            {feedback.map(f => (
              <div key={f.id} className="bg-gray-50 border p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold">{f.name} <span className="text-gray-500 font-normal">&lt;{f.email}&gt;</span></p>
                  <p className="text-sm text-gray-500">{new Date(f.date).toLocaleString()}</p>
                </div>
                <p className="text-gray-700">{f.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No feedback messages received yet.</p>
        )}
      </div>
    );

    const renderTabContent = () => {
        if (!userRole || !PERMISSIONS[userRole].includes(activeTab)) {
            return <AccessDenied />;
        }

        switch(activeTab) {
            case 'students': return <PlaceholderContent title="Student Management" />;
            case 'results': return <ResultManagement results={resultsState[0]} setResults={resultsState[1]} students={studentsState[0]} subjects={subjectsState[0]} language={language} />;
            case 'donations': return <DonationManagement donations={donationsState[0]} setDonations={donationsState[1]} />;
            case 'accounts': return <AccountsTracker incomes={incomeState[0]} setIncomes={incomeState[1]} expenses={expenseState[0]} setExpenses={expenseState[1]} language={language} />;
            case 'routine': return <PlaceholderContent title="Class Routine Management" />;
            case 'gallery': return <PlaceholderContent title="Gallery Management" />;
            case 'feedback': return <ViewFeedback feedback={feedback} />;
            case 'dashboard':
            default:
              const roleName = userRole.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
              return (
                <div>
                    <h3 className="text-2xl font-bold text-green-900 mb-4">Welcome, {roleName}!</h3>
                    <p className="text-gray-700">Select a section from the menu on the left to manage your assigned modules. You have access to {accessibleTabs.length - 1} specific management areas.</p>
                </div>
              );
        }
    };

    const activeTabLabel = allTabs.find(tab => tab.id === activeTab)?.label || 'Dashboard';
    
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-xl min-h-[80vh]">
                <aside className="w-full md:w-64 bg-gray-50 border-r border-gray-200">
                    <div className="p-4">
                        <h3 className="font-bold text-xl text-green-900 mb-5">Admin Menu</h3>
                        <nav>
                            <ul>
                                {accessibleTabs.map(tab => (
                                    <li key={tab.id} className="mb-1">
                                        <button 
                                            onClick={() => setActiveTab(tab.id)} 
                                            className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-200 ${activeTab === tab.id 
                                                ? 'bg-green-800 text-white shadow-sm' 
                                                : 'text-gray-600 hover:bg-green-100 hover:text-green-800'}`
                                            }
                                        >
                                            <tab.icon className="w-5 h-5 flex-shrink-0" />
                                            <span className="font-semibold">{tab.label}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </aside>
                <main className="flex-1 p-6 md:p-10">
                    <header className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">{activeTabLabel}</h2>
                    </header>
                    <div className="min-h-[60vh]">
                       {renderTabContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};