// middleware para checar cookies, verificar token, etc. (si es necesario)
// Por ahora no se necesita, pero se puede agregar en el futuro si se implementa autenticación o algo similar.
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function middleware(request) {
    //obtenemos la cookie de autenticación (si es que existe) como un jwt
    const cookieStore = await cookies()
    const jwt = cookieStore.get("authToken")?.value || null;
    // Si no hay token, simplemente continuamos con la solicitud, *podria redireccionar si es necesario mas adelante a un a ruta tipo /login o algo asi*
    if (!jwt) {
        console.log("No se encontró token, continuando sin autenticación");
        return NextResponse.next();
    }
    // console.log("Middleware ejecutado, token:", jwt);
    // intentamos validar el token, si es valido, continuamos con la solicitud, si no, eliminamos la cookie y continuamos (o redireccionamos a login)
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(jwt, secret);
        return NextResponse.next();
    } catch (error) {
        // Si el token no es válido, eliminamos la cookie y continuamos
        const response = NextResponse.next();
        response.cookies.delete("authToken");
        return response;
    }
}
// agregamos un matcher en configuración para que este middleware solo se ejecute en rutas específicas, 
// por ejemplo, si implementamos autenticación, podríamos querer que solo se ejecute en rutas protegidas

export const config = {
    matcher: ["//:path*"], // Solo se ejecuta en rutas que comienzan con /
};