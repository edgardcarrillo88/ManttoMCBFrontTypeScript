import { ProtectedRouteComponent } from "@/components/protected-route";

export default function page() {
  return (
    <ProtectedRouteComponent password={process.env.NEXT_PUBLIC_PASSWORD_PAGES!}>
      <div>
        <h1>Costos</h1>
      </div>
    </ProtectedRouteComponent>
  );
}
