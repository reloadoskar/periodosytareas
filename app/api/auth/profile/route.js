import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
const { JWT_SECRET } = process.env;

export async function GET(request) {
    // extraer token de las cookies, verificar token, etc. (si es necesario)
    const token = request.cookies.get("authToken")?.value;
    if (!token) {
        return NextResponse.json({ message: "No autenticado" }, { status: 401 })
    }

    // Aquí iría la lógica para verificar el token y obtener el perfil del usuario
    const payload = jwt.verify(token, JWT_SECRET);

    return NextResponse.json({ message: "Ruta de perfil", payload }, { status: 200 })
}