import { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';
import styles from './Styles/AdminDashboard.module.css';
import type { Room } from '../../../Admin/AdminDashboard';
import React from 'react';

interface RoomModalProps {
  room: Room | null;
  onClose: () => void;
  onSave: (roomData: any) => void;
}

function RoomModal({ room, onClose, onSave }: RoomModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Standard',
    price: '',
    status: 'available' as 'available' | 'occupied' | 'maintenance',
    capacity: '',
    description: '',
    amenities: '',
    image: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showSuccess, setShowSuccess] = useState(false);

const predefinedAmenities = [
  'WiFi',
  'Air Conditioning',
  'Mini Bar',
  'Ocean View',
  'Room Service',
  'Spa Access',
  'Private Balcony',
  'Parking',
  'Workspace / Desk Area',
  'Restaurant / Dining',
  'Swimming Pool',
  'Gym / Fitness Center',
  'Heater / Fireplace',
  'Laundry Service',
  'Pet Friendly',
  'Non-Smoking Room',
  'Luggage Storage',
  'Toiletries Included',
  'Extra Bed Available',
  'TV',
  'Coffee / Breakfast Service',
  'Shower / Bath'
];

  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name ?? '',
        type: room.type ?? 'Standard',
        price: room.price?.toString() ?? '',
        status: room.status ?? 'available',
        capacity: room.capacity?.toString() ?? '',
        description: room.description ?? '',
        amenities: Array.isArray(room.amenities)
          ? room.amenities.join(', ')
          : room.amenities ?? '',
        image: room.image ?? ''
      });
    }
  }, [room]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAmenityClick = (amenity: string) => {
    const current = formData.amenities.split(',').map(a => a.trim()).filter(Boolean);
    if (!current.includes(amenity)) {
      const updated = [...current, amenity].join(', ');
      setFormData(prev => ({ ...prev, amenities: updated }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = 'Room name is required';
    else if (formData.name.length < 3) newErrors.name = 'Room name must be at least 3 characters';

    if (!formData.price) newErrors.price = 'Price is required';
    else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0)
      newErrors.price = 'Enter a valid positive price';

    if (!formData.capacity) newErrors.capacity = 'Capacity is required';
    else if (isNaN(Number(formData.capacity)) || Number(formData.capacity) < 1)
      newErrors.capacity = 'Capacity must be at least 1 person';

    if (formData.image && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(formData.image))
      newErrors.image = 'Please enter a valid image URL (http/https)';

    if (formData.description.length > 500)
      newErrors.description = 'Description is too long (max 500 characters)';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const roomData = {
      ...formData,
      price: parseFloat(formData.price),
      capacity: parseInt(formData.capacity),
      amenities: formData.amenities
        .split(',')
        .map(a => a.trim())
        .filter(a => a.length > 0)
    };

    const token = localStorage.getItem('adminToken');
    const method = room ? 'PUT' : 'POST';
    const endpoint = room
      ? `${import.meta.env.VITE_API_BASE_URL}/api/rooms/${room.id}`
      : `${import.meta.env.VITE_API_BASE_URL}/api/rooms`;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(roomData)
      });

      if (!res.ok) throw new Error('Failed to save room');
      const savedRoom = await res.json();
      onSave(savedRoom);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error saving room:', err);
      alert('Error saving room. Please try again.');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      <div className={styles.modal} onClick={handleBackdropClick}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2>{room ? 'Edit Room' : 'Add New Room'}</h2>
            <button className={styles.closeButton} onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Room Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Deluxe Ocean View"
                />
                {errors.name && <p className={styles.errorText}>{errors.name}</p>}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="type">Room Type</label>
                  <select id="type" name="type" value={formData.type} onChange={handleChange}>
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Presidential">Presidential</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="price">Price per Night (R)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="4500"
                  />
                  {errors.price && <p className={styles.errorText}>{errors.price}</p>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="capacity">Max Capacity</label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="2"
                  />
                  {errors.capacity && <p className={styles.errorText}>{errors.capacity}</p>}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="image">Image URL</label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/room-image.jpg"
                />
                {errors.image && <p className={styles.errorText}>{errors.image}</p>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the room features and highlights..."
                  rows={3}
                />
                {errors.description && <p className={styles.errorText}>{errors.description}</p>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="amenities">Amenities (comma-separated)</label>
                <input
                  type="text"
                  id="amenities"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  placeholder="WiFi, Air Conditioning, Mini Bar, Ocean View, Room Service, Spa Access, Private Balcony"
                />

                <div className={styles.dropdown}>
                  {predefinedAmenities.map((amenity, index) => (
                    <button
                      key={index}
                      type="button"
                      className={styles.dropdownItem}
                      onClick={() => handleAmenityClick(amenity)}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button type="button" className={styles.secondaryButton} onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className={styles.primaryButton}>
                {room ? 'Update Room' : 'Add Room'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSuccess && (
        <div className={styles.successModal}>
          <div className={styles.successContent}>
            <CheckCircle size={40} color="#22c55e" strokeWidth={1.5} />
            <p>{room ? 'Room updated successfully!' : 'Room added successfully!'}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default RoomModal;
