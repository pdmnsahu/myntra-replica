import clsx from 'clsx';

export default function Badge({ children, variant = 'primary', className = '' }) {
  const variants = {
    primary: 'bg-primary text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    dark: 'bg-dark text-white',
    light: 'bg-light text-muted',
    outline: 'border border-primary text-primary bg-white',
  };
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}
