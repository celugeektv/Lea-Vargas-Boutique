import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Comprobar si estamos accediendo a una ruta de /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // Permitir acceso a la pantalla de login
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }

    // Verificar cookie de sesión
    const token = request.cookies.get('admin_token')

    if (!token) {
      // Si no hay token, redirigir al login
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Continuar con la petición normal si todo está correcto
  return NextResponse.next()
}

// Configurar el middleware para que solo se ejecute en las rutas que necesitamos
export const config = {
  matcher: ['/admin/:path*'],
}
