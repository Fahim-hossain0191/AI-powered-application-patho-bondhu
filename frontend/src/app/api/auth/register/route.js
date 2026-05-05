import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { name, email, password } = await req.json();

  const hashed = await bcrypt.hash(password, 10);

  await db.query(
    "INSERT INTO users (name, email, password_hash, class_level) VALUES (?, ?, ?, ?)",
    [name, email, hashed, 6]
  );

  return Response.json({ message: "User created" });
}