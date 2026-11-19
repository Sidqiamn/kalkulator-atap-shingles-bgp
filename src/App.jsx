import { useCallback, useEffect, useMemo, useState } from 'react';
import { PRODUCTS, DEFAULT_PRODUCT } from './config';
import { TEMPLATES } from './lib/constants';
import { makePlane, normalizePlane, bumpIdSeed, withRec, evalPlane, summarize, hasData, carryFrom } from './lib/calc';
import { buildSummary } from './lib/summary';
import { m2 } from './lib/format';
import ProjectInfo from './components/ProjectInfo';
import PlaneCard from './components/PlaneCard';
import ResultPanel from './components/ResultPanel';
import Mascot from './components/Mascot';
import { Section } from './components/ui';
import { IconPlus, IconUndo, IconCalc } from './components/icons';

const STORAGE_KEY = 'gnet-kalkulator-atap:v2';
const today = () => new Date().toLocaleDateString('sv-SE');

function freshState() {
  return { project: '', date: today(), product: DEFAULT_PRODUCT, tpl: 'satu', planes: [makePlane()] };
}

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s || !Array.isArray(s.planes) || !s.planes.length) return null;
    // Waste yang tidak diubah manual ikut rekomendasi terbaru di config.js
    const planes = s.planes.map((p) => withRec(normalizePlane(p)));
    bumpIdSeed(planes);
    const product = PRODUCTS.some((p) => p.id === s.product) ? s.product : DEFAULT_PRODUCT;
    const tpl = s.tpl in TEMPLATES || s.tpl === 'custom' ? s.tpl : 'custom';
    return { project: s.project || '', date: s.date || today(), product, tpl, planes };
  } catch {
    return null;
  }
}

function saveState(s) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    return true;
  } catch {
    return false;
  }
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const t = document.createElement('textarea');
    t.value = text;
    document.body.append(t);
    t.select();
    const ok = document.execCommand('copy');
    t.remove();
    return ok;
  }
}

export default function App() {
  const [state, setState] = useState(() => loadState() ?? freshState());
  const [tplUndo, setTplUndo] = useState(null);
  const [collapsed, setCollapsed] = useState(() => new Set());
  const [toast, setToast] = useState(null);
  const [saved, setSaved] = useState(false);

  const product = PRODUCTS.find((p) => p.id === state.product) ?? PRODUCTS[0];
  const results = useMemo(() => state.planes.map(evalPlane), [state.planes]);
  const sum = useMemo(() => summarize(results, product.coverage), [results, product.coverage]);

  useEffect(() => {
    setSaved(saveState(state));
  }, [state]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), toast.action ? 6000 : 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const setField = (k, v) => setState((s) => ({ ...s, [k]: v }));

  const updatePlane = useCallback((id, patch) => {
    setState((s) => ({
      ...s,
      planes: s.planes.map((p) => {
        if (p.id !== id) return p;
        const np = { ...p, ...patch };
        return 'mode' in patch || 'shape' in patch ? withRec(np) : np;
      }),
    }));
  }, []);

  const scrollToPlane = (id) => {
    setCollapsed((c) => {
      if (!c.has(id)) return c;
      const n = new Set(c);
      n.delete(id);
      return n;
    });
    setTimeout(() => document.getElementById(`plane-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  };

  const applyTemplate = (k) => {
    if (k === state.tpl) return;
    const snapshot = state.planes.some(hasData) ? { tpl: state.tpl, planes: state.planes } : null;
    const carry = carryFrom(state.planes.find((p) => p.mode !== 'area'));
    const planes = TEMPLATES[k].planes.map(([name, shape]) => makePlane({ ...carry, name, shape }));
    setState((s) => ({ ...s, tpl: k, planes }));
    setTplUndo(snapshot);
    setCollapsed(new Set());
  };

  const undoTemplate = () => {
    if (!tplUndo) return;
    setState((s) => ({ ...s, tpl: tplUndo.tpl, planes: tplUndo.planes }));
    setTplUndo(null);
  };

  const addPlane = () => {
    const np = makePlane(carryFrom(state.planes[state.planes.length - 1]));
    setState((s) => ({ ...s, tpl: 'custom', planes: [...s.planes, np] }));
    setTplUndo(null);
    scrollToPlane(np.id);
  };

  const duplicatePlane = (id) => {
    const idx = state.planes.findIndex((p) => p.id === id);
    const src = state.planes[idx];
    const copy = makePlane({ ...src, name: src.name ? `${src.name} (salinan)` : '' });
    setState((s) => {
      const planes = [...s.planes];
      planes.splice(idx + 1, 0, copy);
      return { ...s, tpl: 'custom', planes };
    });
    setTplUndo(null);
    scrollToPlane(copy.id);
  };

  const removePlane = (id) => {
    const idx = state.planes.findIndex((p) => p.id === id);
    const removed = state.planes[idx];
    const prevTpl = state.tpl;
    setState((s) => ({ ...s, tpl: 'custom', planes: s.planes.filter((p) => p.id !== id) }));
    setTplUndo(null);
    setToast({
      msg: `${removed.name || `Bidang ${idx + 1}`} dihapus`,
      action: {
        label: 'Batalkan',
        fn: () =>
          setState((s) => {
            const planes = [...s.planes];
            planes.splice(idx, 0, removed);
            return { ...s, tpl: prevTpl, planes };
          }),
      },
    });
  };

  const toggleCollapse = (id) =>
    setCollapsed((c) => {
      const n = new Set(c);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const resetAll = () => {
    const prev = state;
    setState(freshState());
    setTplUndo(null);
    setCollapsed(new Set());
    setToast({ msg: 'Estimasi baru dimulai', action: { label: 'Batalkan', fn: () => setState(prev) } });
  };

  const copySummary = async () => {
    if (!sum.complete) return;
    const ok = await copyText(buildSummary({ state, product, planes: state.planes, results, sum }));
    setToast({ msg: ok ? 'Ringkasan disalin ke clipboard' : 'Browser membatasi fitur salin. Gunakan Cetak / PDF.' });
  };

  return (
    <div className="min-h-screen pb-28 lg:pb-12 print:pb-0">
      <header className="relative overflow-hidden bg-gradient-to-br from-navy via-navy-700 to-navy-600 text-white print:bg-none print:text-navy">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[.06] print:hidden"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="xl:pr-44 2xl:pr-0 print:pr-0">
        <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:pt-10 print:pb-4 print:pt-0">
          <div className="flex items-start justify-between gap-4">
            <p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-indigo-200 print:text-slate-500">GNET • Sales &amp; Project Tool</p>
            <p className="text-3xl font-black tracking-tighter">
              gnet<span className="text-accent">.</span>
            </p>
          </div>
          <h1 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">Kalkulator Kebutuhan Atap Shingles</h1>
          <p className="mt-3 max-w-2xl text-sm text-indigo-100 sm:text-base print:text-slate-600">
            Estimasi luas bidang atap dan jumlah bundle untuk presentasi klien, kontraktor, dan developer.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold print:hidden">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15">
              <IconCalc className="h-3.5 w-3.5" /> Hitung otomatis
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15">
              <span className={`h-1.5 w-1.5 rounded-full ${saved ? 'bg-emerald-300' : 'bg-slate-300'}`} />
              {saved ? 'Draft tersimpan di perangkat ini' : 'Draft tidak tersimpan'}
            </span>
          </div>
        </div>
        </div>
      </header>

      {/* ≥1280px: konten digeser 176px ke kiri supaya pojok kanan bawah bebas untuk karakter asisten */}
      <div className="xl:pr-44 2xl:pr-0 print:pr-0">
      <main className="relative mx-auto -mt-16 grid max-w-6xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_370px] print:mt-0 print:block">
        <div className="min-w-0 space-y-6">
          <ProjectInfo
            state={state}
            setField={setField}
            onTemplate={applyTemplate}
            canUndo={!!tplUndo}
            onUndoTemplate={undoTemplate}
            planeCount={state.planes.length}
          />

          <Section id="bidang" step="02" title="Bidang Atap" subtitle="Isi ukuran setiap bidang. Waste dihitung per bidang sesuai bentuknya, lalu semua bidang dijumlahkan.">
            <div className="space-y-4">
              {state.planes.map((p, i) => (
                <PlaneCard
                  key={p.id}
                  plane={p}
                  index={i}
                  result={results[i]}
                  collapsed={collapsed.has(p.id)}
                  onToggle={() => toggleCollapse(p.id)}
                  onChange={(patch) => updatePlane(p.id, patch)}
                  onRemove={() => removePlane(p.id)}
                  onDuplicate={() => duplicatePlane(p.id)}
                />
              ))}
              {!state.planes.length && (
                <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">Belum ada bidang. Tambahkan bidang atau pilih bentuk atap di atas.</p>
              )}
            </div>
            <button
              type="button"
              onClick={addPlane}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/50 px-4 py-4 text-sm font-extrabold text-navy transition hover:border-brand-500 hover:bg-brand-50 print:hidden"
            >
              <IconPlus /> Tambah bidang atap
            </button>

            <details className="group rounded-2xl bg-slate-50 p-4 text-[13px] leading-relaxed text-slate-600 ring-1 ring-slate-100 print:hidden">
              <summary className="cursor-pointer list-none font-bold text-navy">
                <span className="mr-1 inline-block transition group-open:rotate-90">›</span> Panduan cara mengukur
              </summary>
              <ul className="mt-3 space-y-1.5 pl-1">
                <li><b>Dari Denah</b>: ukuran dari gambar tampak atas (horizontal). Luas dikoreksi dengan sudut (÷ cos sudut). Jika sudut belum diketahui, isi alas &amp; tinggi dari gambar tampak samping.</li>
                <li><b>Di Atas Atap</b>: ukuran diambil langsung di permukaan miring, jadi tidak perlu sudut.</li>
                <li><b>Luas Aktual</b>: luas permukaan atap yang sudah dihitung QS/kontraktor.</li>
                <li>Rumus bentuk: persegi = a × t • trapesium = (a + b) ÷ 2 × t • segitiga = a × t ÷ 2.</li>
                <li>Ukuran harus sudah termasuk overstek bila overstek ditutup shingles.</li>
              </ul>
            </details>
          </Section>
        </div>

        <aside id="hasil" className="lg:sticky lg:top-6 lg:self-start print:mt-6">
          <ResultPanel sum={sum} product={product} planes={state.planes} results={results} onCopy={copySummary} onPrint={() => window.print()} onReset={resetAll} onJump={scrollToPlane} />
        </aside>
      </main>

      <footer className="mx-auto mt-10 max-w-6xl px-4 text-xs text-slate-500 sm:px-6 print:mt-4">
        GNET Atap Shingles | Kalkulator estimasi • Seluruh perhitungan dilakukan di browser perangkat Anda. Tidak mengirim data proyek ke server.
      </footer>
      </div>

      {/* Bar ringkas di HP */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-navy/95 px-4 py-3 text-white backdrop-blur lg:hidden print:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-200">Jumlah bundle</p>
            <p className="text-2xl font-extrabold leading-tight tabular-nums">
              {sum.complete ? `${sum.bundles} bundle` : '—'}
              {sum.complete && <span className="ml-2 text-xs font-semibold text-indigo-200">{m2(sum.order)}</span>}
            </p>
          </div>
          <a href="#hasil" className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-[#FFD2A6] ring-1 ring-white/15">
            Rincian ↓
          </a>
        </div>
      </div>

      <Mascot sum={sum} product={product} />

      {toast && (
        <div role="status" className="fixed inset-x-0 bottom-24 z-30 flex justify-center px-4 lg:bottom-6 print:hidden">
          <div className="flex animate-slide-up items-center gap-4 rounded-2xl bg-ink px-4 py-3 text-sm text-white shadow-2xl">
            <span>{toast.msg}</span>
            {toast.action && (
              <button
                type="button"
                onClick={() => {
                  toast.action.fn();
                  setToast(null);
                }}
                className="inline-flex items-center gap-1 font-bold text-[#FFD2A6]"
              >
                <IconUndo className="h-3.5 w-3.5" /> {toast.action.label}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
