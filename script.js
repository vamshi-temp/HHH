/* ───────── Smooth-scroll anchors ───────── */
document.querySelectorAll("a[href^='#']").forEach(link => {
  link.addEventListener("click", e => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      });
    }
  });
});

/* ───────── Enhanced Fade-in on scroll ───────── */
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all elements that should fade in
document.querySelectorAll(".about-card, .event, .video-grid iframe, .hero-banner > div, .lead, .btn-primary")
  .forEach(el => fadeObserver.observe(el));

/* ───────── Staggered animation for grid items ───────── */
const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add("fade-in");
      }, index * 100); // Stagger by 100ms
      staggerObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Apply staggered animation to grid items
document.querySelectorAll(".about-card, .video-grid iframe")
  .forEach(el => staggerObserver.observe(el));

/* ───────── Lazy-load YouTube ───────── */
const loader = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.src = e.target.dataset.src;
      loader.unobserve(e.target);
    }
  });
}, { rootMargin: "200px" });

document.querySelectorAll("iframe[data-src]").forEach(f => loader.observe(f));

/* ───────── Enhanced Hamburger menu ───────── */
const burger = document.getElementById("burgerBtn");
const overlay = document.getElementById("overlayMenu");
const overlayClose = document.getElementById("overlayClose");

if (burger) {
  burger.addEventListener("click", () => {
    const isOpen = overlay.classList.toggle("open");
    overlay.setAttribute("aria-hidden", !isOpen);
    burger.setAttribute("aria-expanded", isOpen);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? "hidden" : "";
    
    // Add animation class for smooth transition
    if (isOpen) {
      overlay.style.transform = "translateX(0)";
    }
  });
}

if (overlayClose) {
  overlayClose.addEventListener("click", () => {
    overlay.classList.remove("open");
    overlay.style.transform = "translateX(100%)";
    document.body.style.overflow = "";
    burger.setAttribute("aria-expanded", "false");
    overlay.setAttribute("aria-hidden", "true");
  });
}

// Close menu when clicking on nav links
document.querySelectorAll(".overlay-nav a")
  .forEach(link => link.addEventListener("click", () => {
    overlay.classList.remove("open");
    overlay.style.transform = "translateX(100%)";
    document.body.style.overflow = "";
    burger.setAttribute("aria-expanded", "false");
    overlay.setAttribute("aria-hidden", "true");
  }));

/* ───────── Enhanced Find-a-Drive Map ───────── */
const findBtn = document.getElementById('findDriveBtn');
const mapWrap = document.getElementById('driveMapWrap');
const mapFrame = document.getElementById('driveMap');
const statusBox = document.getElementById('driveStatus');
const GMAPS_KEY = 'YOUR_GOOGLE_EMBED_API_KEY'; // <<—— REPLACE

if (findBtn) {
  findBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      showStatus('Geolocation not supported in this browser.');
      return;
    }
    
    // Add loading state
    findBtn.disabled = true;
    findBtn.textContent = 'Finding location...';
    showStatus('Finding your location…');
    
    navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError, {
      enableHighAccuracy: true,
      timeout: 10000
    });
  });
}

function onGeoSuccess(pos) {
  const { latitude, longitude } = pos.coords;
  const query = encodeURIComponent('American Red Cross blood donation center');
  const src = `https://www.google.com/maps/embed/v1/search?key=${GMAPS_KEY}` +
              `&center=${latitude},${longitude}&zoom=12&q=${query}`;
  
  mapFrame.src = src;
  mapWrap.style.display = 'block';
  
  // Reset button state
  findBtn.disabled = false;
  findBtn.textContent = 'Find a nearby Red Cross drive →';
  
  // Smooth reveal animation
  mapWrap.style.opacity = '0';
  mapWrap.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    mapWrap.style.transition = 'all 0.5s ease-out';
    mapWrap.style.opacity = '1';
    mapWrap.style.transform = 'translateY(0)';
  }, 100);
  
  showStatus('Zoom or scroll to explore more drives.');
}

function onGeoError(err) {
  showStatus(err.code === 1
    ? 'Permission denied – please allow location.'
    : 'Unable to retrieve your location.');
  
  // Reset button state
  findBtn.disabled = false;
  findBtn.textContent = 'Find a nearby Red Cross drive →';
}

function showStatus(text) {
  statusBox.textContent = text;
  statusBox.style.opacity = '0';
  
  setTimeout(() => {
    statusBox.style.transition = 'opacity 0.3s ease-in';
    statusBox.style.opacity = '1';
  }, 100);
}

/* ───────── Parallax effect for hero banner ───────── */
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroBanner = document.querySelector('.hero-banner');
  
  if (heroBanner) {
    const rate = scrolled * -0.5;
    heroBanner.style.transform = `translateY(${rate}px)`;
  }
});

/* ───────── Enhanced button interactions ───────── */
document.querySelectorAll('.btn-primary, .cta-button').forEach(button => {
  button.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-2px) scale(1.02)';
  });
  
  button.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
  });
  
  button.addEventListener('mousedown', function() {
    this.style.transform = 'translateY(0) scale(0.98)';
  });
  
  button.addEventListener('mouseup', function() {
    this.style.transform = 'translateY(-2px) scale(1.02)';
  });
});

/* ───────── Card hover effects ───────── */
document.querySelectorAll('.about-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-8px) scale(1.02)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
  });
});

/* ───────── Smooth reveal for sections ───────── */
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
});

// Apply to all sections
document.querySelectorAll('section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(30px)';
  section.style.transition = 'all 0.6s ease-out';
  sectionObserver.observe(section);
});

/* ───────── Enhanced navigation highlighting ───────── */
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

/* ───────── Performance optimization ───────── */
// Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debouncing to scroll events
const debouncedScroll = debounce(() => {
  // Scroll-based animations can go here
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScroll);

/* ───────── Accessibility enhancements ───────── */
// Add keyboard navigation for cards
document.querySelectorAll('.about-card').forEach(card => {
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});

// Add focus indicators for better accessibility
document.querySelectorAll('a, button, [role="button"]').forEach(element => {
  element.addEventListener('focus', function() {
    this.style.outline = '2px solid var(--primary-red)';
    this.style.outlineOffset = '3px';
  });
  
  element.addEventListener('blur', function() {
    this.style.outline = '';
    this.style.outlineOffset = '';
  });
});

/* ───────── Loading state management ───────── */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  
  // Trigger initial animations
  setTimeout(() => {
    document.querySelector('.hero h1')?.classList.add('fade-in');
    document.querySelector('.hero .lead')?.classList.add('fade-in');
  }, 100);
});

/* ───────── Error handling ───────── */
window.addEventListener('error', (e) => {
  console.error('Script error:', e.error);
});

// Graceful fallback for unsupported features
if (!window.IntersectionObserver) {
  // Fallback for older browsers
  document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
}

// Red Cross Locator Feature - Simple & Reliable
(function() {
  const RED_CROSS_LOCATIONS = [
    { 
      name: 'American Red Cross - Philadelphia', 
      address: '701 N Broad St, Philadelphia, PA 19123',
      lat: 39.9626, 
      lng: -75.1576,
      phone: '(215) 299-4000'
    },
    { 
      name: 'American Red Cross - Pittsburgh', 
      address: '1 Riverfront Dr, Pittsburgh, PA 15212',
      lat: 40.4606, 
      lng: -80.0106,
      phone: '(412) 322-4200'
    },
    { 
      name: 'American Red Cross - Harrisburg', 
      address: '1425 N 3rd St, Harrisburg, PA 17102',
      lat: 40.2732, 
      lng: -76.8839,
      phone: '(717) 236-4311'
    },
    { 
      name: 'American Red Cross - Allentown', 
      address: '1140 Hamilton St, Allentown, PA 18101',
      lat: 40.6023, 
      lng: -75.4714,
      phone: '(610) 433-3111'
    },
    { 
      name: 'American Red Cross - Reading', 
      address: '1045 N 6th St, Reading, PA 19601',
      lat: 40.3398, 
      lng: -75.9268,
      phone: '(610) 378-3341'
    },
    { 
      name: 'American Red Cross - Scranton', 
      address: '220 Adams Ave, Scranton, PA 18503',
      lat: 41.4090, 
      lng: -75.6624,
      phone: '(570) 346-4911'
    },
    { 
      name: 'American Red Cross - Erie', 
      address: '1001 State St, Erie, PA 16501',
      lat: 42.1292, 
      lng: -80.0851,
      phone: '(814) 456-4491'
    },
    { 
      name: 'American Red Cross - Lancaster', 
      address: '1425 Manheim Pike, Lancaster, PA 17601',
      lat: 40.0379, 
      lng: -76.3055,
      phone: '(717) 394-2071'
    }
  ];
  
  const RADIUS_MILES = 200; // Increased radius to cover Pennsylvania and surrounding areas
  const btn = document.getElementById('showRedCrossMapBtn');
  const mapContainer = document.getElementById('redcross-map-container');
  const loader = document.getElementById('redcross-map-loader');
  const errorMsg = document.getElementById('redcross-map-error');
  const locationsList = document.getElementById('redcross-locations-list');
  let mapLoaded = false;

  function getDistanceMiles(lat1, lng1, lat2, lng2) {
    const toRad = x => x * Math.PI / 180;
    const R = 3958.8; // miles
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  function showError(message) {
    loader.classList.remove('active');
    errorMsg.textContent = message;
    errorMsg.classList.add('active');
    btn.disabled = false;
  }

  function showSuccess() {
    loader.classList.remove('active');
    errorMsg.classList.remove('active');
  }

  function createLocationCard(location, distance, isClosest = false) {
    const closestBadge = isClosest ? `
      <div style="background: var(--primary-red); color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; display: inline-block; margin-bottom: 8px;">
        CLOSEST TO YOU
      </div>
    ` : '';
    
    const cardStyle = isClosest ? `
      border: 2px solid var(--primary-red); 
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
      background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);
    ` : '';
    
    return `
      <div class="location-card" style="${cardStyle}">
        ${closestBadge}
        <h3 style="${isClosest ? 'color: var(--primary-red);' : ''}">${location.name}</h3>
        <div class="address">${location.address}</div>
        <div class="distance" style="${isClosest ? 'font-weight: 700; color: var(--primary-red);' : ''}">${distance.toFixed(1)} miles away</div>
        ${location.phone ? `<div class="phone" style="color: var(--gray-600); font-size: var(--font-size-sm); margin-top: var(--spacing-2);">${location.phone}</div>` : ''}
        <div style="margin-top: var(--spacing-3);">
          <a href="https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}" 
             target="_blank" 
             style="color: var(--primary-red); text-decoration: none; font-size: var(--font-size-sm); font-weight: 600; ${isClosest ? 'background: var(--primary-red); color: white; padding: 8px 16px; border-radius: 6px; display: inline-block;' : ''}">
            Get Directions${isClosest ? ' (Closest)' : ''}
          </a>
        </div>
      </div>
    `;
  }

  function initializeGoogleMap(userLat, userLng, nearbyLocations) {
    console.log('Initializing Google Map...');
    
    try {
      const map = new google.maps.Map(mapContainer, {
        center: { lat: userLat, lng: userLng },
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        mapTypeControl: true,
        zoomControl: true,
        streetViewControl: false,
        fullscreenControl: true
      });

      // User marker
      new google.maps.Marker({
        position: { lat: userLat, lng: userLng },
        map: map,
        title: 'Your Location',
        icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      });

      // Red Cross markers
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: userLat, lng: userLng });

      nearbyLocations.forEach((location, index) => {
        const isClosest = index === 0;
        const marker = new google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: map,
          title: location.name,
          icon: isClosest ? 
            'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png' : // Gold star for closest
            'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });

        const distance = getDistanceMiles(userLat, userLng, location.lat, location.lng);
        const closestBadge = isClosest ? `
          <div style="background: #dc2626; color: white; padding: 2px 6px; border-radius: 8px; font-size: 11px; font-weight: 600; margin-bottom: 6px; display: inline-block;">
            CLOSEST TO YOU
          </div>
        ` : '';
        
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 250px;">
              ${closestBadge}
              <h4 style="margin: 0 0 8px 0; color: #dc2626;">${location.name}</h4>
              <p style="margin: 0 0 4px 0; font-size: 14px;">${location.address}</p>
              <p style="margin: 0 0 4px 0; font-weight: 600; ${isClosest ? 'color: #dc2626;' : ''}">${distance.toFixed(1)} miles away</p>
              ${location.phone ? `<p style="margin: 0 0 8px 0; font-size: 13px;">${location.phone}</p>` : ''}
              <a href="https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}" 
                 target="_blank" style="color: #2563eb; text-decoration: none; ${isClosest ? 'font-weight: 600;' : ''}">
                                 Get Directions ${isClosest ? '(Closest)' : ''}
              </a>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        bounds.extend({ lat: location.lat, lng: location.lng });
      });

      map.fitBounds(bounds);
      mapContainer.classList.add('active');
      mapLoaded = true;
      
      console.log('Google Map initialized successfully');
    } catch (error) {
      console.error('Error initializing Google Map:', error);
      showError('Failed to initialize map. Please try again.');
    }
  }

  function initializeSimpleMap(userLat, userLng, nearbyLocations) {
    console.log('Using simple embedded map fallback...');
    
    // Create a simple embedded Google Map as fallback
    const mapUrl = `https://www.google.com/maps/embed/v1/search?key=AIzaSyBECwx-GqGMRbKxZeo0cZAxBPczck-3LUk&q=American+Red+Cross+blood+donation&center=${userLat},${userLng}&zoom=10&maptype=terrain`;
    
    mapContainer.innerHTML = `
      <iframe 
        src="${mapUrl}"
        width="100%" 
        height="100%" 
        style="border:0;" 
        allowfullscreen="" 
        loading="lazy" 
        referrerpolicy="no-referrer-when-downgrade">
      </iframe>
    `;
    
    mapContainer.classList.add('active');
    mapLoaded = true;
  }

  btn && btn.addEventListener('click', function() {
    console.log('Red Cross locator button clicked');
    
    if (mapLoaded) {
      mapContainer.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    loader.classList.add('active');
    errorMsg.classList.remove('active');
    btn.disabled = true;

    if (!navigator.geolocation) {
      showError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      function(position) {
        console.log('Location obtained:', position.coords);
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        // Find nearby Red Cross locations
        const allLocationsWithDistance = RED_CROSS_LOCATIONS
          .map(location => ({
            ...location,
            distance: getDistanceMiles(userLat, userLng, location.lat, location.lng)
          }))
          .sort((a, b) => a.distance - b.distance);

        console.log('User location:', userLat, userLng);
        console.log('All locations with distances:', allLocationsWithDistance.map(l => `${l.name}: ${l.distance.toFixed(1)} miles`));

        // Filter by radius, but always show at least the 5 closest if none are within radius
        let nearbyLocations = allLocationsWithDistance.filter(location => location.distance <= RADIUS_MILES);
        
        if (nearbyLocations.length === 0) {
          console.log('No locations within radius, showing 5 closest');
          nearbyLocations = allLocationsWithDistance.slice(0, 5);
        }

        console.log('Locations to show:', nearbyLocations.length);
        
        // Highlight the closest location
        const closestLocation = nearbyLocations[0];
        console.log('Closest location:', closestLocation.name, `(${closestLocation.distance.toFixed(1)} miles)`);

        showSuccess();

        // Try Google Maps API first, fallback to embedded map
        if (typeof google !== 'undefined' && google.maps) {
          console.log('Google Maps API available, using interactive map');
          initializeGoogleMap(userLat, userLng, nearbyLocations);
        } else {
          console.log('Google Maps API not available, using embedded map');
          initializeSimpleMap(userLat, userLng, nearbyLocations);
        }

        // Show locations list with closest highlighted
        locationsList.innerHTML = nearbyLocations
          .map((location, index) => createLocationCard(location, location.distance, index === 0))
          .join('');
        locationsList.classList.add('active');

        btn.disabled = false;
      },
      function(error) {
        console.error('Geolocation error:', error);
        console.log('Falling back to show all Pennsylvania locations');
        
        // Fallback: use center of Pennsylvania and show all locations
        const centerLat = 40.2732; // Center of Pennsylvania (Harrisburg area)
        const centerLng = -76.8839;
        
        const allLocationsWithDistance = RED_CROSS_LOCATIONS
          .map(location => ({
            ...location,
            distance: getDistanceMiles(centerLat, centerLng, location.lat, location.lng)
          }))
          .sort((a, b) => a.distance - b.distance);

        showSuccess();

        // Try Google Maps API first, fallback to embedded map
        if (typeof google !== 'undefined' && google.maps) {
          console.log('Google Maps API available, using interactive map (fallback mode)');
          initializeGoogleMap(centerLat, centerLng, allLocationsWithDistance);
        } else {
          console.log('Google Maps API not available, using embedded map (fallback mode)');
          initializeSimpleMap(centerLat, centerLng, allLocationsWithDistance);
        }

        // Show all locations with closest highlighted
        locationsList.innerHTML = allLocationsWithDistance
          .map((location, index) => createLocationCard(location, location.distance, index === 0))
          .join('');
        locationsList.classList.add('active');

        btn.disabled = false;
        
        // Show a helpful message
        showError('Location access denied. Showing all Pennsylvania Red Cross centers.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  });
})();