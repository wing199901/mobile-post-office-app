-- ========================================
-- Mobile Post Office Database Schema
-- MySQL 8.0+
-- ========================================
-- This script is idempotent - safe to run multiple times
--
-- Usage:
--   mysql -u root -p mobile_post_office < schema.sql
-- ========================================

-- Create table if not exists
CREATE TABLE IF NOT EXISTS mobile_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mobileCode VARCHAR(20),
  seq INT,
  nameEN VARCHAR(255),
  nameTC VARCHAR(255),
  nameSC VARCHAR(255),
  districtEN VARCHAR(100),
  districtTC VARCHAR(100),
  districtSC VARCHAR(100),
  locationEN VARCHAR(255),
  locationTC VARCHAR(255),
  locationSC VARCHAR(255),
  addressEN TEXT,
  addressTC TEXT,
  addressSC TEXT,
  openHour CHAR(5),
  closeHour CHAR(5),
  dayOfWeekCode TINYINT,
  latitude DECIMAL(10,6),
  longitude DECIMAL(10,6),
  imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_district_en (districtEN),
  INDEX idx_district_tc (districtTC),
  INDEX idx_district_sc (districtSC),
  INDEX idx_dayofweek (dayOfWeekCode),
  INDEX idx_seq (seq),
  INDEX idx_coords (latitude, longitude),
  INDEX idx_mobile_code (mobileCode),
  
  -- Unique constraint to prevent duplicate records
  UNIQUE INDEX uniq_site (mobileCode, seq, dayOfWeekCode)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Mobile Post Office locations and schedules';

