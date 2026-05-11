-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 04, 2026 at 01:27 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `patthobondu`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `class_level` tinyint(4) NOT NULL CHECK (`class_level` between 6 and 10),
  `gender` enum('male','female','other') DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `total_points` int(11) DEFAULT 0,
  `streak_days` int(11) DEFAULT 0,
  `is_verified` tinyint(1) DEFAULT 0,
  `last_active` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_class_update` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

CREATE TABLE refresh_tokens (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL UNIQUE,
  token      TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_devices (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  device_token  VARCHAR(255) NOT NULL,  -- Browser এ store হওয়া unique token
  device_type   ENUM('mobile','tablet','desktop') NOT NULL,
  browser       VARCHAR(100),           -- "Chrome", "Firefox"
  last_seen     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  first_seen    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_device (user_id, device_token),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE hobbies (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,   -- "ক্রিকেট"
  category   ENUM(
               'sports',      -- খেলাধুলা
               'creative',    -- সৃজনশীল
               'academic',    -- পড়াশোনা সংক্রান্ত
               'technology'   -- প্রযুক্তি
             ) NOT NULL,
  icon       VARCHAR(50)              -- emoji বা icon name
);

-- Default Data:
INSERT INTO hobbies (name, category, icon) VALUES
-- খেলাধুলা
('ক্রিকেট',       'sports',     '🏏'),
('ফুটবল',         'sports',     '⚽'),
('ব্যাডমিন্টন',   'sports',     '🏸'),
('সাঁতার',        'sports',     '🏊'),
('দাবা',          'sports',     '♟️'),

-- সৃজনশীল
('ছবি আঁকা',      'creative',   '🎨'),
('গান গাওয়া',    'creative',   '🎵'),
('গিটার বাজানো', 'creative',   '🎸'),
('অভিনয়',        'creative',   '🎭'),
('ফটোগ্রাফি',    'creative',   '📷'),

-- পড়াশোনা সংক্রান্ত
('বই পড়া',       'academic',   '📚'),
('গল্প লেখা',    'academic',   '✍️'),
('কবিতা লেখা',   'academic',   '📝'),
('বিজ্ঞান চর্চা','academic',   '🔬'),

-- প্রযুক্তি
('গেমিং',         'technology', '🎮'),
('কোডিং',         'technology', '💻'),
('ইউটিউব দেখা',  'technology', '📺');

CREATE TABLE user_hobbies (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  hobby_id   INT NOT NULL,
  UNIQUE KEY unique_user_hobby (user_id, hobby_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (hobby_id) REFERENCES hobbies(id)
);

-- উদাহরণ: রাফি ক্রিকেট আর কোডিং বেছেছে
-- INSERT INTO user_hobbies VALUES (NULL, 1, 1), (NULL, 1, 15);

CREATE TABLE user_favourite_subjects (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  subject_id  INT NOT NULL,
  UNIQUE KEY unique_user_subject (user_id, subject_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- উদাহরণ: রাফির favourite গণিত আর English
-- INSERT INTO user_favourite_subjects VALUES (NULL, 1, 1), (NULL, 1, 3);