import React, { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Calendar, Settings, LogOut, Trash2, Edit2,
  ChevronRight, ShieldCheck, CheckCircle2, AlertCircle,
  BedDouble, Wallet, Sparkles, Search, Bell, KeyRound, Mail,
  Menu, X
} from 'lucide-react';
import { bookingApi, userApi } from '../api';
import styles from './Profile.module.css';

type Tab = 'overview' | 'bookings' | 'profile' | 'settings';

export default function Profile() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [bookings, setBookings] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [query, setQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [b, p] = await Promise.all([bookingApi.getBookings(), userApi.getProfile()]);
        setBookings(b);
        setProfile(p);
      } catch (err) {
        const msg = err instanceof Error ? err.message.toLowerCase() : '';
        if (msg.includes('auth') || msg.includes('token') || msg.includes('unauthorized')) {
          navigate('/auth');
        } else {
          setMessage({ type: 'error', text: 'Failed to load dashboard data' });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 3500);
    return () => clearTimeout(t);
  }, [message]);

  const stats = useMemo(() => {
    const upcoming = bookings.filter(b => new Date(b.checkIn) >= new Date()).length;
    const past = bookings.length - upcoming;
    const spend = bookings.reduce((s, b) => s + (Number(b.totalPrice) || 0), 0);
    return { total: bookings.length, upcoming, past, spend };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    if (!query.trim()) return bookings;
    const q = query.toLowerCase();
    return bookings.filter(b =>
      b.hotelName?.toLowerCase().includes(q) || b.status?.toLowerCase().includes(q)
    );
  }, [bookings, query]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleCancelBooking = async (id: number) => {
    if (!window.confirm('Cancel this booking? This action cannot be undone.')) return;
    try {
      await bookingApi.deleteBooking(id);
      setBookings(prev => prev.filter(b => b.id !== id));
      setMessage({ type: 'success', text: 'Booking cancelled successfully' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to cancel booking' });
    }
  };

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await userApi.updateProfile({ name: profile.name, email: profile.email });
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...user, name: profile.name, email: profile.email }));
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Update failed' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner} />
          <p className={styles.eyebrow}>Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  const initials = profile?.name
    ? profile.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  const navItems: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'profile', label: 'Profile Details', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={styles.container}>
      {/* Top bar */}
      <header className={styles.topbar}>
        <div>
          <p className={styles.eyebrow}>Guest Dashboard</p>
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.welcomeTitle}
          >
            Welcome back, {profile?.name?.split(' ')[0] || 'Guest'}
          </motion.h1>
          <p className={styles.subtitleMuted}>Manage your stays, profile and preferences in one place.</p>
        </div>

        <div className={styles.topbarActions}>
          <button 
            className={styles.menuBtn} 
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={20} />
          </button>
          <button className={styles.iconBtn} aria-label="Notifications">
            <Bell size={18} />
            <span className={styles.dot} />
          </button>
          <div className={styles.userChip}>
            <div className={styles.avatar}>{initials}</div>
            <div className={styles.userMeta}>
              <span className={styles.userName}>{profile?.name}</span>
              <span className={styles.userEmail}>{profile?.email}</span>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.dashboardLayout}>
        {/* Mobile Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.overlay}
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarNav}>
            {navItems.map(item => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`${styles.sidebarItem} ${active ? styles.sidebarItemActive : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {active && <ChevronRight size={16} className={styles.sidebarChevron} />}
                </button>
              );
            })}
          </div>

          <div className={styles.sidebarPromo}>
            <div className={styles.promoBadge}>LuxeStay+</div>
            <p className={styles.promoTitle}>Unlock member-only rates</p>
            <p className={styles.promoText}>Save up to 25% on featured stays.</p>
            <button
              className={styles.promoBtn}
              onClick={() => navigate('/rooms')}
            >
              Book your stay
            </button>
          </div>

          <div className={styles.sidebarDivider}>
            <button onClick={handleLogout} className={`${styles.sidebarItem} ${styles.sidebarLogout}`}>
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className={styles.content}>
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`${styles.alert} ${message.type === 'success' ? styles.alertSuccess : styles.alertError}`}
              >
                {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.section
                key="overview"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
              >
                <div className={styles.statsGrid}>
                  <StatCard icon={<Calendar size={18} />} label="Total Bookings" value={stats.total} />
                  <StatCard icon={<BedDouble size={18} />} label="Upcoming Stays" value={stats.upcoming} accent="emerald" />
                  <StatCard icon={<ShieldCheck size={18} />} label="Completed" value={stats.past} />
                  <StatCard icon={<Wallet size={18} />} label="Total Spend" value={`R ${stats.spend.toLocaleString()}`} />
                </div>

                <div className={styles.tabHeader}>
                  <h2 className={styles.tabTitle}>Recent Bookings</h2>
                  <button className={styles.linkBtn} onClick={() => setActiveTab('bookings')}>
                    View all <ChevronRight size={14} />
                  </button>
                </div>

                {bookings.length === 0 ? (
                  <EmptyState onBrowse={() => navigate('/')} />
                ) : (
                  <div className={styles.bookingGrid}>
                    {bookings.slice(0, 3).map(b => (
                      <BookingCard
                        key={b.id}
                        booking={b}
                        onModify={() => navigate(`/hotel/${b.hotelId}`)}
                        onCancel={() => handleCancelBooking(b.id)}
                      />
                    ))}
                  </div>
                )}
              </motion.section>
            )}

            {activeTab === 'bookings' && (
              <motion.section
                key="bookings"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
              >
                <div className={styles.tabHeader}>
                  <div>
                    <h2 className={styles.tabTitle}>Your Reservations</h2>
                    <div className={styles.reservationStats}>
                      <span>{stats.total} total</span>
                      <div className={styles.statDot} />
                      <span className={styles.upcomingHighlight}>{stats.upcoming} upcoming</span>
                    </div>
                  </div>
                  <div className={styles.searchWrap}>
                    <Search size={16} />
                    <input
                      placeholder="Search hotel or status…"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                    />
                  </div>
                </div>

                {filteredBookings.length === 0 ? (
                  <EmptyState onBrowse={() => navigate('/')} />
                ) : (
                  <div className={styles.bookingGrid}>
                    {filteredBookings.map(b => (
                      <BookingCard
                        key={b.id}
                        booking={b}
                        onModify={() => navigate(`/hotel/${b.hotelId}`)}
                        onCancel={() => handleCancelBooking(b.id)}
                      />
                    ))}
                  </div>
                )}
              </motion.section>
            )}

            {activeTab === 'profile' && (
              <motion.section
                key="profile"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
              >
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.tabTitle}>Personal Information</h2>
                    <p className={styles.subtitleMuted}>Update your account details and contact information.</p>
                  </div>
                  <form onSubmit={handleUpdateProfile} className={styles.profileForm}>
                    <div className={styles.formGrid}>
                      <div className={styles.inputGroup}>
                        <label>Full Name</label>
                        <div className={styles.inputWrap}>
                          <User size={16} />
                          <input
                            type="text"
                            value={profile?.name || ''}
                            onChange={e => setProfile({ ...profile, name: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className={styles.inputGroup}>
                        <label>Email Address</label>
                        <div className={styles.inputWrap}>
                          <Mail size={16} />
                          <input
                            type="email"
                            value={profile?.email || ''}
                            onChange={e => setProfile({ ...profile, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className={styles.formActions}>
                      <button type="submit" disabled={updating} className={styles.saveBtn}>
                        {updating ? 'Saving…' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.section>
            )}

            {activeTab === 'settings' && (
              <motion.section
                key="settings"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
              >
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.tabTitle}>Account Settings</h2>
                    <p className={styles.subtitleMuted}>Manage security and account preferences.</p>
                  </div>
                  <div className={styles.settingsList}>
                    <SettingRow
                      icon={<KeyRound size={18} />}
                      title="Update Password"
                      desc="Change your login credentials"
                    />
                    <SettingRow
                      icon={<Bell size={18} />}
                      title="Notifications"
                      desc="Manage email and push alerts"
                    />
                    <SettingRow
                      icon={<Trash2 size={18} />}
                      title="Delete Account"
                      desc="Permanently remove your data"
                      danger
                    />
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function StatCard({
  icon, label, value, accent,
}: { icon: React.ReactNode; label: string; value: React.ReactNode; accent?: 'emerald' }) {
  return (
    <div className={`${styles.statCard} ${accent === 'emerald' ? styles.statAccent : ''}`}>
      <div className={styles.statIcon}>{icon}</div>
      <p className={styles.statLabel}>{label}</p>
      <p className={styles.statValue}>{value}</p>
    </div>
  );
}

function BookingCard({
  booking, onModify, onCancel,
}: { booking: any; onModify: () => void; onCancel: () => void | Promise<void>; key?: any }) {
  return (
    <motion.div className={styles.bookingCard} layout whileHover={{ y: -2 }}>
      <img
        src={booking.hotelImage}
        alt={booking.hotelName}
        className={styles.hotelImg}
        loading="lazy"
      />
      <div className={styles.info}>
        <div className={`${styles.status} ${styles.statusConfirmed}`}>{booking.status || 'Confirmed'}</div>
        <h3 className={styles.hotelName}>{booking.hotelName}</h3>
        <div className={styles.detailRow}>
          <div className={styles.detailItem}>
            <Calendar size={14} />
            {booking.checkIn} — {booking.checkOut}
          </div>
          <div className={styles.detailItem}>
            <ShieldCheck size={14} className={styles.verifiedIcon} />
            LuxeStay Verified
          </div>
        </div>
      </div>
      <div className={styles.actions}>
        <button onClick={onModify} className={`${styles.btnAction} ${styles.btnEdit}`}>
          <Edit2 size={14} /> Modify
        </button>
        <button onClick={onCancel} className={`${styles.btnAction} ${styles.btnCancel}`}>
          <Trash2 size={14} /> Cancel
        </button>
      </div>
    </motion.div>
  );
}

function EmptyState({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}><Calendar size={32} /></div>
      <h3>No bookings yet</h3>
      <p>Discover handpicked stays and start your next escape.</p>
      <button onClick={onBrowse} className={styles.browseBtn}>Browse Hotels</button>
    </div>
  );
}

function SettingRow({
  icon, title, desc, danger,
}: { icon: React.ReactNode; title: string; desc: string; danger?: boolean }) {
  return (
    <div className={`${styles.settingItem} ${danger ? styles.deleteItem : ''}`}>
      <div className={styles.settingLeft}>
        <div className={`${styles.settingIcon} ${danger ? styles.settingIconDanger : ''}`}>{icon}</div>
        <div className={styles.settingInfo}>
          <p>{title}</p>
          <p>{desc}</p>
        </div>
      </div>
      <button className={`${styles.settingBtn} ${danger ? styles.deleteBtn : ''}`}>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
