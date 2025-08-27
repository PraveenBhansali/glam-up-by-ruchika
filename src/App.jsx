import React, { useState, useEffect } from 'react';
import { Calendar, Users, DollarSign, Settings, History, Plus, User, Sparkles } from 'lucide-react';
import NewBooking from './components/NewBooking';
import UpcomingBookings from './components/UpcomingBookings';
import CompletedBookings from './components/CompletedBookings';
import ServicesManager from './components/ServicesManager';
import WorkersManager from './components/WorkersManager';
import BookingHistory from './components/BookingHistory';
import { getBookings } from './services/bookingService';
import { getServices } from './services/servicesService';
import { getWorkers } from './services/workersService';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('new-booking');
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([
    { id: 1, name: 'Bridal Makeup', clientPrice: 3500, description: 'Complete bridal transformation with HD makeup ✨' },
    { id: 2, name: 'Non-Bridal Makeup', clientPrice: 2000, description: 'Beautiful makeup for parties and events 💄' },
    { id: 3, name: 'Pre-Wedding Makeup', clientPrice: 2800, description: 'Perfect look for engagement and pre-wedding shoots 📸' },
    { id: 4, name: 'Simple Makeup', clientPrice: 1800, description: 'Elegant everyday makeup for any occasion ✨' },
    { id: 5, name: 'Saree Draping', clientPrice: 1200, description: 'Traditional saree draping with styling 🥻' }
  ]);
  const [workers, setWorkers] = useState([
    { id: 1, name: 'Ruchika Bhansali', role: 'Certified Makeup Artist', paymentRate: 0, isOwner: true },
    { id: 2, name: 'Assistant', role: 'Makeup Assistant', paymentRate: 800, isOwner: false }
  ]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Supabase on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Load services FIRST (needed for booking mapping)
        const servicesResult = await getServices();
        let loadedServices = services; // fallback to default
        
        if (servicesResult.success) {
          const formattedServices = servicesResult.data.map(service => ({
            id: service.id,
            name: service.name,
            clientPrice: service.client_price,
            description: service.description
          }));
          setServices(formattedServices);
          loadedServices = formattedServices;
        } else {
          console.log('Failed to load services from Supabase, using default services');
          const savedServices = localStorage.getItem('glamupbyruchika_services');
          if (savedServices) {
            const parsedServices = JSON.parse(savedServices);
            setServices(parsedServices);
            loadedServices = parsedServices;
          }
        }

        // Load workers
        const workersResult = await getWorkers();
        if (workersResult.success) {
          const formattedWorkers = workersResult.data.map(worker => ({
            id: worker.id,
            name: worker.name,
            role: worker.role,
            paymentRate: worker.payment_rate,
            isOwner: worker.is_owner
          }));
          setWorkers(formattedWorkers);
        } else {
          console.log('Failed to load workers from Supabase, using default workers');
          const savedWorkers = localStorage.getItem('glamupbyruchika_workers');
          if (savedWorkers) setWorkers(JSON.parse(savedWorkers));
        }

        // Load bookings AFTER services are loaded
        const bookingsResult = await getBookings();
        if (bookingsResult.success) {
          // Convert Supabase data to app format using loaded services
          const formattedBookings = bookingsResult.data.map(booking => ({
            id: booking.id,
            clientName: booking.name,
            clientPhone: booking.phone,
            date: booking.date,
            time: booking.time,
            primaryService: loadedServices.find(s => s.name === booking.service)?.id || 1,
            estimatedPeople: booking.estimated_people || 1,
            notes: booking.notes,
            status: booking.status,
            createdAt: booking.created_at,
            members: [],
            totalAmount: booking.service_price || 0
          }));
          setBookings(formattedBookings);
        } else {
          console.log('Failed to load bookings from Supabase, using localStorage fallback');
          const savedBookings = localStorage.getItem('glamupbyruchika_bookings');
          if (savedBookings) setBookings(JSON.parse(savedBookings));
        }

      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to localStorage
        const savedBookings = localStorage.getItem('glamupbyruchika_bookings');
        const savedServices = localStorage.getItem('glamupbyruchika_services');
        const savedWorkers = localStorage.getItem('glamupbyruchika_workers');

        if (savedBookings) setBookings(JSON.parse(savedBookings));
        if (savedServices) setServices(JSON.parse(savedServices));
        if (savedWorkers) setWorkers(JSON.parse(savedWorkers));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever state changes (backup)
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('glamupbyruchika_bookings', JSON.stringify(bookings));
    }
  }, [bookings, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('glamupbyruchika_services', JSON.stringify(services));
    }
  }, [services, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('glamupbyruchika_workers', JSON.stringify(workers));
    }
  }, [workers, isLoading]);

  // Auto-update booking statuses
  useEffect(() => {
    const updateStatuses = () => {
      const now = new Date();
      setBookings(prevBookings => 
        prevBookings.map(booking => {
          if (booking.status === 'upcoming') {
            const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
            if (bookingDateTime < now) {
              return { ...booking, status: 'completed' };
            }
          }
          return booking;
        })
      );
    };

    updateStatuses();
    const interval = setInterval(updateStatuses, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'new-booking', label: 'New', icon: Plus, emoji: '✨' },
    { id: 'upcoming', label: 'Upcoming', icon: Calendar, emoji: '📅' },
    { id: 'completed', label: 'Completed', icon: Users, emoji: '✅' },
    { id: 'history', label: 'History', icon: History, emoji: '📊' },
    { id: 'services', label: 'Services', icon: DollarSign, emoji: '💄' },
    { id: 'workers', label: 'Team', icon: User, emoji: '👥' },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'new-booking':
        return <NewBooking services={services} onBookingCreate={(booking) => setBookings([...bookings, booking])} />;
      case 'upcoming':
        return <UpcomingBookings bookings={bookings.filter(b => b.status === 'upcoming')} services={services} />;
      case 'completed':
        return <CompletedBookings 
          bookings={bookings.filter(b => b.status === 'completed')} 
          services={services} 
          workers={workers}
          onBookingUpdate={(updatedBooking) => {
            setBookings(bookings.map(b => b.id === updatedBooking.id ? updatedBooking : b));
          }}
        />;
      case 'history':
        return <BookingHistory bookings={bookings} services={services} workers={workers} />;
      case 'services':
        return <ServicesManager services={services} onServicesUpdate={setServices} />;
      case 'workers':
        return <WorkersManager workers={workers} onWorkersUpdate={setWorkers} />;
      default:
        return <NewBooking services={services} onBookingCreate={(booking) => setBookings([...bookings, booking])} />;
    }
  };

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <div className="header-sparkles">✨</div>
            <h1>💄 Glam Up by Ruchika</h1>
            <p>Ruchika Bhansali | Makeup Artist</p>
            <div className="header-credentials">
              <div className="credential-item">💄 Professionally Certified Makeup Artist</div>
              <div className="credential-item">📍 Gadag, Karnataka (Open to travel)</div>
              <div className="credential-item">✨ Bridal | Non-Bridal | Pre-Wedding</div>
            </div>
            <div className="header-tagline">💌 Creating beautiful transformations</div>
            <div className="header-sparkles">✨</div>
          </div>
        </header>

        <nav className="app-nav">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="nav-tab-icon">
                  <span className="nav-emoji">{tab.emoji}</span>
                  <Icon size={16} />
                </div>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <main className="app-main">
          {renderActiveComponent()}
        </main>

        <footer className="app-footer">
          <div className="footer-content">
            <p>✨ @glamupbyruchika_ ✨</p>
            <p>💌 DM for bookings & inquiries 💄</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
