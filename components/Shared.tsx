import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 ${className}`}>
    {children}
  </div>
);

export const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'fun' | 'glass';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
}> = ({ children, variant = 'primary', onClick, className = '', disabled, fullWidth, type = 'button' }) => {
  
  const baseStyles = "px-6 py-3.5 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 tracking-tight";
  
  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/30",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30",
    outline: "border-2 border-slate-200 text-slate-600 hover:border-brand-200 hover:text-brand-600",
    fun: "bg-gradient-to-r from-fun-500 to-orange-500 text-white shadow-lg shadow-fun-500/30 rounded-full",
    glass: "bg-white/20 backdrop-blur-md text-white hover:bg-white/30 border border-white/30"
  };

  return (
    <button 
      type={type}
      disabled={disabled}
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900/60 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-display font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center">✕</button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
            {children}
        </div>
      </div>
    </div>
  );
};

export const AmountDisplay: React.FC<{ amount: number; currency?: string; className?: string }> = ({ amount, currency = '₵', className = '' }) => {
    const isNegative = amount < 0;
    return (
        <span className={`font-display font-bold tracking-tight ${className} ${isNegative ? 'text-slate-900' : ''}`}>
            {isNegative ? '-' : ''}{currency}{Math.abs(amount).toFixed(2)}
        </span>
    );
};