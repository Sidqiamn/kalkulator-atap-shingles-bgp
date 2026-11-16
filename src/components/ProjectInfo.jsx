import { PRODUCTS } from '../config';
import { TEMPLATES, TEMPLATE_INFO } from '../lib/constants';
import { f2 } from '../lib/format';
import { Section, GroupLabel, TextField, Callout } from './ui';
import { ProductPattern, RoofIcon, IconCheck, IconInfo, IconUndo } from './icons';

export default function ProjectInfo({ state, setField, onTemplate, canUndo, onUndoTemplate, planeCount }) {
  const tpl = state.tpl;
  return (
    <Section id="info" step="01" title="Informasi Proyek" subtitle="Data proyek, tipe shingles, dan bentuk atap.">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField id="project" label="Nama proyek / klien" value={state.project} onChange={(v) => setField('project', v)} placeholder="Contoh: Villa Bandung" maxLength={100} />
        <TextField id="date" type="date" label="Tanggal estimasi" value={state.date} onChange={(v) => setField('date', v)} />
      </div>

      <div>
        <GroupLabel>Tipe GNET Atap Shingles</GroupLabel>
        <div role="radiogroup" aria-label="Tipe GNET Atap Shingles" className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {PRODUCTS.map((p) => {
            const active = p.id === state.product;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setField('product', p.id)}
                className={`relative flex flex-col items-start gap-2 rounded-2xl border p-3.5 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 ${
                  active ? 'border-navy bg-brand-50 shadow-[inset_0_0_0_1px_#180F5E]' : 'border-slate-200 bg-white hover:border-slate-300'
                } ${active ? '' : 'print:hidden'}`}
              >
                <ProductPattern id={p.id} className={`h-7 w-10 ${active ? 'text-navy' : 'text-slate-400'}`} />
                <span className={`text-sm font-extrabold ${active ? 'text-navy' : 'text-slate-700'}`}>{p.name}</span>
                <span className="text-xs font-medium text-slate-500">{f2(p.coverage)} m²/bundle</span>
                {active && (
                  <span className="absolute right-2.5 top-2.5 grid h-5 w-5 place-items-center rounded-full bg-navy text-white">
                    <IconCheck className="h-3 w-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="print:hidden">
        <GroupLabel>Bentuk atap</GroupLabel>
        <div role="radiogroup" aria-label="Bentuk atap" className="grid grid-cols-3 gap-2.5">
          {Object.entries(TEMPLATES).map(([k, t]) => {
            const active = k === tpl;
            return (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onTemplate(k)}
                className={`relative flex flex-col items-center gap-1 rounded-2xl border px-2 pb-3 pt-3.5 text-center transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 ${
                  active ? 'border-navy bg-navy text-white shadow-lg shadow-navy/20' : 'border-slate-200 bg-white text-slate-500 hover:border-brand-500 hover:text-navy'
                }`}
              >
                <RoofIcon tpl={k} className="h-8 w-12 sm:h-9 sm:w-14" />
                <span className="text-sm font-extrabold">{t.label}</span>
                <span className={`text-[11px] font-medium ${active ? 'text-indigo-200' : 'text-slate-400'}`}>{t.hint}</span>
                {active && (
                  <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-accent text-white">
                    <IconCheck className="h-3 w-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="mt-3">
          <Callout tone="brand" icon={<IconInfo className="h-4 w-4 text-brand-600" />}>
            <b className="text-navy">{tpl === 'custom' ? `Kustom: ${planeCount} bidang.` : `${TEMPLATES[tpl].label}.`}</b> {TEMPLATE_INFO[tpl]}
            {canUndo && (
              <span className="mt-1.5 flex flex-wrap items-center gap-1.5 text-amber-800">
                Ukuran bidang sebelumnya sudah diganti.
                <button type="button" onClick={onUndoTemplate} className="inline-flex items-center gap-1 font-bold text-brand-600 underline underline-offset-2">
                  <IconUndo className="h-3.5 w-3.5" /> Batalkan
                </button>
              </span>
            )}
          </Callout>
        </div>
      </div>

      <p className="border-l-[3px] border-accent pl-3 text-xs leading-relaxed text-slate-500">
        Cakupan per bundle mengacu E-Catalog GNET Atap Shingles 2026. Asumsi: angka m²/bundle adalah cakupan pemasangan efektif; wajib dikonfirmasi sebelum penawaran final.
      </p>
    </Section>
  );
}
