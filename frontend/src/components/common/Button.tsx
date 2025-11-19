import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: ReactNode;
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400',
  secondary: 'bg-white text-brand-700 border border-brand-200 hover:bg-brand-50 dark:bg-slate-900 dark:text-brand-200 dark:border-slate-700',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
};

const Button = ({ children, variant = 'primary', className = '', icon, ...props }: ButtonProps) => (
  <button
    className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600 ${variantStyles[variant]} ${className}`}
    {...props}
  >
    {icon}
    {children}
  </button>
);

export default Button;
