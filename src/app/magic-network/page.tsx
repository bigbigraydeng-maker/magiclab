'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ── DATA ──────────────────────────────────────────────────────────────────────

const TOAST_DATA = [
  { name: 'Sarah K.',   city: 'Auckland',     stores: 3,  earn: 150 },
  { name: 'James T.',   city: 'Wellington',   stores: 5,  earn: 250 },
  { name: 'Mei L.',     city: 'Christchurch', stores: 2,  earn: 100 },
  { name: 'Daniel R.',  city: 'Auckland',     stores: 8,  earn: 400 },
  { name: 'Priya S.',   city: 'Hamilton',     stores: 4,  earn: 200 },
  { name: 'Tom W.',     city: 'Tauranga',     stores: 6,  earn: 300 },
  { name: 'Aiko M.',    city: 'Auckland',     stores: 1,  earn: 50  },
  { name: 'Carlos V.',  city: 'Wellington',   stores: 10, earn: 500 },
  { name: 'Lucy F.',    city: 'Dunedin',      stores: 3,  earn: 150 },
  { name: 'Ben H.',     city: 'Auckland',     stores: 7,  earn: 350 },
  { name: 'Natalie C.', city: 'Christchurch', stores: 4,  earn: 200 },
  { name: 'Oliver P.',  city: 'Auckland',     stores: 12, earn: 600 },
  { name: 'Yasmin R.',  city: 'Wellington',   stores: 2,  earn: 100 },
  { name: 'Marcus D.',  city: 'Hamilton',     stores: 5,  earn: 250 },
  { name: 'Sophie N.',  city: 'Auckland',     stores: 9,  earn: 450 },
];

const ACTIVITY_EVENTS = [
  { initials: 'SK', name: 'Sarah K.',   action: 'completed 3 pharmacies in Auckland',       earn: '$150',  time: '2 min ago'  },
  { initials: 'JT', name: 'James T.',   action: 'submitted shelf photos — Wellington CBD',  earn: '$50',   time: '11 min ago' },
  { initials: 'ML', name: 'Mei L.',     action: 'onboarded Life Pharmacy Newmarket',         earn: '$50',   time: '34 min ago' },
  { initials: 'DR', name: 'Daniel R.',  action: 'completed 8-store Auckland route',          earn: '$400',  time: '1 hr ago'   },
  { initials: 'PS', name: 'Priya S.',   action: 'placed 2 brands at Unichem Hamilton',       earn: '$100',  time: '2 hrs ago'  },
  { initials: 'TW', name: 'Tom W.',     action: 'onboarded 3 new pharmacies in Tauranga',    earn: '$150',  time: '3 hrs ago'  },
];

const PHARMACIES = [
  { name: 'Life Pharmacy Newmarket', loc: 'Auckland, NZ',     brands: 2 },
  { name: 'Unichem Ponsonby',        loc: 'Auckland, NZ',     brands: 1 },
  { name: 'Green Cross Health',      loc: 'Wellington, NZ',   brands: 1 },
  { name: 'Chemist Warehouse Albany',loc: 'Auckland, NZ',     brands: 2 },
];

const FAQS = [
  {
    q: 'Do I need retail or sales experience?',
    a: 'No. We provide everything — product briefs, display guides, and templates for introducing yourself to pharmacy staff. If you can follow instructions and take a clear photo, you\'re qualified.',
  },
  {
    q: 'How do I receive payment?',
    a: 'You submit your bank account details when you sign up. After each approved placement, $50 NZD is transferred directly to your account within 48 business hours.',
  },
  {
    q: 'How many pharmacies can I cover?',
    a: 'As many as you can handle. We allocate pharmacies based on geography and capacity. Some partners cover 3–5 per week; our most active partners do 15–20. There\'s no cap — the more you do, the more you earn.',
  },
  {
    q: 'What do I actually do inside the pharmacy?',
    a: 'The pharmacy has already agreed to host the products. You walk in, introduce yourself, place the items on the designated shelf, arrange them per the guide, and photograph the finished display. Usually under 30 minutes.',
  },
  {
    q: 'Is this available outside New Zealand?',
    a: 'We\'re currently building our NZ network and will expand to Australia in Q3 2026. If you\'re based in Australia, apply now — you\'ll be first in line when we launch there.',
  },
  {
    q: 'What products will I be placing?',
    a: 'Health supplements, vitamins, and wellness products from legitimate ANZ brands. All products are fully approved for retail sale. You\'ll receive full details on each brand before any visit.',
  },
];

// ── TOAST COMPONENT ───────────────────────────────────────────────────────────

interface ToastItem {
  id: number;
  name: string;
  city: string;
  stores: number;
  earn: number;
  visible: boolean;
}

function ToastStack() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idxRef = useRef(0);
  const counterRef = useRef(0);

  useEffect(() => {
    const shuffled = [...TOAST_DATA].sort(() => Math.random() - 0.5);

    const fire = () => {
      const d = shuffled[idxRef.current % shuffled.length];
      idxRef.current++;
      const id = counterRef.current++;

      setToasts(prev => [...prev, { ...d, id, visible: true }]);

      // Fade out after 4.5s
      setTimeout(() => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: false } : t));
        // Remove from DOM after fade
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== id));
        }, 600);
      }, 4500);
    };

    const initial = setTimeout(fire, 2000);
    const interval = setInterval(fire, 6500 + Math.random() * 3000);

    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          style={{
            transition: 'opacity 0.5s ease, transform 0.4s ease',
            opacity: t.visible ? 1 : 0,
            transform: t.visible ? 'translateX(0)' : 'translateX(-30px)',
          }}
          className="flex items-center gap-3 bg-slate-800/95 border border-blue-500/20 border-l-2 border-l-cyan-400 rounded-xl px-4 py-3 max-w-xs shadow-2xl backdrop-blur-md text-sm"
        >
          <div className="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-base shrink-0">
            💊
          </div>
          <div>
            <div className="font-semibold text-white text-xs">{t.name} · {t.city}</div>
            <div className="text-slate-400 text-xs mt-0.5">
              Placed {t.stores} {t.stores === 1 ? 'store' : 'stores'} ·{' '}
              earned <span className="text-cyan-400 font-bold">+${t.earn} NZD</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── CALCULATOR ────────────────────────────────────────────────────────────────

function EarningsCalc() {
  const [pharmacies, setPharmacies] = useState(5);
  const [weeks, setWeeks] = useState(3);

  const monthly = pharmacies * weeks * 50;
  const annual = monthly * 12;

  return (
    <div className="bg-white/[0.03] border border-blue-500/18 rounded-2xl p-10 max-w-2xl mx-auto mt-14">
      <div className="text-lg font-bold mb-1">Your Earning Potential</div>
      <div className="text-slate-400 text-sm mb-9">Based on $50 per pharmacy placement</div>

      <div className="mb-7">
        <div className="flex justify-between text-sm mb-2.5">
          <span className="text-slate-300">Pharmacies per week</span>
          <span className="text-cyan-400 font-bold">{pharmacies} {pharmacies === 1 ? 'store' : 'stores'}</span>
        </div>
        <input
          type="range" min={1} max={20} value={pharmacies}
          onChange={e => setPharmacies(Number(e.target.value))}
          className="w-full h-1.5 rounded bg-blue-500/20 accent-blue-400 cursor-pointer"
        />
      </div>

      <div className="mb-9">
        <div className="flex justify-between text-sm mb-2.5">
          <span className="text-slate-300">Weeks active per month</span>
          <span className="text-cyan-400 font-bold">{weeks} {weeks === 1 ? 'week' : 'weeks'}</span>
        </div>
        <input
          type="range" min={1} max={4} value={weeks}
          onChange={e => setWeeks(Number(e.target.value))}
          className="w-full h-1.5 rounded bg-blue-500/20 accent-blue-400 cursor-pointer"
        />
      </div>

      <div className="grid grid-cols-2 gap-5 bg-gradient-to-br from-blue-500/12 to-cyan-500/6 border border-blue-500/18 rounded-xl p-7">
        <div className="text-center">
          <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            ${monthly.toLocaleString()}
          </div>
          <div className="text-slate-400 text-xs mt-1">Est. monthly earnings</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            ${annual.toLocaleString()}
          </div>
          <div className="text-slate-400 text-xs mt-1">Est. annual earnings</div>
        </div>
      </div>
    </div>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────

function FaqList() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="mt-12 max-w-2xl">
      {FAQS.map((faq, i) => (
        <div key={i} className="border-b border-white/[0.07] py-5">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex justify-between items-center text-left font-semibold text-sm gap-4 hover:text-blue-400 transition-colors"
          >
            <span>{faq.q}</span>
            <span
              className="text-slate-400 text-xl shrink-0 transition-transform duration-200"
              style={{ transform: open === i ? 'rotate(45deg)' : 'none' }}
            >
              +
            </span>
          </button>
          {open === i && (
            <p className="text-slate-400 text-sm leading-relaxed mt-3">{faq.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}

// ── APPLY FORM ────────────────────────────────────────────────────────────────

function ApplyForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🎉</div>
        <div className="text-xl font-bold mb-3">Application received!</div>
        <div className="text-slate-400 text-sm max-w-sm mx-auto">
          We&apos;ll review your details and get back to you within 24 hours. Keep an eye on your inbox.
        </div>
      </div>
    );
  }

  const inputCls = "w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 outline-none focus:border-blue-500/50 transition-colors";
  const labelCls = "block text-xs font-semibold text-slate-400 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelCls}>Full Name</label>
        <input type="text" placeholder="Your full name" required className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Email Address</label>
        <input type="email" placeholder="you@email.com" required className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Phone Number</label>
        <input type="tel" placeholder="+64 21 000 0000" className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Your City</label>
        <select className={inputCls} defaultValue="">
          <option value="" disabled>Select your city</option>
          {['Auckland','Wellington','Christchurch','Hamilton','Tauranga','Dunedin','Other NZ city','Sydney, AU','Melbourne, AU','Other AU city'].map(c => (
            <option key={c} value={c} className="bg-slate-800">{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelCls}>How many pharmacies per week can you cover?</label>
        <select className={inputCls} defaultValue="">
          <option value="" disabled>Select</option>
          {['1–3 (casual)','4–8 (part-time)','9–15 (serious)','15+ (full routes)'].map(o => (
            <option key={o} value={o} className="bg-slate-800">{o}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelCls}>Anything else? (optional)</label>
        <textarea
          placeholder="E.g. I have a car, I know the pharmacy staff at X…"
          rows={3}
          className={inputCls + ' resize-y'}
        />
      </div>
      <button
        type="submit"
        className="w-full py-4 rounded-xl font-bold text-white text-sm mt-1 transition-all hover:opacity-90 hover:-translate-y-0.5"
        style={{ background: 'linear-gradient(135deg,#3B82F6,#06B6D4)' }}
      >
        Apply to Join Magic Network →
      </button>
      <p className="text-center text-slate-500 text-xs">🔒 Your details are never shared. We&apos;ll reply within 24 hours.</p>
    </form>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

export default function MagicNetworkPage() {
  const [liveStores, setLiveStores] = useState(4);

  // Slowly increment live store count
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        setLiveStores(prev => prev < 12 ? prev + 1 : prev);
      }
    }, 18000);
    return () => clearInterval(interval);
  }, []);

  const sectionTag = "text-xs font-bold tracking-widest uppercase text-cyan-400 mb-3";
  const h2 = "text-3xl md:text-4xl font-extrabold leading-tight mb-4";
  const sub = "text-slate-400 text-base max-w-lg";

  return (
    <>
      <ToastStack />

      {/* ── HERO ── */}
      <section
        className="min-h-screen flex items-center relative overflow-hidden pt-28 pb-20 px-6"
        style={{ background: 'linear-gradient(160deg,#0F172A 0%,#111827 45%,#1E293B 100%)' }}
      >
        {/* Glow blobs */}
        <div className="absolute -top-1/5 -right-1/10 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(59,130,246,0.07) 0%,transparent 68%)' }} />
        <div className="absolute -bottom-1/10 -left-1/20 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(6,182,212,0.05) 0%,transparent 68%)' }} />

        <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/8 text-blue-400 text-xs font-semibold mb-7 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#06B6D4]" />
            Now Recruiting Field Partners · ANZ
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.15] text-white mb-6">
            Earn{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              $50 Per Pharmacy
            </span>
            .<br />Build Your Network.
          </h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto mb-10">
            Magic Network partners get paid to place health brands on pharmacy shelves across New Zealand and Australia. Set your own schedule. No experience required.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="#apply"
              className="px-8 py-3.5 rounded-xl font-bold text-white text-base transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg,#3B82F6,#06B6D4)' }}
            >
              Join the Network
            </a>
            <a
              href="#how-it-works"
              className="px-8 py-3.5 rounded-xl font-semibold text-blue-300 text-base border border-blue-500/40 hover:bg-blue-500/10 transition-all hover:-translate-y-0.5"
            >
              See How It Works
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-16">
            {[
              { val: '$50',            lbl: 'Earned per pharmacy' },
              { val: String(liveStores), lbl: 'Stores live in network' },
              { val: '100+',           lbl: 'Target network size' },
            ].map((s, i) => (
              <div key={i} className="stat-card rounded-xl p-5 text-center">
                <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {s.val}
                </div>
                <div className="text-slate-400 text-xs mt-1">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="section-alt py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className={sectionTag}>How it works</div>
          <h2 className={h2}>Three steps.<br />That&apos;s all it takes.</h2>
          <p className={sub}>No sales experience, no office. Walk in, set up, snap a photo, get paid.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            {[
              { n: '01', title: 'Get Assigned a Pharmacy',     desc: 'We match you with pharmacies in your area and send you brand materials and a clear brief before your visit.' },
              { n: '02', title: 'Visit & Set Up the Display',  desc: 'Introduce yourself, place the products on shelf, arrange the display per our simple guide. Usually under 30 minutes.' },
              { n: '03', title: 'Submit Photos & Get Paid',    desc: 'Take 2–3 photos of the completed shelf placement, upload via our portal, and $50 hits your account within 48 hours.' },
              { n: '04', title: 'Grow Your Earnings',          desc: 'The more pharmacies you cover, the more you earn. Top partners build routes of 10–20 stores per cycle.' },
            ].map(s => (
              <div key={s.n} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 hover:border-blue-500/25 hover:-translate-y-1 transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center font-extrabold text-xs text-blue-400 mb-5">
                  {s.n}
                </div>
                <div className="font-bold text-base mb-2.5">{s.title}</div>
                <div className="text-slate-400 text-sm leading-relaxed">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EARNINGS CALCULATOR ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className={sectionTag}>Earnings calculator</div>
          <h2 className={h2}>See what you could make.</h2>
          <p className={sub}>Drag the sliders and see your estimated earnings in real time.</p>
          <EarningsCalc />
        </div>
      </section>

      {/* ── LIVE ACTIVITY ── */}
      <section className="section-alt py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className={sectionTag}>Network activity</div>
          <h2 className={h2}>Real partners. Real placements.</h2>
          <p className={sub}>Live updates from our growing network of field partners across New Zealand.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
            {ACTIVITY_EVENTS.map((e, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/20 flex items-center justify-center font-bold text-xs text-blue-400 shrink-0">
                  {e.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{e.name}</div>
                  <div className="text-slate-400 text-xs mt-0.5 truncate">{e.action} · {e.time}</div>
                </div>
                <div className="text-emerald-400 font-bold text-sm shrink-0">{e.earn}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHARMACY NETWORK ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className={sectionTag}>Our early network</div>
          <h2 className={h2}>
            Already live in{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {PHARMACIES.length} pharmacies
            </span>.
          </h2>
          <p className={sub}>We started small and built trust first. Every store in our network has been personally onboarded.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {PHARMACIES.map((p, i) => (
              <div key={i} className="flex items-start gap-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl px-5 py-5 hover:border-blue-500/20 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/12 border border-emerald-500/20 flex items-center justify-center text-lg shrink-0">💊</div>
                <div>
                  <div className="font-semibold text-sm">{p.name}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{p.loc}</div>
                  <div className="flex items-center gap-1.5 mt-2 text-emerald-400 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Live · {p.brands} {p.brands === 1 ? 'brand' : 'brands'} placed
                  </div>
                </div>
              </div>
            ))}
            {/* Open slot */}
            <div className="flex items-start gap-4 bg-white/[0.02] border border-dashed border-blue-500/20 rounded-2xl px-5 py-5 opacity-60">
              <div className="w-9 h-9 rounded-lg bg-blue-500/8 border border-blue-500/15 flex items-center justify-center text-lg shrink-0">➕</div>
              <div>
                <div className="font-semibold text-sm text-slate-400">Your city, next</div>
                <div className="text-slate-500 text-xs mt-0.5">Be the one to onboard it</div>
                <div className="flex items-center gap-1.5 mt-2 text-blue-400 text-xs font-semibold">
                  Open slot
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY JOIN ── */}
      <section className="section-alt py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className={sectionTag}>Why join</div>
          <h2 className={h2}>Built for people who<br />value their time.</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              { icon: '⚡', title: 'Fast Payouts',      desc: 'Payment within 48 hours of photo approval. No chasing invoices.' },
              { icon: '📍', title: 'Work Your Area',    desc: 'We match you to pharmacies near you. No long commutes.' },
              { icon: '📈', title: 'Scale At Your Pace',desc: 'Start with 2–3 stores. Build up to 20+. You control the volume.' },
              { icon: '🤝', title: 'Backed by Magic Lab',desc: 'An AI marketing company operating across ANZ. Reliable, structured, transparent.' },
            ].map(w => (
              <div key={w.title} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 hover:border-blue-500/25 hover:-translate-y-1 transition-all">
                <div className="text-3xl mb-4">{w.icon}</div>
                <div className="font-bold text-base mb-2.5">{w.title}</div>
                <div className="text-slate-400 text-sm leading-relaxed">{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className={sectionTag}>FAQ</div>
          <h2 className={h2}>Questions answered.</h2>
          <FaqList />
        </div>
      </section>

      {/* ── APPLY ── */}
      <section
        id="apply"
        className="py-24 px-6"
        style={{ background: 'linear-gradient(160deg,#0f172a,#111827,#1a1f35)' }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <div className={sectionTag}>Join the network</div>
          <h2 className={h2}>Ready to start earning?</h2>
          <p className={sub + ' mx-auto'}>Applications take under 3 minutes. We&apos;ll be in touch within 24 hours.</p>

          <div className="max-w-lg mx-auto mt-14 bg-white/[0.03] border border-blue-500/18 rounded-2xl p-10 text-left">
            <ApplyForm />
          </div>
        </div>
      </section>

      {/* ── FOOTER NOTE ── */}
      <div className="text-center py-8 px-6 border-t border-white/[0.06] text-slate-500 text-sm">
        <strong className="text-white">Magic Network</strong> — a product of{' '}
        <Link href="/" className="text-blue-400 hover:underline">Magic Lab</Link>.
        Helping ANZ health brands reach pharmacy shelves.
      </div>
    </>
  );
}
