import { useState } from "react";
import { Button } from "../../../Components/Button/Button";
import { Input } from "../../../Components/Input/Input";
import { Text } from "../../../Components/Text/Text";
import { Sparkles, User, Mail, Lock } from "lucide-react";
import styles from "./AdminReg.module.css";
import { Link, useNavigate } from "react-router-dom";
import React from "react";

export const Register = () => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    const full_name = data.get("full_name")?.toString().trim();
    const email = data.get("email")?.toString().trim();
    const password = data.get("password")?.toString();
    const confirm = data.get("conf_password")?.toString();

    const newErrors: { [key: string]: string } = {};

    if (!full_name) newErrors.full_name = "Full name is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (!confirm) newErrors.conf_password = "Please confirm your password";

    if (password && confirm && password !== confirm) {
      newErrors.conf_password = "Passwords do not match";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (password && !passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters and contain letters and numbers";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    const payload = { full_name, email, password };

    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL ||
      "https://tango-hotel-backend.onrender.com";

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server response:", text);
        setGeneralError(`Registration failed: ${res.statusText}`);
        setLoading(false);
        return;
      }

      const result = await res.json();
      console.log("Admin registered:", result);

      localStorage.setItem("adminToken", result.token);
      localStorage.setItem("adminEmail", result.admin.email);
      localStorage.setItem("adminName", result.admin.full_name);

      setTimeout(() => {
        navigate("/admin/login");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
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
            <span>Admin Registration</span>
            <Sparkles size={16} className={styles.sparkleIcon} />
          </div>
        </div>

        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <Text variant="h2">Create Admin Account</Text>
            <p className={styles.formSubtitle}>
              Register to manage Tango Hotel
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {generalError && (
              <p className={styles.generalError}>{generalError}</p>
            )}

            <Input
              type="text"
              label="Full Name"
              name="full_name"
              placeholder="Enter full name"
              icon={User}
              error={errors.full_name}
            />
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
            <Input
              type={showConfirm ? "text" : "password"}
              label="Confirm Password"
              name="conf_password"
              placeholder="Repeat password"
              icon={Lock}
              error={errors.conf_password}
              rightIcon={showConfirm ? "eye-off" : "eye"}
              onRightIconClick={() => setShowConfirm(!showConfirm)}
            />

            <Button
              type="submit"
              className={styles.SubmitButton}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register Admin"}
            </Button>

            <div className={styles.divider}>
              <span>Already registered?</span>
            </div>

            <Link to="/admin/login" className={styles.switchButton}>
              Sign In
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

export default Register;
