import { type LucideIcon, Eye, EyeOff } from 'lucide-react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  rightIcon?: 'eye' | 'eye-off';
  onRightIconClick?: () => void;
}

export const Input = ({
  label,
  icon: Icon,
  error,
  rightIcon,
  onRightIconClick,
  ...props
}: InputProps) => {
  return (
    <div className={styles.inputGroup}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrapper}>
        {Icon && <Icon className={styles.icon} size={20} />}
        <input
          className={`${styles.input} ${Icon ? styles.inputWithIcon : ''} ${error ? styles.inputError : ''}`}
          {...props}
        />
        {rightIcon && (
          <button
            type="button"
            className={styles.togglePassword}
            onClick={onRightIconClick}
          >
            {rightIcon === 'eye' ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        )}
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
