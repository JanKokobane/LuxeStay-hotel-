import { useState } from 'react';
import { Button } from '../Components/Button/Button';
import { Input } from '../Components/Input/Input';
import { Text } from '../Components/Text/Text';
import { Sparkles, Mail, Lock } from 'lucide-react';
import styles from './Login.module.css';
import { Link, useNavigate } from 'react-router-dom';
import React from 'react';
import Header from '../Components/Navbar/RegHeader/Header';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const newErrors: { [key: string]: string } = {};

    const email = data.get('email')?.toString().trim();
    const password = data.get('password')?.toString().trim();

    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      return;
    }

    const payload = { email, password };
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tango-hotel-backend.onrender.com';
    const loginEndpoint = `${API_BASE_URL}/api/users/login`;

    console.log('🔐 Sending login request to:', loginEndpoint);
    console.log('📦 Payload:', payload);

    try {
      const res = await fetch(loginEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error('❌ Login failed:', result);
        setGeneralError(result.error || 'Invalid email or password');
        setLoading(false);
        return;
      }

      login(result.token); 
      alert('Login successful! Welcome back.');
      navigate('/profile');
    } catch (err) {
      console.error('🌐 Network error during login:', err);
      setGeneralError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.backgroundOverlay}></div>
      <div className={styles.contentWrapper}>
       

        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <Text variant="h2">Welcome Back</Text>
            <p className={styles.formSubtitle}>Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {generalError && <p className={styles.generalError}>{generalError}</p>}

            <Input
              type="email"
              label="Email"
              name="email"
              placeholder="user@email.com"
              icon={Mail}
              error={errors.email}
            />
            <Input
              type={showPassword ? 'text' : 'password'}
              label="Password"
              name="password"
              placeholder="••••••••"
              icon={Lock}
              error={errors.password}
              rightIcon={showPassword ? 'eye-off' : 'eye'}
              onRightIconClick={() => setShowPassword(!showPassword)}
            />

            <Button type="submit" className={styles.SubmitButton} disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <div className={styles.divider}>
              <span>New to LuxeStay?</span>
            </div>

            <Link to="/register" className={styles.switchButton}>
              Create Account
            </Link>
          </form>
        </div>

        <div className={styles.footer}>
          <p>© 2026 LuxeStay. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
