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
  icon: React.ReactNode;
}

// --- Constants ---
const NAV_ITEMS: NavItem[] = [
  { label: 'Visa Types', href: '#visas' },
  { label: 'Interview Tips', href: '#tips' },
  { label: 'Success Stories', href: '#stories' },
  { label: 'Relocation Guide', href: '#guide' },
  { label: 'AI Advisor', href: '#advisor' },
];

const VISA_TYPES: VisaType[] = [
  {
    id: 'f1',
    title: 'F-1 Student Visa',
    description: 'For Kenyans planning to study at an accredited US college or university.',
    icon: <Globe className="w-6 h-6 text-brand-red" />,
  },
  {
    id: 'b1',
    title: 'B1/B2 Visitor',
    description: 'For business or pleasure trips, including visiting family or medical treatment.',
    icon: <ShieldCheck className="w-6 h-6 text-brand-red" />,
  },
  {
    id: 'dv',
    title: 'DV Lottery',
    description: 'The Diversity Visa program for those selected in the annual lottery.',
    icon: <Sparkles className="w-6 h-6 text-brand-red" />,
  },
  {
    id: 'h1b',
    title: 'H-1B Work Visa',
    description: 'For specialty occupations requiring theoretical or technical expertise.',
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
    image: "https://picsum.photos/seed/brian-kenya/200/200",
    content: "Brian grew up in Nairobi and always dreamed of working in technology. After finishing his degree in Kenya, he applied to a master’s program in computer science in the United States. He secured a student visa and moved to California. During his studies, he gained experience through internships and eventually received a full-time job offer from a technology company. Today, Brian works as a software engineer and regularly mentors Kenyan students who want to follow the same path."
  },
  {
    title: "A Nurse’s Journey from Nakuru to Texas",
    name: "Faith",
    image: "https://picsum.photos/seed/faith-kenya/200/200",
    content: "Faith was a nurse working in Nakuru but wanted better career opportunities and training. She joined a U.S. healthcare recruitment program that helps international nurses relocate. After completing the licensing exams and immigration process, she moved to Texas and started working in a hospital. Faith now earns a higher income and has been able to support her family and sponsor her younger sister’s university education."
  },
  {
    title: "From Kisumu Student to Business Owner in America",
    name: "Kevin",
    image: "https://picsum.photos/seed/kevin-kenya/200/200",
    content: "Kevin from Kisumu moved to the United States on a student visa to study business administration. While studying, he started a small online store selling African products to diaspora communities. The idea grew quickly, and after graduating he expanded the business into a full online brand. Today, his his company ships African goods across several states and sources many products directly from Kenya."
  },
  {
    title: "Scholarship to Engineering Success",
    name: "Aisha",
    image: "https://picsum.photos/seed/aisha-kenya/200/200",
    content: "Aisha from Mombasa earned a scholarship to study mechanical engineering in the United States. She worked hard during her studies and joined research programs that opened doors to internships. After graduation, she was hired by an engineering firm and now works on large infrastructure projects. Aisha frequently speaks to students back home about the importance of applying for international scholarships."
  },
  {
    title: "From Eldoret to Logistics Management",
    name: "David",
    image: "https://picsum.photos/seed/david-kenya/200/200",
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
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 md:px-6 py-3 md:py-6",
      scrolled ? "bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm" : "bg-transparent"
    )}>
      <div className="container-width flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="bg-brand-navy p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-lg shadow-brand-navy/10 border border-white/10">
            <Plane className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <span className={cn(
            "text-lg md:text-xl font-bold tracking-tighter transition-colors",
            scrolled ? "text-brand-navy" : "text-white"
          )}>
            Relocate<span className="text-brand-red">Usa</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {NAV_ITEMS.map((item) => (
            <a 
              key={item.label} 
              href={item.href}
              className={cn(
                "text-xs font-bold uppercase tracking-widest transition-all relative group",
                scrolled ? "text-slate-500 hover:text-brand-navy" : "text-white/80 hover:text-white"
              )}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all group-hover:w-full" />
            </a>
          ))}
          <a 
            href="https://wa.me/17712165155" 
            target="_blank" 
            rel="noopener noreferrer"
            className={cn(
              "px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-xl hover:-translate-y-0.5",
              scrolled 
                ? "bg-brand-accent text-white hover:bg-emerald-600 shadow-brand-accent/10" 
                : "bg-brand-accent text-white hover:bg-emerald-600 shadow-brand-accent/10"
            )}
          >
            Get Started
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
            className="fixed top-[60px] md:top-[88px] left-0 right-0 bg-white border-b border-slate-100 overflow-hidden md:hidden shadow-2xl z-40"
          >
            <div className="p-8 flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                {NAV_ITEMS.map((item, idx) => (
                  <motion.a 
                    key={item.label} 
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-2xl font-serif text-brand-navy hover:text-brand-red transition-colors"
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
                className="bg-brand-accent text-white px-5 py-4 rounded-2xl text-lg font-bold text-center shadow-xl shadow-brand-accent/20"
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
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden text-center">
      {/* Background Image with Immersive Overlay */}
      <div className="absolute inset-0 -z-10">
        <img 
          src="https://images.pexels.com/photos/7114420/pexels-photo-7114420.jpeg?auto=compress&cs=tinysrgb&w=1920" 
          alt="Smiling family" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          loading="eager"
        />
        {/* Multi-layered overlay for depth and readability */}
        <div className="absolute inset-0 bg-brand-navy/40" />
        <div className="absolute inset-0 bg-linear-to-b from-brand-navy/60 via-transparent to-brand-navy/60" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-brand-navy/40" />
      </div>

      <div className="container-width relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] md:leading-[0.95] mb-6 md:mb-8 text-white tracking-tighter">
              Start Your <br className="hidden sm:block" /> <span className="text-brand-red italic font-normal">American Dream</span>.
            </h1>
            
            <p className="text-base sm:text-lg md:text-2xl text-slate-100 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed font-light px-4 sm:px-0">
              RelocateUSA helps Kenyans discover real pathways to study, work, and build a successful life in the United States.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-6 sm:px-0">
              <a 
                href="https://wa.me/17712165155" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-brand-accent text-white px-8 md:px-12 py-4 md:py-6 rounded-xl md:rounded-2xl font-bold uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-2xl shadow-brand-accent/40 hover:-translate-y-1"
              >
                Start Your Journey <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#stories" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 md:px-12 py-4 md:py-6 rounded-xl md:rounded-2xl font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-white/20 transition-all flex items-center justify-center hover:shadow-lg">
                Success Stories
              </a>
            </div>
          </motion.div>

        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Scroll</span>
        <div className="w-px h-12 bg-linear-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
};

const VisaSection = () => {
  return (
    <section id="visas" className="section-padding bg-white">
      <div className="container-width">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-brand-navy leading-tight">Expertise across all <span className="italic font-normal text-brand-red">Visa categories.</span></h2>
          </div>
          <p className="text-slate-500 max-w-xs text-sm leading-relaxed font-light">
            Tailored strategies for every relocation goal, from academic pursuits to professional career moves.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {VISA_TYPES.map((visa, idx) => (
            <motion.div
              key={visa.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="group bg-brand-paper p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-slate-100 hover:border-brand-red/20 hover:shadow-2xl hover:shadow-brand-red/5 transition-all duration-500 flex flex-col"
            >
              <div className="bg-white w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8 shadow-sm group-hover:scale-110 group-hover:bg-brand-red group-hover:text-white transition-all duration-500">
                {React.cloneElement(visa.icon as React.ReactElement<any>, { className: "w-6 h-6 md:w-7 md:h-7 transition-colors" })}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-brand-navy mb-3 md:mb-4">{visa.title}</h3>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-6 md:mb-8 font-light">
                {visa.description}
              </p>
              <div className="mt-auto">
                <button className="text-brand-navy font-bold text-[9px] md:text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                  Details <ChevronRight className="w-4 h-4 text-brand-red" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SuccessStoriesSection = () => {
  return (
    <section id="stories" className="section-padding bg-brand-navy text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-red rounded-full blur-[150px] -mr-96 -mt-96" />
      </div>

      <div className="container-width relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6">The <span className="italic font-normal">Kenyan</span> Diaspora.</h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-light text-sm md:text-base">
            Real narratives of ambition, resilience, and success from our community members across the United States.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {SUCCESS_STORIES.map((story, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="bg-white/5 backdrop-blur-sm p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-white/10 flex flex-col h-full hover:bg-white/10 transition-all duration-500"
            >
              <div className="flex items-center gap-4 md:gap-5 mb-6 md:mb-8">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden border-2 border-brand-red/30 shadow-2xl">
                  <img 
                    src={story.image} 
                    alt={story.name} 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-base md:text-lg">{story.name}</h4>
                  <p className="text-[8px] md:text-[10px] text-brand-red font-bold uppercase tracking-widest">Verified Alumnus</p>
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-5 leading-tight text-slate-100">{story.title}</h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed flex-grow font-light italic">
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
      <div className="container-width grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
        <div className="order-2 lg:order-1">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-brand-navy mb-6 md:mb-8 leading-tight">Meticulous <span className="italic font-normal">Planning.</span></h2>
          <p className="text-slate-500 mb-8 md:mb-12 text-base md:text-lg font-light leading-relaxed">
            Our proprietary relocation framework ensures every document is verified and every requirement is met before you step into the US Embassy.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
            {CHECKLIST_ITEMS.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-3 md:gap-4 bg-white p-4 md:p-5 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="bg-brand-red/10 p-1.5 rounded-full shrink-0">
                  <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-brand-red" />
                </div>
                <span className="text-[10px] md:text-xs font-bold text-brand-navy uppercase tracking-wider">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="bg-brand-navy p-8 md:p-12 rounded-3xl md:rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/20 blur-[80px] rounded-full -mr-32 -mt-32" />
            
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 md:mb-10 flex items-center gap-4">
              <HelpCircle className="text-brand-red w-6 h-6 md:w-8 md:h-8" />
              Strategic Tips
            </h3>
            
            <div className="space-y-8 md:space-y-10">
              {[
                { id: '01', title: 'Absolute Integrity', desc: 'Consular officers prioritize transparency. Ensure your verbal testimony matches your DS-160 documentation exactly.' },
                { id: '02', title: 'Demonstrate Ties', desc: 'Clearly articulate your long-term commitment to Kenya, including professional, familial, and economic foundations.' },
                { id: '03', title: 'Concise Articulation', desc: 'Interviews are brief. Practice delivering high-impact, direct responses that address the core of each inquiry.' }
              ].map((tip) => (
                <div key={tip.id} className="flex gap-4 md:gap-6">
                  <div className="text-brand-red font-serif italic text-2xl md:text-3xl opacity-50 shrink-0">{tip.id}</div>
                  <div>
                    <p className="font-bold text-white mb-2 text-base md:text-lg">{tip.title}</p>
                    <p className="text-xs md:text-sm text-slate-400 font-light leading-relaxed">{tip.desc}</p>
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

const AIAdvisor = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    try {
      const advice = await getVisaAdvice(query);
      setResponse(advice || "I'm sorry, I couldn't generate advice at this time.");
    } catch (error) {
      setResponse("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (response && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response]);

  return (
    <section id="advisor" className="section-padding bg-white">
      <div className="container-width max-w-4xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-brand-navy mb-4 md:mb-6">Personalized <span className="italic font-normal">Guidance.</span></h2>
          <p className="text-slate-500 font-light max-w-xl mx-auto text-sm md:text-base">
            Leverage our proprietary AI engine to receive immediate, accurate insights into the US immigration landscape.
          </p>
        </div>

        <div className="bg-brand-paper rounded-3xl md:rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden premium-shadow mx-2 sm:mx-0">
          <div className="p-6 md:p-14 border-b border-slate-100">
            <form onSubmit={handleAsk} className="relative flex flex-col sm:block">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about F1 interviews..."
                className="w-full bg-white border border-slate-100 rounded-2xl md:rounded-3xl py-4 md:py-6 pl-6 md:pl-8 pr-6 sm:pr-20 focus:ring-4 focus:ring-brand-red/5 focus:border-brand-red transition-all text-slate-800 placeholder:text-slate-400 shadow-sm text-base md:text-lg font-light"
              />
              <button 
                type="submit"
                disabled={loading}
                className="mt-4 sm:mt-0 sm:absolute sm:right-4 sm:top-4 sm:bottom-4 bg-brand-accent text-white px-6 md:px-8 py-4 sm:py-0 rounded-xl md:rounded-2xl hover:bg-emerald-600 transition-all disabled:opacity-50 shadow-lg shadow-brand-accent/20 flex items-center justify-center"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </form>
          </div>

          <div className="p-6 md:p-14 min-h-[250px] md:min-h-[300px] bg-white/50">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 md:py-20 gap-4 md:gap-6">
                <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-brand-red animate-spin" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-xs animate-pulse">Analyzing Protocols...</p>
              </div>
            ) : response ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-slate prose-sm md:prose-lg max-w-none"
              >
                <div ref={scrollRef} />
                <ReactMarkdown>{response}</ReactMarkdown>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center">
                <div className="bg-brand-paper p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm mb-4 md:mb-6 border border-slate-50">
                  <MessageSquare className="w-8 h-8 md:w-10 md:h-10 text-slate-200" />
                </div>
                <p className="text-slate-400 italic font-light text-base md:text-lg">Your bespoke advice will be generated here.</p>
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
    <footer className="bg-brand-navy text-white pt-20 md:pt-32 pb-12 px-4 sm:px-6 overflow-hidden relative">
      <div className="absolute bottom-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-brand-red rounded-full blur-[100px] md:blur-[150px] -ml-48 md:-ml-96 -mb-48 md:-mb-96" />
      </div>

      <div className="container-width relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20 mb-16 md:mb-24">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="bg-brand-red p-2 rounded-xl shadow-lg shadow-brand-red/20">
                <Plane className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-bold tracking-tighter">Relocate<span className="text-brand-red">Usa</span></span>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed font-light text-base md:text-lg">
              The premier relocation platform for the Kenyan diaspora. We provide the strategic intelligence and community support required to thrive in the United States.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 md:col-span-2 lg:col-span-2">
            <div>
              <h4 className="font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] text-brand-red mb-6 md:mb-8">Navigation</h4>
              <ul className="space-y-4 md:space-y-5 text-slate-400 text-xs md:text-sm font-medium">
                {NAV_ITEMS.map(item => (
                  <li key={item.label}><a href={item.href} className="hover:text-white transition-colors">{item.label}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] text-brand-red mb-6 md:mb-8">Global HQ</h4>
              <ul className="space-y-4 md:space-y-5 text-slate-400 text-xs md:text-sm font-medium">
                <li>Westlands, Nairobi, KE</li>
                <li>concierge@relocateusa.co.ke</li>
                <li>+254 700 000 000</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-8 md:pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 text-[8px] md:text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] text-center md:text-left">
          <p>© 2024 RelocateUsa. Excellence in Relocation.</p>
          <div className="flex gap-8 md:gap-12">
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
        <AIAdvisor />
      </main>
      <Footer />
    </div>
  );
}
