import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import styles from "./StaffsSection.module.css";
import React from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

interface Admin {
  id: number;
  full_name: string;
  email: string;
  created_at: string;
}

function StaffsSection() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/all`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data: Admin[] = await response.json();
        setAdmins(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch admins");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  const query = searchQuery.trim().toLowerCase();

  const filteredAdmins = admins.filter((admin) => {
    if (!query) return true;
    return (
      admin.full_name?.toLowerCase().includes(query) ||
      admin.email?.toLowerCase().includes(query) ||
      admin.id.toString().includes(query)
    );
  });

  const highlightMatch = (text: string | null | undefined) => {
    if (!text) return "";
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? <mark key={i}>{part}</mark> : part
        )}
      </>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Staff Management</h2>
      </div>

      <div className={styles.searchBar}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p>Loading admins...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : filteredAdmins.length > 0 ? (
        <div className={styles.reviewsTableWrapper}>
          <table className={styles.reviewsTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin) => (
                <tr key={admin.id}>
                  <td>{highlightMatch(admin.id.toString())}</td>
                  <td>{highlightMatch(admin.full_name)}</td>
                  <td>{highlightMatch(admin.email)}</td>
                  <td>{formatDate(admin.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Search size={64} />
          <h3>No admins found</h3>
          <p>Try adjusting your search</p>
        </div>
      )}
    </div>
  );
}

export default StaffsSection;
