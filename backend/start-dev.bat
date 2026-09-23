@echo off
echo ========================================================
echo   RideDriveAhead Microservices Local Launcher (Windows)
echo ========================================================

echo [1/3] Starting PostgreSQL and Redis containers...
docker-compose up -d postgres redis

echo [2/3] Building backend multi-module workspace...
call mvn clean package -DskipTests

echo [3/3] Launching Core Services...
start "RideDriveAhead - API Gateway (8080)" cmd /k "cd api-gateway && mvn spring-boot:run"
start "RideDriveAhead - Auth Service (8081)" cmd /k "cd auth-service && mvn spring-boot:run"
start "RideDriveAhead - Booking Service (8082)" cmd /k "cd booking-service && mvn spring-boot:run"
start "RideDriveAhead - Driver Service (8083)" cmd /k "cd driver-service && mvn spring-boot:run"

echo All services launched!
echo API Gateway: http://localhost:8080
echo Swagger UI: http://localhost:8081/swagger-ui.html
pause
