import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, password } = await req.json();

  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  const user = rows[0];

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    return NextResponse.json({ error: "Wrong password" }, { status: 400 });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const response = NextResponse.json({ message: "Login success" });

  // ✅ SET COOKIE
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: false, // true in production (https)
    sameSite: "lax",
    path: "/",
  });

  return response;
}