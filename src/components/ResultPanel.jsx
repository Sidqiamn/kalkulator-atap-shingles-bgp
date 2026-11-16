import { m2, f2, fx, inputNum } from '../lib/format';
import { IconCopy, IconPrinter, IconReset, IconAlert } from './icons';

function Row({ label, value, strong }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2.5">
      <span className="text-sm text-slate-600">{label}</span>
      <span className={`text-right tabular-nums ${strong ? 'font-extrabold text-navy' : 'font-bold text-ink'}`}>{value}</span>
    </div>
  );
}

export default function ResultPanel({ sum, product, planes, results, onCopy, onPrint, onReset, onJump }) {
  const ready = sum.complete;
  const dash = '—';
  const maxOrder = ready ? Math.max(...results.map((r) => r.order)) : 0;

  let statusText;
  if (!sum.count) statusText = 'Tambahkan minimal satu bidang atap.';
  else if (ready) statusText = `${sum.count} bidang lengkap`;
  else if (sum.errorCount) statusText = `${sum.errorCount} bidang perlu diperiksa`;
  else statusText = `Lengkapi ${sum.pending} bidang lagi`;

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-navy-700 to-navy-600 p-6 text-white shadow-xl shadow-navy/20 print:shadow-none">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[.07]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <div className="relative">
          <p className="text-[11px] font-extrabold uppercase tracking-[.18em] text-indigo-200">Jumlah bundle yang dibeli</p>
          <div className="mt-2 flex items-end gap-3">
            <span key={ready ? sum.bundles : 'x'} className="animate-pop text-7xl font-extrabold leading-none tracking-tight tabular-nums">
              {ready ? sum.bundles : dash}
            </span>
            <span className="pb-1.5 text-xl font-bold text-indigo-200">bundle</span>
          </div>
          <p className="mt-3 text-sm text-indigo-100">
            {product.name} · {f2(product.coverage)} m²/bundle
          </p>
          <p
            className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
              ready ? 'bg-emerald-400/15 text-emerald-200' : sum.errorCount ? 'bg-red-400/20 text-red-100' : 'bg-white/10 text-indigo-100'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${ready ? 'bg-emerald-300' : sum.errorCount ? 'bg-red-300' : 'bg-indigo-200'}`} />
            {statusText}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white px-5 py-2 shadow-sm print:border-0 print:px-0">
        <div className="divide-y divide-slate-100">
          <Row label="Luas permukaan aktual" value={ready ? m2(sum.area) : dash} />
          <Row label={ready ? `Waste (rata-rata ${fx(sum.avgWaste)}%)` : 'Waste semua bidang'} value={ready ? `+${m2(sum.extra)}` : dash} />
          <Row label="Luas perhitungan order" value={ready ? m2(sum.order) : dash} strong />
          <Row label={ready ? `Cakupan ${sum.bundles} × ${f2(product.coverage)} m²` : 'Cakupan bundle dibeli'} value={ready ? m2(sum.covered) : dash} />
          <Row label="Sisa cakupan teoritis*" value={ready ? m2(sum.remainder) : dash} />
        </div>
      </div>

      {ready && (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm print:border-0 print:px-0">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Rincian per bidang</p>
          <ul className="space-y-3">
            {planes.map((p, i) => {
              const r = results[i];
              return (
                <li key={p.id}>
                  <button type="button" onClick={() => onJump(p.id)} className="group w-full text-left">
                    <div className="flex items-baseline justify-between gap-3 text-[13px]">
                      <span className="min-w-0 truncate font-semibold text-slate-700 group-hover:text-navy">
                        {i + 1}. {p.name || `Bidang ${i + 1}`}
                      </span>
                      <span className="shrink-0 font-extrabold tabular-nums text-navy">{m2(r.order)}</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-navy-600 transition-all" style={{ width: `${(r.order / maxOrder) * 100}%` }} />
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {m2(r.area)} + waste {inputNum(r.waste)}%
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 print:hidden">
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-navy transition hover:border-navy disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!ready}
        >
          <IconCopy /> Salin ringkasan
        </button>
        <button
          type="button"
          onClick={onPrint}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-4 py-3 text-sm font-bold text-white transition hover:bg-navy-600 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!ready}
        >
          <IconPrinter /> Cetak / PDF
        </button>
        <button type="button" onClick={onReset} className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-navy">
          <IconReset className="h-3.5 w-3.5" /> Mulai estimasi baru
        </button>
      </div>

      <div className="flex gap-2.5 rounded-2xl bg-amber-50 p-4 text-xs leading-relaxed text-amber-900 ring-1 ring-amber-200">
        <IconAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <p>
          <b>Estimasi awal, bukan BOQ final.</b> Belum termasuk starter, nok, jurai, underlayment, flashing, dek, fastener, dan item sistem atap lainnya. *Sisa teoritis adalah kelebihan akibat pembulatan, bukan stok utuh yang pasti bisa dipakai.
        </p>
      </div>
      <p className="px-1 text-[11px] leading-relaxed text-slate-500">
        Rumus: jumlah bundle = pembulatan ke atas [Σ (luas bidang × (1 + waste bidang ÷ 100)) ÷ cakupan per bundle].
      </p>
    </div>
  );
}
