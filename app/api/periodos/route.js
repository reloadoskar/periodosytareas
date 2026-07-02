import {NextResponse} from "next/server";
import {  dbConnect } from "@/utils/connection";
import Periodo from "@/models/periodo";

export async function GET(request) {
}

export async function POST(request) {
    const req = await request.json();
    const { periodo, database } = req;

    // console.log("Creating periodo:", periodo, "in database:", database);
    // crear conexion a bd definida por cliente
    const conn = await dbConnect(database);

    try {
        const newPeriodo = new Periodo(periodo);
        await newPeriodo.save();
        return NextResponse.json({ message: "Periodo creado exitosamente", status: "success", periodo: newPeriodo }, { status: 200 });
    } catch (error) {
        console.error("Error al crear periodo:", error);
        return NextResponse.json({ error: "Error al crear periodo", status: "error" }, { status: 500 });
    }

}