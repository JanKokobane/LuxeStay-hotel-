import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { authApi } from '../api';
import styles from './Auth.module.css';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!isLogin && !formData.name.trim()) {
      setError('Full name is required');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    // Using dummy logic as requested for easy access
    setTimeout(() => {
      const mockUser = {
        id: 'u1',
        name: formData.name || 'Guest User',
        email: formData.email || 'guest@example.com'
      };
      
      localStorage.setItem('token', 'dummy-token-123');
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setLoading(false);
      navigate('/');
      window.location.reload();
    }, 800);
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>{isLogin ? 'Welcome back' : 'Create an account'}</h1>
        
        {error && <div className={styles.alertError}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <div className={styles.relative}>
                <User className={styles.inputIcon} size={18} />
                <input 
                  type="text" 
                  className={styles.inputField} 
                  placeholder="John Doe" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
          )}
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <div className={styles.relative}>
              <Mail className={styles.inputIcon} size={18} />
              <input 
                type="email" 
                className={styles.inputField} 
                placeholder="name@example.com" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.relative}>
              <Lock className={styles.inputIcon} size={18} />
              <input 
                type="password" 
                className={styles.inputField} 
                placeholder="••••••••" 
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Log in' : 'Sign up')}
          </button>
        </form>

        <div className={styles.switch}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            className={styles.switchBtn}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
}

