import { MODES, SHAPES, ANGLE_MODES, REC_NAMES } from '../lib/constants';
import { recFor, recKey } from '../lib/calc';
import { m2, f2, f1, f3, num, inputNum } from '../lib/format';
import { Segmented, NumberField, IconButton, Callout } from './ui';
import { ShapeDiagram, SlopeDiagram } from './diagrams';
import { ShapeIcon, IconCopy, IconTrash, IconChevron, IconAlert, IconInfo } from './icons';

const MODE_OPTIONS = Object.entries(MODES).map(([value, m]) => ({ value, label: m.label, hint: m.hint }));
const SHAPE_OPTIONS = Object.entries(SHAPES).map(([value, label]) => ({ value, label, icon: <ShapeIcon shape={value} /> }));
const ANGLE_OPTIONS = Object.entries(ANGLE_MODES).map(([value, m]) => ({ value, label: m.label, hint: m.hint }));

function fieldsFor(p) {
  if (p.mode === 'area') return [['area', 'Luas permukaan aktual', 'mis. 85,5', 'm²']];
  const den = p.mode === 'projection';
  const f = [['a', p.shape === 'rect' ? 'Panjang sisi talang (a)' : 'Sisi talang / bawah (a)', 'mis. 10', 'm']];
  if (p.shape === 'trap') f.push(['b', 'Sisi nok / atas (b)', 'mis. 4', 'm']);
  f.push(['t', den ? 'Kedalaman horizontal (t)' : 'Tinggi miring (t)', 'mis. 4', 'm']);
  if (den && p.angleMode !== 'unknown') f.push(['angle', 'Sudut kemiringan', 'mis. 30', '°']);
  return f;
}

function tipFor(p) {
  if (p.mode === 'area') return 'Masukkan luas permukaan miring yang sudah dihitung QS/kontraktor. Angka ini tidak dikoreksi sudut lagi.';
  if (p.mode === 'projection') {
    const base = (
      <>
        Ambil ukuran dari gambar denah atap (tampak atas), termasuk overstek. <b>t</b> = jarak horizontal dari garis talang ke garis nok/puncak.
      </>
    );
    return p.angleMode === 'unknown' ? (
      <>
        {base} Sudut dihitung otomatis dari <b>alas</b> dan <b>tinggi</b> di bawah.
      </>
    ) : (
      <>{base} Kemiringan dikoreksi otomatis.</>
    );
  }
  return (
    <>
      Ukur langsung di permukaan atap. <b>t</b> = jarak tegak lurus dari talang ke nok/puncak, menyusuri permukaan atap
      {p.shape === 'rect' ? '.' : <>, <b>bukan</b> panjang garis jurai.</>}
    </>
  );
}

function StatusBadge({ r }) {
  const map = {
    ok: ['bg-emerald-50 text-emerald-700 ring-emerald-200', 'Lengkap'],
    error: ['bg-red-50 text-red-700 ring-red-200', 'Periksa input'],
    empty: ['bg-slate-100 text-slate-500 ring-slate-200', r.need === 'waste' ? 'Isi waste' : 'Belum lengkap'],
  };
  const [cls, text] = map[r.status];
  return <span className={`hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 sm:inline-flex ${cls}`}>{text}</span>;
}

function Metric({ label, value, strong }) {
  return (
    <div className="px-2 py-3">
      <p className="text-[11px] font-semibold text-slate-500">{label}</p>
      <p className={`mt-0.5 tabular-nums ${strong ? 'text-base font-extrabold text-navy' : 'text-sm font-bold text-ink'}`}>{value}</p>
    </div>
  );
}

function NameInput({ p, index, onChange }) {
  return (
    <input
      value={p.name}
      onChange={(e) => onChange({ name: e.target.value })}
      placeholder={`Bidang ${index + 1} — beri nama, mis. Sisi depan`}
      aria-label={`Nama bidang ${index + 1}`}
      maxLength={70}
      className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-[15px] font-bold text-ink outline-none transition placeholder:font-medium placeholder:text-slate-400 hover:border-slate-200 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
    />
  );
}

function Metrics({ r }) {
  return (
    <div className="grid grid-cols-3 divide-x divide-slate-100 rounded-2xl bg-slate-50 text-center ring-1 ring-slate-100">
      <Metric label="Luas permukaan" value={r.area !== undefined ? m2(r.area) : '—'} />
      <Metric label={r.status === 'ok' ? `Waste ${inputNum(r.waste)}%` : 'Waste'} value={r.status === 'ok' ? `+${m2(r.extra)}` : '—'} />
      <Metric label="Luas order" value={r.status === 'ok' ? m2(r.order) : '—'} strong />
    </div>
  );
}

/** Bidang yang otomatis sama dengan bidang lain (Sisi belakang / Sisi kanan) */
function MirrorCard({ plane: p, index, result: r, onChange }) {
  const src = p.mirrorName || 'bidang sumber';
  const detail = p.mode === 'area' ? 'Luas aktual' : `${SHAPES[p.shape]} · ${MODES[p.mode].label}`;
  return (
    <article id={`plane-${p.id}`} className="animate-slide-up overflow-hidden rounded-2xl border border-dashed border-brand-200 bg-white print:break-inside-avoid">
      <header className="flex items-center gap-2 border-b border-brand-100 bg-brand-50/60 py-2.5 pl-3 pr-3 sm:gap-3 sm:pl-4">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-100 text-sm font-extrabold text-navy">{index + 1}</span>
        <NameInput p={p} index={index} onChange={onChange} />
        <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-brand-600 ring-1 ring-brand-200">Otomatis</span>
      </header>
      <div className="space-y-3 p-4 sm:p-5">
        <p className="flex items-start gap-2 text-[13px] leading-relaxed text-slate-600">
          <IconCopy className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
          <span>
            Ukuran, sudut, dan waste sama dengan <b className="text-navy">{src}</b> ({detail.toLowerCase()}). Untuk mengubah, isi di bidang {src}.
          </span>
        </p>
        <Metrics r={r} />
      </div>
    </article>
  );
}

export default function PlaneCard(props) {
  return props.plane.mirrorOf != null ? <MirrorCard {...props} /> : <EditableCard {...props} />;
}

function EditableCard({ plane: p, index, result: r, locked, collapsed, onToggle, onChange, onRemove, onDuplicate }) {
  const isArea = p.mode === 'area';
  const isProj = p.mode === 'projection';
  const unknown = isProj && p.angleMode === 'unknown';
  const rec = recFor(p);
  const changed = p.wasteManual && num(p.waste) !== rec;
  const fe = r.errors || {};
  const fid = (k) => `p${p.id}-${k}`;
  const title = p.name || `Bidang ${index + 1}`;

  const setMode = (v) => {
    if (v === p.mode) return;
    const patch = { mode: v };
    if (v === 'area' && String(p.area).trim() === '' && r.area !== undefined) patch.area = inputNum(Math.round(r.area * 100) / 100);
    onChange(patch);
  };

  const collapsedText = isArea ? 'Luas aktual' : `${SHAPES[p.shape]} · ${MODES[p.mode].label}`;

  return (
    <article id={`plane-${p.id}`} className="animate-slide-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:break-inside-avoid print:shadow-none">
      <header className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/70 py-2.5 pl-3 pr-2 sm:gap-3 sm:pl-4">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-navy text-sm font-extrabold text-white">{index + 1}</span>
        <NameInput p={p} index={index} onChange={onChange} />
        <StatusBadge r={r} />
        <div className="flex items-center print:hidden">
          {!locked && (
            <>
              <IconButton label={`Duplikat ${title}`} onClick={onDuplicate}><IconCopy /></IconButton>
              <IconButton label={`Hapus ${title}`} onClick={onRemove} danger><IconTrash /></IconButton>
            </>
          )}
          <IconButton label={collapsed ? `Buka ${title}` : `Ciutkan ${title}`} onClick={onToggle}>
            <IconChevron className={`h-4 w-4 transition ${collapsed ? '' : 'rotate-180'}`} />
          </IconButton>
        </div>
      </header>

      {collapsed ? (
        <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm text-slate-500 hover:bg-slate-50">
          <span className="flex items-center gap-2">
            {!isArea && <ShapeIcon shape={p.shape} className="h-4 w-7 text-slate-400" />}
            {collapsedText}
          </span>
          <span className="font-extrabold tabular-nums text-navy">{r.status === 'ok' ? m2(r.order) : '—'}</span>
        </button>
      ) : (
        <div className="space-y-5 p-4 sm:p-5">
          <Segmented label="Cara mengukur" options={MODE_OPTIONS} value={p.mode} onChange={setMode} />
          {!isArea &&
            (locked ? (
              <div>
                <p className="mb-1.5 text-xs font-semibold text-slate-600">Bentuk bidang</p>
                <p className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] font-bold text-navy">
                  <ShapeIcon shape={p.shape} className="h-4 w-7 text-slate-500" />
                  {SHAPES[p.shape]}
                  <span className="font-medium text-slate-400">· sesuai bentuk atap</span>
                </p>
              </div>
            ) : (
              <Segmented label="Bentuk bidang" options={SHAPE_OPTIONS} value={p.shape} onChange={(v) => onChange({ shape: v })} />
            ))}
          {isProj && <Segmented label="Sudut kemiringan" cols={2} options={ANGLE_OPTIONS} value={p.angleMode} onChange={(v) => onChange({ angleMode: v })} />}

          <div className="print:hidden">
            <Callout icon={<IconInfo className="h-4 w-4 text-slate-400" />}>{tipFor(p)}</Callout>
          </div>

          <div className={isArea ? '' : 'grid gap-4 sm:grid-cols-[170px_minmax(0,1fr)]'}>
            {!isArea && (
              <div className="max-w-[220px] self-start rounded-xl bg-slate-50 p-2 ring-1 ring-slate-100">
                <ShapeDiagram shape={p.shape} />
              </div>
            )}
            <div className="grid content-start gap-3 sm:grid-cols-2">
              {fieldsFor(p).map(([k, label, ph, suffix]) => (
                <NumberField key={k} id={fid(k)} label={label} value={p[k]} placeholder={ph} suffix={suffix} error={fe[k]} onChange={(v) => onChange({ [k]: v })} />
              ))}
            </div>
          </div>

          {unknown && (
            <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/60 p-4">
              <div className="grid gap-4 sm:grid-cols-[220px_minmax(0,1fr)]">
                <div className="max-w-[260px] self-start rounded-xl bg-white p-2 ring-1 ring-brand-100">
                  <SlopeDiagram />
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-extrabold text-navy">Cari sudut dari alas &amp; tinggi</h4>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      Ukur dari gambar <b>tampak samping / potongan</b> atap. <b>Alas</b> = jarak mendatar dari talang ke titik tepat di bawah nok. <b>Tinggi</b> = jarak tegak dari garis talang ke nok.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <NumberField id={fid('run')} label="Alas (mendatar)" value={p.run} placeholder="mis. 4" suffix="m" error={fe.run} onChange={(v) => onChange({ run: v })} />
                    <NumberField id={fid('rise')} label="Tinggi (tegak)" value={p.rise} placeholder="mis. 2,31" suffix="m" error={fe.rise} onChange={(v) => onChange({ rise: v })} />
                  </div>
                  <div className="rounded-xl bg-white px-3.5 py-2.5 text-xs leading-relaxed text-slate-700 ring-1 ring-brand-100">
                    {r.derived ? (
                      <>
                        Panjang miring = √(alas² + tinggi²) = <b className="text-navy">{f2(r.derived.slope)} m</b>
                        <br />
                        cos θ = alas ÷ miring = <b className="text-navy">{f3(r.derived.cos)}</b> → sudut θ ≈ <b className="text-navy">{f1(r.derived.g)}°</b>
                      </>
                    ) : (
                      <span className="text-slate-500">Isi alas dan tinggi untuk menghitung sudut.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {r.warnings.map((w) => (
            <Callout key={w} tone="warn" icon={<IconAlert className="h-4 w-4 text-amber-600" />}>{w}</Callout>
          ))}

          <div className="rounded-2xl border border-accent-100 bg-accent-50 p-4">
            <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
              <label htmlFor={fid('waste')} className="text-xs font-bold text-slate-700">Waste bidang ini</label>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-accent-700 ring-1 ring-accent-200" title={`Rekomendasi untuk ${REC_NAMES[recKey(p)]}`}>
                Rekomendasi: {inputNum(rec)}%
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-32">
                <input
                  id={fid('waste')}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={p.waste}
                  onChange={(e) => onChange({ waste: e.target.value, wasteManual: true })}
                  aria-invalid={!!fe.waste}
                  className={`w-full rounded-xl border bg-white px-3.5 py-2.5 pr-9 text-[15px] font-bold text-ink outline-none transition focus:ring-4 ${
                    fe.waste ? 'border-red-400 focus:ring-red-100' : 'border-accent-200 focus:border-accent focus:ring-accent-100'
                  }`}
                />
                <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm font-bold text-slate-400">%</span>
              </div>
              {changed ? (
                <p className="text-xs text-accent-800">
                  Diubah manual ·{' '}
                  <button type="button" onClick={() => onChange({ waste: inputNum(rec), wasteManual: false })} className="font-bold text-brand-600 underline underline-offset-2 print:hidden">
                    Pakai {inputNum(rec)}%
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-500">Sesuai rekomendasi {REC_NAMES[recKey(p)]}</p>
              )}
            </div>
            {fe.waste && <p className="mt-1.5 text-xs font-medium text-red-600">{fe.waste}</p>}
          </div>

          <Metrics r={r} />
        </div>
      )}
    </article>
  );
}
