import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PeriodoSchema } from "@/models/periodo";
import { dbConnect } from "@/utils/connection";
import { normalizePeriodo } from "@/utils/periodos";

const { JWT_SECRET } = process.env;

const unauthorized = () =>
  NextResponse.json(
    { error: "No autenticado", status: "error" },
    { status: 401 },
  );

const getSession = async () => {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined.");

  const token = (await cookies()).get("authToken")?.value;
  if (!token) return null;

  return jwt.verify(token, JWT_SECRET);
};

const getPeriodoModel = async (database) => {
  const conn = await dbConnect(database);
  return conn.models.Periodo || conn.model("Periodo", PeriodoSchema);
};

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.database) return unauthorized();

    const Periodo = await getPeriodoModel(session.database);
    const periodos = await Periodo.find({}).sort({ horaInicio: 1 }).lean();

    return NextResponse.json(
      { status: "success", periodos: periodos.map(normalizePeriodo) },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message, status: "error" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session?.database) return unauthorized();

    const { periodo } = await request.json();
    const Periodo = await getPeriodoModel(session.database);
    const newPeriodo = await Periodo.create(normalizePeriodo(periodo));

    return NextResponse.json(
      {
        message: "Periodo creado exitosamente",
        status: "success",
        periodo: newPeriodo,
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

export async function PATCH(request) {
  try {
    const session = await getSession();
    if (!session?.database) return unauthorized();

    const { id, periodo } = await request.json();
    if (!id)
      return NextResponse.json(
        { error: "id es requerido", status: "error" },
        { status: 400 },
      );

    const Periodo = await getPeriodoModel(session.database);
    const updatedPeriodo = await Periodo.findByIdAndUpdate(
      id,
      normalizePeriodo(periodo),
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).lean();

    if (!updatedPeriodo) {
      return NextResponse.json(
        { error: "Periodo no encontrado", status: "error" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { status: "success", periodo: normalizePeriodo(updatedPeriodo) },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message, status: "error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await getSession();
    if (!session?.database) return unauthorized();

    const { id } = await request.json();
    if (!id)
      return NextResponse.json(
        { error: "id es requerido", status: "error" },
        { status: 400 },
      );

    const Periodo = await getPeriodoModel(session.database);
    await Periodo.findByIdAndDelete(id);

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message, status: "error" },
      { status: 500 },
    );
  }
}
