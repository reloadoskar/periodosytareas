import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import UserSchema from "@/schemas/user";
import { getUsersConnection } from "@/utils/connection";
import { sanitizeUserUpdate } from "@/utils/user";

const { JWT_SECRET } = process.env;

const buildPayload = (user) => ({
  _id: user._id,
  nombre: user.nombre,
  apellido1: user.apellido1,
  apellido2: user.apellido2,
  telefono: user.telefono,
  email: user.email,
  level: user.level,
  database: user.database,
  tryPeriodEnds: user.tryPeriodEnds,
  paidPeriodEnds: user.paidPeriodEnds,
});

const getTokenPayload = (request) => {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined.");

  const token = request.cookies.get("authToken")?.value;
  if (!token) return null;

  return jwt.verify(token, JWT_SECRET);
};

export async function GET(request) {
  try {
    const payload = getTokenPayload(request);
    if (!payload) {
      return NextResponse.json(
        { message: "No autenticado", status: "anonymous" },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Ruta de perfil", payload, status: "success" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message, status: "error" },
      { status: 401 },
    );
  }
}

export async function PATCH(request) {
  try {
    const payload = getTokenPayload(request);
    if (!payload?._id) {
      return NextResponse.json(
        { message: "No autenticado", status: "error" },
        { status: 401 },
      );
    }

    const { user } = await request.json();
    const update = sanitizeUserUpdate(user);
    const conn = await getUsersConnection();
    const User = conn.models.User || conn.model("User", UserSchema);
    const updatedUser = await User.findByIdAndUpdate(payload._id, update, {
      returnDocument: "after",
      runValidators: true,
    }).lean();

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Usuario no encontrado", status: "error" },
        { status: 404 },
      );
    }

    const nextPayload = buildPayload(updatedUser);
    const token = jwt.sign(nextPayload, JWT_SECRET, { expiresIn: "30d" });
    const response = NextResponse.json(
      { message: "Perfil actualizado", status: "success", user: nextPayload },
      { status: 200 },
    );

    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error.message, status: "error" },
      { status: 500 },
    );
  }
}
