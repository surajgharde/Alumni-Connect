// components/Common/Button.tsx
interface ButtonProps {
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
  }
  
  export const Button = ({ 
    variant = 'primary', 
    children, 
    className = '',
    ...props 
  }: ButtonProps) => {
    const baseStyles = 'px-6 py-2 rounded-lg font-medium transition-colors';
    
    const variants = {
      primary: 'bg-alama-primary text-white hover:bg-alama-secondary',
      secondary: 'bg-white text-alama-primary border border-alama-primary hover:bg-alama-50'
    };
  
    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };