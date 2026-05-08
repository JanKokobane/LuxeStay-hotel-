import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, X, Image as ImageIcon, 
  LayoutDashboard, BedDouble, Calendar, Settings, 
  LogOut, Star, TrendingUp, Users, Search, Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';
import { hotelApi, adminApi } from '../../api';

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

const AdminDashboard: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('rooms');
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    distance: '',
    description: '',
    image: '',
    stars: 3
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const data = await hotelApi.getHotels();
      setHotels(data);
    } catch (err) {
      console.error('Failed to fetch hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'rooms', label: 'Room Management', icon: BedDouble },
    { id: 'bookings', label: 'All Bookings', icon: Calendar },
    { id: 'users', label: 'User Directory', icon: Users },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  const handleOpenModal = (hotel?: Hotel) => {
    if (hotel) {
      setEditingHotel(hotel);
      setFormData({
        name: hotel.name,
        price: hotel.price,
        distance: hotel.distance,
        description: hotel.description,
        image: hotel.image,
        stars: hotel.stars
      });
    } else {
      setEditingHotel(null);
      setFormData({
        name: '',
        price: 0,
        distance: '',
        description: '',
        image: '',
        stars: 3
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingHotel(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stars' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingHotel) {
        await adminApi.updateHotel(editingHotel.id, formData);
      } else {
        await adminApi.createHotel(formData);
      }
      fetchHotels();
      handleCloseModal();
    } catch (err) {
      console.error('Failed to save hotel:', err);
      alert('Failed to save hotel. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await adminApi.deleteHotel(id);
        fetchHotels();
      } catch (err) {
        console.error('Failed to delete hotel:', err);
        alert('Failed to delete hotel. Please try again.');
      }
    }
  };

  const stats = [
    { label: 'Total Rooms', value: hotels.length, icon: BedDouble, accent: true },
    { label: 'Avg. Price', value: `ZAR ${Math.round(hotels.reduce((acc, h) => acc + h.price, 0) / (hotels.length || 1))}`, icon: TrendingUp },
    { label: 'Rating', value: '4.8', icon: Star },
  ];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.topbar}>
        <div>
          <p className={styles.eyebrow}>Administration Panel</p>
          <h1 className={styles.welcomeTitle}>Property Management</h1>
          <p className={styles.subtitleMuted}>Managing {hotels.length} luxury suites at LuxeStay</p>
        </div>

        <div className={styles.topbarActions}>
          <button 
            className={styles.menuBtn}
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <button className={styles.addBtn} onClick={() => handleOpenModal()}>
            <Plus size={20} />
            Add New Room
          </button>
        </div>
      </header>

      <div className={styles.dashboardLayout}>
        {/* Overlay */}
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
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button 
                  key={item.id}
                  className={`${styles.sidebarItem} ${activeMenu === item.id ? styles.sidebarItemActive : ''}`}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setIsSidebarOpen(false);
                  }}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className={styles.sidebarPromo}>
            <div className={styles.promoBadge}>Admin Beta</div>
            <div className={styles.promoTitle}>Analytics Pro</div>
            <div className={styles.promoText}>Enable advanced insights and revenue tracking.</div>
          </div>

          <div className={styles.sidebarDivider}>
            <button className={`${styles.sidebarItem} ${styles.sidebarLogout}`} onClick={() => navigate('/')}>
              <LogOut size={18} />
              Exit Dashboard
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className={styles.content}>
          {/* Stats Overview */}
          <div className={styles.statsGrid}>
            {stats.map((stat, i) => (
              <div key={i} className={`${styles.statCard} ${stat.accent ? styles.statAccent : ''}`}>
                <div className={styles.statIcon}>
                  <stat.icon size={18} />
                </div>
                <p className={styles.statLabel}>{stat.label}</p>
                <p className={styles.statValue}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Rooms List */}
          <div className={styles.cardGrid}>
            {hotels.map(hotel => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={hotel.id} 
                className={styles.roomCard}
              >
                <img src={hotel.image} alt={hotel.name} className={styles.roomImg} />
                <div className={styles.roomInfo}>
                  <div className={styles.roomHeader}>
                    <h3 className={styles.roomName}>{hotel.name}</h3>
                    <p className={styles.roomPrice}><span>ZAR {hotel.price}</span> / night</p>
                  </div>
                  <div className={styles.roomMeta}>
                    <div className={styles.metaItem}>
                      <Star size={14} className={styles.verifiedIcon} fill="currentColor" />
                      {hotel.stars} Stars
                    </div>
                    <div className={styles.metaItem}>
                      <TrendingUp size={14} />
                      {hotel.reviews} reviews
                    </div>
                  </div>
                </div>
                <div className={styles.roomActions}>
                  <button 
                    className={`${styles.actionBtn} ${styles.editBtn}`}
                    onClick={() => handleOpenModal(hotel)}
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button 
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    onClick={() => handleDelete(hotel.id)}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={styles.modalContent}
            >
              <div className={styles.modalHeader}>
                <h2>{editingHotel ? 'Edit Room' : 'Add New Room'}</h2>
                <button className={styles.closeBtn} onClick={handleCloseModal}>
                  <X size={20} />
                </button>
              </div>
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label>Room Category Name</label>
                  <input 
                    className={styles.inputField}
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="e.g. Deluxe Ocean View Suite"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className={styles.formGroup}>
                    <label>Price per Night (ZAR)</label>
                    <input 
                      className={styles.inputField}
                      type="number" 
                      name="price" 
                      value={formData.price} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Star Rating</label>
                    <select className={styles.inputField} name="stars" value={formData.stars} onChange={handleInputChange}>
                      {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                    </select>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Location/View Detail</label>
                  <input 
                    className={styles.inputField}
                    type="text" 
                    name="distance" 
                    value={formData.distance} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="e.g. Ocean Front, Second Floor"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Property Description</label>
                  <textarea 
                    className={`${styles.inputField} ${styles.textarea}`}
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    required 
                    rows={3}
                    placeholder="Briefly describe the room's features and amenities..."
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Cover Image URL</label>
                  <input 
                    className={styles.inputField}
                    type="url" 
                    name="image" 
                    value={formData.image} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                
                <div className={styles.formActions}>
                  <button type="button" className={styles.cancelBtn} onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.submitBtn}>
                    {editingHotel ? 'Update Room' : 'Create Room'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
