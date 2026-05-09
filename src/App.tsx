import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import React from "react";

import Navbar from "./Components/Navbar/Navbar";
import Hero from "./Pages/Hero";
import { RoomsSection } from "./Components/RoomsSection/RoomsSection";
import HotelAmenities from "./Components/HotelAmenities/HotelAmenities";
import LatestNewsEvents from "./Components/NewsEvents/LatestNewsEvents";
import BlogNewYearsGala from "./Components/NewsEvents/Blog/BlogNewYearsGala";
import BlogWinePairing from "./Components/NewsEvents/Blog/BlogWinePairing";
import BlogHiddenGems from "./Components/NewsEvents/Blog/BlogHiddenGems";
import ContactUs from "./Components/ContactUs/ContactUs";
import Footer from "./Components/Footer/Footer";
import Login from "./Pages/Login";
import RattingAndFAQ from "./Components/RatingsAndFAQ/RatingsAndFAQ";
import Gallery from "./Components/Gallery/Gallery";
import ScrollToHash from "./ScrollToHash";
import Register from "./Pages/Register";
import AdminReg from "./Admin/components/AdminReg/AdminReg";
import { AdminLogin } from "./Admin/components/AdminReg/AdminLogin";
import AdminDashboard from "./Admin/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import RoomsPage from "./Pages/RoomsPage/RoomsPage";
import Profile from "./Profile/Profile";
import AdminProtectedRoute from "./Admin/components/AdminProtectedRoute";
import CheckoutPage from "./Pages/RoomsPage/PaymentGateWay/CheckoutPage"; 

function PublicLayout() {
  const location = useLocation();
  const isAuthPage = [
    "/login",
    "/register",
    "/admin/adminreg",
    "/admin/login",
    "/bookingfoom",
  ].includes(location.pathname);

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <RoomsSection />
              <HotelAmenities />
              <LatestNewsEvents />
              <Gallery />
              <RattingAndFAQ />
              <ContactUs />
              {!isAuthPage && <Footer />}
              <ScrollToHash />
            </>
          }
        />
        <Route
          path="/blog/new-years-eve-gala"
          element={
            <>
              <BlogNewYearsGala />
              <Footer />
            </>
          }
        />
        <Route
          path="/blog/wine-pairing-masterclass"
          element={
            <>
              <BlogWinePairing />
              <Footer />
            </>
          }
        />
        <Route
          path="/blog/hidden-gems-guide"
          element={
            <>
              <BlogHiddenGems />
              <Footer />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/*" element={<PublicLayout />} />
        <Route path="/rooms" element={<RoomsPage />} />

        <Route path="/admin/adminreg" element={<AdminReg />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
       <Route
  path="/checkout"
  element={
    <ProtectedRoute>
      <CheckoutPage
        onBack={() => window.history.back()}
        onPaymentComplete={() => window.location.replace("/profile")} bookingData={{
          id: "",
          room_id: 0,
          room_name: "",
          full_name: "",
          phone: "",
          email: "",
          check_in: "",
          check_out: "",
          total_price: "",
          nights: 0
        }}      />
    </ProtectedRoute>
  }
/>
      </Routes>
    </Router>
  );
}

export default App;
