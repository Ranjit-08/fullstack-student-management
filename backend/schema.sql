-- Run this manually in MySQL Workbench or AWS RDS Query Editor
-- if you want to pre-create the schema before first deploy

CREATE DATABASE IF NOT EXISTS studentdb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE studentdb;

CREATE TABLE IF NOT EXISTS students (
  id         INT           AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(150)  NOT NULL UNIQUE,
  phone      VARCHAR(15)   NOT NULL,
  batch      ENUM('07:30','09:00','10:30') NOT NULL,
  created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: view all registrations by batch
SELECT batch, COUNT(*) AS total FROM students GROUP BY batch;