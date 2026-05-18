# Pattho Bondhu Backend API Documentation

Here is a complete list of all the backend APIs available for you to use in the frontend, along with the expected payload structures.

> [!NOTE]
> The base URL for all these endpoints is your `NEXT_PUBLIC_API_URL` (currently `http://localhost:5000`).

---

## 1. Authentication APIs (`/api/auth`)

These routes handle user registration, login, and sessions.

### `POST /api/auth/register`
Creates a new user account.
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "full_name": "John Doe",       // required (min 2 chars)
    "email": "john@example.com",   // required (valid email)
    "password": "password123",     // required (min 6 chars)
    "class": "9-10",               // required
    "phone": "01712345678",        // optional
    "school_name": "Ideal School", // optional
    "board_name": "Dhaka",         // optional
    "profile_image_url": "..."     // optional (must be valid URI if provided)
  }
  ```

### `POST /api/auth/login`
Authenticates a user and returns tokens.
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "john@example.com",   // required
    "password": "password123"      // required
  }
  ```

### `POST /api/auth/logout`
Logs out the user and clears HttpOnly cookies.
- **Body:** `{}` (None required)

### `POST /api/auth/refresh`
Refreshes the access token using the HttpOnly `refreshToken` cookie.
- **Body:** `{}` (None required)

### `GET /api/auth/google`
Redirects to Google for OAuth authentication. You can just use this URL in an `<a>` tag or `window.location.href`.

---

## 2. Math / AI Module APIs (`/api/math`)

> [!WARNING]
> All `/api/math/*` routes are protected. You must include the user's access token in the Authorization header: `Authorization: Bearer <access_token>`

### `POST /api/math/mcq/generate`
Generates MCQ questions for a specific chapter.
- **Body:**
  ```json
  {
    "chapter_id": 1,
    "count": 5,
    "previously_generated": [] // Array of IDs to avoid duplicates
  }
  ```

### `POST /api/math/answer/check-text`
Evaluates a student's text-based answer for an exercise and awards points.
- **Body:**
  ```json
  {
    "exercise_id": 123,
    "student_answer": "x = 5, y = 10",
    "subject_id": 1,  // optional
    "chapter_id": 1   // optional
  }
  ```

### `POST /api/math/answer/check-image`
Evaluates a student's answer from an uploaded image.
- **Body:**
  ```json
  {
    "exercise_id": 123,
    "image_base64": "iVBORw0KGgo...", // Base64 encoded image string
    "image_mime": "image/jpeg",       // MIME type
    "subject_id": 1,                  // optional
    "chapter_id": 1                   // optional
  }
  ```

### `POST /api/math/hint`
Requests a hint for an exercise (deducts 5 points).
- **Body:**
  ```json
  {
    "exercise_id": 123,
    "phase": 1,       // Hint level (1, 2, 3...)
    "subject_id": 1,  // optional
    "chapter_id": 1   // optional
  }
  ```

### `POST /api/math/jachai/solve`
Asks the AI to solve a specific question.
- **Body:**
  ```json
  {
    "question": "Solve 2x + 5 = 15",
    "chapter_id": 1 // optional
  }
  ```

### `POST /api/math/jachai/check`
Asks the AI to check a student's custom solution steps.
- **Body:**
  ```json
  {
    "question": "Solve 2x + 5 = 15",
    "student_solution": "2x = 10, x = 5",
    "chapter_id": 1 // optional
  }
  ```

### `POST /api/math/jachai/image`
Processes an image upload for the Jachai (verification) feature.
- **Body:**
  ```json
  {
    "image_base64": "iVBORw0KGgo...",
    "image_mime": "image/jpeg"
  }
  ```

---

## 3. General Routes

### `GET /health`
A simple health check endpoint to verify the backend is running. No authentication required. Returns `{"status": "OK"}`.
