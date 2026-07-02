//signup para registrar un nuevo usuario
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createConnection } from "mongoose"
import jwt from "jsonwebtoken"
const { MONGODB_URI, JWT_SECRET } = process.env;
import { cookies } from "next/headers";

export async function POST(request) {
    const req = await request.json();
    const { email, password } = req.credenciales;
    // console.log(req.credenciales)
    try {
        const conn = createConnection(MONGODB_URI + 'PYT_USRS')
        conn.on("connected", () => console.log("Conectado a PYT_USRS :::::::"));
        conn.on("disconnected", () => console.log("Cerrando DB ⚠️."));
        if (!conn) {
            throw new Error("No se pudo conectar a la base de datos")
        }
        const UserSchema = require("@/schemas/user").default;
        let User = conn.model('User', UserSchema)
        const hashedPassword = await bcrypt.hash(password, 10);

        const usuarioExiste = await User.findOne({ email });
        if (usuarioExiste) {
            conn.close();
            return NextResponse.json({ error: "El usuario ya existe", status: "error" }, { status: 500 });
        }

        const newUser = new User({
            email,
            password: hashedPassword,
            database: "PYT_DB_" + email.split("@")[0], // Genera un nombre de base de datos único basado en el correo electrónico
            level: 1,
        });
        await newUser.save();

        const payload = {
            _id: newUser._id,
            email: newUser.email,
            level: newUser.level,
            database: newUser.database,
        } // console.log(payload)

        let token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2d' })

        const c = cookies()
        c.set("authToken", token, {
            httpOnly: false, secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 30,
            path: '/'
        })

        conn.close()

        return NextResponse.json({ message: "Usuario registrado exitosamente", status: "success", token: token }, { status: 200 });
    } catch (error) {
        console.error("Error en registro:", error);
        return NextResponse.json({ error: "Error en registro", status: "error" }, { status: 500 });
    }
}