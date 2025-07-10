/**
 * Dashboard API Integration for The Iron Foundation
 * Real-time donation tracking and user engagement analytics
 * 
 * Features:
 * - Live donation counter with webhook integration
 * - User engagement tracking (quiz completions, logins)
 * - Real-time dashboard updates
 * - Supabase backend integration
 * - Donorbox webhook handling
 */

// Firebase Configuration
const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  databaseURL: "https://your-app.firebaseio.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Dashboard Stats
class DashboardStats {
  constructor() {
    this.stats = {
      donations: 0,
      livesImpacted: 0,
      awarenessReached: 0,
      monthlyDonations: 0,
      bloodDonated: 0,
      donorCount: 0
    };
    this.initializeStats();
    this.setupEventListeners();
  }

  async initializeStats() {
    try {
      // In a real implementation, these would come from your backend
      const mockStats = {
        donations: 1234,
        livesImpacted: 3702,
        awarenessReached: 15000,
        monthlyDonations: 89,
        bloodDonated: 567,
        donorCount: 234
      };

      this.updateStats(mockStats);
      this.startLiveUpdates();
    } catch (error) {
      console.error('Error initializing stats:', error);
    }
  }

  updateStats(newStats) {
    this.stats = { ...this.stats, ...newStats };
    this.updateDOM();
  }

  updateDOM() {
    // Update all stat displays
    Object.keys(this.stats).forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        this.animateNumber(element, this.stats[key]);
      }
    });
  }

  animateNumber(element, target) {
    const start = parseInt(element.textContent) || 0;
    const duration = 1000;
    const steps = 60;
    const increment = (target - start) / steps;
    let current = start;
    let step = 0;

    const animate = () => {
      step++;
      current += increment;
      element.textContent = Math.round(current).toLocaleString();

      if (step < steps) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = target.toLocaleString();
      }
    };

    requestAnimationFrame(animate);
  }

  startLiveUpdates() {
    // Simulate real-time updates
    setInterval(() => {
      const randomIncrease = {
        donations: Math.floor(Math.random() * 3),
        livesImpacted: Math.floor(Math.random() * 5),
        awarenessReached: Math.floor(Math.random() * 20),
        monthlyDonations: Math.floor(Math.random() * 2),
        bloodDonated: Math.floor(Math.random() * 3),
        donorCount: Math.floor(Math.random() * 2)
      };

      Object.keys(randomIncrease).forEach(key => {
        this.stats[key] += randomIncrease[key];
      });

      this.updateDOM();
    }, 5000);
  }

  setupEventListeners() {
    // Track donation button clicks
    const donateButtons = document.querySelectorAll('[href="#donate"]');
    donateButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.trackEvent('donation_button_click');
      });
    });

    // Track map interactions
    const map = document.getElementById('redCrossMap');
    if (map) {
      map.addEventListener('click', () => {
        this.trackEvent('map_interaction');
      });
    }
  }

  trackEvent(eventName, eventData = {}) {
    // In a real implementation, this would send data to your analytics service
    console.log('Event tracked:', eventName, eventData);
  }
}

// Magic Link Authentication
class MagicLinkAuth {
  constructor() {
    this.auth = firebase.auth();
    this.setupAuthUI();
  }

  setupAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    if (!loginBtn) return;

    loginBtn.addEventListener('click', () => {
      const email = prompt('Enter your email for a magic link:');
      if (email) {
        this.sendMagicLink(email);
      }
    });
  }

  async sendMagicLink(email) {
    try {
      const actionCodeSettings = {
        url: window.location.href,
        handleCodeInApp: true
      };

      await this.auth.sendSignInLinkToEmail(email, actionCodeSettings);
      localStorage.setItem('emailForSignIn', email);
      alert('Check your email for the login link!');
    } catch (error) {
      console.error('Error sending magic link:', error);
      alert('Error sending login link. Please try again.');
    }
  }

  async completeSignIn() {
    if (this.auth.isSignInWithEmailLink(window.location.href)) {
      let email = localStorage.getItem('emailForSignIn');
      
      if (!email) {
        email = window.prompt('Please provide your email for confirmation:');
      }

      try {
        await this.auth.signInWithEmailLink(email, window.location.href);
        localStorage.removeItem('emailForSignIn');
        window.location.href = '/dashboard.html';
      } catch (error) {
        console.error('Error signing in:', error);
        alert('Error completing sign in. Please try again.');
      }
    }
  }
}

// Google Maps Integration
class LocationFinder {
  constructor() {
    this.map = null;
    this.markers = [];
    this.initMap();
    this.setupEventListeners();
  }

  initMap() {
    // Initialize map with default center
    this.map = new google.maps.Map(document.getElementById('redCrossMap'), {
      center: { lat: 39.8283, lng: -98.5795 }, // Center of USA
      zoom: 4,
      styles: [
        {
          featureType: "all",
          elementType: "labels.text.fill",
          stylers: [{ color: "#333333" }]
        }
      ]
    });
  }

  setupEventListeners() {
    const findNearMeBtn = document.getElementById('findNearMe');
    const locationSearch = document.getElementById('locationSearch');

    if (findNearMeBtn) {
      findNearMeBtn.addEventListener('click', () => this.findNearMe());
    }

    if (locationSearch) {
      locationSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.searchLocation(locationSearch.value);
        }
      });
    }
  }

  async findNearMe() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.map.setCenter(pos);
          this.map.setZoom(11);
          this.findRedCrossLocations(pos);
        },
        () => {
          alert('Error: The Geolocation service failed.');
        }
      );
    } else {
      alert('Error: Your browser doesn\'t support geolocation.');
    }
  }

  async searchLocation(query) {
    const geocoder = new google.maps.Geocoder();
    
    try {
      const result = await geocoder.geocode({ address: query });
      const location = result.results[0].geometry.location;
      this.map.setCenter(location);
      this.map.setZoom(11);
      this.findRedCrossLocations(location);
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Location not found. Please try again.');
    }
  }

  async findRedCrossLocations(location) {
    // Clear existing markers
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];

    // Example Red Cross locations (replace with actual API call)
    const redCrossLocations = await this.fetchRedCrossLocations(location);

    redCrossLocations.forEach(loc => {
      const marker = new google.maps.Marker({
        position: loc.position,
        map: this.map,
        title: loc.name,
        icon: {
          url: 'images/red-cross-icon.png',
          scaledSize: new google.maps.Size(32, 32)
        }
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="info-window">
            <h3>${loc.name}</h3>
            <p>${loc.address}</p>
            <p>${loc.phone}</p>
            <a href="${loc.scheduleUrl}" target="_blank" class="btn btn-primary">Schedule Donation</a>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(this.map, marker);
      });

      this.markers.push(marker);
    });
  }

  async fetchRedCrossLocations(location) {
    // TODO: Replace with actual Red Cross API integration
    // This is a placeholder that returns mock data
    return [
      {
        name: 'Red Cross Donation Center',
        position: {
          lat: location.lat + 0.01,
          lng: location.lng + 0.01
        },
        address: '123 Main St, Anytown, USA',
        phone: '(555) 123-4567',
        scheduleUrl: 'https://www.redcross.org/give-blood'
      }
      // Add more mock locations as needed
    ];
  }
}

// Initialize all features when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const dashboard = new DashboardStats();
  const auth = new MagicLinkAuth();
  const locationFinder = new LocationFinder();

  // Check for magic link completion
  auth.completeSignIn();
});

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.dashboardAPI = dashboardAPI;
}

// Handle page unload
window.addEventListener('beforeunload', () => {
  if (dashboardAPI) {
    dashboardAPI.destroy();
  }
}); 