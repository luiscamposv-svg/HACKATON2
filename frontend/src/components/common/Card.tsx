import { ReactNode } from 'react';

interface Props {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

const Card = ({ title, subtitle, action, children }: Props) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    {(title || action) && (
      <header className="mb-4 flex items-center justify-between gap-4">
        <div>
          {title && <h2 className="text-lg font-semibold text-slate-900">{title}</h2>}
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
        {action}
      </header>
    )}
    <div className="text-sm text-slate-600">{children}</div>
  </section>
);

export default Card;
