"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LockIcon } from "lucide-react";
import axios from "axios";

type ResponseData = {
  datos: any;
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  empresa: string;
  OnResponse?: (status: number, datos: ResponseData) => void; //######################################
}

export function ProtectedRouteComponentemail({
  children,
  empresa,
  OnResponse,
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkUserAccess = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/data/validateusers`,
            { params: { user: session.user.email } }
          );

          console.log(response.data.response[0]);

          if (
            response.status === 200 &&
            (response.data.response[0].empresa === empresa ||
              empresa === "Todos")
          ) {
            if (OnResponse) {
              const objectUser = {
                email: response.data.response[0].correo,
                empresa: response.data.response[0].empresa,
              }
              OnResponse(response.status, {datos: objectUser});
            }
            setIsAuthorized(true);
          } else {
            setError("You are not authorized to access this page.");
            router.push("/unauthorized");
          }
        } catch (err) {
          setError("An error occurred while checking access.");
          router.push("/unauthorized");
        }
      } else if (status === "unauthenticated") {
        router.push("/api/auth/signin");
      }
    };

    checkUserAccess();
  }, [session, status, router]);

  if (status === "loading" || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800 text-white border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
              <LockIcon className="mr-2" /> Checking Access
            </CardTitle>
            <CardDescription className="text-gray-400 text-center">
              {error || "Verificando acceso de usuario..."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
