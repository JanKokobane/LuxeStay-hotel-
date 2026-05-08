import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Results from './pages/Results';
import HotelDetail from './pages/HotelDetail';
import Confirmation from './pages/Confirmation';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import PopularRooms from './pages/PopularRooms';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import AdminDashboard from './pages/admin/AdminDashboard';

function AppContent() {
  const location = useLocation();
  const hideNavbarOn = ['/profile', '/admin'];
  const shouldHideNavbar = hideNavbarOn.some(path => location.pathname.startsWith(path));

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Results />} />
          <Route path="/popular" element={<PopularRooms />} />
          <Route path="/hotel/:id" element={<HotelDetail />} />
          <Route path="/book/:id" element={<Booking />} />
          <Route path="/payment/:id" element={<Payment />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!shouldHideNavbar && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}



