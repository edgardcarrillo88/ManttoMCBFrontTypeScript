import { ProtectedRouteComponent } from "@/components/protected-route";

export default function page() {
  return (
    <ProtectedRouteComponent password="1234">
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col items-center">
        <div className="mt-8 w-5/6 h-[50rem] ">
          <h1 className="text-4xl font-bold text-white text-center">
            Dashboard Indicadores Diarios
          </h1>
          <div className="w-full h-full mt-8">
            <iframe
              title="Report Section"
              width="100%"
              height="100%"
              src="https://app.powerbi.com/view?r=eyJrIjoiZjBiZmUwOGUtMTU1ZS00YTI5LWI3ZTktYjhiZTE0NWRmZGY0IiwidCI6IjAwMDE1ZDkyLTIxYWQtNDhhOC04NDQ1LWE3ZDY4YmY4OTliZCIsImMiOjR9"
              frameBorder={1}
              allowFullScreen={true}


            ></iframe>
          </div>
        </div>
      </div>
    </ProtectedRouteComponent>
  );
}

