"use client";

import React, { useState } from "react";

const SignUp = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    class: "9-10",
    school_name: "",
    board_name: "",
    profile_image_url: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(formData),
});

      const data = await res.json();

      if (res.ok) {
        alert("Account created successfully!");
        console.log(data);
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f7fb",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "white",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "25px",
            color:"black"
          }}
        >
          Create Account
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <select
            name="class"
            value={formData.class}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="6">Class 6</option>
            <option value="7">Class 7</option>
            <option value="8">Class 8</option>
            <option value="9-10">Class 9-10</option>
            <option value="11-12">Class 11-12</option>
          </select>

          <input
            type="text"
            name="school_name"
            placeholder="School Name"
            value={formData.school_name}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            name="board_name"
            placeholder="Board Name"
            value={formData.board_name}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            name="profile_image_url"
            placeholder="Profile Image URL"
            value={formData.profile_image_url}
            onChange={handleChange}
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              background: "#2563eb",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "14px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  outline: "none",
  fontSize: "15px",
  color:"black"
};

export default SignUp;