-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 09, 2026 at 06:50 PM
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
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `class_level` tinyint(4) NOT NULL,
  `title` varchar(200) NOT NULL,
  `publisher` varchar(100) DEFAULT 'NCTB',
  `edition_year` int(11) DEFAULT 2024,
  `cover_image_url` varchar(500) DEFAULT NULL,
  `cover_color` varchar(10) DEFAULT NULL,
  `total_chapters` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `subject_id`, `class_level`, `title`, `publisher`, `edition_year`, `cover_image_url`, `cover_color`, `total_chapters`, `is_active`) VALUES
(1, 1, 6, 'গণিত — ষষ্ঠ শ্রেণি', 'NCTB', 2024, NULL, '#10B981', 12, 1),
(2, 1, 7, 'গণিত — সপ্তম শ্রেণি', 'NCTB', 2024, NULL, '#10B981', 12, 1),
(3, 1, 8, 'গণিত — অষ্টম শ্রেণি', 'NCTB', 2024, NULL, '#10B981', 12, 1),
(4, 1, 9, 'গণিত — নবম শ্রেণি', 'NCTB', 2024, NULL, '#10B981', 14, 1),
(5, 1, 10, 'গণিত — দশম শ্রেণি', 'NCTB', 2024, NULL, '#10B981', 14, 1),
(6, 2, 6, 'বাংলা — ষষ্ঠ শ্রেণি', 'NCTB', 2024, NULL, '#FF9800', 5, 1),
(7, 2, 7, 'বাংলা — সপ্তম শ্রেণি', 'NCTB', 2024, NULL, '#FF9800', 5, 1),
(8, 2, 8, 'বাংলা — অষ্টম শ্রেণি', 'NCTB', 2024, NULL, '#FF9800', 5, 1),
(9, 2, 9, 'বাংলা — নবম শ্রেণি', 'NCTB', 2024, NULL, '#FF9800', 5, 1),
(10, 2, 10, 'বাংলা — দশম শ্রেণি', 'NCTB', 2024, NULL, '#FF9800', 5, 1),
(11, 3, 6, 'English For Today — Class 6', 'NCTB', 2024, NULL, '#2196F3', 8, 1),
(12, 3, 7, 'English For Today — Class 7', 'NCTB', 2024, NULL, '#2196F3', 8, 1),
(13, 3, 8, 'English For Today — Class 8', 'NCTB', 2024, NULL, '#2196F3', 8, 1),
(14, 3, 9, 'English For Today — Class 9', 'NCTB', 2024, NULL, '#2196F3', 8, 1),
(15, 3, 10, 'English For Today — Class 10', 'NCTB', 2024, NULL, '#2196F3', 8, 1);

-- --------------------------------------------------------

--
-- Table structure for table `chapters`
--

CREATE TABLE `chapters` (
  `id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `class_level` tinyint(4) NOT NULL,
  `title` varchar(200) NOT NULL,
  `chapter_number` int(11) NOT NULL,
  `is_board_chapter` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chapters`
--

INSERT INTO `chapters` (`id`, `book_id`, `subject_id`, `class_level`, `title`, `chapter_number`, `is_board_chapter`) VALUES
(1, 3, 1, 8, 'মুনাফা', 1, 1),
(2, 3, 1, 8, 'সেট', 2, 1),
(3, 3, 1, 8, 'পরিমাপ', 3, 0),
(4, 3, 1, 8, 'বীজগাণিতিক সূত্রাবলি', 4, 1),
(5, 3, 1, 8, 'বীজগাণিতিক ভগ্নাংশ', 5, 1),
(6, 3, 1, 8, 'সরল সমীকরণ', 6, 1),
(7, 3, 1, 8, 'অসমতা', 7, 0),
(8, 3, 1, 8, 'সমানুপাত', 8, 0),
(9, 3, 1, 8, 'তথ্য ও উপাত্ত', 9, 1),
(10, 3, 1, 8, 'পিথাগোরাসের উপপাদ্য', 10, 1),
(11, 3, 1, 8, 'সম্পাদ্য', 11, 0),
(12, 3, 1, 8, 'জ্যামিতিক প্রমাণ', 12, 1),
(13, 8, 2, 8, 'গদ্য', 1, 1),
(14, 8, 2, 8, 'কবিতা', 2, 1),
(15, 8, 2, 8, 'সহায়ক পাঠ', 3, 0),
(16, 8, 2, 8, 'বাংলা ভাষার ব্যাকরণ', 4, 1),
(17, 8, 2, 8, 'রচনামূলক প্রশ্ন', 5, 1),
(18, 13, 3, 8, 'Unit 1 — My World', 1, 0),
(19, 13, 3, 8, 'Unit 2 — People Around Me', 2, 0),
(20, 13, 3, 8, 'Unit 3 — Nature', 3, 1),
(21, 13, 3, 8, 'Unit 4 — Education', 4, 1),
(22, 13, 3, 8, 'Unit 5 — Health', 5, 1),
(23, 13, 3, 8, 'Unit 6 — Travel', 6, 0),
(24, 13, 3, 8, 'Unit 7 — Science & Tech', 7, 1),
(25, 13, 3, 8, 'Unit 8 — Literature', 8, 1);

-- --------------------------------------------------------

--
-- Table structure for table `plan_daily_schedule`
--

CREATE TABLE `plan_daily_schedule` (
  `id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `day_number` int(11) NOT NULL,
  `scheduled_date` date NOT NULL,
  `subject_id` int(11) NOT NULL,
  `topic_id` int(11) NOT NULL,
  `question_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`question_ids`)),
  `description` varchar(300) DEFAULT NULL,
  `duration_min` int(11) NOT NULL DEFAULT 30,
  `is_completed` tinyint(1) DEFAULT 0,
  `completed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `plan_members`
--

CREATE TABLE `plan_members` (
  `id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role` enum('owner','member') DEFAULT 'member',
  `joined_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `point_logs`
--

CREATE TABLE `point_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `points` int(11) NOT NULL,
  `reason` enum('submission','daily_streak','plan_completed','perfect_score','group_contribution') NOT NULL,
  `reference_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `practice_plans`
--

CREATE TABLE `practice_plans` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `plan_code` varchar(20) NOT NULL,
  `session_type` enum('daily','exam_prep','weak_area','olympiad') NOT NULL,
  `subject_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`subject_ids`)),
  `topic_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`topic_ids`)),
  `daily_minutes` int(11) NOT NULL DEFAULT 30,
  `total_days` int(11) NOT NULL DEFAULT 14,
  `reminder_time` time DEFAULT NULL,
  `status` enum('active','completed','abandoned') DEFAULT 'active',
  `started_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `ends_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `topic_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `class_level` tinyint(4) NOT NULL,
  `question_body` text NOT NULL,
  `question_image_url` varchar(500) DEFAULT NULL,
  `difficulty` enum('easy','medium','hard') DEFAULT 'medium',
  `question_type` enum('math_solve','math_mcq','bangla_creative','bangla_dorkhasto','bangla_paragraph','bangla_letter','bangla_grammar','english_grammar','english_writing','english_letter','english_paragraph','english_story') NOT NULL,
  `is_board_question` tinyint(1) DEFAULT 0,
  `board_year` int(11) DEFAULT NULL,
  `hint_level_1` text DEFAULT NULL,
  `hint_level_2` text DEFAULT NULL,
  `hint_level_3` text DEFAULT NULL,
  `solution` text DEFAULT NULL,
  `best_solution` text DEFAULT NULL,
  `marks` tinyint(4) DEFAULT 10
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `topic_id`, `subject_id`, `class_level`, `question_body`, `question_image_url`, `difficulty`, `question_type`, `is_board_question`, `board_year`, `hint_level_1`, `hint_level_2`, `hint_level_3`, `solution`, `best_solution`, `marks`) VALUES
(1, 1, 1, 8, 'কোনো আসলের ৪ বছরের সরল মুনাফা আসলের ২/৫ অংশ হলে, বার্ষিক সুদের হার কত?', NULL, 'medium', 'math_solve', 1, 2023, 'সূত্র মনে করো: মুনাফা = আসল × হার × সময় ÷ ১০০', 'মুনাফা = আসলের ২/৫, সময় = ৪। এখন সূত্রে বসাও।', '(২/৫) = হার × ৪ ÷ ১০০ → হার = ?', 'ধরি আসল = P। মুনাফা = 2P/5।\nসূত্র: I = Prt/100\n2P/5 = P × r × 4/100\nr = (2/5 × 100)/4 = 10%\nউত্তর: বার্ষিক সুদের হার ১০%।', 'হার = মুনাফা×১০০ ÷ (আসল×সময়) = (2P/5×100)÷(P×4) = 10%', 10),
(2, 1, 1, 8, '৫০০০ টাকার ৩ বছরের সরল মুনাফা ৯০০ টাকা হলে, বার্ষিক সুদের হার নির্ণয় করো।', NULL, 'easy', 'math_solve', 0, NULL, 'সরল মুনাফার সূত্র: I = Prt/100 ব্যবহার করো।', 'I=900, P=5000, t=3, r=? বসিয়ে দেখো।', '900 = 5000 × r × 3 ÷ 100 → r = কত?', '900 = 5000 × r × 3 / 100\nr = 900×100/(5000×3) = 6%\nউত্তর: ৬%', 'r = I×100/(P×t) = 900×100/(5000×3) = 6%', 5),
(3, 1, 1, 8, 'কত বছরে ৮% সরল সুদে কোনো আসল দ্বিগুণ হবে?', NULL, 'medium', 'math_solve', 1, 2022, 'দ্বিগুণ মানে মুনাফা = আসলের সমান।', 'মুনাফা = আসল হলে, I = P। সূত্রে বসাও।', 'P = P × 8 × t / 100 → t = ?', 'I = P (দ্বিগুণ হলে মুনাফা = আসল)\nP = P×8×t/100\n1 = 8t/100\nt = 100/8 = 12.5 বছর\nউত্তর: ১২.৫ বছরে দ্বিগুণ হবে।', 't = 100/হার = 100/8 = 12.5 বছর', 10),
(4, 4, 1, 8, 'যদি A = {1,2,3,4,5} এবং B = {3,4,5,6,7} হয়, তাহলে A∪B এবং A∩B নির্ণয় করো।', NULL, 'easy', 'math_solve', 0, NULL, 'Union (∪) মানে দুটো সেটের সব উপাদান একসাথে (duplicate ছাড়া)।', 'Intersection (∩) মানে শুধু যে উপাদানগুলো দুটো সেটেই আছে।', 'A∪B = A ও B এর সব elements। A∩B = শুধু common elements।', 'A∪B = {1,2,3,4,5,6,7}\nA∩B = {3,4,5}', 'Union: সব elements মিলিয়ে। Intersection: common = {3,4,5}', 10),
(5, 4, 1, 8, 'একটি শ্রেণিতে ৪০ জন ছাত্র। তাদের মধ্যে ২৫ জন গণিত ভালোবাসে, ২০ জন বিজ্ঞান ভালোবাসে এবং ১০ জন উভয়ই ভালোবাসে। কতজন শুধু গণিত ভালোবাসে?', NULL, 'medium', 'math_solve', 1, 2023, 'ভেনচিত্র আঁকো। দুটো বৃত্ত — একটা গণিতের, একটা বিজ্ঞানের।', 'শুধু গণিত = মোট গণিত − উভয়।', 'শুধু গণিত = ২৫ − ১০ = ?', 'শুধু গণিত = ২৫ − ১০ = ১৫ জন\nশুধু বিজ্ঞান = ২০ − ১০ = ১০ জন\nউভয় = ১০ জন\nযাচাই: ১৫+১০+১০ = ৩৫, কেউ কিছু ভালোবাসে না = ৪০−৩৫ = ৫ জন', 'শুধু গণিত = n(A) − n(A∩B) = 25−10 = 15', 10),
(6, 17, 2, 8, 'নিচের উদ্দীপকটি পড়ো এবং প্রশ্নগুলোর উত্তর দাও:\n\nরহিম একজন কৃষক। সে সারাদিন মাঠে কাজ করে। তবুও তার সংসারে অভাব লেগেই থাকে।\n\n(ক) \"কৃষক\" শব্দের অর্থ কী?\n(খ) রহিমের জীবনযাত্রা ব্যাখ্যা করো।\n(গ) রহিমের অভাবের কারণ বিশ্লেষণ করো।\n(ঘ) \"পরিশ্রমই সৌভাগ্যের মূল\" — উদ্দীপকের আলোকে মূল্যায়ন করো।', NULL, 'medium', 'bangla_creative', 1, 2022, '(ক) জ্ঞানমূলক — সরাসরি ১ বাক্যে অর্থ লেখো।', '(খ) অনুধাবনমূলক — উদ্দীপক থেকে তথ্য নিয়ে নিজের ভাষায় লেখো। ২-৩ বাক্য।', '(গ) প্রয়োগমূলক — কারণ খোঁজো, যুক্তি দাও। (ঘ) নিজের মত দাও প্রমাণ সহ।', '(ক) কৃষক = যে কৃষিকাজ করে জীবিকা নির্বাহ করে।\n(খ) রহিম সারাদিন কঠোর পরিশ্রম করলেও তার পরিবারে অভাব ছিল। তার জীবন ছিল সংগ্রামময়।\n(গ) রহিমের অভাবের কারণ: জমির স্বল্পতা, ন্যায্য মূল্য না পাওয়া, প্রাকৃতিক দুর্যোগ।\n(ঘ) শুধু পরিশ্রম নয়, সঠিক সুযোগ ও সম্পদও দরকার। তবু পরিশ্রম সৌভাগ্যের পথ খুলে দেয়।', NULL, 20),
(7, 18, 2, 8, 'তোমার বিদ্যালয়ের প্রধান শিক্ষকের কাছে বিজ্ঞানাগার স্থাপনের জন্য একটি দরখাস্ত লেখো।', NULL, 'medium', 'bangla_dorkhasto', 1, 2023, 'শুরু: তারিখ → বরাবর (প্রাপক) → বিষয় — এই ক্রমে লেখো।', 'মূল অংশে: কী চাইছ, কেন দরকার, কী উপকার হবে — সংক্ষেপে লেখো।', 'শেষে: বিনীত নিবেদক, নাম, শ্রেণি, রোল নম্বর।', 'তারিখ: ০১/০১/২০২৪\nবরাবর\nপ্রধান শিক্ষক\n[বিদ্যালয়ের নাম], [ঠিকানা]\n\nবিষয়: বিজ্ঞানাগার স্থাপনের আবেদন।\n\nজনাব,\nবিনীত নিবেদন এই যে, আমাদের বিদ্যালয়ে কোনো বিজ্ঞানাগার নেই। ব্যবহারিক শিক্ষার জন্য বিজ্ঞানাগার অত্যন্ত প্রয়োজন।\n\nঅতএব, মহোদয়ের নিকট আবেদন, একটি আধুনিক বিজ্ঞানাগার স্থাপনের ব্যবস্থা করুন।\n\nবিনীত নিবেদক\nনাম: [নাম], শ্রেণি: অষ্টম, রোল: [নম্বর]', NULL, 10),
(8, 21, 3, 8, 'Write a formal letter to your headmaster requesting permission to arrange a study tour.', NULL, 'medium', 'english_letter', 1, 2023, 'Format: Date → The Headmaster, School Name → Subject line.', 'Body: Why you want the tour, where, when, how many students.', 'End: Yours obediently, Name, Class, Roll number.', 'Date: 01 January 2024\nThe Headmaster\n[School Name]\n\nSubject: Prayer for permission to arrange a study tour.\n\nSir,\nWith due respect I beg to state that we, the students of Class VIII, want to arrange a study tour to Cox\'s Bazar to learn about marine ecology.\n\nTherefore, I pray and hope that you would kindly permit us to arrange the tour.\n\nYours obediently\n[Name], Class VIII, Roll: [No]', NULL, 10),
(9, 22, 3, 8, 'Write a paragraph on \"The Importance of Exercise\" in about 150 words.', NULL, 'easy', 'english_paragraph', 0, NULL, 'Start with a topic sentence about why exercise is important.', 'Give 3-4 reasons: health, fitness, mental well-being, discipline.', 'End with a concluding sentence — make exercise a daily habit.', 'Exercise is essential for maintaining good health and a sound mind. Regular physical activity helps us stay fit and active. It strengthens our muscles and bones and improves blood circulation. Exercise also keeps our heart healthy and reduces the risk of many diseases. Moreover, it helps reduce stress and anxiety, making us feel happier. Students who exercise regularly can concentrate better on their studies. We should make exercise a part of our daily routine to lead a healthy and productive life.', NULL, 10),
(10, 19, 3, 8, 'Fill in the blanks with the correct form of the verbs given in brackets:\n1. She ___ (go) to school every day.\n2. They ___ (play) football now.\n3. I ___ (finish) my homework yesterday.', NULL, 'easy', 'english_grammar', 0, NULL, 'Think about the time: every day = present, now = present continuous, yesterday = past.', 'Every day → simple present (goes). Now → present continuous (are playing). Yesterday → simple past (finished).', 'Rule: she/he/it + verb+s for simple present. am/is/are + verb+ing for continuous.', '1. goes (simple present — every day)\n2. are playing (present continuous — now)\n3. finished (simple past — yesterday)', NULL, 5);

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`id`, `user_id`, `token`, `created_at`) VALUES
(1, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJyYWZpQHRlc3QuY29tIiwiaWF0IjoxNzc3OTE4MDkxLCJleHAiOjE3Nzg1MjI4OTF9.YIqlWKY6_fakQoBR1D6QTQKWlds5q7no_BRJwLkSof8', '2026-05-04 18:08:11'),
(2, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJuYWZpdWwzMHBAZ21haWwuY29tIiwiaWF0IjoxNzc3OTYyMTI1LCJleHAiOjE3Nzg1NjY5MjV9.Z6rcsU0w0I2ZIgwCWX34as1oUVZ-l_wWTURsPIOkqZs', '2026-05-05 06:22:05'),
(3, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJmYWhpbTMwQGdtYWlsLmNvbSIsImlhdCI6MTc3Nzk2ODQ4NiwiZXhwIjoxNzc4NTczMjg2fQ.jkEkxLaYCnmA6zpnbJt15AIsm0tL_J9uUhI3h4mNywU', '2026-05-05 08:08:06');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `color_code` varchar(10) DEFAULT NULL,
  `icon` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `name`, `slug`, `color_code`, `icon`) VALUES
(1, 'গণিত', 'math', '#10B981', '📐'),
(2, 'বাংলা', 'bangla', '#FF9800', '📝'),
(3, 'English', 'english', '#2196F3', '📖');

-- --------------------------------------------------------

--
-- Table structure for table `submissions`
--

CREATE TABLE `submissions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `plan_id` int(11) DEFAULT NULL,
  `schedule_id` int(11) DEFAULT NULL,
  `user_answer` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `score` float DEFAULT 0,
  `status` enum('pending','evaluated','needs_retry') DEFAULT 'pending',
  `hint_used_level` tinyint(4) DEFAULT 0,
  `time_taken_sec` int(11) DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `submission_feedback`
--

CREATE TABLE `submission_feedback` (
  `id` int(11) NOT NULL,
  `submission_id` int(11) NOT NULL,
  `feedback_body` text NOT NULL,
  `error_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`error_details`)),
  `improved_version` text DEFAULT NULL,
  `alternative_solution` text DEFAULT NULL,
  `step_by_step` text DEFAULT NULL,
  `marks_breakdown` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`marks_breakdown`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `topics`
--

CREATE TABLE `topics` (
  `id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `topic_type` enum('math_problem','bangla_creative','bangla_dorkhasto','bangla_letter','bangla_paragraph','bangla_grammar','english_grammar','english_writing','english_letter','english_paragraph','english_story') NOT NULL,
  `order_index` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `topics`
--

INSERT INTO `topics` (`id`, `chapter_id`, `subject_id`, `title`, `topic_type`, `order_index`) VALUES
(1, 1, 1, 'সরল মুনাফা', 'math_problem', 1),
(2, 1, 1, 'চক্রবৃদ্ধি মুনাফা', 'math_problem', 2),
(3, 2, 1, 'সেটের ধারণা ও প্রকারভেদ', 'math_problem', 1),
(4, 2, 1, 'সেটের অপারেশন (∪ ∩ −)', 'math_problem', 2),
(5, 2, 1, 'ভেনচিত্র সমস্যা', 'math_problem', 3),
(6, 4, 1, 'বীজগাণিতিক সূত্র প্রয়োগ', 'math_problem', 1),
(7, 4, 1, 'উৎপাদকে বিশ্লেষণ', 'math_problem', 2),
(8, 5, 1, 'ভগ্নাংশের যোগ ও বিয়োগ', 'math_problem', 1),
(9, 5, 1, 'ভগ্নাংশের গুণ ও ভাগ', 'math_problem', 2),
(10, 6, 1, 'এক চলকের সমীকরণ', 'math_problem', 1),
(11, 6, 1, 'দুই চলকের সমীকরণ', 'math_problem', 2),
(12, 9, 1, 'গড়, মধ্যক, প্রচুরক', 'math_problem', 1),
(13, 9, 1, 'গণসংখ্যা ছক ও লেখচিত্র', 'math_problem', 2),
(14, 10, 1, 'পিথাগোরাসের উপপাদ্য প্রমাণ', 'math_problem', 1),
(15, 10, 1, 'পিথাগোরাস সমস্যা সমাধান', 'math_problem', 2),
(16, 12, 1, 'জ্যামিতিক প্রমাণ অনুশীলন', 'math_problem', 1),
(17, 17, 2, 'সৃজনশীল লেখা', 'bangla_creative', 1),
(18, 17, 2, 'দরখাস্ত লেখা', 'bangla_dorkhasto', 2),
(19, 17, 2, 'অনুচ্ছেদ লেখা', 'bangla_paragraph', 3),
(20, 17, 2, 'চিঠি লেখা', 'bangla_letter', 4),
(21, 16, 2, 'ব্যাকরণ অনুশীলন', 'bangla_grammar', 1),
(22, 18, 3, 'Grammar Practice', 'english_grammar', 1),
(23, 19, 3, 'Reading Comprehension', 'english_writing', 1),
(24, 20, 3, 'Nature Writing', 'english_paragraph', 1),
(25, 21, 3, 'Formal Letter', 'english_letter', 1),
(26, 21, 3, 'Informal Letter', 'english_letter', 2),
(27, 22, 3, 'Health Paragraph', 'english_paragraph', 1),
(28, 24, 3, 'Technology Essay', 'english_writing', 1),
(29, 25, 3, 'Story Writing', 'english_story', 1);

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
  `medium` enum('bangla','english') DEFAULT NULL,
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
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `class_level`, `medium`, `gender`, `phone_number`, `avatar_url`, `total_points`, `streak_days`, `is_verified`, `last_active`, `last_class_update`, `created_at`) VALUES
(1, 'রাফি', 'rafi@test.com', '$2b$12$IsSageMwYVifq8ZpBIFfR.HcBqDX9Db6S7RLxCyGlkoHxtu.7kzsi', 8, NULL, 'male', NULL, NULL, 0, 0, 0, '2026-05-04 18:08:11', '2026-05-04 18:08:11', '2026-05-04 18:08:11'),
(2, 'Nafi', 'nafiul30p@gmail.com', '$2b$12$XfxFQY/R3bIOS0yC4k8Sp.sROfyvRCEIXmsklFgiZQMd0wJc4MNN.', 6, NULL, NULL, NULL, NULL, 0, 0, 0, '2026-05-05 06:11:01', '2026-05-05 06:11:01', '2026-05-05 06:11:01'),
(3, 'fahim', 'fahim30@gmail.com', '$2b$12$4nx.DdIFaU8hQ44ntWo6/.6NEU9ubgXpafqkeKQMDtx2INFtMPIC.', 6, NULL, NULL, NULL, NULL, 0, 0, 0, '2026-05-05 08:06:32', '2026-05-05 08:06:32', '2026-05-05 08:06:32'),
(4, 'nafiul', 'nafiulw30p@gmail.com', '$2b$12$c7GrQaxUD/1vrlN2fbgCEOYNkC/5NFabwVQuSsd349sZiA1InNLGy', 8, NULL, NULL, NULL, NULL, 0, 0, 0, '2026-05-05 08:09:56', '2026-05-05 08:09:56', '2026-05-05 08:09:56');

-- --------------------------------------------------------

--
-- Table structure for table `user_devices`
--

CREATE TABLE `user_devices` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `device_token` varchar(255) NOT NULL,
  `device_type` enum('mobile','tablet','desktop') NOT NULL,
  `browser` varchar(100) DEFAULT NULL,
  `last_seen` timestamp NOT NULL DEFAULT current_timestamp(),
  `first_seen` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_devices`
--

INSERT INTO `user_devices` (`id`, `user_id`, `device_token`, `device_type`, `browser`, `last_seen`, `first_seen`) VALUES
(1, 2, 'cf836c54-98fd-4d9f-ba82-85ea85e8b83a', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Sa', '2026-05-05 06:22:05', '2026-05-05 06:22:05'),
(2, 3, 'c280f692-4980-446b-9ac1-ca190959eb40', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Sa', '2026-05-05 08:08:06', '2026-05-05 08:08:06');

-- --------------------------------------------------------

--
-- Table structure for table `user_favourite_subjects`
--

CREATE TABLE `user_favourite_subjects` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subject_slug` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_hobbies`
--

CREATE TABLE `user_hobbies` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `hobby_slug` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_learning_styles`
--

CREATE TABLE `user_learning_styles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `style` enum('visual','audio','hands') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_progress`
--

CREATE TABLE `user_progress` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `chapter_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `solved_count` int(11) DEFAULT 0,
  `correct_count` int(11) DEFAULT 0,
  `accuracy_rate` float DEFAULT 0,
  `last_solved_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_books_class` (`class_level`,`subject_id`),
  ADD KEY `books_ibfk_1` (`subject_id`);

--
-- Indexes for table `chapters`
--
ALTER TABLE `chapters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_chapters_book` (`book_id`,`class_level`),
  ADD KEY `chapters_ibfk_2` (`subject_id`);

--
-- Indexes for table `plan_daily_schedule`
--
ALTER TABLE `plan_daily_schedule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_schedule_plan` (`plan_id`,`scheduled_date`),
  ADD KEY `plan_daily_schedule_ibfk_2` (`subject_id`),
  ADD KEY `plan_daily_schedule_ibfk_3` (`topic_id`);

--
-- Indexes for table `plan_members`
--
ALTER TABLE `plan_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_plan_user` (`plan_id`,`user_id`),
  ADD KEY `idx_plan_members_plan` (`plan_id`),
  ADD KEY `idx_plan_members_user` (`user_id`);

--
-- Indexes for table `point_logs`
--
ALTER TABLE `point_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_points_user` (`user_id`);

--
-- Indexes for table `practice_plans`
--
ALTER TABLE `practice_plans`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `plan_code` (`plan_code`),
  ADD KEY `idx_plans_user` (`user_id`,`status`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_questions_topic` (`topic_id`,`class_level`),
  ADD KEY `idx_questions_board` (`is_board_question`,`board_year`),
  ADD KEY `questions_ibfk_2` (`subject_id`);

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
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `submissions`
--
ALTER TABLE `submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_submissions_user` (`user_id`),
  ADD KEY `idx_submissions_question` (`question_id`),
  ADD KEY `submissions_ibfk_3` (`plan_id`),
  ADD KEY `submissions_ibfk_4` (`schedule_id`);

--
-- Indexes for table `submission_feedback`
--
ALTER TABLE `submission_feedback`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `submission_id` (`submission_id`);

--
-- Indexes for table `topics`
--
ALTER TABLE `topics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_topics_chapter` (`chapter_id`),
  ADD KEY `topics_ibfk_2` (`subject_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_devices`
--
ALTER TABLE `user_devices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_device` (`user_id`,`device_token`);

--
-- Indexes for table `user_favourite_subjects`
--
ALTER TABLE `user_favourite_subjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_subject` (`user_id`,`subject_slug`);

--
-- Indexes for table `user_hobbies`
--
ALTER TABLE `user_hobbies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_hobby` (`user_id`,`hobby_slug`);

--
-- Indexes for table `user_learning_styles`
--
ALTER TABLE `user_learning_styles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_style` (`user_id`,`style`);

--
-- Indexes for table `user_progress`
--
ALTER TABLE `user_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_chapter` (`user_id`,`chapter_id`),
  ADD KEY `idx_progress_user` (`user_id`,`subject_id`),
  ADD KEY `user_progress_ibfk_2` (`chapter_id`),
  ADD KEY `user_progress_ibfk_3` (`subject_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `chapters`
--
ALTER TABLE `chapters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `plan_daily_schedule`
--
ALTER TABLE `plan_daily_schedule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `plan_members`
--
ALTER TABLE `plan_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `point_logs`
--
ALTER TABLE `point_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `practice_plans`
--
ALTER TABLE `practice_plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `submissions`
--
ALTER TABLE `submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `submission_feedback`
--
ALTER TABLE `submission_feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `topics`
--
ALTER TABLE `topics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_devices`
--
ALTER TABLE `user_devices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_favourite_subjects`
--
ALTER TABLE `user_favourite_subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_hobbies`
--
ALTER TABLE `user_hobbies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_learning_styles`
--
ALTER TABLE `user_learning_styles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_progress`
--
ALTER TABLE `user_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `books_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`);

--
-- Constraints for table `chapters`
--
ALTER TABLE `chapters`
  ADD CONSTRAINT `chapters_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`),
  ADD CONSTRAINT `chapters_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`);

--
-- Constraints for table `plan_daily_schedule`
--
ALTER TABLE `plan_daily_schedule`
  ADD CONSTRAINT `plan_daily_schedule_ibfk_1` FOREIGN KEY (`plan_id`) REFERENCES `practice_plans` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `plan_daily_schedule_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
  ADD CONSTRAINT `plan_daily_schedule_ibfk_3` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`);

--
-- Constraints for table `plan_members`
--
ALTER TABLE `plan_members`
  ADD CONSTRAINT `plan_members_ibfk_1` FOREIGN KEY (`plan_id`) REFERENCES `practice_plans` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `plan_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `point_logs`
--
ALTER TABLE `point_logs`
  ADD CONSTRAINT `point_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `practice_plans`
--
ALTER TABLE `practice_plans`
  ADD CONSTRAINT `practice_plans_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`),
  ADD CONSTRAINT `questions_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`);

--
-- Constraints for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `submissions`
--
ALTER TABLE `submissions`
  ADD CONSTRAINT `submissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `submissions_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`),
  ADD CONSTRAINT `submissions_ibfk_3` FOREIGN KEY (`plan_id`) REFERENCES `practice_plans` (`id`),
  ADD CONSTRAINT `submissions_ibfk_4` FOREIGN KEY (`schedule_id`) REFERENCES `plan_daily_schedule` (`id`);

--
-- Constraints for table `submission_feedback`
--
ALTER TABLE `submission_feedback`
  ADD CONSTRAINT `submission_feedback_ibfk_1` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `topics`
--
ALTER TABLE `topics`
  ADD CONSTRAINT `topics_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`),
  ADD CONSTRAINT `topics_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`);

--
-- Constraints for table `user_devices`
--
ALTER TABLE `user_devices`
  ADD CONSTRAINT `user_devices_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_favourite_subjects`
--
ALTER TABLE `user_favourite_subjects`
  ADD CONSTRAINT `user_favourite_subjects_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_hobbies`
--
ALTER TABLE `user_hobbies`
  ADD CONSTRAINT `user_hobbies_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_learning_styles`
--
ALTER TABLE `user_learning_styles`
  ADD CONSTRAINT `user_learning_styles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_progress`
--
ALTER TABLE `user_progress`
  ADD CONSTRAINT `user_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_progress_ibfk_2` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`),
  ADD CONSTRAINT `user_progress_ibfk_3` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
