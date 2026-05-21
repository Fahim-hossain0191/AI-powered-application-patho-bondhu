-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 19, 2026 at 05:19 AM
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
-- Database: `pathobondhu`
--

-- --------------------------------------------------------

--
-- Table structure for table `answer_submissions`
--

CREATE TABLE `answer_submissions` (
  `submission_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `chapter_id` int(11) DEFAULT NULL,
  `question_type` varchar(50) NOT NULL,
  `question_ref_id` int(11) DEFAULT NULL,
  `input_type` varchar(20) NOT NULL,
  `input_text` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `ocr_extracted_text` text DEFAULT NULL,
  `is_correct` tinyint(1) DEFAULT NULL,
  `error_line` int(11) DEFAULT NULL,
  `error_type` varchar(100) DEFAULT NULL,
  `error_details` text DEFAULT NULL,
  `feedback_text` text DEFAULT NULL,
  `hints_used` int(11) DEFAULT 0,
  `points_earned` int(11) DEFAULT 0,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `boards`
--

CREATE TABLE `boards` (
  `board_id` int(11) NOT NULL,
  `board_name` varchar(100) NOT NULL,
  `board_name_bn` varchar(100) NOT NULL,
  `board_code` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `boards`
--

INSERT INTO `boards` (`board_id`, `board_name`, `board_name_bn`, `board_code`) VALUES
(1, 'Dhaka', 'ঢাকা', 'dhk'),
(2, 'Chattogram', 'চট্টগ্রাম', 'ctg'),
(3, 'Rajshahi', 'রাজশাহী', 'raj'),
(4, 'Jessore', 'যশোর', 'jes'),
(5, 'Comilla', 'কুমিল্লা', 'com'),
(6, 'Sylhet', 'সিলেট', 'syl'),
(7, 'Barishal', 'বরিশাল', 'bar'),
(8, 'Dinajpur', 'দিনাজপুর', 'din'),
(9, 'Mymensingh', 'ময়মনসিংহ', 'mym');

-- --------------------------------------------------------

--
-- Table structure for table `chapters`
--

CREATE TABLE `chapters` (
  `chapter_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `chapter_name` varchar(300) NOT NULL,
  `chapter_name_en` varchar(300) DEFAULT NULL,
  `chapter_number` int(11) DEFAULT NULL,
  `chapter_type` varchar(50) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `total_exercise_count` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chapter_progress`
--

CREATE TABLE `chapter_progress` (
  `progress_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `exercises_total` int(11) DEFAULT 0,
  `exercises_solved` int(11) DEFAULT 0,
  `mcq_accuracy` decimal(5,2) DEFAULT 0.00,
  `mcq_sessions_count` int(11) DEFAULT 0,
  `srijonshil_completed` int(11) DEFAULT 0,
  `writing_completed` int(11) DEFAULT 0,
  `total_points` int(11) DEFAULT 0,
  `last_activity` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `file_uploads`
--

CREATE TABLE `file_uploads` (
  `file_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `submission_id` int(11) DEFAULT NULL,
  `file_type` varchar(20) NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `file_size_kb` int(11) DEFAULT NULL,
  `purpose` varchar(50) DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `generated_questions_log`
--

CREATE TABLE `generated_questions_log` (
  `log_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `chapter_id` int(11) DEFAULT NULL,
  `question_type` varchar(50) NOT NULL,
  `generation_count` int(11) DEFAULT NULL,
  `questions_json` text DEFAULT NULL,
  `generated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hint_usage`
--

CREATE TABLE `hint_usage` (
  `hint_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `chapter_id` int(11) DEFAULT NULL,
  `question_ref_table` varchar(50) DEFAULT NULL,
  `question_ref_id` int(11) DEFAULT NULL,
  `phase_reached` int(11) NOT NULL,
  `hint_content` text DEFAULT NULL,
  `question_pattern` varchar(50) DEFAULT NULL,
  `requested_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `math_concepts`
--

CREATE TABLE `math_concepts` (
  `concept_id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `module_title` varchar(300) NOT NULL,
  `content` text NOT NULL,
  `examples` text DEFAULT NULL,
  `importance_rank` int(11) DEFAULT 0,
  `source` varchar(100) DEFAULT 'nctb_board_book',
  `display_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `math_exercises`
--

CREATE TABLE `math_exercises` (
  `exercise_id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `question_image_url` varchar(500) DEFAULT NULL,
  `question_pattern` varchar(50) DEFAULT NULL,
  `board_mentions` text DEFAULT NULL,
  `mention_count` int(11) DEFAULT 0,
  `frequency_module` varchar(30) NOT NULL,
  `solution_steps` text DEFAULT NULL,
  `formulas_used` text DEFAULT NULL,
  `source` varchar(100) DEFAULT 'nctb_board_book',
  `exercise_number` varchar(20) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `math_formulas`
--

CREATE TABLE `math_formulas` (
  `formula_id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `formula_text` varchar(500) NOT NULL,
  `formula_latex` varchar(500) DEFAULT NULL,
  `when_to_use` varchar(500) DEFAULT NULL,
  `variables_explanation` text DEFAULT NULL,
  `importance_rank` int(11) DEFAULT 0,
  `source` varchar(100) DEFAULT 'nctb_board_book',
  `display_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `math_mcq_board`
--

CREATE TABLE `math_mcq_board` (
  `mcq_id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `question_image_url` varchar(500) DEFAULT NULL,
  `option_a` varchar(500) NOT NULL,
  `option_b` varchar(500) NOT NULL,
  `option_c` varchar(500) NOT NULL,
  `option_d` varchar(500) NOT NULL,
  `correct_option` char(1) NOT NULL,
  `explanation_steps` text DEFAULT NULL,
  `formula_used` varchar(500) DEFAULT NULL,
  `board_id` int(11) DEFAULT NULL,
  `exam_year` int(11) DEFAULT NULL,
  `source` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `math_mcq_practice`
--

CREATE TABLE `math_mcq_practice` (
  `mcq_id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `question_image_url` varchar(500) DEFAULT NULL,
  `option_a` varchar(500) NOT NULL,
  `option_b` varchar(500) NOT NULL,
  `option_c` varchar(500) NOT NULL,
  `option_d` varchar(500) NOT NULL,
  `correct_option` char(1) NOT NULL,
  `explanation_steps` text DEFAULT NULL,
  `formula_used` varchar(500) DEFAULT NULL,
  `source` varchar(100) DEFAULT NULL,
  `is_generated` tinyint(1) DEFAULT 0,
  `generated_for_user_id` int(11) DEFAULT NULL,
  `set_number` int(11) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `math_short_questions`
--

CREATE TABLE `math_short_questions` (
  `short_q_id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `solution` text NOT NULL,
  `source` varchar(100) DEFAULT NULL,
  `is_generated` tinyint(1) DEFAULT 0,
  `generated_for_user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `math_srijonshil`
--

CREATE TABLE `math_srijonshil` (
  `srijonshil_id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `category` varchar(20) NOT NULL,
  `question_text` text NOT NULL,
  `question_image_url` varchar(500) DEFAULT NULL,
  `uddipok_text` text DEFAULT NULL,
  `solution` text NOT NULL,
  `solution_image_url` varchar(500) DEFAULT NULL,
  `board_id` int(11) DEFAULT NULL,
  `exam_year` int(11) DEFAULT NULL,
  `source_name` varchar(200) DEFAULT NULL,
  `source_type` varchar(30) DEFAULT NULL,
  `star_rating` int(11) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mcq_answers`
--

CREATE TABLE `mcq_answers` (
  `answer_id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `mcq_ref_table` varchar(50) NOT NULL,
  `mcq_ref_id` int(11) NOT NULL,
  `selected_option` varchar(10) DEFAULT NULL,
  `is_correct` tinyint(1) DEFAULT NULL,
  `answered_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mcq_sessions`
--

CREATE TABLE `mcq_sessions` (
  `session_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `chapter_id` int(11) DEFAULT NULL,
  `session_type` varchar(30) NOT NULL,
  `source_detail` varchar(100) DEFAULT NULL,
  `total_questions` int(11) DEFAULT 20,
  `answered` int(11) DEFAULT 0,
  `correct_count` int(11) DEFAULT 0,
  `wrong_count` int(11) DEFAULT 0,
  `accuracy` decimal(5,2) DEFAULT 0.00,
  `total_points` int(11) DEFAULT 0,
  `feedback` text DEFAULT NULL,
  `is_complete` tinyint(1) DEFAULT 0,
  `started_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `completed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(500) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`id`, `user_id`, `token`, `created_at`) VALUES
(1, 4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJmYWhpbWhvc3NhaW4wMTkxQGdtYWlsLmNvbSIsImlhdCI6MTc3OTE2MDUxMywiZXhwIjoxNzc5NzY1MzEzfQ.jianX7XDEKgcPFavQrt3HlmJ2BHYopMHwjj7M2Jxpbc', '2026-05-19 03:15:13');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `subject_id` int(11) NOT NULL,
  `subject_name` varchar(100) NOT NULL,
  `subject_code` varchar(30) NOT NULL,
  `display_name` varchar(200) NOT NULL,
  `icon_url` varchar(500) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`subject_id`, `subject_name`, `subject_code`, `display_name`, `icon_url`, `display_order`) VALUES
(1, 'Mathematics', 'math', 'গণিত', NULL, 1),
(2, 'Bangla 1st Paper', 'bn_1st', 'বাংলা ১ম পত্র', NULL, 2),
(3, 'Bangla 2nd Paper', 'bn_2nd', 'বাংলা ২য় পত্র', NULL, 3),
(4, 'English 1st Paper', 'eng_1st', 'English 1st Paper', NULL, 4),
(5, 'English 2nd Paper', 'eng_2nd', 'English 2nd Paper', NULL, 5);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `full_name` varchar(200) NOT NULL,
  `email` varchar(200) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `class` varchar(10) DEFAULT '9-10',
  `school_name` varchar(300) DEFAULT NULL,
  `board_name` varchar(100) DEFAULT NULL,
  `profile_image_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `email`, `phone`, `password_hash`, `class`, `school_name`, `board_name`, `profile_image_url`, `created_at`, `updated_at`, `is_active`) VALUES
(1, 'Md mainul hossains fahim chowdhury', 'fahimhossain9121@gmail.com', '01911331159', '$2b$12$CAfoIADZ3rBJER9eEeO34.1nHuKG7fWwgRn420CEJMNqPR3RXz7KW', '9-10', 'Nab', 'Dhaka', 'https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png', '2026-05-18 18:02:57', '2026-05-18 18:02:57', 1),
(3, 'Md mainul hossains fahim chowdhury', 'fahimhossain0121@gmail.com', '01911331155', '$2b$12$n.EDUmzeqjavvHFPVm.EZe0Vbn2KvtrOacIYFjTGmYOXjhdsk2V32', '9-10', 'Nab', 'Dhaka', 'https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png', '2026-05-18 18:03:35', '2026-05-18 18:03:35', 1),
(4, 'Fahim Hossain', 'fahimhossain0191@gmail.com', '01911331151', '$2b$12$AzJVPsxpKqYUcao7zopQuuNue.ygFJQYT1SMt/9h1qYwcN/bGSKDG', '9-10', 'Nab', 'Dhaka', 'https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png', '2026-05-18 18:07:20', '2026-05-18 18:07:20', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_devices`
--

CREATE TABLE `user_devices` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `device_token` varchar(255) NOT NULL,
  `device_type` varchar(50) DEFAULT NULL,
  `browser` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_seen` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_devices`
--

INSERT INTO `user_devices` (`id`, `user_id`, `device_token`, `device_type`, `browser`, `created_at`, `last_seen`) VALUES
(1, 4, 'ee614ecd-84e5-4a02-8b92-506144d39df6', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-05-18 18:22:27', '2026-05-18 18:22:27'),
(2, 4, 'a0e754fb-fec1-49c2-b668-49b3c5464abc', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.120.0 Chrome/142.0.7444.265 Electron/39.8.8 Safari/537.36', '2026-05-18 18:23:11', '2026-05-18 18:23:11'),
(3, 4, '6fd6251d-2d99-44ed-8d3d-8a0ac4d5c4c8', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0', '2026-05-18 18:26:27', '2026-05-18 18:26:27'),
(4, 4, '0482cb5f-f15e-479f-a903-82ea0c067428', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0', '2026-05-19 03:12:00', '2026-05-19 03:12:00'),
(5, 4, 'd76dd92d-4daa-4945-ae30-01c7c1130bb5', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0', '2026-05-19 03:13:46', '2026-05-19 03:13:46'),
(6, 4, '48879c31-952a-4136-8adc-705b826bbcc7', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0', '2026-05-19 03:15:13', '2026-05-19 03:15:13');

-- --------------------------------------------------------

--
-- Table structure for table `user_points`
--

CREATE TABLE `user_points` (
  `point_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subject_id` int(11) DEFAULT NULL,
  `chapter_id` int(11) DEFAULT NULL,
  `action_type` varchar(50) NOT NULL,
  `points` int(11) NOT NULL,
  `description` varchar(300) DEFAULT NULL,
  `earned_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `answer_submissions`
--
ALTER TABLE `answer_submissions`
  ADD PRIMARY KEY (`submission_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `subject_id` (`subject_id`),
  ADD KEY `chapter_id` (`chapter_id`);

--
-- Indexes for table `boards`
--
ALTER TABLE `boards`
  ADD PRIMARY KEY (`board_id`),
  ADD UNIQUE KEY `board_code` (`board_code`);

--
-- Indexes for table `chapters`
--
ALTER TABLE `chapters`
  ADD PRIMARY KEY (`chapter_id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indexes for table `chapter_progress`
--
ALTER TABLE `chapter_progress`
  ADD PRIMARY KEY (`progress_id`),
  ADD UNIQUE KEY `unique_user_chapter` (`user_id`,`subject_id`,`chapter_id`),
  ADD KEY `subject_id` (`subject_id`),
  ADD KEY `chapter_id` (`chapter_id`);

--
-- Indexes for table `file_uploads`
--
ALTER TABLE `file_uploads`
  ADD PRIMARY KEY (`file_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `submission_id` (`submission_id`);

--
-- Indexes for table `generated_questions_log`
--
ALTER TABLE `generated_questions_log`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `hint_usage`
--
ALTER TABLE `hint_usage`
  ADD PRIMARY KEY (`hint_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `math_concepts`
--
ALTER TABLE `math_concepts`
  ADD PRIMARY KEY (`concept_id`),
  ADD KEY `chapter_id` (`chapter_id`);

--
-- Indexes for table `math_exercises`
--
ALTER TABLE `math_exercises`
  ADD PRIMARY KEY (`exercise_id`),
  ADD KEY `chapter_id` (`chapter_id`);

--
-- Indexes for table `math_formulas`
--
ALTER TABLE `math_formulas`
  ADD PRIMARY KEY (`formula_id`),
  ADD KEY `chapter_id` (`chapter_id`);

--
-- Indexes for table `math_mcq_board`
--
ALTER TABLE `math_mcq_board`
  ADD PRIMARY KEY (`mcq_id`),
  ADD KEY `chapter_id` (`chapter_id`),
  ADD KEY `board_id` (`board_id`);

--
-- Indexes for table `math_mcq_practice`
--
ALTER TABLE `math_mcq_practice`
  ADD PRIMARY KEY (`mcq_id`),
  ADD KEY `chapter_id` (`chapter_id`);

--
-- Indexes for table `math_short_questions`
--
ALTER TABLE `math_short_questions`
  ADD PRIMARY KEY (`short_q_id`),
  ADD KEY `chapter_id` (`chapter_id`);

--
-- Indexes for table `math_srijonshil`
--
ALTER TABLE `math_srijonshil`
  ADD PRIMARY KEY (`srijonshil_id`),
  ADD KEY `chapter_id` (`chapter_id`),
  ADD KEY `board_id` (`board_id`);

--
-- Indexes for table `mcq_answers`
--
ALTER TABLE `mcq_answers`
  ADD PRIMARY KEY (`answer_id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indexes for table `mcq_sessions`
--
ALTER TABLE `mcq_sessions`
  ADD PRIMARY KEY (`session_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `subject_id` (`subject_id`),
  ADD KEY `chapter_id` (`chapter_id`);

--
-- Indexes for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`subject_id`),
  ADD UNIQUE KEY `subject_code` (`subject_code`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `user_devices`
--
ALTER TABLE `user_devices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `device_token` (`device_token`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user_points`
--
ALTER TABLE `user_points`
  ADD PRIMARY KEY (`point_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `answer_submissions`
--
ALTER TABLE `answer_submissions`
  MODIFY `submission_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `boards`
--
ALTER TABLE `boards`
  MODIFY `board_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `chapters`
--
ALTER TABLE `chapters`
  MODIFY `chapter_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chapter_progress`
--
ALTER TABLE `chapter_progress`
  MODIFY `progress_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `file_uploads`
--
ALTER TABLE `file_uploads`
  MODIFY `file_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `generated_questions_log`
--
ALTER TABLE `generated_questions_log`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hint_usage`
--
ALTER TABLE `hint_usage`
  MODIFY `hint_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `math_concepts`
--
ALTER TABLE `math_concepts`
  MODIFY `concept_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `math_exercises`
--
ALTER TABLE `math_exercises`
  MODIFY `exercise_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `math_formulas`
--
ALTER TABLE `math_formulas`
  MODIFY `formula_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `math_mcq_board`
--
ALTER TABLE `math_mcq_board`
  MODIFY `mcq_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `math_mcq_practice`
--
ALTER TABLE `math_mcq_practice`
  MODIFY `mcq_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `math_short_questions`
--
ALTER TABLE `math_short_questions`
  MODIFY `short_q_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `math_srijonshil`
--
ALTER TABLE `math_srijonshil`
  MODIFY `srijonshil_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `mcq_answers`
--
ALTER TABLE `mcq_answers`
  MODIFY `answer_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mcq_sessions`
--
ALTER TABLE `mcq_sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_devices`
--
ALTER TABLE `user_devices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_points`
--
ALTER TABLE `user_points`
  MODIFY `point_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `answer_submissions`
--
ALTER TABLE `answer_submissions`
  ADD CONSTRAINT `answer_submissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `answer_submissions_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`),
  ADD CONSTRAINT `answer_submissions_ibfk_3` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`chapter_id`);

--
-- Constraints for table `chapters`
--
ALTER TABLE `chapters`
  ADD CONSTRAINT `chapters_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`);

--
-- Constraints for table `chapter_progress`
--
ALTER TABLE `chapter_progress`
  ADD CONSTRAINT `chapter_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `chapter_progress_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`),
  ADD CONSTRAINT `chapter_progress_ibfk_3` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`chapter_id`);

--
-- Constraints for table `file_uploads`
--
ALTER TABLE `file_uploads`
  ADD CONSTRAINT `file_uploads_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `file_uploads_ibfk_2` FOREIGN KEY (`submission_id`) REFERENCES `answer_submissions` (`submission_id`);

--
-- Constraints for table `generated_questions_log`
--
ALTER TABLE `generated_questions_log`
  ADD CONSTRAINT `generated_questions_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `hint_usage`
--
ALTER TABLE `hint_usage`
  ADD CONSTRAINT `hint_usage_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `math_concepts`
--
ALTER TABLE `math_concepts`
  ADD CONSTRAINT `math_concepts_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`chapter_id`);

--
-- Constraints for table `math_exercises`
--
ALTER TABLE `math_exercises`
  ADD CONSTRAINT `math_exercises_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`chapter_id`);

--
-- Constraints for table `math_formulas`
--
ALTER TABLE `math_formulas`
  ADD CONSTRAINT `math_formulas_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`chapter_id`);

--
-- Constraints for table `math_mcq_board`
--
ALTER TABLE `math_mcq_board`
  ADD CONSTRAINT `math_mcq_board_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`chapter_id`),
  ADD CONSTRAINT `math_mcq_board_ibfk_2` FOREIGN KEY (`board_id`) REFERENCES `boards` (`board_id`);

--
-- Constraints for table `math_mcq_practice`
--
ALTER TABLE `math_mcq_practice`
  ADD CONSTRAINT `math_mcq_practice_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`chapter_id`);

--
-- Constraints for table `math_short_questions`
--
ALTER TABLE `math_short_questions`
  ADD CONSTRAINT `math_short_questions_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`chapter_id`);

--
-- Constraints for table `math_srijonshil`
--
ALTER TABLE `math_srijonshil`
  ADD CONSTRAINT `math_srijonshil_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`chapter_id`),
  ADD CONSTRAINT `math_srijonshil_ibfk_2` FOREIGN KEY (`board_id`) REFERENCES `boards` (`board_id`);

--
-- Constraints for table `mcq_answers`
--
ALTER TABLE `mcq_answers`
  ADD CONSTRAINT `mcq_answers_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `mcq_sessions` (`session_id`);

--
-- Constraints for table `mcq_sessions`
--
ALTER TABLE `mcq_sessions`
  ADD CONSTRAINT `mcq_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `mcq_sessions_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`),
  ADD CONSTRAINT `mcq_sessions_ibfk_3` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`chapter_id`);

--
-- Constraints for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `user_devices`
--
ALTER TABLE `user_devices`
  ADD CONSTRAINT `user_devices_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `user_points`
--
ALTER TABLE `user_points`
  ADD CONSTRAINT `user_points_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
