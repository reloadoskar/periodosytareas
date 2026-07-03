import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PeriodoSchema } from "@/models/periodo";
import UserSchema from "@/schemas/user";
import { dbConnect, getUsersConnection } from "@/utils/connection";
import { getDefaultPeriodos } from "@/utils/defaultPeriodos";

const { JWT_SECRET } = process.env;

const sanitizeDatabaseName = (email) =>
  `PYT_DB_${email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_")}`;

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
        { error: "Email y contraseña son requeridos", status: "error" },
        { status: 400 },
      );
    }

    const conn = await getUsersConnection();
    if (!conn) {
      return NextResponse.json(
        { error: "Error al conectar con la base de datos", status: "error" },
        { status: 500 },
      );
    }
    const User = conn.models.User || conn.model("User", UserSchema);
    const usuarioExiste = await User.findOne({ email });

    if (usuarioExiste) {
      return NextResponse.json(
        { error: "El usuario ya existe", status: "error" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const database = sanitizeDatabaseName(email);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      database,
      level: 1,
    });

    const userConn = await dbConnect(database);
    const Periodo =
      userConn.models.Periodo || userConn.model("Periodo", PeriodoSchema);
    await Periodo.insertMany(getDefaultPeriodos());

    const payload = {
      _id: newUser._id,
      email: newUser.email,
      level: newUser.level,
      database: newUser.database,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
    await setAuthCookie(token);

    return NextResponse.json(
      {
        message: "Usuario registrado exitosamente",
        status: "success",
        user: payload,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message, status: "error" },
      { status: 500 },
    );
  }
}
