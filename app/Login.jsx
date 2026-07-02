//login basico para acceder a la aplicacion
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contextos/authContext';
import Signup from './Signup';

export default function Login() {
    const { credenciales, setCredenciales, login, error } = useAuth()
    const [modoRegistro, setModoRegistro] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        login()
            .then(() => {
                // Aquí puedes redirigir al usuario a otra página después del login exitoso
                // console.log("Login exitoso");
            })
            .catch((err) => {
                console.error("Error en login:", err);
            });
    }

    return (
        <div className="fixed top-0 left-0 flex flex-col items-center justify-center w-full h-full bg-slate-800/95 text-white">
            {!modoRegistro ? (
                <div className="w-full justify-center flex flex-col items-center">
                    <h1 className="text-2xl font-black mb-2">Inicia Sesión</h1>
                    <form onSubmit={handleSubmit}
                        className="bg-gray-950 p-6 rounded-lg shadow-md w-full max-w-sm justify-center">
                        <div className="mb-4 flex flex-col m-auto">
                            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="username">
                                Nombre de usuario
                            </label>
                            <input
                                className="input"
                                id="email"
                                type="email"
                                placeholder="Ingresa tu correo electrónico"
                                value={credenciales.email}
                                required
                                onChange={(e) => setCredenciales({ ...credenciales, email: e.target.value })}
                            />
                        </div>
                        <div className="mb-6 flex flex-col m-auto">
                            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                                Contraseña
                            </label>
                            <input
                                className="input"
                                id="password"
                                type="password"
                                placeholder="Ingresa tu contraseña"
                                value={credenciales.password}
                                required
                                onChange={(e) => setCredenciales({ ...credenciales, password: e.target.value })}
                            />
                        </div>
                        {error && (
                            <div className="text-red-500 mb-4 text-center">{error}</div>
                        )}
                        <div className="flex justify-end">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="submit"
                            >
                                Iniciar Sesión
                            </button>
                        </div>
                    </form>
                    <div className="mt-4 text-center">
                        <button className="cursor-pointer text-blue-400 hover:text-blue-300" onClick={() => setModoRegistro(true)}>Registrarse</button>
                    </div>
                </div>
            ) : <Signup setModoRegistro={setModoRegistro} />
            }

        </div>
    )
}