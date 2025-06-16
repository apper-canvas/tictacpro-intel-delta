import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  className = '', 
  onClick,
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-neon-pink',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary shadow-neon-blue',
    accent: 'bg-accent text-black hover:bg-accent/90 focus:ring-accent shadow-neon-yellow',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    ghost: 'text-white hover:bg-white/10 focus:ring-white/20'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`;

  const { children: _, variant: __, size: ___, disabled: ____, className: _____, onClick: ______, ...domProps } = props;

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...domProps}
    >
      {children}
    </motion.button>
  );
};

export default Button;