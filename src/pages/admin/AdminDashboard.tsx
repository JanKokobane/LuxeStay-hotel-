import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Plus, Edit2, Trash2, X, LayoutDashboard, BedDouble, Calendar,
  Settings, LogOut, Star, TrendingUp, Users, Menu,
} from "lucide-react";
import styles from "./AdminDashboard.module.css";

// export const Route = createFileRoute('/admin')({
//   head: () => ({
//     meta: [
//       { title: "Admin Dashboard — LuxeStay" },
//       { name: "description", content: "Manage rooms, bookings and users." },
//     ],
//   }),
//   component: AdminDashboard,
// });

interface Hotel {
  id: number;
  name: string;
  rating: number;
  ratingText: string;
  reviews: number;
  distance: string;
  price: number;
  image: string;
  description: string;
  stars: number;
}

const STORAGE_KEY = "luxestay_admin_hotels_v1";

const seedHotels: Hotel[] = [
  {
    id: 1,
    name: "Deluxe Ocean View Suite",
    rating: 4.9, ratingText: "Exceptional", reviews: 128,
    distance: "Ocean Front, 5th Floor", price: 2400,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&q=80",
    description: "Spacious suite with a private balcony overlooking the Atlantic.",
    stars: 5,
  },
  {
    id: 2,
    name: "Garden Terrace Room",
    rating: 4.6, ratingText: "Excellent", reviews: 86,
    distance: "Garden Wing, Ground Floor", price: 1450,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=900&q=80",
    description: "Cozy room with direct access to our private gardens.",
    stars: 4,
  },
  {
    id: 3,
    name: "Penthouse City Loft",
    rating: 5.0, ratingText: "Outstanding", reviews: 42,
    distance: "Top Floor, Skyline View", price: 5200,
    image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=900&q=80",
    description: "Two-bedroom loft with panoramic city views and a rooftop terrace.",
    stars: 5,
  },
];

const emptyForm = { name: "", price: 0, distance: "", description: "", image: "", stars: 3 };

function AdminDashboard() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("rooms");
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setHotels(raw ? JSON.parse(raw) : seedHotels);
    } catch {
      setHotels(seedHotels);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(hotels));
  }, [hotels, loaded]);

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "rooms", label: "Room Management", icon: BedDouble },
    { id: "bookings", label: "All Bookings", icon: Calendar },
    { id: "users", label: "User Directory", icon: Users },
    { id: "settings", label: "System Settings", icon: Settings },
  ];

  const openModal = (hotel?: Hotel) => {
    if (hotel) {
      setEditingHotel(hotel);
      setFormData({
        name: hotel.name, price: hotel.price, distance: hotel.distance,
        description: hotel.description, image: hotel.image, stars: hotel.stars,
      });
    } else {
      setEditingHotel(null);
      setFormData(emptyForm);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingHotel(null); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === "price" || name === "stars" ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHotel) {
      setHotels(prev => prev.map(h => h.id === editingHotel.id ? { ...editingHotel, ...formData } : h));
    } else {
      const newHotel: Hotel = {
        id: Date.now(),
        rating: 4.5, ratingText: "Great", reviews: 0,
        ...formData,
      };
      setHotels(prev => [newHotel, ...prev]);
    }
    closeModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      setHotels(prev => prev.filter(h => h.id !== id));
    }
  };

  const stats = [
    { label: "Total Rooms", value: hotels.length, icon: BedDouble, accent: true },
    { label: "Avg. Price", value: `ZAR ${Math.round(hotels.reduce((a, h) => a + h.price, 0) / (hotels.length || 1))}`, icon: TrendingUp },
    { label: "Rating", value: "4.8", icon: Star },
  ];

  if (!loaded) {
    return <div className={styles.loadingContainer}><div className={styles.spinner} /></div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.topbar}>
        <div>
          <p className={styles.eyebrow}>Administration Panel</p>
          <h1 className={styles.welcomeTitle}>Property Management</h1>
          <p className={styles.subtitleMuted}>Managing {hotels.length} luxury suites at LuxeStay</p>
        </div>
        <div className={styles.topbarActions}>
          <button className={styles.menuBtn} onClick={() => setIsSidebarOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <button className={styles.addBtn} onClick={() => openModal()}>
            <Plus size={20} /> Add New Room
          </button>
        </div>
      </header>

      <div className={styles.dashboardLayout}>
        {isSidebarOpen && <div className={styles.overlay} onClick={() => setIsSidebarOpen(false)} />}

        <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarNav}>
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`${styles.sidebarItem} ${activeMenu === item.id ? styles.sidebarItemActive : ""}`}
                  onClick={() => { setActiveMenu(item.id); setIsSidebarOpen(false); }}
                >
                  <Icon size={18} /> {item.label}
                </button>
              );
            })}
          </div>
          <div className={styles.sidebarDivider}>
            <button className={`${styles.sidebarItem} ${styles.sidebarLogout}`} onClick={() => navigate({ to: "/" })}>
              <LogOut size={18} /> Exit Dashboard
            </button>
          </div>
        </aside>

        <main className={styles.content}>
          <div className={styles.statsGrid}>
            {stats.map((stat, i) => (
              <div key={i} className={`${styles.statCard} ${stat.accent ? styles.statAccent : ""}`}>
                <div className={styles.statIcon}><stat.icon size={18} /></div>
                <p className={styles.statLabel}>{stat.label}</p>
                <p className={styles.statValue}>{stat.value}</p>
              </div>
            ))}
          </div>

          {activeMenu === "rooms" && (
            <div className={styles.cardGrid}>
              {hotels.length === 0 && (
                <div className={styles.emptyState}>
                  <BedDouble size={32} />
                  <p>No rooms yet. Click "Add New Room" to create your first listing.</p>
                </div>
              )}
              {hotels.map(hotel => (
                <div key={hotel.id} className={styles.roomCard}>
                  <img src={hotel.image} alt={hotel.name} className={styles.roomImg} />
                  <div className={styles.roomInfo}>
                    <div className={styles.roomHeader}>
                      <h3 className={styles.roomName}>{hotel.name}</h3>
                      <p className={styles.roomPrice}><span>ZAR {hotel.price}</span> / night</p>
                    </div>
                    <div className={styles.roomMeta}>
                      <div className={styles.metaItem}>
                        <Star size={14} fill="currentColor" /> {hotel.stars} Stars
                      </div>
                      <div className={styles.metaItem}>
                        <TrendingUp size={14} /> {hotel.reviews} reviews
                      </div>
                    </div>
                  </div>
                  <div className={styles.roomActions}>
                    <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => openModal(hotel)}>
                      <Edit2 size={14} /> Edit
                    </button>
                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(hotel.id)}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeMenu !== "rooms" && (
            <div className={styles.placeholderPanel}>
              <h2>{menuItems.find(m => m.id === activeMenu)?.label}</h2>
              <p>This section is coming soon.</p>
            </div>
          )}
        </main>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingHotel ? "Edit Room" : "Add New Room"}</h2>
              <button className={styles.closeBtn} onClick={closeModal} aria-label="Close"><X size={20} /></button>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Room Category Name</label>
                <input className={styles.inputField} type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Deluxe Ocean View Suite" />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Price per Night (ZAR)</label>
                  <input className={styles.inputField} type="number" name="price" value={formData.price} onChange={handleChange} required min={0} />
                </div>
                <div className={styles.formGroup}>
                  <label>Star Rating</label>
                  <select className={styles.inputField} name="stars" value={formData.stars} onChange={handleChange}>
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Location/View Detail</label>
                <input className={styles.inputField} type="text" name="distance" value={formData.distance} onChange={handleChange} required placeholder="e.g. Ocean Front, Second Floor" />
              </div>
              <div className={styles.formGroup}>
                <label>Property Description</label>
                <textarea className={`${styles.inputField} ${styles.textarea}`} name="description" value={formData.description} onChange={handleChange} required rows={3} placeholder="Briefly describe the room..." />
              </div>
              <div className={styles.formGroup}>
                <label>Cover Image URL</label>
                <input className={styles.inputField} type="url" name="image" value={formData.image} onChange={handleChange} required placeholder="https://images.unsplash.com/..." />
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                <button type="submit" className={styles.submitBtn}>{editingHotel ? "Update Room" : "Create Room"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
