import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { TareaSchema } from "@/models/tarea";
import { dbConnect } from "@/utils/connection";
import { getDateKey, normalizeTask, reorderTasks } from "@/utils/tareas";

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

const getTareaModel = async (database) => {
  const conn = await dbConnect(database);
  return conn.models.Tarea || conn.model("Tarea", TareaSchema);
};

const serializeTask = (task) => ({
  ...task,
  _id: task._id?.toString?.() ?? task._id,
  periodoId: task.periodoId?.toString?.() ?? task.periodoId,
});

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session?.database) return unauthorized();

    const { searchParams } = new URL(request.url);
    const periodoId = searchParams.get("periodoId");
    const fecha = searchParams.get("fecha") ?? getDateKey();
    const history = searchParams.get("history") === "true";

    const query = {};
    if (periodoId) query.periodoId = periodoId;
    if (history) {
      query.fecha = { $ne: fecha };
    } else {
      query.fecha = fecha;
    }

    const Tarea = await getTareaModel(session.database);
    const tareas = await Tarea.find(query)
      .sort(
        history
          ? { fecha: -1, order: 1, createdAt: 1 }
          : { order: 1, createdAt: 1 },
      )
      .lean();

    return NextResponse.json(
      { status: "success", tareas: tareas.map(serializeTask) },
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

    const { tarea } = await request.json();
    if (!tarea?.periodoId) {
      return NextResponse.json(
        { error: "periodoId es requerido", status: "error" },
        { status: 400 },
      );
    }

    const Tarea = await getTareaModel(session.database);
    const fecha = tarea.fecha ?? getDateKey();
    const order = await Tarea.countDocuments({
      periodoId: tarea.periodoId,
      fecha,
    });
    const newTarea = await Tarea.create(normalizeTask(tarea, { fecha, order }));

    return NextResponse.json(
      {
        message: "Tarea creada exitosamente",
        status: "success",
        tarea: serializeTask(newTarea.toObject()),
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

    const { id, tarea, direction } = await request.json();
    if (!id) {
      return NextResponse.json(
        { error: "id es requerido", status: "error" },
        { status: 400 },
      );
    }

    const Tarea = await getTareaModel(session.database);

    if (Number.isInteger(direction)) {
      const currentTask = await Tarea.findById(id).lean();
      if (!currentTask) {
        return NextResponse.json(
          { error: "Tarea no encontrada", status: "error" },
          { status: 404 },
        );
      }

      const sameDayTasks = await Tarea.find({
        periodoId: currentTask.periodoId,
        fecha: currentTask.fecha,
      })
        .sort({ order: 1, createdAt: 1 })
        .lean();
      const reordered = reorderTasks(
        sameDayTasks.map(serializeTask),
        id,
        direction,
      );
      await Promise.all(
        reordered.map((task) =>
          Tarea.findByIdAndUpdate(task._id, { order: task.order }),
        ),
      );

      return NextResponse.json(
        { status: "success", tareas: reordered },
        { status: 200 },
      );
    }

    const update = normalizeTask(tarea, {});
    delete update._id;
    const updatedTarea = await Tarea.findByIdAndUpdate(id, update, {
      returnDocument: "after",
      runValidators: true,
    }).lean();

    if (!updatedTarea) {
      return NextResponse.json(
        { error: "Tarea no encontrada", status: "error" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { status: "success", tarea: serializeTask(updatedTarea) },
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
    if (!id) {
      return NextResponse.json(
        { error: "id es requerido", status: "error" },
        { status: 400 },
      );
    }

    const Tarea = await getTareaModel(session.database);
    await Tarea.findByIdAndDelete(id);

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message, status: "error" },
      { status: 500 },
    );
  }
}
