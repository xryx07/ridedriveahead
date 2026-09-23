const http = require('http');
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

  // 2. DATABASE INSPECT
  if (pathname === '/api/v1/db/inspect' && method === 'GET') {
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

  // 3. AUTH: REQUEST OTP
  if (pathname === '/api/v1/auth/otp/request' && method === 'POST') {
    const body = await parseJsonBody(req);
    const phone = body.phoneNumber || '+919876543210';
    return sendJson(res, 200, {
      success: true,
      message: `OTP 123456 sent to ${phone}`,
      data: { otp: '123456', expiresInSeconds: 300 }
    }, method, pathname);
  }

  // 4. AUTH: VERIFY OTP / LOGIN / SIGNUP
  if (pathname === '/api/v1/auth/otp/verify' && method === 'POST') {
    const body = await parseJsonBody(req);
    const phone = body.phoneNumber ? body.phoneNumber.trim() : '+919876543210';
    const fullName = body.fullName ? body.fullName.trim() : '';
    const role = body.userRole || 'RIDER';
    const email = body.email || '';
    const city = body.city || 'Delhi NCR';

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
          licenseNumber: body.licenseNumber || 'DL-042026001234',
          role: body.preference || 'ALL_ROUNDER',
          transmissionSkills: body.skills || ['MANUAL', 'AUTOMATIC'],
          vehicleModel: 'Customer Car Chauffeur',
          vehiclePlate: 'N/A',
          vehicleType: 'SEDAN',
          isOnline: true,
          rating: 5.0,
          totalTrips: 0,
          kycStatus: 'APPROVED',
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
          rating: 5.0,
          registeredCars: [
            { model: 'Honda City (2022)', transmission: 'AUTOMATIC', plate: 'DL 01 AB 9988' }
          ],
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
      riderName: body.riderName || 'Arjun Verma',
      driverName: 'Rajesh Kumar',
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

  // ========================================================
  // SERVE SIMULATOR HTML FILE
  // ========================================================
  if (pathname === '/' || pathname === '/index.html') {
    const htmlPath = path.join(__dirname, 'index.html');
    fs.readFile(htmlPath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading preview: ' + err.message);
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
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
