import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Users,
  DollarSign,
  LogIn,
  LogOut,
  Hotel,
} from "lucide-react";
import styles from "./Styles/DashboardOverview.module.css";
import React, { useCallback, useEffect, useState } from "react";

const guestsData = [
  { day: "Sun", guests: 0 },
  { day: "Mon", guests: 0 },
  { day: "Tue", guests: 0 },
  { day: "Wed", guests: 0 },
  { day: "Thu", guests: 0 },
  { day: "Fri", guests: 7 },
  { day: "Sat", guests: 0 },
];

const revenueData = [
  { month: "May", revenue: 0 },
  { month: "Jun", revenue: 0 },
  { month: "Jul", revenue: 0 },
  { month: "Aug", revenue: 0 },
  { month: "Sept", revenue:0 },
  { month: "Oct", revenue:  89300 },
  { month: "Nov", revenue: 0 },
  { month: "Dec", revenue: 0 },
];


const bookingsMonthly = [
  { month: 'Jan', booked: 45, cancelled: 5 },
  { month: 'Feb', booked: 38, cancelled: 8 },
  { month: 'Mar', booked: 52, cancelled: 6 },
  { month: 'Apr', booked: 48, cancelled: 7 },
  { month: 'May', booked: 42, cancelled: 9 },
  { month: 'Jun', booked: 35, cancelled: 4 },
  { month: 'Jul', booked: 48, cancelled: 6 },
  { month: 'Aug', booked: 45, cancelled: 5 },
  { month: 'Sep', booked: 38, cancelled: 7 },
  { month: 'Oct', booked: 52, cancelled: 4 },
  { month: 'Nov', booked: 48, cancelled: 8 },
  { month: 'Dec', booked: 65, cancelled: 6 }
];

const platformData = [
  { name: "online", value: 10, color: "#0071c2" },
  { name: "Agoda", value: 0.1, color: "#ec5b24" },
  { name: "Airbnb", value: 0.80, color: "#ff5a5f" },
  { name: "Hotels.com", value: 0.5, color: "#d32f2f" },
  { name: "TripAdvisor", value: 0.80, color: "#00af87" },
  { name: "Traveloka", value: 0.80, color: "#1ba0e2" },
];

const recentActivities = [
  {
    id: 1,
    type: "registration",
    message: "New user registration completed",
    detail: "Karabo Mogano - Registered for a new account using the email address",
    time: "10:30 AM",
    icon: Users,
    color: "#3b82f6",
  },
  {
    id: 2,
    type: "booking",
    message: "Booking Confirmation",
    detail: "Booking ID 00123 for Gift Ragidhi, Deluxe Room 105",
    time: "9:06 AM",
    icon: LogIn,
    color: "#22c55e",
  },
  {
    id: 3,
    type: "payment",
    message: "Payment Received",
    detail: "Payment of R 1 900 received from Jan Kokobane for booking #00125",
    time: "8:45 AM",
    icon: DollarSign,
    color: "#8b5cf6",
  },
];

const bookingsList = [
  {
    id: "00123",
    guestName: "Karabo Mogano",
    roomType: "Deluxe",
    roomNo: "3",
    duration: "3 Nights",
    checkIn: "2024-04-06",
    checkOut: "2024-04-08",
    status: "Confirmed",
  },
  {
    id: "00124",
    guestName: "Jan Kokobane",
    roomType: "Suite",
    roomNo: "1",
    duration: "2 Nights",
    checkIn: "2024-04-07",
    checkOut: "2024-04-09",
    status: "Confirmed",
  },
  {
    id: "00125",
    guestName: "James Nkele",
    roomType: "Standard",
    roomNo: "5",
    duration: "4 Nights",
    checkIn: "2024-04-08",
    checkOut: "2024-04-12",
    status: "Pending",
  },
];

const ratings = [
  { category: "Cleanliness", score: 8.8 },
  { category: "Facilities", score: 9.1 },
  { category: "Location", score: 9.0 },
  { category: "Service", score: 8.7 },
  { category: "Value", score: 8.9 },
];

interface StatCard {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  subtitle: string;
}

function DashboardOverview() {
  const totalPlatformBookings = platformData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const [statsData, setStatsData] = useState<StatCard[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  const [bookingsMonthly, setBookingsMonthly] = useState<MonthlyBookingData[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/bookings/stats`
        );
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();

        const formattedStats: StatCard[] = [
          {
            label: "Total Revenue",
            value: `R ${data.totalRevenue.toLocaleString()}`,
            change: `${
              data.changes.revenue > 0 ? "+" : ""
            }${data.changes.revenue.toFixed(2)}%`,
            trend: data.changes.revenue >= 0 ? "up" : "down",
            subtitle: "from last week",
          },
          {
            label: "New Bookings",
            value: `${data.newBookings}`,
            change: `${
              data.changes.bookings > 0 ? "+" : ""
            }${data.changes.bookings.toFixed(2)}%`,
            trend: data.changes.bookings >= 0 ? "up" : "down",
            subtitle: "from last week",
          },
          {
            label: "Check In",
            value: `${data.checkIns}`,
            change: `${
              data.changes.checkIns > 0 ? "+" : ""
            }${data.changes.checkIns.toFixed(2)}%`,
            trend: data.changes.checkIns >= 0 ? "up" : "down",
            subtitle: "from last week",
          },
          {
            label: "Check Out",
            value: `${data.checkOuts}`,
            change: `${
              data.changes.checkOuts > 0 ? "+" : ""
            }${data.changes.checkOuts.toFixed(2)}%`,
            trend: data.changes.checkOuts >= 0 ? "up" : "down",
            subtitle: "from last week",
          },
        ];

        setStatsData(formattedStats);
      } catch (err) {
        console.error("Stats fetch error:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);


type MonthlyBookingData = {
  month: string;
  booked: number;
  cancelled: number;
};

useEffect(() => {
  const fetchMonthlyBookings = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/bookings/monthly`
      );
      if (!response.ok) throw new Error("Failed to fetch monthly bookings");
      const data = await response.json();

      const formattedData: MonthlyBookingData[] = data.map((item: any) => ({
        month: item.month,
        booked: Number(item.booked) || 0,
        cancelled: Number(item.cancelled) || 0,
      }));

      setBookingsMonthly(formattedData);
    } catch (err) {
      console.error("Monthly bookings fetch error:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  fetchMonthlyBookings();
}, []);

if (loadingBookings) {
  return <p>Loading bookings data...</p>;
}


  return (
    <div className={styles.dashboardOverview}>
      <div className={styles.mainSection}>

        {/* Stats Cards */}

        <div className={styles.statsGrid}>
          {loadingStats ? (
            <p>Loading stats...</p>
          ) : (
            statsData.map((stat, index) => (
              <div key={index} className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span className={styles.statLabel}>{stat.label}</span>
                  <button className={styles.moreButton}>
                    <MoreVertical size={16} />
                  </button>
                </div>
                <div className={styles.statValue}>{stat.value}</div>
                <div
                  className={`${styles.statChange} ${
                    stat.trend === "up" ? styles.positive : styles.negative
                  }`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  <span>{stat.change}</span>
                  <span className={styles.statSubtitle}>{stat.subtitle}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Charts Row 1 */}
        <div className={styles.chartsRow}>
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div>
                <h3>Guests</h3>
                <p className={styles.chartSubtitle}>This Week</p>
              </div>
              <select className={styles.chartSelect}>
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={guestsData}>
                <defs>
                  <linearGradient id="guestGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="guests" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fill="url(#guestGradient)"
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className={styles.chartFooter}>
              <span className={styles.guestCount}>8 Guests</span>
            </div>
          </div>

          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div>
                <h3>Revenue</h3>
                <p className={styles.chartSubtitle}>Last 6 Months</p>
              </div>
              <select className={styles.chartSelect}>
                <option>Last 6 Months</option>
                <option>Last Year</option>
                <option>All Time</option>
              </select>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: number) => `R ${value.toLocaleString()}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className={styles.chartFooter}>
              <span className={styles.revenueAmount}>R12300</span>
            </div>
          </div>
        </div>

        {/* Booking List */}
        <div className={styles.tableSection}>
          <div className={styles.tablHeader}>
            <h3>Booking List</h3>
            <div className={styles.tableActions}>
              <select className={styles.tableSelect}>
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
              </select>
              <button className={styles.seeAllButton}>See All</button>
            </div>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.bookingTable}>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Guest Name</th>
                  <th>Room Type</th>
                  <th>Room No</th>
                  <th>Duration</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookingsList.map((booking) => (
                  <tr key={booking.id}>
                    <td><strong>{booking.id}</strong></td>
                    <td>{booking.guestName}</td>
                    <td>{booking.roomType}</td>
                    <td>{booking.roomNo}</td>
                    <td>{booking.duration}</td>
                    <td>{booking.checkIn}</td>
                    <td>{booking.checkOut}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[booking.status.toLowerCase()]}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className={styles.rightSidebar}>
        {/* Room Occupancy */}
        <div className={styles.widget}>
          <div className={styles.widgetHeader}>
            <h3>Room Occupancy</h3>
            <button className={styles.moreButton}>
              <MoreVertical size={16} />
            </button>
          </div>
          <div className={styles.occupancyMain}>
            <div className={styles.occupancyIcon}>
              <Hotel size={32} />
            </div>
            <div className={styles.occupancyValue}>6</div>
            <div className={styles.occupancyLabel}>Total Rooms</div>
          </div>
          <div className={styles.occupancyBar}>
            <div className={styles.occupancySegment} style={{ width: '38%', background: '#3b82f6' }}></div>
            <div className={styles.occupancySegment} style={{ width: '18%', background: '#22c55e' }}></div>
            <div className={styles.occupancySegment} style={{ width: '34%', background: '#f59e0b' }}></div>
            <div className={styles.occupancySegment} style={{ width: '10%', background: '#e5e7eb' }}></div>
          </div>
          <div className={styles.occupancyStats}>
            <div className={styles.occupancyStat}>
              <span className={styles.occupancyDot} style={{ background: '#3b82f6' }}></span>
              <div>
                <div className={styles.occupancyNumber}>4</div>
                <div className={styles.occupancyText}>Occupied</div>
              </div>
            </div>
            <div className={styles.occupancyStat}>
              <span className={styles.occupancyDot} style={{ background: '#22c55e' }}></span>
              <div>
                <div className={styles.occupancyNumber}>1</div>
                <div className={styles.occupancyText}>Available</div>
              </div>
            </div>
            <div className={styles.occupancyStat}>
              <span className={styles.occupancyDot} style={{ background: '#f59e0b' }}></span>
              <div>
                <div className={styles.occupancyNumber}>1</div>
                <div className={styles.occupancyText}>Reserved</div>
              </div>
            </div>
            <div className={styles.occupancyStat}>
              <span className={styles.occupancyDot} style={{ background: '#e5e7eb' }}></span>
              <div>
                <div className={styles.occupancyNumber}>0</div>
                <div className={styles.occupancyText}>Not Ready</div>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Ratings */}
        <div className={styles.widget}>
          <div className={styles.widgetHeader}>
            <h3>Overall Ratings</h3>
            <button className={styles.seeAllLink}>See All</button>
          </div>
          <div className={styles.ratingsMain}>
            <div className={styles.overallScore}>8.9</div>
            <div>
              <div className={styles.ratingLabel}>Excellent</div>
              <div className={styles.ratingCount}>1,458 verified reviews</div>
            </div>
          </div>
          <div className={styles.ratingsList}>
            {ratings.map((rating, index) => (
              <div key={index} className={styles.ratingItem}>
                <div className={styles.ratingCategory}>{rating.category}</div>
                <div className={styles.ratingBarContainer}>
                  <div 
                    className={styles.ratingBar} 
                    style={{ width: `${(rating.score / 10) * 100}%` }}
                  ></div>
                </div>
                <div className={styles.ratingScore}>{rating.score}</div>
              </div>
            ))}
          </div>
        </div>

        
      </div>
    </div>
  );
}

export default DashboardOverview;