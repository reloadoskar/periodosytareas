// crear pagina de not found personalizada, para que se vea mas bonita y acorde al diseño de la app
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-slate-900 text-white">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-2xl">¡Parece que te has perdido!</p>
      <p className="text-center max-w-md">
        La página que estás buscando no existe. Pero no te preocupes, puedes
        volver a la página principal y seguir organizando tus periodos y tareas.
      </p>
      <a
        href="/"
        className="mt-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition"
      >
        Volver a Inicio
      </a>
    </div>
  );
}
