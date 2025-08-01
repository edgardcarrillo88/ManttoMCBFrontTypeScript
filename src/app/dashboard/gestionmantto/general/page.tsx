import { ProtectedRouteComponent } from "@/components/protected-route";

export default function page() {
  return (
    <ProtectedRouteComponent password={process.env.NEXT_PUBLIC_PASSWORD_PAGES!}>
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col items-center">
        <div className="mt-8 w-5/6 h-[50rem] mb-8">
          <h1 className="text-4xl font-bold text-white text-center">
            Dashboard Indicadores Mantenimiento General
          </h1>
          <div className="w-full h-full mt-8">
            <iframe
              title="Report Section"
              width="100%"
              height="100%"
              src="https://app.powerbi.com/view?r=eyJrIjoiOWQzNWUxYTEtOTRhYS00YmEzLTg3N2EtYjMyOTJjNWJlYjBkIiwidCI6IjAwMDE1ZDkyLTIxYWQtNDhhOC04NDQ1LWE3ZDY4YmY4OTliZCIsImMiOjR9"
              frameBorder={1}
              allowFullScreen={true}
            ></iframe>
          </div>
        </div>
      </div>
    </ProtectedRouteComponent>
  );
}
