import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useAnimate, useReducedMotion } from 'motion/react';
import MascotFigure, { MascotHead } from './MascotFigure';

const STORAGE_KEY = 'gnet-kalkulator-atap:asisten';
const GREETING_MS = 3200;
const BUBBLE_MS = 7000;

/** Nilai yang baru berubah setelah stabil selama `ms` (supaya tidak berkedip saat mengetik) */
function useSettled(value, ms) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

/** Bawaan: layar kecil (<1024px) mulai dalam bentuk avatar kecil agar tidak menutupi form */
function readMinimized() {
  let saved = null;
  try {
    saved = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    /* penyimpanan tidak tersedia */
  }
  if (saved === 'min') return true;
  if (saved === 'open') return false;
  return window.innerWidth < 1024;
}

function getMessage(sum, product, greeting) {
  if (greeting) return { mood: 'wave', title: 'Selamat datang', text: 'Saya siap membantu menghitung kebutuhan atap shingles Anda.' };
  if (sum.complete) {
    return { mood: 'happy', title: 'Estimasi siap', text: `Total ${sum.bundles} bundle ${product.name}. Siap digunakan untuk penawaran awal.` };
  }
  if (sum.errorCount) {
    return { mood: 'concern', title: 'Mohon dicek kembali', text: `Ada ${sum.errorCount} bidang dengan input yang perlu diperiksa.` };
  }
  if (!sum.count) return { mood: 'idle', title: 'Belum ada bidang', text: 'Silakan tambahkan bidang atap terlebih dahulu.' };
  return { mood: 'idle', title: 'Menunggu ukuran', text: `Silakan lengkapi ukuran ${sum.pending} bidang lagi.` };
}

export default function Mascot({ sum, product }) {
  const reduce = useReducedMotion();
  const [greeting, setGreeting] = useState(true);
  const [minimized, setMinimized] = useState(readMinimized);
  const [bubble, setBubble] = useState(true);
  const hideTimer = useRef();

  useEffect(() => {
    const t = setTimeout(() => setGreeting(false), GREETING_MS);
    return () => clearTimeout(t);
  }, []);

  const setMin = (v) => {
    setMinimized(v);
    try {
      window.localStorage.setItem(STORAGE_KEY, v ? 'min' : 'open');
    } catch {
      /* penyimpanan tidak tersedia: abaikan */
    }
  };

  const liveKey = JSON.stringify(getMessage(sum, product, greeting));
  const msg = JSON.parse(useSettled(liveKey, greeting ? 0 : 450));
  const [scope, animate] = useAnimate();

  const showFor = (ms = BUBBLE_MS) => {
    setBubble(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setBubble(false), ms);
  };

  // tampilkan balon tiap kali pesan berubah
  useEffect(() => {
    showFor();
    return () => clearTimeout(hideTimer.current);
  }, [msg.text]);

  // lompat kecil saat hasil lengkap / jumlah bundle berubah
  const jumpKey = msg.mood === 'happy' ? msg.text : '';
  useEffect(() => {
    if (!jumpKey || reduce || !scope.current) return;
    animate(scope.current, { y: [0, -14, 0, -5, 0] }, { duration: 0.75, ease: 'easeOut' });
  }, [jumpKey, reduce, animate, scope]);

  return (
    <div className="pointer-events-none fixed bottom-[92px] right-2 z-20 flex items-end gap-1 lg:bottom-5 lg:right-5 print:hidden">
      {/* HP & tablet: balon di kiri karakter (muncul sebentar). Layar ≥1280px: balon di atas kepala, di ruang kanan yang dikosongkan. */}
      <AnimatePresence initial={false} mode="popLayout">
        {minimized ? (
          <motion.button
            key="mini"
            type="button"
            onClick={() => {
              setMin(false);
              showFor();
            }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 24 }}
            aria-label="Tampilkan asisten GNET"
            className="pointer-events-auto relative mb-1 grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-white shadow-xl shadow-navy/20 ring-2 ring-white hover:ring-brand-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
          >
            <span className="absolute inset-0 bg-gradient-to-br from-brand-100 to-white" />
            <span className="relative h-12 w-12 translate-y-1">
              <MascotHead mood={msg.mood} />
            </span>
            {sum.complete && (
              <span className="absolute -right-0.5 -top-0.5 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-extrabold text-white ring-2 ring-white">{sum.bundles}</span>
            )}
          </motion.button>
        ) : (
          <motion.div
            key="full"
            className="flex items-end gap-1 xl:flex-col xl:gap-2"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          >
            <AnimatePresence>
              {bubble && (
                <motion.div
                  key="bubble"
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0, y: 8, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  style={{ originX: 1, originY: 1 }}
                  className="pointer-events-auto relative mb-16 w-[200px] rounded-2xl bg-white px-4 py-3 shadow-xl shadow-navy/15 ring-1 ring-slate-200 sm:w-[230px] lg:mb-24 xl:mb-0 xl:mr-2 xl:w-[168px]"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div key={msg.text} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}>
                      <p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-accent-700">{msg.title}</p>
                      <p className="mt-1 text-[13px] leading-snug text-ink">{msg.text}</p>
                    </motion.div>
                  </AnimatePresence>
                  {/* ekor balon: ke kanan (HP/tablet), ke bawah (layar lebar) */}
                  <span aria-hidden="true" className="absolute -right-1.5 bottom-5 h-3 w-3 rotate-45 bg-white ring-1 ring-slate-200 [clip-path:polygon(0_0,100%_0,100%_100%)] xl:hidden" />
                  <span aria-hidden="true" className="absolute -bottom-1.5 right-12 hidden h-3 w-3 rotate-45 bg-white ring-1 ring-slate-200 [clip-path:polygon(100%_0,100%_100%,0_100%)] xl:block" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <button
                type="button"
                onClick={() => setMin(true)}
                aria-label="Perkecil asisten"
                title="Perkecil asisten"
                className="pointer-events-auto absolute -left-1 top-2 z-10 grid h-6 w-6 place-items-center rounded-full bg-white text-slate-400 shadow ring-1 ring-slate-200 transition hover:text-navy lg:top-4"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 12h12" />
                </svg>
              </button>
              <button
                ref={scope}
                type="button"
                onClick={() => (bubble ? setBubble(false) : showFor())}
                aria-label={bubble ? 'Sembunyikan pesan asisten' : 'Tampilkan pesan asisten'}
                className="pointer-events-auto block w-[92px] cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 sm:w-[110px] lg:w-[140px]"
              >
                <MascotFigure mood={msg.mood} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
