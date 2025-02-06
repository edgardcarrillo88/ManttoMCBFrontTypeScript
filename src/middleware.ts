export { default } from "next-auth/middleware"

export const config = {
    matcher: [
        "/costos/:path*",	
        "/dashboard/:path*",
        "/formhistorial",
        "/loadtemp",
        // "/paradadeplanta",
        "/reportes/andamios/reporte",
        "/planeamiento",
        "/reportes",
        "/settings",
        "/whatsapp",
    ]
}