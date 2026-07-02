import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import UserSchema from "@/schemas/user";
import { getUsersConnection } from "@/utils/connection";

const { JWT_SECRET } = process.env;

const buildPayload = (user) => ({
  _id: user._id,
  nombre: user.nombre,
  apellido1: user.apellido1,
  apellido2: user.apellido2,
  email: user.email,
  level: user.level,
  database: user.database,
  tryPeriodEnds: user.tryPeriodEnds,
  paidPeriodEnds: user.paidPeriodEnds,
});

const setAuthCookie = async (token) => {
  (await cookies()).set("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
};

export async function POST(request) {
  try {
    if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined.");

    const { credenciales } = await request.json();
    const { email, password } = credenciales ?? {};

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email y contraseña son requeridos", status: "error" },
        { status: 400 },
      );
    }

    const conn = await getUsersConnection();
    const User = conn.models.User || conn.model("User", UserSchema);
    const usuario = await User.findOne({ email }).select("+password");

    if (!usuario) {
      return NextResponse.json(
        { message: "Credenciales inválidas", status: "error" },
        { status: 401 },
      );
    }

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Credenciales inválidas", status: "error" },
        { status: 401 },
      );
    }

    const payload = buildPayload(usuario);
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
    await setAuthCookie(token);

    return NextResponse.json(
      { message: "Login exitoso", status: "success", user: payload },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message, status: "error" },
      { status: 500 },
    );
  }
}
