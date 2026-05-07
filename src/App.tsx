
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Results from './pages/Results';
import HotelDetail from './pages/HotelDetail';
import Confirmation from './pages/Confirmation';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import PopularRooms from './pages/PopularRooms';
import Booking from './pages/Booking';
import Payment from './pages/Payment';

function AppContent() {
  const location = useLocation();
  const hideNavbarOn = ['/profile', '/admin'];
  const shouldHideNavbar = hideNavbarOn.some(path => location.pathname.startsWith(path));

  return (
    <div>
      {!shouldHideNavbar && <Navbar />}
      <main>
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
        </Routes>
      </main>
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



