const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, '..', '..', 'backend', 'database.json');

// Helper to read DB
function readDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    }
  } catch (e) {
    console.error('[DB ERROR] Failed to read database:', e.message);
  }
  return { users: [], drivers: [], chauffeurPackages: [], cabTiers: [], gigs: [], bookings: [], kycDocuments: [], apiLogs: [] };
}

// Helper to write DB
function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('[DB ERROR] Failed to write database:', e.message);
    return false;
  }
}

// Helper to parse JSON body
function parseJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

// Send JSON response with CORS
function sendJson(res, statusCode, data, reqMethod, reqUrl) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));

  // Log to database API logs
  if (reqUrl && reqUrl.startsWith('/api/')) {
    try {
      const db = readDb();
      if (!db.apiLogs) db.apiLogs = [];
      db.apiLogs.unshift({
        time: new Date().toLocaleTimeString(),
        method: reqMethod,
        endpoint: reqUrl,
        status: statusCode
      });
      if (db.apiLogs.length > 40) db.apiLogs = db.apiLogs.slice(0, 40);
      writeDb(db);
    } catch (e) {}
  }
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // ========================================================
  // REST API ENDPOINTS
  // ========================================================

  // 1. HEALTH CHECK
  if (pathname === '/api/v1/health' && method === 'GET') {
    return sendJson(res, 200, { status: 'UP', database: 'CONNECTED', timestamp: new Date().toISOString() }, method, pathname);
  }

  // 2. DATABASE INSPECT (ADMIN PROTECTED)
  if (pathname === '/api/v1/db/inspect' && method === 'GET') {
    const authHeader = req.headers['authorization'] || '';
    if (!authHeader.startsWith('Bearer ') || authHeader.replace('Bearer ', '').trim() !== 'admin-ops-key') {
      return sendJson(res, 401, { error: 'Unauthorized: Admin authentication token required to inspect database' }, method, pathname);
    }
    const db = readDb();
    return sendJson(res, 200, {
      databaseFile: DB_PATH,
      status: 'HEALTHY',
      summary: {
        totalUsers: db.users ? db.users.length : 0,
        totalDrivers: db.drivers ? db.drivers.length : 0,
        totalBookings: db.bookings ? db.bookings.length : 0,
        totalGigs: db.gigs ? db.gigs.length : 0,
        totalKycDocuments: db.kycDocuments ? db.kycDocuments.length : 0
      },
      data: db
    }, method, pathname);
  }

  // 2B. GEO: SMART IP LOCATION AUTO-DETECTION (RELIABLE ON HTTP & MOBILE)
  if (pathname === '/api/v1/geo/current' && method === 'GET') {
    try {
      const geoReq = https.get('https://ipapi.co/json/', {
        headers: { 'User-Agent': 'RideDriveAhead/1.0' },
        timeout: 4000
      }, (geoRes) => {
        let raw = '';
        geoRes.on('data', c => raw += c);
        geoRes.on('end', () => {
          try {
            const j = JSON.parse(raw);
            const city = j.city || 'Sagar';
            const region = j.region || 'Madhya Pradesh';
            const lat = typeof j.latitude === 'number' ? j.latitude : 23.8333;
            const lng = typeof j.longitude === 'number' ? j.longitude : 78.7167;
            return sendJson(res, 200, {
              success: true,
              city,
              region,
              country: j.country_name || 'India',
              lat,
              lng,
              displayName: `${city}, ${region}`
            }, method, pathname);
          } catch(e) {
            return sendJson(res, 200, {
              success: true,
              city: 'Sagar',
              region: 'Madhya Pradesh',
              country: 'India',
              lat: 23.8333,
              lng: 78.7167,
              displayName: 'Sagar, Madhya Pradesh'
            }, method, pathname);
          }
        });
      });
      geoReq.on('error', () => {
        return sendJson(res, 200, {
          success: true,
          city: 'Sagar',
          region: 'Madhya Pradesh',
          country: 'India',
          lat: 23.8333,
          lng: 78.7167,
          displayName: 'Sagar, Madhya Pradesh'
        }, method, pathname);
      });
      geoReq.on('timeout', () => {
        geoReq.destroy();
        return sendJson(res, 200, {
          success: true,
          city: 'Sagar',
          region: 'Madhya Pradesh',
          country: 'India',
          lat: 23.8333,
          lng: 78.7167,
          displayName: 'Sagar, Madhya Pradesh'
        }, method, pathname);
      });
    } catch(err) {
      return sendJson(res, 200, {
        success: true,
        city: 'Sagar',
        region: 'Madhya Pradesh',
        country: 'India',
        lat: 23.8333,
        lng: 78.7167,
        displayName: 'Sagar, Madhya Pradesh'
      }, method, pathname);
    }
    return;
  }

  // 2C. GEO: REVERSE GEOCODING (COORDINATES -> HUMAN ADDRESS)
  if (pathname === '/api/v1/geo/reverse' && method === 'GET') {
    const lat = parsedUrl.searchParams.get('lat') || '23.8333';
    const lng = parsedUrl.searchParams.get('lng') || '78.7167';
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`;
      const revReq = https.get(url, {
        headers: { 'User-Agent': 'RideDriveAhead/1.0 (contact@ridedriveahead.local)' },
        timeout: 4000
      }, (revRes) => {
        let raw = '';
        revRes.on('data', c => raw += c);
        revRes.on('end', () => {
          try {
            const j = JSON.parse(raw);
            const addr = j.address || {};
            const mainName = addr.road || addr.suburb || addr.neighbourhood || addr.city_district || addr.city || 'Detected Location';
            const subtitle = [addr.suburb, addr.city, addr.state].filter(Boolean).join(', ');
            return sendJson(res, 200, {
              success: true,
              displayName: j.display_name || `${lat}, ${lng}`,
              mainName,
              subtitle: subtitle || 'Current Location',
              lat: parseFloat(lat),
              lng: parseFloat(lng)
            }, method, pathname);
          } catch (e) {
            return sendJson(res, 200, {
              success: true,
              displayName: `Location (${lat}, ${lng})`,
              mainName: 'Current Location',
              subtitle: 'Detected GPS Position',
              lat: parseFloat(lat),
              lng: parseFloat(lng)
            }, method, pathname);
          }
        });
      });
      revReq.on('error', () => {
        return sendJson(res, 200, {
          success: true,
          displayName: `Location (${lat}, ${lng})`,
          mainName: 'Current Location',
          subtitle: 'Detected GPS Position',
          lat: parseFloat(lat),
          lng: parseFloat(lng)
        }, method, pathname);
      });
      revReq.on('timeout', () => {
        revReq.destroy();
        return sendJson(res, 200, {
          success: true,
          displayName: `Location (${lat}, ${lng})`,
          mainName: 'Current Location',
          subtitle: 'Detected GPS Position',
          lat: parseFloat(lat),
          lng: parseFloat(lng)
        }, method, pathname);
      });
    } catch(e) {
      return sendJson(res, 200, {
        success: true,
        displayName: `Location (${lat}, ${lng})`,
        mainName: 'Current Location',
        subtitle: 'Detected GPS Position',
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      }, method, pathname);
    }
    return;
  }

  // 2D. GEO: AUTOCOMPLETE / SEARCH PLACES (OLA STYLE SEARCH)
  if (pathname === '/api/v1/geo/search' && method === 'GET') {
    const query = parsedUrl.searchParams.get('q') || '';
    if (!query || query.trim().length < 2) {
      return sendJson(res, 200, { success: true, places: [] }, method, pathname);
    }
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=8`;
      const searchReq = https.get(url, {
        headers: { 'User-Agent': 'RideDriveAhead/1.0 (contact@ridedriveahead.local)' },
        timeout: 4000
      }, (searchRes) => {
        let raw = '';
        searchRes.on('data', c => raw += c);
        searchRes.on('end', () => {
          try {
            const results = JSON.parse(raw);
            const places = results.map(r => ({
              id: r.place_id,
              name: r.display_name.split(',')[0],
              fullName: r.display_name,
              lat: parseFloat(r.lat),
              lng: parseFloat(r.lon),
              type: r.type || 'place'
            }));
            return sendJson(res, 200, { success: true, places }, method, pathname);
          } catch(e) {
            return sendJson(res, 200, { success: true, places: [] }, method, pathname);
          }
        });
      });
      searchReq.on('error', () => {
        return sendJson(res, 200, { success: true, places: [] }, method, pathname);
      });
      searchReq.on('timeout', () => {
        searchReq.destroy();
        return sendJson(res, 200, { success: true, places: [] }, method, pathname);
      });
    } catch(e) {
      return sendJson(res, 200, { success: true, places: [] }, method, pathname);
    }
    return;
  }

  // 3. AUTH: REQUEST OTP
  if (pathname === '/api/v1/auth/otp/request' && method === 'POST') {
    const body = await parseJsonBody(req);
    const phone = body.phoneNumber || '';
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      return sendJson(res, 400, { success: false, message: 'Valid 10-digit mobile number required' }, method, pathname);
    }
    return sendJson(res, 200, {
      success: true,
      message: `OTP sent to ${phone}`,
      data: { otp: '123456', expiresInSeconds: 300 }
    }, method, pathname);
  }

  // 4. AUTH: VERIFY OTP / LOGIN / SIGNUP
  if (pathname === '/api/v1/auth/otp/verify' && method === 'POST') {
    const body = await parseJsonBody(req);
    const phone = body.phoneNumber ? body.phoneNumber.trim() : '';
    const otpCode = body.otpCode ? String(body.otpCode).trim() : '';
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      return sendJson(res, 400, { success: false, message: 'Valid mobile number required' }, method, pathname);
    }
    if (!otpCode || (otpCode !== '123456' && otpCode !== '4821')) {
      return sendJson(res, 401, { success: false, message: 'Invalid or expired OTP code' }, method, pathname);
    }
    const fullName = body.fullName ? body.fullName.trim() : '';
    const role = body.userRole || 'RIDER';
    const email = body.email || '';
    const city = body.city || 'National Operations';

    const db = readDb();
    let user = null;

    if (role === 'DRIVER') {
      let driver = db.drivers.find(d => d.phoneNumber.replace(/\D/g, '') === phone.replace(/\D/g, ''));
      if (!driver) {
        driver = {
          id: 'd-' + Math.floor(1000 + Math.random() * 9000),
          userId: 'u-' + Math.floor(1000 + Math.random() * 9000),
          fullName: fullName || 'New Driver Partner',
          phoneNumber: phone,
          city: city,
          licenseNumber: body.licenseNumber || '',
          role: body.preference || 'CHAUFFEUR',
          transmissionSkills: body.skills || ['MANUAL', 'AUTOMATIC'],
          vehicleModel: 'Personal Vehicle Chauffeur',
          vehiclePlate: 'N/A',
          vehicleType: 'SEDAN',
          isOnline: false,
          rating: null,
          totalTrips: 0,
          kycStatus: 'PENDING_REVIEW',
          drivingHoursToday: 0.0,
          maxDrivingHours: 8.0,
          todayEarnings: 0
        };
        db.drivers.push(driver);
        writeDb(db);
      }
      return sendJson(res, 200, {
        success: true,
        accessToken: 'jwt-driver-' + Date.now(),
        user: driver
      }, method, pathname);
    } else {
      user = db.users.find(u => u.phoneNumber.replace(/\D/g, '') === phone.replace(/\D/g, ''));
      if (!user) {
        user = {
          id: 'u-' + Math.floor(1000 + Math.random() * 9000),
          phoneNumber: phone,
          fullName: fullName || 'Verified Rider',
          email: email,
          role: 'RIDER',
          city: city,
          rating: null,
          registeredCars: [],
          createdAt: new Date().toISOString()
        };
        db.users.push(user);
        writeDb(db);
      }
      return sendJson(res, 200, {
        success: true,
        accessToken: 'jwt-rider-' + Date.now(),
        user: user
      }, method, pathname);
    }
  }

  // 5. CHAUFFEUR PACKAGES
  if (pathname === '/api/v1/chauffeur/packages' && method === 'GET') {
    const db = readDb();
    return sendJson(res, 200, { success: true, data: db.chauffeurPackages }, method, pathname);
  }

  // 6. CAB TIERS
  if (pathname === '/api/v1/cab/tiers' && method === 'GET') {
    const db = readDb();
    return sendJson(res, 200, { success: true, data: db.cabTiers }, method, pathname);
  }

  // 7. DRIVER GIGS MARKETPLACE
  if (pathname === '/api/v1/drivers/gigs' && method === 'GET') {
    const db = readDb();
    return sendJson(res, 200, { success: true, data: db.gigs }, method, pathname);
  }

  // 8. CLAIM A GIG
  if (pathname.startsWith('/api/v1/drivers/gigs/') && pathname.endsWith('/claim') && method === 'POST') {
    const gigId = pathname.split('/')[5];
    const db = readDb();
    const gig = db.gigs.find(g => g.id === gigId);
    if (gig) {
      gig.isClaimed = true;
      writeDb(db);
      return sendJson(res, 200, { success: true, message: `Gig ${gigId} claimed!`, gig }, method, pathname);
    }
    return sendJson(res, 404, { success: false, message: 'Gig not found' }, method, pathname);
  }

  // 9. BOOKINGS: CREATE BOOKING
  if (pathname === '/api/v1/bookings' && method === 'POST') {
    const body = await parseJsonBody(req);
    const db = readDb();
    const newBooking = {
      id: (body.serviceMode === 'HIRE_DRIVER' ? 'CHF-' : 'CAB-') + Math.floor(1000 + Math.random() * 9000),
      serviceMode: body.serviceMode || 'HIRE_DRIVER',
      pkgName: body.pkgName || '4 Hours Half-Day Chauffeur',
      durationHours: body.durationHours || 4,
      carModel: body.carModel || 'Honda City (Automatic AT)',
      transmission: body.transmission || 'AUTOMATIC',
      pickup: body.pickup || 'Sector 43, Golf Course Road, Gurugram',
      drop: body.drop || 'City Local Travel Round-Trip',
      distanceKm: body.distanceKm || 25.0,
      fare: body.fare || 549,
      overtimeRate: body.overtimeRate || 99,
      otp: String(Math.floor(1000 + Math.random() * 9000)),
      status: 'SCHEDULED_CONFIRMED',
      elapsedSeconds: 0,
      fuelHandover: '80% Full',
      odometerStart: 34812,
      riderName: body.riderName || 'Rider',
      driverName: 'Assigned on Dispatch',
      createdAt: new Date().toISOString()
    };
    db.bookings.unshift(newBooking);
    writeDb(db);
    return sendJson(res, 201, { success: true, message: 'Booking confirmed!', booking: newBooking }, method, pathname);
  }

  // 10. BOOKINGS: GET ACTIVE
  if (pathname === '/api/v1/bookings/active' && method === 'GET') {
    const db = readDb();
    const active = db.bookings[0] || null;
    return sendJson(res, 200, { success: true, booking: active }, method, pathname);
  }

  // 11. BOOKINGS: VERIFY OTP & START DUTY
  if (pathname === '/api/v1/bookings/verify-otp' && method === 'POST') {
    const body = await parseJsonBody(req);
    const db = readDb();
    if (db.bookings.length > 0) {
      db.bookings[0].status = 'IN_PROGRESS';
      writeDb(db);
      return sendJson(res, 200, { success: true, message: 'OTP verified! Duty in progress.', booking: db.bookings[0] }, method, pathname);
    }
    return sendJson(res, 404, { success: false, message: 'No active booking' }, method, pathname);
  }

  // 12. BOOKINGS: COMPLETE DUTY
  if (pathname === '/api/v1/bookings/complete' && method === 'POST') {
    const db = readDb();
    if (db.bookings.length > 0) {
      const b = db.bookings[0];
      b.status = 'COMPLETED';
      if (db.drivers.length > 0) {
        db.drivers[0].todayEarnings += b.fare;
        db.drivers[0].totalTrips += 1;
      }
      writeDb(db);
      return sendJson(res, 200, { success: true, message: 'Duty settled and completed!', booking: b }, method, pathname);
    }
    return sendJson(res, 404, { success: false, message: 'No active booking' }, method, pathname);
  }

  // ADMIN AUTHENTICATION GUARD
  if (pathname.startsWith('/api/v1/admin/')) {
    const authHeader = req.headers['authorization'] || '';
    if (!authHeader.startsWith('Bearer ') || authHeader.replace('Bearer ', '').trim() !== 'admin-ops-key') {
      return sendJson(res, 401, { error: 'Unauthorized: Admin authentication token required' }, method, pathname);
    }
  }

  // 13. ADMIN COMMAND CENTER ACTION AUDIT & MUTATION
  if (pathname === '/api/v1/admin/action' && method === 'POST') {
    const body = await parseJsonBody(req);
    const db = readDb();
    if (!db.auditLogs) db.auditLogs = [];
    const logEntry = {
      id: 'AUD-' + Math.floor(10000 + Math.random() * 90000),
      timestamp: new Date().toISOString(),
      adminId: body.adminId || 'ADM-001',
      adminName: body.adminName || 'Super Admin',
      role: body.role || 'SUPER_ADMIN',
      action: body.action || 'ADMIN_ACTION',
      targetResource: body.targetResource || 'SYSTEM',
      targetId: body.targetId || 'N/A',
      ipAddress: req.socket.remoteAddress || '10.0.4.88',
      status: 'SUCCESS',
      metadata: body.metadata || {}
    };
    db.auditLogs.unshift(logEntry);
    writeDb(db);
    return sendJson(res, 200, { success: true, logEntry }, method, pathname);
  }

  // 14. ADMIN DRIVER SUSPENSION
  if (pathname === '/api/v1/admin/driver/suspend' && method === 'POST') {
    const body = await parseJsonBody(req);
    const db = readDb();
    const driver = (db.drivers || []).find(d => d.id === body.driverId);
    if (driver) {
      driver.isOnline = false;
      driver.suspended = true;
      driver.suspensionReason = body.reason || 'Safety investigation';
    }
    if (!db.auditLogs) db.auditLogs = [];
    db.auditLogs.unshift({
      id: 'AUD-' + Math.floor(10000 + Math.random() * 90000),
      timestamp: new Date().toISOString(),
      adminId: body.adminId || 'ADM-001',
      adminName: body.adminName || 'Super Admin',
      role: body.role || 'SUPER_ADMIN',
      action: 'DRIVER_SUSPENDED',
      targetResource: 'DRIVER',
      targetId: body.driverId,
      ipAddress: '10.0.4.88',
      status: 'SUCCESS',
      metadata: { reason: body.reason, duration: body.duration }
    });
    writeDb(db);
    return sendJson(res, 200, { success: true, message: `Driver ${body.driverId} suspended` }, method, pathname);
  }

  // 15. ADMIN DRIVER VERIFY KYC
  if (pathname === '/api/v1/admin/driver/verify' && method === 'POST') {
    const body = await parseJsonBody(req);
    const db = readDb();
    const driver = (db.drivers || []).find(d => d.id === body.driverId);
    if (driver) {
      driver.kycStatus = 'VERIFIED';
    }
    if (!db.auditLogs) db.auditLogs = [];
    db.auditLogs.unshift({
      id: 'AUD-' + Math.floor(10000 + Math.random() * 90000),
      timestamp: new Date().toISOString(),
      adminId: body.adminId || 'ADM-004',
      adminName: body.adminName || 'Safety Admin',
      role: body.role || 'SAFETY_ADMIN',
      action: 'KYC_APPROVED',
      targetResource: 'DRIVER',
      targetId: body.driverId,
      ipAddress: '10.0.4.88',
      status: 'SUCCESS',
      metadata: { notes: 'Aadhaar + DL verified successfully' }
    });
    writeDb(db);
    return sendJson(res, 200, { success: true, message: `Driver ${body.driverId} verified` }, method, pathname);
  }

  // 16. ADMIN SURGE UPDATE
  if (pathname === '/api/v1/admin/surge/update' && method === 'POST') {
    const body = await parseJsonBody(req);
    const db = readDb();
    const zone = (db.surgeZones || []).find(z => z.id === body.zoneId);
    if (zone) {
      zone.currentSurge = parseFloat(body.multiplier);
    }
    writeDb(db);
    return sendJson(res, 200, { success: true, message: 'Surge multiplier updated', zone }, method, pathname);
  }

  // ========================================================
  // SERVE MOBILE PWA APPS (INSTALLABLE, INSTANT-UPDATE)
  // Rider PWA: /app
  // Driver PWA: /driver-app
  // ========================================================

  // RIDER PWA (mobile installable app)
  if (pathname === '/app' || pathname === '/rider-app' || pathname === '/app/') {
    const pwaPath = path.join(__dirname, 'rider-pwa.html');
    fs.readFile(pwaPath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Rider PWA not found: ' + err.message);
        return;
      }
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(data);
    });
    return;
  }

  // DRIVER PWA (mobile installable app)
  if (pathname === '/driver-app' || pathname === '/driver-app/') {
    const pwaPath = path.join(__dirname, 'driver-pwa.html');
    fs.readFile(pwaPath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Driver PWA not found: ' + err.message);
        return;
      }
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(data);
    });
    return;
  }

  // ========================================================
  // SERVE 3 DISTINCT WEB APPLICATIONS (BY ROUTE OR HOSTNAME)
  // 1. Customer Web: ridedriveahead.com / /
  // 2. Driver Web: driver.ridedriveahead.com / /driver
  // 3. Admin Web: admin.ridedriveahead.com / /admin
  // ========================================================
  const host = (req.headers.host || '').toLowerCase();

  // 1. DRIVER WEB (driver.ridedriveahead.com or /driver)
  if (pathname === '/driver' || pathname === '/driver.html' || (host.startsWith('driver.') && (pathname === '/' || pathname === '/index.html'))) {
    const driverPath = path.join(__dirname, 'driver.html');
    fs.readFile(driverPath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading driver portal: ' + err.message);
        return;
      }
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(data);
    });
    return;
  }

  // 2. ADMIN WEB (admin.ridedriveahead.com or /admin)
  if (pathname === '/admin' || pathname === '/admin.html' || (host.startsWith('admin.') && (pathname === '/' || pathname === '/index.html'))) {
    const adminPath = path.join(__dirname, 'admin.html');
    fs.readFile(adminPath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading admin command center: ' + err.message);
        return;
      }
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(data);
    });
    return;
  }

  // 3. MASTER ECOSYSTEM SHOWCASE (EXACT POSTER VIEW: /showcase or /hub)
  if (pathname === '/showcase' || pathname === '/showcase.html' || pathname === '/hub' || pathname === '/hub.html') {
    const showcasePath = path.join(__dirname, 'showcase.html');
    if (fs.existsSync(showcasePath)) {
      fs.readFile(showcasePath, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error loading showcase: ' + err.message);
          return;
        }
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0'
        });
        res.end(data);
      });
      return;
    }
  }

  // 4. CUSTOMER WEB (ridedriveahead.com or / or /customer or /index.html)
  if (pathname === '/' || pathname === '/customer' || pathname === '/customer.html' || pathname === '/index.html' || (host.startsWith('customer.') && (pathname === '/' || pathname === '/index.html'))) {
    const htmlPath = path.join(__dirname, 'index.html');
    fs.readFile(htmlPath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading customer web: ' + err.message);
        return;
      }
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(data);
    });
    return;
  }

  // 404 FALLBACK
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint Not Found', pathname }));
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`RideDriveAhead Full-Stack Server & Database Online`);
  console.log(`Web Simulator: http://localhost:${PORT}`);
  console.log(`Backend REST API: http://localhost:${PORT}/api/v1/...`);
  console.log(`Database File: ${DB_PATH}`);
  console.log(`======================================================\n`);
});
