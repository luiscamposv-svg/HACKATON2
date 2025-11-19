import { ReactNode } from 'react';

interface Props {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

const Card = ({ title, subtitle, action, children, className = '' }: Props) => (
  <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 ${className}`}>
    {(title || action) && (
      <header className="mb-4 flex items-center justify-between gap-4">
        <div>
          {title && <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>}
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        {action}
      </header>
    )}
    <div className="text-sm text-slate-600 dark:text-slate-300">{children}</div>
  </section>
);

export default Card;
