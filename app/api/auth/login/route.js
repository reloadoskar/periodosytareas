import UserSchema from "@/schemas/user"
import { createConnection } from "mongoose"
import { NextResponse } from "next/server"
// import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";
const { MONGODB_URI, JWT_SECRET } = process.env;
export async function POST(request) {
    const req = await request.json()
    // console.log(req)
    const { email, password } = req.credenciales
    try {
        //conectamos a la base de datos y verificamos las credenciales
        const conn = createConnection(MONGODB_URI + 'PYT_USRS')
        conn.on("connected", () => console.log("Conectado a PYT_USRS :::::::"));
        conn.on("disconnected", () => console.log("Cerrando DB ⚠️."));
        if (!conn) {
            throw new Error("No se pudo conectar a la base de datos")
        }
        let User = conn.model('User', UserSchema)

        const usuarioExistente = await User.find({ email }).select("+password").lean()
        // console.log(usuarioExistente)
        if (usuarioExistente.length === 0) return NextResponse.json({ message: "Credenciales invalidas", status: "error" }, { status: 500 })

        // const isMatch = bcrypt.compareSync(password, usuarioExistente[0].password);
        // if (!isMatch) return NextResponse.json({ message: "Credenciales invalidas", status: "error" }, { status: 500 })

        const payload = {
            _id: usuarioExistente[0]._id,
            nombre: usuarioExistente[0].nombre,
            apellido: usuarioExistente[0].apellido,
            email: usuarioExistente[0].email,
            ubicacion: usuarioExistente[0].ubicacion,
            level: usuarioExistente[0].level,
            database: usuarioExistente[0].database,
            tryPeriodEnds: usuarioExistente[0].tryPeriodEnds,
            paidPeriodEnds: usuarioExistente[0].paidPeriodEnds,
            rol: usuarioExistente[0].rol,
        } // console.log(payload)

        let token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' })

        cookies().set("authToken", token, {
            httpOnly: false, secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 30,
            path: '/'
        })

        conn.close()
        return NextResponse.json({ message: "Login exitoso", status: "success", token: token }, { status: 200 })

    } catch (error) {
        return NextResponse.json(error.message, { status: 500 })
    }
}