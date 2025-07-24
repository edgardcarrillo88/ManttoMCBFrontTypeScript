import { ProtectedRouteComponent } from "@/components/protected-route";
import {ProtectedRouteComponentemail} from "@/components/protected-route-email";
 
export default function page() {
  return (
    <ProtectedRouteComponentemail empresa="Marcobre">
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col items-center">
        <div className="mt-8 w-5/6 h-[50rem] ">
          <h1 className="text-4xl font-bold text-white text-center">
            Dashboard Seguridad Parada de Planta
          </h1>
          <div className="w-full h-full mt-8">
            <iframe
              title="Report Section"
              width="100%"
              height="100%"
              src="https://app.powerbi.com/view?r=eyJrIjoiYTU3ZWQ3MDctMTk2NC00N2IyLWI1MzEtMDk4OTczMzczYjU2IiwidCI6IjAwMDE1ZDkyLTIxYWQtNDhhOC04NDQ1LWE3ZDY4YmY4OTliZCIsImMiOjR9&pageName=ReportSection"
              frameBorder={1}
              allowFullScreen={true}


            ></iframe>
          </div>
        </div>
      </div>
    </ProtectedRouteComponentemail>
  );
}
