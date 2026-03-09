import React, { useState, useEffect, useRef } from 'react';
import { 
  Plane, 
  FileText, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight, 
  Globe, 
  ShieldCheck, 
  HelpCircle,
  Menu,
  X,
  Sparkles,
  Send,
  Loader2,
  ChevronRight,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';
import { getVisaAdvice } from './services/gemini';

// --- Types ---
interface NavItem {
  label: string;
  href: string;
}

interface VisaType {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  requirements: string[];
  icon: React.ReactNode;
}

// --- Constants ---
const NAV_ITEMS: NavItem[] = [
  { label: 'Pathways', href: '#visas' },
  { label: 'Success Stories', href: '#stories' },
  { label: 'Relocation Guide', href: '#guide' },
  { label: 'AI Advisor', href: '#advisor' },
];

const VISA_TYPES: VisaType[] = [
  {
    id: 'f1',
    title: 'F-1 Student Visa',
    description: 'For Kenyans planning to study at an accredited US college or university.',
    longDescription: 'The F-1 Student Visa is the most common path for Kenyans seeking higher education in the US. It allows you to enter the United States as a full-time student at an accredited college, university, seminary, conservatory, academic high school, elementary school, or other academic institution or in a language training program.',
    requirements: [
      'Acceptance at an SEVP-approved school',
      'Form I-20 issued by the school',
      'Proof of financial support for the duration of studies',
      'Intent to return home after completion',
      'English language proficiency'
    ],
    icon: <Globe className="w-6 h-6 text-brand-red" />,
  },
  {
    id: 'b1',
    title: 'B1/B2 Visitor',
    description: 'For business or pleasure trips, including visiting family or medical treatment.',
    longDescription: 'The B-1/B-2 visitor visa is for people traveling to the United States temporarily for business (B-1) or for pleasure or medical treatment (B-2). B-1 visas are for consulting with business associates, attending scientific, educational, professional, or business conventions/conferences, settling an estate, or negotiating a contract.',
    requirements: [
      'Proof of purpose of the trip',
      'Intent to depart the US after a specific period',
      'Evidence of funds to cover expenses',
      'Strong social and economic ties to Kenya',
      'Valid passport and DS-160 confirmation'
    ],
    icon: <ShieldCheck className="w-6 h-6 text-brand-red" />,
  },
  {
    id: 'dv',
    title: 'DV Lottery',
    description: 'The Diversity Visa program for those selected in the annual lottery.',
    longDescription: 'The Diversity Immigrant Visa Program (DV Program) makes up to 50,000 immigrant visas available annually, drawn from random selection among all entries to individuals who are from countries with low rates of immigration to the United States.',
    requirements: [
      'High school education or equivalent',
      'Two years of work experience in a qualifying occupation',
      'Selection in the random drawing',
      'Medical examination and background check',
      'Successful consular interview'
    ],
    icon: <Sparkles className="w-6 h-6 text-brand-red" />,
  },
  {
    id: 'h1b',
    title: 'H-1B Work Visa',
    description: 'For specialty occupations requiring theoretical or technical expertise.',
    longDescription: 'The H-1B is a non-immigrant visa that allows US employers to temporarily employ foreign workers in specialty occupations that require theoretical or technical expertise in specialized fields such as IT, finance, accounting, architecture, engineering, mathematics, science, medicine, etc.',
    requirements: [
      'Job offer from a US employer',
      'Bachelor\'s degree or equivalent in the specialty field',
      'Employer must file a Labor Condition Application (LCA)',
      'Employer must file Form I-129',
      'Subject to annual numerical caps (lottery)'
    ],
    icon: <FileText className="w-6 h-6 text-brand-red" />,
  },
];

const CHECKLIST_ITEMS = [
  "Valid Passport (at least 6 months validity)",
  "DS-160 Confirmation Page",
  "Visa Interview Appointment Letter",
  "SEVIS Fee Receipt (for students)",
  "Proof of Financial Support",
  "Passport-sized Photographs",
  "Academic/Professional Certificates",
];

const SUCCESS_STORIES = [
  {
    title: "From Nairobi to a Tech Career in California",
    name: "Brian",
    path: "Nairobi to Colorado",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&auto=format&fit=crop",
    content: "Brian grew up in Nairobi and always dreamed of working in technology. After finishing his degree in Kenya, he applied to a master’s program in computer science in the United States. He secured a student visa and moved to California. During his studies, he gained experience through internships and eventually received a full-time job offer from a technology company. Today, Brian works as a software engineer and regularly mentors Kenyan students who want to follow the same path."
  },
  {
    title: "A Nurse’s Journey from Nakuru to Texas",
    name: "Faith",
    path: "Nakuru to Texas",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=400&h=400&auto=format&fit=crop",
    content: "Faith was a nurse working in Nakuru but wanted better career opportunities and training. She joined a U.S. healthcare recruitment program that helps international nurses relocate. After completing the licensing exams and immigration process, she moved to Texas and started working in a hospital. Faith now earns a higher income and has been able to support her family and sponsor her younger sister’s university education."
  },
  {
    title: "From Kisumu Student to Business Owner in America",
    name: "Kevin",
    path: "Kisumu to California",
    image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=400&h=400&auto=format&fit=crop",
    content: "Kevin from Kisumu moved to the United States on a student visa to study business administration. While studying, he started a small online store selling African products to diaspora communities. The idea grew quickly, and after graduating he expanded the business into a full online brand. Today, his his company ships African goods across several states and sources many products directly from Kenya."
  },
  {
    title: "Scholarship to Engineering Success",
    name: "Aisha",
    path: "Mombasa to New York",
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=400&h=400&auto=format&fit=crop",
    content: "Aisha from Mombasa earned a scholarship to study mechanical engineering in the United States. She worked hard during her studies and joined research programs that opened doors to internships. After graduation, she was hired by an engineering firm and now works on large infrastructure projects. Aisha frequently speaks to students back home about the importance of applying for international scholarships."
  },
  {
    title: "From Eldoret to Logistics Management",
    name: "David",
    path: "Eldoret to Washington",
    image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=400&h=400&auto=format&fit=crop",
    content: "David from Eldoret moved to the United States after winning a diversity visa. At first, he worked entry-level jobs while studying logistics and supply chain management. Over time he gained experience and moved into management at a transportation company. Today he oversees logistics operations and has built a stable life for his family while investing in property back in Kenya."
  }
];

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-700 px-4 md:px-8 py-4 md:py-6",
      scrolled ? "bg-white/80 backdrop-blur-2xl border-b border-slate-200/50 shadow-sm" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-brand-navy p-2 rounded-2xl shadow-2xl shadow-brand-navy/20 border border-white/10 group-hover:scale-110 transition-transform duration-500">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <span className={cn(
            "text-xl md:text-2xl font-serif font-bold tracking-tight transition-colors duration-500",
            scrolled ? "text-brand-navy" : "text-white"
          )}>
            Relocate<span className="text-brand-red">Usa</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-12">
          {NAV_ITEMS.map((item) => (
            <a 
              key={item.label} 
              href={item.href}
              className={cn(
                "text-sm font-medium tracking-wide uppercase transition-all duration-300 hover:text-brand-red relative group",
                scrolled ? "text-slate-600" : "text-white/90"
              )}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-red transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <a 
            href="https://wa.me/17712165155" 
            target="_blank" 
            rel="noopener noreferrer"
            className={cn(
              "px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-500 shadow-xl",
              scrolled 
                ? "bg-brand-navy text-white hover:bg-brand-red hover:shadow-brand-red/20" 
                : "bg-white text-brand-navy hover:bg-brand-red hover:text-white"
            )}
          >
            Contact Us
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={cn(
            "md:hidden p-2 rounded-full transition-colors",
            scrolled ? "text-brand-navy hover:bg-slate-100" : "text-white hover:bg-white/10"
          )} 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-[72px] left-0 right-0 bg-white/95 backdrop-blur-3xl border-b border-slate-200 overflow-hidden md:hidden shadow-2xl z-40"
          >
            <div className="p-10 flex flex-col gap-10">
              <div className="flex flex-col gap-6">
                {NAV_ITEMS.map((item, idx) => (
                  <motion.a 
                    key={item.label} 
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-3xl font-serif text-brand-navy hover:text-brand-red transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </div>
              <motion.a 
                href="https://wa.me/17712165155" 
                target="_blank" 
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-brand-navy text-white px-8 py-5 rounded-2xl text-lg font-bold text-center shadow-2xl shadow-brand-navy/20"
              >
                Get Started
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleQuickAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    try {
      const advice = await getVisaAdvice(query);
      setResponse(advice);
      // Scroll to advisor section to see full response if needed, 
      // but we'll show a preview here too
      const advisorSection = document.getElementById('advisor');
      if (advisorSection) {
        advisorSection.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden text-center py-20">
      {/* Background Image with Immersive Overlay */}
      <div className="absolute inset-0 -z-10">
        <img 
          src="https://images.pexels.com/photos/7114420/pexels-photo-7114420.jpeg?auto=compress&cs=tinysrgb&w=1920" 
          alt="Smiling family" 
          className="w-full h-full object-cover scale-105 animate-slow-zoom"
          referrerPolicy="no-referrer"
          loading="eager"
        />
        {/* Multi-layered overlay for depth and readability */}
        <div className="absolute inset-0 bg-brand-navy/50" />
        <div className="absolute inset-0 bg-linear-to-b from-brand-navy/80 via-transparent to-brand-navy/80" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-brand-navy/60" />
      </div>

      <div className="container-width relative z-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold leading-[1] md:leading-[0.9] mb-10 md:mb-12 text-white tracking-tighter">
              Start Your <br className="hidden sm:block" /> <span className="text-brand-red italic font-normal serif">American Dream</span>.
            </h1>
            
            <p className="text-white/70 text-base md:text-xl max-w-2xl mx-auto mb-12 md:mb-16 font-light leading-relaxed">
              Strategic intelligence and elite community support for the Kenyan diaspora navigating the United States.
            </p>

            {/* Integrated AI Chatbot in Hero */}
            <div className="max-w-xl mx-auto mb-12">
              <form onSubmit={handleQuickAsk} className="relative group">
                <div className="absolute inset-0 bg-brand-red/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 focus-within:border-brand-red/50 transition-all">
                  <div className="pl-4 text-brand-red">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask our AI about your visa journey..."
                    className="flex-grow bg-transparent border-none focus:ring-0 text-white placeholder:text-white/40 px-4 py-3 text-sm md:text-base font-light"
                  />
                  <button 
                    type="submit"
                    disabled={loading}
                    className="bg-brand-red text-white p-3 rounded-xl hover:bg-white hover:text-brand-navy transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                  </button>
                </div>
              </form>

              <AnimatePresence>
                {response && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-6 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-left"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-brand-red p-2 rounded-lg shrink-0">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white/90 text-sm font-light leading-relaxed line-clamp-3">
                          {response.replace(/[#*]/g, '')}
                        </p>
                        <button 
                          onClick={() => document.getElementById('advisor')?.scrollIntoView({ behavior: 'smooth' })}
                          className="mt-3 text-brand-red text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
                        >
                          Read Full Analysis
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
 
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
              <a 
                href="#advisor" 
                className="w-full sm:w-auto bg-brand-red text-white px-10 md:px-12 py-5 md:py-6 rounded-full text-xs md:text-sm font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-brand-navy transition-all duration-500 shadow-2xl shadow-brand-red/20"
              >
                Begin Assessment
              </a>
              <a 
                href="#visas" 
                className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 md:px-12 py-5 md:py-6 rounded-full text-xs md:text-sm font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-brand-navy transition-all duration-500"
              >
                Explore Pathways
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <div className="w-px h-24 bg-linear-to-b from-white/50 to-transparent" />
      </motion.div>
    </section>
  );
};

const VisaModal = ({ visa, onClose }: { visa: VisaType; onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
    >
      <div className="absolute inset-0 bg-brand-navy/90 backdrop-blur-md" onClick={onClose} />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white w-full max-w-3xl rounded-[3rem] overflow-hidden shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 rounded-full bg-slate-100 text-brand-navy hover:bg-brand-red hover:text-white transition-all z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid md:grid-cols-5 h-full">
          <div className="md:col-span-2 bg-brand-paper p-10 md:p-12 flex flex-col items-center justify-center text-center border-r border-slate-100">
            <div className="bg-white w-24 h-24 rounded-3xl flex items-center justify-center mb-8 shadow-xl text-brand-red">
              {React.cloneElement(visa.icon as React.ReactElement<any>, { className: "w-12 h-12" })}
            </div>
            <h2 className="text-3xl font-bold text-brand-navy mb-4">{visa.title}</h2>
            <p className="text-slate-500 text-sm font-light leading-relaxed uppercase tracking-widest">{visa.id} Category</p>
          </div>

          <div className="md:col-span-3 p-10 md:p-16 overflow-y-auto max-h-[80vh]">
            <div className="mb-12">
              <h3 className="text-xs font-bold text-brand-red uppercase tracking-[0.3em] mb-6">Overview</h3>
              <p className="text-slate-600 text-lg font-light leading-relaxed italic">
                {visa.longDescription}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-brand-red uppercase tracking-[0.3em] mb-6">Key Requirements</h3>
              <ul className="space-y-4">
                {visa.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-4 group">
                    <div className="mt-1 bg-brand-red/10 p-1 rounded-full group-hover:bg-brand-red group-hover:text-white transition-colors">
                      <CheckCircle2 className="w-4 h-4 text-brand-red group-hover:text-white" />
                    </div>
                    <span className="text-slate-700 font-light leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 pt-12 border-t border-slate-100">
              <a 
                href="#advisor" 
                onClick={onClose}
                className="inline-flex items-center gap-3 bg-brand-navy text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-brand-red transition-all"
              >
                Get Strategic Advice <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const VisaSection = () => {
  const [selectedVisa, setSelectedVisa] = useState<VisaType | null>(null);

  return (
    <section id="visas" className="section-padding bg-white">
      <div className="container-width">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-brand-navy leading-tight">Expertise across all <span className="italic font-normal text-brand-red serif">Visa categories.</span></h2>
          </div>
          <p className="text-slate-500 max-w-xs text-sm md:text-base leading-relaxed font-light">
            Tailored strategies for every relocation goal, from academic pursuits to professional career moves.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {VISA_TYPES.map((visa, idx) => (
            <motion.div
              key={visa.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="group bg-brand-paper p-10 md:p-12 rounded-[2.5rem] border border-slate-100 hover:border-brand-red/30 hover:shadow-[0_30px_60px_-15px_rgba(191,10,48,0.15)] transition-all duration-700 flex flex-col"
            >
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:bg-brand-navy group-hover:text-white transition-all duration-500">
                {React.cloneElement(visa.icon as React.ReactElement<any>, { className: "w-7 h-7 transition-colors" })}
              </div>
              <h3 className="text-2xl font-bold text-brand-navy mb-4">{visa.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 font-light">
                {visa.description}
              </p>
              <div className="mt-auto">
                <button 
                  onClick={() => setSelectedVisa(visa)}
                  className="text-brand-navy font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-4 transition-all group-hover:text-brand-red"
                >
                  Details <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedVisa && (
          <VisaModal visa={selectedVisa} onClose={() => setSelectedVisa(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

const SuccessStoriesSection = () => {
  return (
    <section id="stories" className="section-padding bg-brand-navy text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-brand-red rounded-full blur-[200px] -mr-96 -mt-96" />
      </div>

      <div className="container-width relative z-10">
        <div className="text-center mb-20 md:mb-32">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 md:mb-8">The <span className="italic font-normal serif text-brand-red">Kenyan</span> Diaspora.</h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-light text-base md:text-lg leading-relaxed">
            Real narratives of ambition, resilience, and success from our community members across the United States.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {SUCCESS_STORIES.map((story, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="bg-white/5 backdrop-blur-md p-10 md:p-12 rounded-[3rem] border border-white/10 flex flex-col h-full hover:bg-white/10 transition-all duration-700 group"
            >
              <div className="flex items-center gap-6 mb-10">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 border-brand-red/30 shadow-2xl group-hover:scale-110 transition-transform duration-700">
                  <img 
                    src={story.image} 
                    alt={story.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-xl">{story.name}</h4>
                  <p className="text-[10px] text-brand-red font-bold uppercase tracking-[0.3em]">{story.path}</p>
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-6 leading-tight text-white">{story.title}</h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed flex-grow font-light italic opacity-80 group-hover:opacity-100 transition-opacity">
                "{story.content}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ChecklistSection = () => {
  return (
    <section id="guide" className="section-padding bg-brand-paper">
      <div className="container-width grid lg:grid-cols-2 gap-16 md:gap-32 items-center">
        <div className="order-2 lg:order-1">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-brand-navy mb-8 md:mb-10 leading-tight">Meticulous <span className="italic font-normal serif text-brand-red">Planning.</span></h2>
          <p className="text-slate-500 mb-12 md:mb-16 text-lg md:text-xl font-light leading-relaxed">
            Our proprietary relocation framework ensures every document is verified and every requirement is met before you step into the US Embassy.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {CHECKLIST_ITEMS.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-4 md:gap-5 bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-red/20 transition-all duration-500"
              >
                <div className="bg-brand-red/10 p-2 rounded-full shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-brand-red" />
                </div>
                <span className="text-[11px] md:text-xs font-bold text-brand-navy uppercase tracking-[0.15em]">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="bg-brand-navy p-10 md:p-16 rounded-[3rem] md:rounded-[4rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-red/10 blur-[100px] rounded-full -mr-40 -mt-40" />
            
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-12 md:mb-16 flex items-center gap-5">
              <HelpCircle className="text-brand-red w-8 h-8 md:w-10 md:h-10" />
              Strategic Tips
            </h3>
            
            <div className="space-y-12 md:space-y-16">
              {[
                { id: '01', title: 'Absolute Integrity', desc: 'Consular officers prioritize transparency. Ensure your verbal testimony matches your DS-160 documentation exactly.' },
                { id: '02', title: 'Demonstrate Ties', desc: 'Clearly articulate your long-term commitment to Kenya, including professional, familial, and economic foundations.' },
                { id: '03', title: 'Concise Articulation', desc: 'Interviews are brief. Practice delivering high-impact, direct responses that address the core of each inquiry.' }
              ].map((tip) => (
                <div key={tip.id} className="flex gap-6 md:gap-8 group">
                  <div className="text-brand-red font-serif italic text-3xl md:text-4xl opacity-30 group-hover:opacity-100 transition-opacity duration-500 shrink-0">{tip.id}</div>
                  <div>
                    <p className="font-bold text-white mb-3 text-xl md:text-2xl">{tip.title}</p>
                    <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                      {tip.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      q: "How much is visa from Kenya to USA?",
      a: "The standard non-immigrant visa fee (MRV fee) for most categories like B1/B2 and F1 is $185. However, the total cost including SEVIS fees for students and other administrative costs can vary. Always check the official US Embassy Nairobi website for the latest rates."
    },
    {
      q: "How many states in USA?",
      a: "The United States consists of 50 states, along with the District of Columbia (Washington D.C.) and several territories. Each state offers unique opportunities and climates for Kenyans relocating."
    },
    {
      q: "How much is from Kenya to USA in Kenyan Shillings?",
      a: "Flight costs fluctuate based on the season and airline. On average, a one-way ticket can range from KES 100,000 to KES 250,000. Visa fees ($185) are approximately KES 24,000 to KES 28,000 depending on the prevailing exchange rate."
    },
    {
      q: "How many hours from Kenya to USA?",
      a: "A typical flight from Jomo Kenyatta International Airport (Nairobi) to major US hubs like New York (JFK) takes approximately 15 to 16 hours for direct flights. Connecting flights can take anywhere from 20 to 30+ hours."
    },
    {
      q: "How to send money from USA to Kenya?",
      a: "There are several reliable ways to send money home, including M-PESA Global, WorldRemit, Sendwave, and traditional bank transfers. Most Kenyans prefer mobile-app based services for their speed and competitive exchange rates."
    },
    {
      q: "How to receive money from USA to Kenya?",
      a: "Receiving money is simple via M-PESA, bank accounts, or cash pickup points like Western Union and MoneyGram. Using apps like Sendwave allows the sender in the USA to deposit funds directly into your M-PESA wallet in seconds."
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-width">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-brand-navy mb-6 md:mb-8">Common <span className="italic font-normal serif text-brand-red">Inquiries.</span></h2>
          <p className="text-slate-500 font-light max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Essential information for every Kenyan planning their relocation to the United States.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {faqs.map((faq, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-brand-paper p-8 md:p-10 rounded-[2rem] border border-slate-100 hover:border-brand-red/20 transition-all"
            >
              <h3 className="text-xl font-bold text-brand-navy mb-4 flex items-start gap-4">
                <span className="text-brand-red">Q.</span> {faq.q}
              </h3>
              <p className="text-slate-600 font-light leading-relaxed">
                {faq.a}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AIAdvisor = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const SUGGESTED_QUESTIONS = [
    "How do I prepare for an F1 visa interview?",
    "What are the requirements for a B1/B2 visitor visa?",
    "How does the DV Lottery process work for Kenyans?",
    "Can I work in the US with an H-1B visa?"
  ];

  const handleAsk = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = customQuery || query;
    if (!finalQuery.trim() || loading) return;

    setLoading(true);
    setResponse(null);
    setCopied(false);
    try {
      const advice = await getVisaAdvice(finalQuery);
      setResponse(advice || "I'm sorry, I couldn't generate advice at this time.");
    } catch (error) {
      setResponse("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    if (response && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response]);

  return (
    <section id="advisor" className="section-padding bg-white">
      <div className="container-width max-w-5xl">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-brand-navy mb-6 md:mb-8">AI <span className="italic font-normal serif text-brand-red">Advisor.</span></h2>
          <p className="text-slate-500 font-light max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Leverage our proprietary AI engine to receive immediate, accurate insights into the US immigration landscape.
          </p>
        </div>

        <div className="bg-brand-paper rounded-[3rem] md:rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden mx-2 sm:mx-0">
          <div className="p-8 md:p-16 border-b border-slate-100 bg-linear-to-b from-white to-brand-paper">
            <form onSubmit={handleAsk} className="relative flex flex-col sm:block mb-8">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about F1 interviews, B1/B2 protocols..."
                className="w-full bg-white border border-slate-200 rounded-3xl py-6 md:py-8 pl-8 md:pl-10 pr-6 sm:pr-24 focus:ring-4 focus:ring-brand-red/5 focus:border-brand-red transition-all text-slate-800 placeholder:text-slate-400 shadow-sm text-lg md:text-xl font-light"
              />
              <button 
                type="submit"
                disabled={loading}
                className="mt-6 sm:mt-0 sm:absolute sm:right-5 sm:top-5 sm:bottom-5 bg-brand-navy text-white px-10 md:px-12 py-5 sm:py-0 rounded-2xl hover:bg-brand-red transition-all duration-500 disabled:opacity-50 shadow-2xl shadow-brand-navy/20 flex items-center justify-center group"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="flex flex-wrap gap-3 justify-center">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(q);
                    handleAsk(undefined, q);
                  }}
                  className="text-[10px] md:text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-full bg-white border border-slate-200 text-slate-500 hover:border-brand-red hover:text-brand-red transition-all shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 md:p-16 min-h-[350px] md:min-h-[450px] bg-white relative">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 md:py-32 gap-8">
                <div className="relative">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-slate-100 border-t-brand-red animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-brand-red animate-pulse" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-brand-navy font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs mb-2">Analyzing Global Protocols</p>
                  <p className="text-slate-400 text-xs font-light animate-pulse">Our AI is crafting your strategic advice...</p>
                </div>
              </div>
            ) : response ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-none"
              >
                <div ref={scrollRef} />
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-brand-red/10 p-2 rounded-lg">
                      <Sparkles className="w-5 h-5 text-brand-red" />
                    </div>
                    <span className="text-xs font-bold text-brand-navy uppercase tracking-[0.2em]">Strategic Analysis</span>
                  </div>
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-brand-red transition-colors"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <FileText className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy Advice'}
                  </button>
                </div>
                <div className="bg-brand-paper p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm prose prose-slate prose-lg md:prose-xl max-w-none">
                  <ReactMarkdown>{response}</ReactMarkdown>
                </div>
                <div className="mt-12 p-8 bg-brand-navy rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
                  <div>
                    <p className="text-lg font-bold mb-2">Need more personalized support?</p>
                    <p className="text-slate-400 text-sm font-light">Connect with our human experts for a deep-dive consultation.</p>
                  </div>
                  <a 
                    href="https://wa.me/17712165155" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-brand-red text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-brand-navy transition-all shadow-xl shadow-brand-red/20"
                  >
                    Speak to an Expert
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 md:py-32 text-center">
                <div className="bg-brand-paper p-8 md:p-10 rounded-[2.5rem] shadow-sm mb-8 border border-slate-50 group hover:scale-110 transition-transform duration-700">
                  <MessageSquare className="w-12 h-12 md:w-16 md:h-16 text-slate-200 group-hover:text-brand-red transition-colors" />
                </div>
                <p className="text-slate-400 italic font-light text-lg md:text-xl max-w-md">Your bespoke strategic advice will be generated here. Ask anything about your US relocation journey.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-brand-navy text-white pt-24 md:pt-40 pb-16 px-4 sm:px-6 overflow-hidden relative">
      <div className="absolute bottom-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-brand-red rounded-full blur-[120px] md:blur-[180px] -ml-48 md:-ml-96 -mb-48 md:-mb-96" />
      </div>

      <div className="container-width relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-24 mb-20 md:mb-32">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-8 md:mb-10">
              <div className="bg-brand-red p-2.5 rounded-2xl shadow-2xl shadow-brand-red/20">
                <Plane className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-2xl md:text-3xl font-serif font-bold tracking-tight">Relocate<span className="text-brand-red">Usa</span></span>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed font-light text-lg md:text-xl opacity-80">
              The premier relocation platform for the Kenyan diaspora. We provide the strategic intelligence and community support required to thrive in the United States.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-12 md:col-span-2 lg:col-span-2">
            <div>
              <h4 className="font-bold text-[11px] md:text-xs uppercase tracking-[0.4em] text-brand-red mb-8 md:mb-10">Navigation</h4>
              <ul className="space-y-5 md:space-y-6 text-slate-400 text-sm md:text-base font-medium">
                {NAV_ITEMS.map(item => (
                  <li key={item.label}><a href={item.href} className="hover:text-brand-red transition-colors duration-300">{item.label}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[11px] md:text-xs uppercase tracking-[0.4em] text-brand-red mb-8 md:mb-10">Global HQ</h4>
              <ul className="space-y-5 md:space-y-6 text-slate-400 text-sm md:text-base font-medium">
                <li className="flex items-center gap-3"><Globe className="w-4 h-4 text-brand-red/50" /> Westlands, Nairobi, KE</li>
                <li className="flex items-center gap-3"><Send className="w-4 h-4 text-brand-red/50" /> contact@relocateusa.co.ke</li>
                <li className="flex items-center gap-3"><User className="w-4 h-4 text-brand-red/50" /> +254 700 000 000</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-12 md:pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12 text-[10px] md:text-[11px] text-slate-500 font-bold uppercase tracking-[0.3em] text-center md:text-left">
          <p>© 2024 RelocateUsa. Excellence in Relocation.</p>
          <div className="flex gap-10 md:gap-16">
            <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Engagement</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="min-h-screen selection:bg-brand-red/30">
      <Navbar />
      <main>
        <Hero />
        <VisaSection />
        <SuccessStoriesSection />
        <ChecklistSection />
        <FAQSection />
        <AIAdvisor />
      </main>
      <Footer />
    </div>
  );
}
