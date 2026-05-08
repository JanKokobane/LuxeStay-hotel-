const MOCK_HOTELS = [
  {
    id: 1,
    name: 'Main Deluxe Suite',
    rating: 9.6,
    ratingText: 'Excellent',
    reviews: 1920,
    distance: 'Inner Circle View',
    price: 180,
    image: 'https://m.media-amazon.com/images/I/81uNBfS2aqL._AC_SX569_.jpg',
    description: 'A refined 3-star suite featuring classic architecture and contemporary amenities.',
    stars: 3
  },
  {
    id: 2,
    name: 'Skyline Presidential Room',
    rating: 8.3,
    ratingText: 'Good',
    reviews: 792,
    distance: 'Upper Terrace',
    price: 260,
    image: 'https://m.media-amazon.com/images/I/413RY5AmYOL._AC_.jpg',
    description: 'Modern design with panoramic city views and a dedicated workspace.',
    stars: 4
  },
  {
    id: 3,
    name: 'Oceanic Royal Penthouse',
    rating: 9.5,
    ratingText: 'Excellent',
    reviews: 2000,
    distance: 'Seaside Wing',
    price: 420,
    image: 'https://m.media-amazon.com/images/I/415YfkkDIxL._AC_.jpg',
    description: 'Our most exclusive experience, offering a private terrace and direct ocean views.',
    stars: 5
  }
];

// Helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function apiFetch(endpoint: string, options: any = {}) {
  await delay(500); // Simulate network speed

  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  const currentUser = userJson ? JSON.parse(userJson) : null;

  // AUTH ENDPOINTS
  if (endpoint === '/auth/signup') {
    const { email, name } = JSON.parse(options.body);
    const user = { id: Date.now(), email, name };
    const dummyToken = 'mock-jwt-' + Date.now();
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', dummyToken);
    return { token: dummyToken, user };
  }

  if (endpoint === '/auth/login') {
    const { email } = JSON.parse(options.body);
    const user = { id: 1, email, name: email.split('@')[0] };
    const dummyToken = 'mock-jwt-123';
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', dummyToken);
    return { token: dummyToken, user };
  }

  // HOTEL ENDPOINTS
  if (endpoint === '/hotels') {
    return MOCK_HOTELS;
  }

  if (endpoint.startsWith('/hotels/')) {
    const id = parseInt(endpoint.split('/').pop() || '0');
    const hotel = MOCK_HOTELS.find(h => h.id === id);
    if (!hotel) throw new Error('Room not found');
    return hotel;
  }

  // BOOKING ENDPOINTS
  if (endpoint === '/bookings' && options.method === 'POST') {
    const { hotelId, checkIn, checkOut } = JSON.parse(options.body);
    const hotel = MOCK_HOTELS.find(h => h.id === parseInt(hotelId));
    const newBooking = {
      id: Date.now(),
      userId: currentUser?.id,
      hotelId: parseInt(hotelId),
      hotelName: hotel?.name,
      hotelImage: hotel?.image,
      checkIn,
      checkOut,
      status: 'Confirmed'
    };
    
    const bookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
    bookings.push(newBooking);
    localStorage.setItem('mock_bookings', JSON.stringify(bookings));
    return newBooking;
  }

  if (endpoint === '/bookings' && !options.method) {
    return JSON.parse(localStorage.getItem('mock_bookings') || '[]');
  }

  if (endpoint.startsWith('/bookings/') && options.method === 'DELETE') {
    const id = parseInt(endpoint.split('/').pop() || '0');
    let bookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
    bookings = bookings.filter((b: any) => b.id !== id);
    localStorage.setItem('mock_bookings', JSON.stringify(bookings));
    return { success: true };
  }

  if (endpoint.startsWith('/bookings/') && options.method === 'PUT') {
    const id = parseInt(endpoint.split('/').pop() || '0');
    const { checkIn, checkOut, status } = JSON.parse(options.body);
    let bookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
    const index = bookings.findIndex((b: any) => b.id === id);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], checkIn, checkOut, status: status || 'Confirmed' };
      localStorage.setItem('mock_bookings', JSON.stringify(bookings));
      return { success: true };
    }
    throw new Error('Booking not found');
  }

  // PROFILE ENDPOINTS
  if (endpoint === '/profile' && !options.method) {
    if (!currentUser) throw new Error('Auth');
    return currentUser;
  }

  if (endpoint === '/profile' && options.method === 'PUT') {
    const { name, email } = JSON.parse(options.body);
    const updatedUser = { ...currentUser, name, email };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return { success: true, user: updatedUser };
  }

  // PAYMENT ENDPOINTS
  if (endpoint === '/create-payment-intent') {
    return { clientSecret: 'mock_secret_' + Math.random().toString(36).substring(7), simulated: true };
  }

  throw new Error('Endpoint not matched in mock API');
}

export const authApi = {
  login: (credentials: any) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  signup: (userData: any) => apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify(userData) }),
};

export const hotelApi = {
  getHotels: () => apiFetch('/hotels'),
  getHotel: (id: string) => apiFetch(`/hotels/${id}`),
};

export const bookingApi = {
  createBooking: (bookingData: any) => apiFetch('/bookings', { method: 'POST', body: JSON.stringify(bookingData) }),
  getBookings: () => apiFetch('/bookings'),
  updateBooking: (id: string | number, data: any) => apiFetch(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBooking: (id: string | number) => apiFetch(`/bookings/${id}`, { method: 'DELETE' }),
};

export const userApi = {
  getProfile: () => apiFetch('/profile'),
  updateProfile: (profileData: any) => apiFetch('/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
};

export const paymentApi = {
  createPaymentIntent: (amount: number) => apiFetch('/create-payment-intent', { method: 'POST', body: JSON.stringify({ amount }) }),
};

export const adminApi = {
  getUsers: async () => {
    const response = await fetch(
      'https://luxestay-hotel-gppc.onrender.com/api/admin/users'
    );

    return response.json();
  },

  getBookings: async () => {
    const response = await fetch(
      'https://luxestay-hotel-gppc.onrender.com/api/admin/bookings'
    );

    return response.json();
  },

  deleteUser: async (id: string | number) => {
    const response = await fetch(
      `https://luxestay-hotel-gppc.onrender.com/api/admin/users/${id}`,
      {
        method: 'DELETE',
      }
    );

    return response.json();
  },
};

