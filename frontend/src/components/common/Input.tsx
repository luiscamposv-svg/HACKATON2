import { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = ({ label, error, className = '', ...props }: Props) => (
  <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
    {label}
    <input
      className={`rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 ${className}`}
      {...props}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </label>
);

export default Input;
