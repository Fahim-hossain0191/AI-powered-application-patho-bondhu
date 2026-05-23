const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getStoredToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken") || localStorage.getItem("token");
};

export const storeSession = (payload) => {
  if (typeof window === "undefined") return;

  const data = payload?.data || payload || {};
  const token = data.token || data.accessToken;
  const user = data.user || data;

  if (token) {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("token", token);
  }

  if (user && typeof user === "object") {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

export const clearSession = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/**
 * Base fetch wrapper that handles authorization headers and JSON parsing.
 */
async function fetchAPI(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Only run on the client side
  if (typeof window !== "undefined") {
    const token = getStoredToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });
  } catch (err) {
    throw new Error("সার্ভারে কানেক্ট করা সম্ভব হয়নি। অনুগ্রহ করে চেক করুন ব্যাকএন্ড চালু আছে কিনা।");
  }

  if (response.status === 401 && endpoint !== "/api/auth/login") {
    if (typeof window !== "undefined") {
      clearSession();
      window.location.href = "/signin";
    }
    throw new Error("Token মেয়াদ শেষ বা ভুল, আবার login করো");
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.message || "An error occurred with the API request");
  }

  return data;
}

// -----------------------------------------------------------------------------
// Authentication APIs
// -----------------------------------------------------------------------------
export const auth = {
  register: (userData) => {
    return fetchAPI("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  login: (credentials) => {
    return fetchAPI("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  logout: () => {
    clearSession();
    return Promise.resolve({ success: true });
  },

  refresh: () => {
    return Promise.resolve({ success: false });
  }
};

// -----------------------------------------------------------------------------
// Math & AI APIs
// -----------------------------------------------------------------------------
export const math = {
  generateMCQ: (data) => {
    // data: { chapter_id, count, previously_generated }
    return fetchAPI("/api/math/mcq/generate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  checkTextAnswer: (data) => {
    // data: { exercise_id, student_answer, subject_id, chapter_id }
    return fetchAPI("/api/math/answer/check-text", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  checkImageAnswer: (data) => {
    // data: { exercise_id, image_base64, image_mime, subject_id, chapter_id }
    return fetchAPI("/api/math/answer/check-image", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getHint: (data) => {
    // data: { exercise_id, phase, subject_id, chapter_id }
    return fetchAPI("/api/math/hint", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  jachaiSolve: (data) => {
    // data: { question, chapter_id }
    return fetchAPI("/api/math/jachai/solve", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  jachaiCheck: (data) => {
    // data: { question, student_solution, chapter_id }
    return fetchAPI("/api/math/jachai/check", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  jachaiImage: (data) => {
    // data: { image_base64, image_mime }
    return fetchAPI("/api/math/jachai/image", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getExercises: (chapterId) => {
    return fetchAPI(`/api/math/exercises?chapter_id=${chapterId}`, {
      method: "GET",
    });
  },

  getChapters: () => {
    return fetchAPI("/api/math/chapters", {
      method: "GET",
    });
  },

  getChapter: (chapterId) => {
    return fetchAPI(`/api/math/chapters/${chapterId}`, {
      method: "GET",
    });
  },

  getConcepts: (chapterId) => {
    return fetchAPI(`/api/math/chapters/${chapterId}/concepts`, {
      method: "GET",
    });
  },

  getFormulas: (chapterId) => {
    return fetchAPI(`/api/math/chapters/${chapterId}/formulas`, {
      method: "GET",
    });
  },

  getSrijonshil: (chapterId) => {
    return fetchAPI(`/api/math/chapters/${chapterId}/srijonshil`, {
      method: "GET",
    });
  }
};

