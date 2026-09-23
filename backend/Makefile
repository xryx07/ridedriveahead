.PHONY: all build infra run-gateway run-auth run-booking run-driver test clean

all: build

infra:
	docker-compose up -d postgres redis

infra-down:
	docker-compose down

build:
	mvn clean install -DskipTests

test:
	mvn test

run-gateway:
	cd api-gateway && mvn spring-boot:run

run-auth:
	cd auth-service && mvn spring-boot:run

run-booking:
	cd booking-service && mvn spring-boot:run

run-driver:
	cd driver-service && mvn spring-boot:run

clean:
	mvn clean
