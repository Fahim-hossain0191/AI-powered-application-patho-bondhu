const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
    const token = localStorage.getItem("accessToken");
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

  // Handle unauthorized / expired tokens automatically
  if (response.status === 401 && endpoint !== "/api/auth/login" && endpoint !== "/api/auth/refresh") {
    try {
      const refreshResult = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      
      if (refreshResult.ok) {
        const refreshData = await refreshResult.json();
        const newAccessToken = refreshData.data?.accessToken || refreshData.accessToken;
        
        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          headers.Authorization = `Bearer ${newAccessToken}`;
          
          const retryResponse = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
            credentials: "include",
          });
          
          if (retryResponse.ok) {
            return await retryResponse.json();
          }
        }
      }
    } catch (refreshErr) {
      console.error("Silent refresh failed:", refreshErr);
    }

    // If silent refresh fails, clear user data and redirect to signin
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/signin";
    }
    throw new Error("Token মেয়াদ শেষ বা ভুল, আবার login করো");
  }

  const data = await response.json();

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
    return fetchAPI("/api/auth/logout", {
      method: "POST",
    });
  },

  refresh: () => {
    return fetchAPI("/api/auth/refresh", {
      method: "POST",
    });
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
  }
};
