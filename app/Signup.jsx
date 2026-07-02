import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contextos/authContext';

export default function Signup({ setModoRegistro }) {
    const { credenciales, setCredenciales, signup, error } = useAuth()
    const handleSubmit = (e) => {
        e.preventDefault();
        signup(credenciales)
            .then((res) => {
                // Aquí puedes redirigir al usuario a otra página después del registro exitoso
                // console.log(res)
                if (res.status === "success") {
                    setModoRegistro(false);
                    // console.log("Registro exitoso");
                } else {
                    console.error("Error en registro:", res.error);
                }
            })
            .catch((err) => {
                console.error("Error en registro:", err);
            });
    }

    // agrega una funcion para comprarar las contraseñas y mostrar un mensaje de error si no coinciden
    const checkPasswordMatch = () => {
        if (credenciales.password !== credenciales.confirmPassword) {
            return "Las contraseñas no coinciden";
        }
        return null;
    };
    // usa la funcion checkPasswordMatch para mostrar un mensaje de error si las contraseñas no coinciden usa un useEffect para actualizar el mensaje de error cada vez que cambie la contraseña o la confirmacion de contraseña
    const [passwordError, setPasswordError] = useState(null);

    useEffect(() => {
        setPasswordError(checkPasswordMatch());
    }, [credenciales.password, credenciales.confirmPassword]);
    return (
        <div className="w-full justify-center flex flex-col items-center">
            <h1 className="text-2xl font-black mb-2">Registro</h1>
            <form onSubmit={handleSubmit}
                className="bg-gray-950 p-6 rounded-lg shadow-md w-full max-w-sm justify-center">
                <div className="mb-4 flex flex-col m-auto">
                    <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="username">
                        Correo
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
                {/* Crea una confirmacion de contraseña
                    
                 */}
                <div className="mb-6 flex flex-col m-auto">
                    <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="confirmPassword">
                        Confirmar Contraseña
                    </label>
                    <input
                        className="input"
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirma tu contraseña"
                        value={credenciales.confirmPassword}
                        required
                        onChange={(e) => setCredenciales({ ...credenciales, confirmPassword: e.target.value })}
                    />
                </div>
                {passwordError && (
                    <div className="text-red-500 text-sm mb-4 text-center">
                        {passwordError}
                    </div>
                )}
                {error && (
                    <div className="text-red-500 mb-4 text-center">{error}</div>
                )}
                <div className="flex justify-end">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="submit"
                        disabled={!!passwordError} // Deshabilita el botón si hay un error de contraseña
                    >
                        Registrarse
                    </button>
                </div>
            </form>
            <div className="mt-4 text-center">
                <button className="cursor-pointer text-blue-400 hover:text-blue-300" onClick={() => setModoRegistro(false)}>Iniciar Sesión</button>
            </div>
        </div>
    )
}
