import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import styles from './Auth.module.css';

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(location.state?.mode !== 'signup');
  useEffect(() => {
    setIsLogin(location.state?.mode !== 'signup');
  }, [location.state]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const BASE_URL = 'https://luxestay-hotel-gppc.onrender.com/api/auth';

  const authApi = {
    signup: async (formData: { name: string; email: string; password: string }) => {
      const res = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      return data;
    },

    login: async (formData: { email: string; password: string }) => {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      return data;
    },
  };

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin && !formData.name.trim()) {
      setError('Full name is required');
      return;
    }
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (formData.password.trim().length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const response = await authApi.login({
          email: formData.email.trim(),
          password: formData.password.trim(),
        });
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setLoading(false);
        // ✅ Redirect to profile page after login
        navigate('/profile');
        window.location.reload();
      } else {
        await authApi.signup({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password.trim(),
        });
        setLoading(false);
        setIsLogin(true);
        setFormData({ email: '', password: '', confirmPassword: '', name: '' });
        setError('Account created successfully. Please log in.');
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Authentication failed. Please check your credentials.';
      setError(message);
      setLoading(false);
    }
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
                  placeholder="Full Name"
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
                type={showPassword ? 'text' : 'password'}
                className={styles.inputField}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Confirm Password</label>
              <div className={styles.relative}>
                <Lock className={styles.inputIcon} size={18} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={styles.inputField}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Log in' : 'Sign up'}
          </button>
        </form>

        <div className={styles.switch}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            type="button"
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
