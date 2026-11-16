export function Section({ id, step, title, subtitle, children }) {
  return (
    <section id={id} className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(16,24,64,.04),0_10px_30px_-18px_rgba(16,24,64,.18)] sm:p-7 print:rounded-none print:border-0 print:p-0 print:shadow-none">
      <div className="mb-6 flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-100 text-sm font-extrabold text-navy">{step}</span>
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-navy">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-slate-500 print:hidden">{subtitle}</p>}
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

export const GroupLabel = ({ children, htmlFor }) =>
  htmlFor ? (
    <label htmlFor={htmlFor} className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">{children}</label>
  ) : (
    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">{children}</p>
  );

/** Tombol pilihan (radio) bergaya segmented */
export function Segmented({ label, options, value, onChange, cols = 3 }) {
  return (
    <div>
      {label && <p className="mb-1.5 text-xs font-semibold text-slate-600">{label}</p>}
      <div role="radiogroup" aria-label={label} className={`grid gap-1.5 ${cols === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl border px-2 py-2 text-center text-[13px] font-bold leading-tight transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 ${
                active ? 'border-brand-500 bg-brand-50 text-navy shadow-[inset_0_0_0_1px_#7669DF]' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700'
              } ${active ? '' : 'print:hidden'}`}
            >
              {o.icon}
              <span>{o.label}</span>
              {o.hint && <span className={`text-[11px] font-medium ${active ? 'text-brand-600' : 'text-slate-400'}`}>{o.hint}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const inputCls = (error) =>
  `w-full rounded-xl border bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition placeholder:text-slate-400 focus:ring-4 ${
    error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 hover:border-slate-300 focus:border-brand-500 focus:ring-brand-100'
  }`;

export function NumberField({ id, label, value, onChange, suffix, placeholder, error, hint }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</label>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className={`${inputCls(error)} ${suffix ? 'pr-10' : ''}`}
        />
        {suffix && <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm font-semibold text-slate-400">{suffix}</span>}
      </div>
      {error ? (
        <p id={`${id}-err`} className="mt-1 text-xs font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextField({ id, label, value, onChange, placeholder, type = 'text', maxLength }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</label>
      <input id={id} type={type} value={value} placeholder={placeholder} maxLength={maxLength} onChange={(e) => onChange(e.target.value)} className={inputCls(false)} />
    </div>
  );
}

export function IconButton({ label, onClick, danger, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`grid h-9 w-9 place-items-center rounded-lg transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 ${
        danger ? 'text-slate-400 hover:bg-red-50 hover:text-red-600' : 'text-slate-400 hover:bg-slate-100 hover:text-navy'
      }`}
    >
      {children}
    </button>
  );
}

export function Callout({ tone = 'info', children, icon }) {
  const tones = {
    info: 'bg-slate-50 text-slate-600 ring-slate-200/70',
    warn: 'bg-amber-50 text-amber-900 ring-amber-200',
    brand: 'bg-brand-50 text-slate-700 ring-brand-200',
  };
  return (
    <div className={`flex gap-2.5 rounded-xl px-3.5 py-3 text-[13px] leading-relaxed ring-1 ${tones[tone]}`}>
      {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
      <div className="min-w-0">{children}</div>
    </div>
  );
}
