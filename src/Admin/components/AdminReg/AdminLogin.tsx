import { useState } from "react";
import { Button } from "../../../Components/Button/Button";
import { Input } from "../../../Components/Input/Input";
import { Text } from "../../../Components/Text/Text";
import { Sparkles, Mail, Lock } from "lucide-react";
import styles from "./AdminReg.module.css";
import { Link, useNavigate } from "react-router-dom";
import React from "react";

export const AdminLogin = () => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    const email = data.get("email")?.toString().trim();
    const password = data.get("password")?.toString();

    const newErrors: { [key: string]: string } = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    const payload = { email, password };
    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL ||
      "https://tango-hotel-backend.onrender.com";

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        setGeneralError(
          result.error || "Login failed. Please check your credentials."
        );
        setLoading(false);
        return;
      }

      localStorage.setItem("adminToken", result.token);
      localStorage.setItem("adminEmail", result.admin.email);
      localStorage.setItem("adminName", result.admin.full_name);

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Login error:", err);
      setGeneralError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.backgroundOverlay}></div>
      <div className={styles.contentWrapper}>
        <div className={styles.brandSection}>
          <div className={styles.tagline}>
            <Sparkles size={16} className={styles.sparkleIcon} />
            <span>Admin Login</span>
            <Sparkles size={16} className={styles.sparkleIcon} />
          </div>
        </div>

        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <Text variant="h2">Welcome Back</Text>
            <p className={styles.formSubtitle}>Sign in to manage Tango Hotel</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {generalError && (
              <p className={styles.generalError}>{generalError}</p>
            )}

            <Input
              type="email"
              label="Email"
              name="email"
              placeholder="admin@email.com"
              icon={Mail}
              error={errors.email}
            />
            <Input
              type={showPassword ? "text" : "password"}
              label="Password"
              name="password"
              placeholder="Enter password"
              icon={Lock}
              error={errors.password}
              rightIcon={showPassword ? "eye-off" : "eye"}
              onRightIconClick={() => setShowPassword(!showPassword)}
            />

            <Button
              type="submit"
              className={styles.SubmitButton}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>

            <div className={styles.divider}>
              <span>Need an account?</span>
            </div>

            <Link to="/admin/adminreg" className={styles.switchButton}>
              Register Admin
            </Link>
          </form>
        </div>

        <div className={styles.footer}>
          <p>© 2025 Tango Hotel. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
