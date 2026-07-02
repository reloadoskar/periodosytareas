import { useEffect, useState } from "react";
import { useAuth } from "@/contextos/authContext";

export default function Signup({ setModoRegistro }) {
  const { credenciales, setCredenciales, signup, error } = useAuth();
  const [passwordError, setPasswordError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordError) return;

    const res = await signup(credenciales);
    if (res.status === "success") {
      setModoRegistro(false);
    }
  };

  useEffect(() => {
    if (!credenciales.confirmPassword) {
      setPasswordError(null);
      return;
    }

    setPasswordError(
      credenciales.password !== credenciales.confirmPassword
        ? "Las contraseñas no coinciden"
        : null,
    );
  }, [credenciales.password, credenciales.confirmPassword]);

  return (
    <div className="w-full justify-center flex flex-col items-center">
      <h1 className="text-2xl font-black mb-2">Registro</h1>
      <form
        className="bg-gray-950 p-6 rounded-lg shadow-md w-full max-w-sm justify-center"
        onSubmit={handleSubmit}
      >
        <div className="mb-4 flex flex-col m-auto">
          <label
            className="block text-gray-300 text-sm font-bold mb-2"
            htmlFor="signup-email"
          >
            Correo
          </label>
          <input
            className="input"
            id="signup-email"
            onChange={(e) =>
              setCredenciales({ ...credenciales, email: e.target.value })
            }
            placeholder="Ingresa tu correo electrónico"
            required
            type="email"
            value={credenciales.email}
          />
        </div>
        <div className="mb-6 flex flex-col m-auto">
          <label
            className="block text-gray-300 text-sm font-bold mb-2"
            htmlFor="signup-password"
          >
            Contraseña
          </label>
          <input
            className="input"
            id="signup-password"
            onChange={(e) =>
              setCredenciales({ ...credenciales, password: e.target.value })
            }
            placeholder="Ingresa tu contraseña"
            required
            type="password"
            value={credenciales.password}
          />
        </div>
        <div className="mb-6 flex flex-col m-auto">
          <label
            className="block text-gray-300 text-sm font-bold mb-2"
            htmlFor="confirmPassword"
          >
            Confirmar Contraseña
          </label>
          <input
            className="input"
            id="confirmPassword"
            onChange={(e) =>
              setCredenciales({
                ...credenciales,
                confirmPassword: e.target.value,
              })
            }
            placeholder="Confirma tu contraseña"
            required
            type="password"
            value={credenciales.confirmPassword}
          />
        </div>
        {passwordError ? (
          <div className="text-red-500 text-sm mb-4 text-center">
            {passwordError}
          </div>
        ) : null}
        {error ? (
          <div className="text-red-500 mb-4 text-center">{error}</div>
        ) : null}
        <div className="flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!!passwordError}
            type="submit"
          >
            Registrarse
          </button>
        </div>
      </form>
      <div className="mt-4 text-center">
        <button
          className="cursor-pointer text-blue-400 hover:text-blue-300"
          onClick={() => setModoRegistro(false)}
          type="button"
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
}
