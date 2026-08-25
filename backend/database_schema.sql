-- =========================================================
-- Search2Service - MySQL Database Schema & Initial Seed
-- Database: search2service
-- =========================================================

CREATE DATABASE IF NOT EXISTS `search2service` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `search2service`;

-- ---------------------------------------------------------
-- 1. Table: users
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `phone` VARCHAR(30) DEFAULT '',
    `role` ENUM('customer', 'provider', 'admin', 'super_admin', 'state_manager', 'district_manager') DEFAULT 'customer',
    `passwordHash` VARCHAR(255) NOT NULL,
    `verified` BOOLEAN DEFAULT FALSE,
    `avatar` VARCHAR(500) DEFAULT NULL,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_role` (`role`),
    INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 2. Table: categories
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL UNIQUE,
    `slug` VARCHAR(150) NOT NULL UNIQUE,
    `group` VARCHAR(100) NOT NULL,
    `icon` VARCHAR(100) DEFAULT 'Folder',
    `groupIcon` VARCHAR(100) DEFAULT 'Folder',
    `color` VARCHAR(100) DEFAULT 'from-blue-500 to-indigo-600',
    `description` TEXT DEFAULT NULL,
    `iconVersion` INT DEFAULT 2,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_categories_group` (`group`),
    INDEX `idx_categories_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 3. Table: providers
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `providers` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `ownerId` VARCHAR(36) DEFAULT NULL,
    `ownerName` VARCHAR(255) DEFAULT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `categorySlug` VARCHAR(150) DEFAULT NULL,
    `categoryName` VARCHAR(150) DEFAULT NULL,
    `categoryId` VARCHAR(36) DEFAULT NULL,
    `group` VARCHAR(100) DEFAULT NULL,
    `state` VARCHAR(100) DEFAULT NULL,
    `district` VARCHAR(100) DEFAULT NULL,
    `city` VARCHAR(100) DEFAULT NULL,
    `area` VARCHAR(150) DEFAULT NULL,
    `address` TEXT DEFAULT NULL,
    `phone` VARCHAR(30) DEFAULT NULL,
    `whatsapp` VARCHAR(30) DEFAULT NULL,
    `email` VARCHAR(255) DEFAULT NULL,
    `website` VARCHAR(255) DEFAULT NULL,
    `services` JSON DEFAULT NULL,
    `priceFrom` VARCHAR(50) DEFAULT NULL,
    `priceTo` VARCHAR(50) DEFAULT NULL,
    `fees` VARCHAR(50) DEFAULT NULL,
    `offers` JSON DEFAULT NULL,
    `upi` VARCHAR(100) DEFAULT NULL,
    `razorpayKeyId` VARCHAR(100) DEFAULT NULL,
    `paymentMethods` JSON DEFAULT NULL,
    `banner` VARCHAR(500) DEFAULT NULL,
    `images` JSON DEFAULT NULL,
    `timings` JSON DEFAULT NULL,
    `location` JSON DEFAULT NULL,
    `rating` DECIMAL(3, 2) DEFAULT 4.50,
    `reviewCount` INT DEFAULT 0,
    `verified` BOOLEAN DEFAULT FALSE,
    `premium` BOOLEAN DEFAULT FALSE,
    `featured` BOOLEAN DEFAULT FALSE,
    `specialization` VARCHAR(255) DEFAULT NULL,
    `qualification` VARCHAR(255) DEFAULT NULL,
    `experience` VARCHAR(50) DEFAULT NULL,
    `status` ENUM('active', 'pending', 'rejected', 'suspended') DEFAULT 'active',
    `views` INT DEFAULT 0,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_providers_city` (`city`),
    INDEX `idx_providers_category` (`categorySlug`),
    INDEX `idx_providers_owner` (`ownerId`),
    INDEX `idx_providers_status` (`status`),
    INDEX `idx_providers_rating` (`rating`),
    CONSTRAINT `fk_providers_user` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 4. Table: bookings
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bookings` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `userId` VARCHAR(36) DEFAULT NULL,
    `providerId` VARCHAR(36) NOT NULL,
    `customerName` VARCHAR(255) NOT NULL,
    `customerPhone` VARCHAR(30) NOT NULL,
    `customerEmail` VARCHAR(255) DEFAULT NULL,
    `serviceName` VARCHAR(255) NOT NULL,
    `bookingDate` VARCHAR(50) NOT NULL,
    `timeSlot` VARCHAR(50) NOT NULL,
    `status` ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    `amount` DECIMAL(10, 2) DEFAULT 0.00,
    `address` TEXT DEFAULT NULL,
    `city` VARCHAR(100) DEFAULT NULL,
    `notes` TEXT DEFAULT NULL,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_bookings_user` (`userId`),
    INDEX `idx_bookings_provider` (`providerId`),
    INDEX `idx_bookings_status` (`status`),
    CONSTRAINT `fk_bookings_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_bookings_provider` FOREIGN KEY (`providerId`) REFERENCES `providers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 5. Table: reviews
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reviews` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `userId` VARCHAR(36) DEFAULT NULL,
    `providerId` VARCHAR(36) NOT NULL,
    `authorName` VARCHAR(255) NOT NULL,
    `rating` INT NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
    `comment` TEXT NOT NULL,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_reviews_provider` (`providerId`),
    CONSTRAINT `fk_reviews_provider` FOREIGN KEY (`providerId`) REFERENCES `providers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 6. Table: jobs
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `jobs` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `company` VARCHAR(255) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `state` VARCHAR(100) NOT NULL,
    `salary` VARCHAR(100) NOT NULL,
    `experience` VARCHAR(100) NOT NULL,
    `type` VARCHAR(50) DEFAULT 'Full-time',
    `posted` VARCHAR(50) DEFAULT '1 day ago',
    `description` TEXT NOT NULL,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_jobs_city` (`city`),
    INDEX `idx_jobs_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 7. Table: chat_conversations
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `chat_conversations` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `userId` VARCHAR(36) DEFAULT NULL,
    `sessionId` VARCHAR(100) DEFAULT NULL,
    `title` VARCHAR(255) DEFAULT 'New Chat',
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_chat_user` (`userId`),
    INDEX `idx_chat_session` (`sessionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 8. Table: chat_messages
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `chat_messages` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `conversationId` VARCHAR(36) NOT NULL,
    `sender` ENUM('user', 'assistant', 'provider') NOT NULL,
    `text` LONGTEXT NOT NULL,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_messages_conversation` (`conversationId`),
    CONSTRAINT `fk_messages_conversation` FOREIGN KEY (`conversationId`) REFERENCES `chat_conversations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 9. Table: uploads (GridFS replacement in MySQL)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `uploads` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `filename` VARCHAR(255) NOT NULL,
    `contentType` VARCHAR(100) NOT NULL,
    `length` BIGINT NOT NULL DEFAULT 0,
    `metadata` JSON DEFAULT NULL,
    `fileData` LONGBLOB DEFAULT NULL,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 10. Table: advertisements
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `advertisements` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `subtitle` TEXT DEFAULT NULL,
    `imageUrl` VARCHAR(500) DEFAULT NULL,
    `targetUrl` VARCHAR(500) DEFAULT '/',
    `placement` ENUM('homepage_banner', 'search_top', 'search_sidebar', 'category_banner', 'popup_modal', 'footer_banner') DEFAULT 'homepage_banner',
    `badge` VARCHAR(100) DEFAULT 'Sponsored',
    `ctaText` VARCHAR(100) DEFAULT 'Explore Now',
    `advertiserName` VARCHAR(255) DEFAULT NULL,
    `advertiserPhone` VARCHAR(50) DEFAULT NULL,
    `gradient` VARCHAR(150) DEFAULT 'from-blue-600 via-indigo-600 to-orange-500',
    `startDate` VARCHAR(20) DEFAULT NULL,
    `endDate` VARCHAR(20) DEFAULT NULL,
    `status` ENUM('active', 'inactive', 'expired', 'draft') DEFAULT 'active',
    `priority` INT DEFAULT 1,
    `impressions` INT DEFAULT 0,
    `clicks` INT DEFAULT 0,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_ads_placement` (`placement`),
    INDEX `idx_ads_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- SEED DATA
-- =========================================================

-- 1. Default Super Admin (Email: admin@search2service.in, Password: admin123)
-- bcrypt hash for 'admin123'
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `role`, `passwordHash`, `verified`)
VALUES (
    'admin-root-0001',
    'Super Admin',
    'admin@search2service.in',
    '',
    'super_admin',
    '$2b$12$e6f3U7oVnI1sO4WwGv2kze6bJ1tW7YjN4d4Kx0F2E2Yx8f9L1QZqu',
    TRUE
)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 2. Core Categories Seed
INSERT INTO `categories` (`id`, `name`, `slug`, `group`, `icon`, `groupIcon`, `color`, `description`, `iconVersion`)
VALUES
('cat-doc-01', 'Doctor', 'doctor', 'Healthcare', 'Stethoscope', 'Stethoscope', 'from-rose-500 to-pink-600', 'Find top doctors and clinics near you', 2),
('cat-hosp-02', 'Hospital', 'hospital', 'Healthcare', 'Building2', 'Stethoscope', 'from-rose-500 to-pink-600', '24x7 Multi-speciality hospitals and emergency care', 2),
('cat-dent-03', 'Dentist', 'dentist', 'Healthcare', 'Smile', 'Stethoscope', 'from-rose-500 to-pink-600', 'Dental care, scaling, braces and implants', 2),
('cat-path-04', 'Pathology', 'pathology', 'Healthcare', 'FlaskConical', 'Stethoscope', 'from-rose-500 to-pink-600', 'Diagnostic tests, blood tests and lab services', 2),
('cat-elec-05', 'Electrician', 'electrician', 'Home Services', 'Zap', 'Wrench', 'from-amber-500 to-orange-600', 'Wiring, appliances, inverter and electrical repairs', 2),
('cat-plumb-06', 'Plumber', 'plumber', 'Home Services', 'Wrench', 'Wrench', 'from-amber-500 to-orange-600', 'Pipe leakage, tap fitting, bathroom sanitary repair', 2),
('cat-ac-07', 'AC Repair', 'ac-repair', 'Home Services', 'AirVent', 'Wrench', 'from-amber-500 to-orange-600', 'AC installation, gas filling and regular servicing', 2),
('cat-carp-08', 'Carpenter', 'carpenter', 'Home Services', 'Hammer', 'Wrench', 'from-amber-500 to-orange-600', 'Custom furniture, woodwork and home repairs', 2),
('cat-paint-09', 'Painter', 'painter', 'Home Services', 'Paintbrush', 'Wrench', 'from-amber-500 to-orange-600', 'Interior, exterior and wall texture painting', 2),
('cat-sal-10', 'Ladies Salon', 'ladies-salon', 'Beauty & Wellness', 'Sparkles', 'Sparkles', 'from-fuchsia-500 to-purple-600', 'Hair styling, bridal makeup, facial and spa', 2),
('cat-gen-11', 'Gents Parlour', 'gents-parlour', 'Beauty & Wellness', 'Scissors', 'Sparkles', 'from-fuchsia-500 to-purple-600', 'Hair cutting, grooming, shaving and massage', 2),
('cat-comp-12', 'Computer Repair', 'computer-repair', 'Repair Services', 'Cpu', 'Cpu', 'from-slate-600 to-slate-800', 'PC, laptop, windows installation & hardware fixes', 2),
('cat-mob-13', 'Mobile Repair', 'mobile-repair', 'Repair Services', 'Smartphone', 'Cpu', 'from-slate-600 to-slate-800', 'Screen replacement, battery and motherboards', 2),
('cat-cctv-14', 'CCTV Installation', 'cctv-installation', 'Repair Services', 'Video', 'Cpu', 'from-slate-600 to-slate-800', 'Security cameras, DVR setup and home surveillance', 2),
('cat-photo-15', 'Photographer', 'photographer', 'Events & Photography', 'Camera', 'Camera', 'from-indigo-500 to-blue-700', 'Wedding, events, pre-wedding and portfolio shoots', 2),
('cat-banq-16', 'Banquet Hall', 'banquet-hall', 'Events & Photography', 'Landmark', 'Camera', 'from-indigo-500 to-blue-700', 'Marriage halls, party venues and catering space', 2),
('cat-rest-17', 'Restaurant', 'restaurant', 'Food & Hospitality', 'Utensils', 'Utensils', 'from-red-500 to-orange-600', 'Family restaurants, fast food, cafe and dining', 2),
('cat-tour-18', 'Tours & Travels', 'tours-and-travels', 'Travel & Transport', 'Plane', 'Plane', 'from-sky-500 to-blue-600', 'Holiday packages, flight, train and hotel bookings', 2),
('cat-taxi-19', 'Taxi', 'taxi', 'Travel & Transport', 'Car', 'Plane', 'from-sky-500 to-blue-600', 'Local cab, outstation rides and airport taxi', 2),
('cat-csc-20', 'CSC Center', 'csc-center', 'Government Services', 'Landmark', 'Landmark', 'from-orange-500 to-red-600', 'Aadhaar, PAN Card, certificates and online forms', 2)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 3. Core Advertisements Seed
INSERT INTO `advertisements` (`id`, `title`, `subtitle`, `imageUrl`, `targetUrl`, `placement`, `badge`, `ctaText`, `advertiserName`, `advertiserPhone`, `gradient`, `status`, `priority`, `impressions`, `clicks`)
VALUES
('ad-ac-01', '⚡ 50% Off Summer AC & Appliance Repair', 'Certified technicians at your doorstep within 60 minutes across all major Indian cities.', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80', '/search?category=ac-repair', 'homepage_banner', '🔥 Summer Super Saver', 'Book AC Service', 'Urban Cool Tech', '+91 98765 11223', 'from-amber-600 via-orange-600 to-red-700', 'active', 1, 1420, 184),
('ad-doc-02', '🩺 Free First Consultation & 20% Off Diagnostics', 'Consult top specialist doctors & NABL accredited labs near you with verified patient ratings.', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80', '/search?group=Healthcare', 'search_top', '✨ Sponsored Healthcare', 'Find Specialists', 'MediCare Plus Clinics', '+91 98765 22334', 'from-blue-600 via-indigo-600 to-cyan-700', 'active', 1, 2850, 312),
('ad-job-03', '💼 Urgent Hiring: 500+ Local Service Technicians & Staff', 'Direct placement with salary up to ₹35,000/month. Verified employers with zero recruitment fees.', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', '/search?group=Job+%26+Career', 'search_sidebar', '💼 Career Spotlight', 'Apply Online', 'FastHire Services India', '+91 98765 33445', 'from-indigo-600 via-purple-600 to-slate-800', 'active', 1, 1980, 165)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

