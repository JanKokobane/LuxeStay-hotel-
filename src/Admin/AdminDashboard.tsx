import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Hotel,
  Calendar,
  Users,
  Settings,
  Bell,
  Search,
  Menu,
  X as CloseIcon,
  Star,
  FileText,
  MessageSquare,
  DollarSign,
  BarChart3,
} from "lucide-react";
import styles from "./AdminDashboard.module.css";
import DashboardOverview from "./components/dashboard/DashboardOverview";
import RoomsSection from "./components/dashboard/RoomsSection";
import BookingsSection from "./components/dashboard/BookingsSection";
import AnalyticsSection from "./components/dashboard/AnalyticsSection";
import RoomModal from "./components/dashboard/RoomModal";
import SettingsSection from "./components/dashboard/SettingsSection";
import InvoicesSection from "./components/dashboard/InvoicesSection";
import StaffsSection from "./components/dashboard/StaffsSection";
import ReportsSection from "./components/dashboard/ReportsSection";
import ReviewsSection from "./components/dashboard/ReviewsSection";
import React from "react";
import Logo from ".././assets/Logo.png";
import { useNavigate } from "react-router-dom";

type TabType =
  | "dashboard"
  | "reservation"
  | "rooms"
  | "staffs"
  | "analytics"
  | "reports"
  | "reviews"
  | "invoices"
  | "settings";

export interface Room {
  description: string;
  amenities: string;
  id: string;
  name: string;
  type: string;
  price: number;
  status: "available" | "occupied" | "maintenance";
  image: string;
  capacity: number;
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [adminName, setAdminName] = useState(
    localStorage.getItem("adminName") || ""
  );
  const [adminInitials, setAdminInitials] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminName");
    navigate("/admin/login");
  };

  const handleAddRoom = () => {
    setEditingRoom(null);
    setShowRoomModal(true);
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setShowRoomModal(true);
  };

  const handleCloseModal = () => {
    setShowRoomModal(false);
    setEditingRoom(null);
  };

  const handleDeleteRoom = (roomId: string) => {
    if (confirm("Are you sure you want to delete this room?")) {
      console.log("Deleting room:", roomId);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "analytics":
        return <AnalyticsSection detailed />;
      case "rooms":
        return (
          <RoomsSection
            onAddRoom={handleAddRoom}
            onEditRoom={handleEditRoom}
            onDeleteRoom={handleDeleteRoom}
          />
        );

      case "reservation":
        return <BookingsSection />;
      case "staffs":
        return <StaffsSection />;
      case "reports":
        return <ReportsSection />;
      case "reviews":
        return <ReviewsSection />;
      case "invoices":
        return <InvoicesSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return (
          <div className={styles.emptySection}>
            <div className={styles.emptyState}>
              <Settings size={64} />
              <h3>Dashboard</h3>
              <p>This section is coming soon</p>
            </div>
          </div>
        );
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard";
      case "reservation":
        return "Reservation";
      case "rooms":
        return "Rooms";
      case "staffs":
        return "Staffs";
      case "analytics":
        return "Analytics";
      case "reports":
        return "Reports";
      case "reviews":
        return "Reviews";
      case "invoices":
        return "Invoices";
      case "settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  useEffect(() => {
    const fetchAdminProfile = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      try {
        const res = await fetch(
          "https://tango-hotel-backend.onrender.com/api/admin/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch admin profile");

        const data = await res.json();
        const fullName = data.admin.full_name;
        setAdminName(fullName);

        const initials = fullName
          .split(" ")
          .map((n: string) => n[0])
          .join("");
        setAdminInitials(initials.toUpperCase());
      } catch (err) {
        console.error(err);
      }
    };

    fetchAdminProfile();
  }, []);

  return (
    <div className={styles.dashboard}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <img src={Logo} alt="Logo" />
          </div>
          <button
            className={styles.mobileCloseBtn}
            onClick={() => setSidebarOpen(false)}
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <nav className={styles.nav}>
          <div
            className={`${styles.navItem} ${
              activeTab === "dashboard" ? styles.active : ""
            }`}
            onClick={() => {
              setActiveTab("dashboard");
              setSidebarOpen(false);
            }}
          >
            <LayoutDashboard className={styles.navIcon} />
            <span>Dashboard</span>
          </div>
          <div
            className={`${styles.navItem} ${
              activeTab === "reservation" ? styles.active : ""
            }`}
            onClick={() => {
              setActiveTab("reservation");
              setSidebarOpen(false);
            }}
          >
            <Calendar className={styles.navIcon} />
            <span>Reservation</span>
          </div>
          <div
            className={`${styles.navItem} ${
              activeTab === "rooms" ? styles.active : ""
            }`}
            onClick={() => {
              setActiveTab("rooms");
              setSidebarOpen(false);
            }}
          >
            <Hotel className={styles.navIcon} />
            <span>Rooms</span>
          </div>
          <div
            className={`${styles.navItem} ${
              activeTab === "staffs" ? styles.active : ""
            }`}
            onClick={() => {
              setActiveTab("staffs");
              setSidebarOpen(false);
            }}
          >
            <Users className={styles.navIcon} />
            <span>Staffs</span>
          </div>
          <div
            className={`${styles.navItem} ${
              activeTab === "analytics" ? styles.active : ""
            }`}
            onClick={() => {
              setActiveTab("analytics");
              setSidebarOpen(false);
            }}
          >
            <BarChart3 className={styles.navIcon} />
            <span>Analytics</span>
          </div>
          <div
            className={`${styles.navItem} ${
              activeTab === "reports" ? styles.active : ""
            }`}
            onClick={() => {
              setActiveTab("reports");
              setSidebarOpen(false);
            }}
          >
            <FileText className={styles.navIcon} />
            <span>Reports</span>
          </div>
          <div
            className={`${styles.navItem} ${
              activeTab === "reviews" ? styles.active : ""
            }`}
            onClick={() => {
              setActiveTab("reviews");
              setSidebarOpen(false);
            }}
          >
            <Star className={styles.navIcon} />
            <span>Reviews</span>
          </div>
          <div
            className={`${styles.navItem} ${
              activeTab === "invoices" ? styles.active : ""
            }`}
            onClick={() => {
              setActiveTab("invoices");
              setSidebarOpen(false);
            }}
          >
            <DollarSign className={styles.navIcon} />
            <span>Invoices</span>
          </div>
          <div
            className={`${styles.navItem} ${
              activeTab === "settings" ? styles.active : ""
            }`}
            onClick={() => {
              setActiveTab("settings");
              setSidebarOpen(false);
            }}
          >
            <Settings className={styles.navIcon} />
            <span>Settings</span>
          </div>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <button
              className={styles.mobileMenuBtn}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1>{getPageTitle()}</h1>
          </div>
          <div className={styles.topBarCenter}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search booking, room, etc."
                className={styles.searchInput}
              />
            </div>
          </div>

          <div className={styles.topBarRight}>
            {/* <button className={styles.iconButton}>
              <MessageSquare size={20} />
            </button>
            <button className={styles.iconButton}>
              <Bell size={20} />
              <span className={styles.notificationBadge}>2</span>
            </button> */}

            <div className={styles.userProfile}>
              {/* <div className={styles.adminAvatar}>{adminInitials}</div> */}
              <div className={styles.userInfo}>
                <div className={styles.userName}>{adminName}</div>
                <div className={styles.userRole}>Admin</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.content}>{renderContent()}</div>
      </main>

      {showRoomModal && (
        <RoomModal
          room={editingRoom}
          onClose={handleCloseModal}
          onSave={handleAddRoom}
        />
      )}

      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}

export default AdminDashboard;
