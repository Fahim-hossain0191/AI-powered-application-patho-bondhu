# API Service Layer Integration

I have successfully built and integrated a centralized API service for your frontend application. This will make it incredibly easy to connect your frontend components to your backend routes.

## 1. The API Service (`frontend/src/services/api.js`)
I created this new file to handle all communication with the backend. 
- It automatically handles attaching the `Authorization: Bearer <accessToken>` header to your protected API calls.
- It parses the JSON responses and automatically throws clean errors if the request fails (e.g. 400 or 500 errors).
- It exports clean, descriptive functions for every single route (e.g., `math.generateMCQ`, `auth.login`).

**Example Usage for future components:**
```javascript
import { math } from "@/services/api"; // or relative path

// To generate an MCQ
const mcqData = await math.generateMCQ({ chapter_id: 1, count: 5 });

// To check a text answer
const result = await math.checkTextAnswer({ exercise_id: 12, student_answer: "x = 5" });
```

## 2. Refactored Sign In & Sign Up
To demonstrate how much cleaner this makes your components, I refactored `signin/page.jsx` and `signup/page.jsx`.
- **Sign In** now just calls `const data = await auth.login({ email, password })`. No more manual `fetch()` with `JSON.stringify`!
- **Sign Up** now just calls `await auth.register(formData)`.

This keeps your React components clean and focused strictly on the UI and state, leaving the networking details entirely to `api.js`!
