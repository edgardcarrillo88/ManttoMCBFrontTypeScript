"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {ProtectedRouteComponentemail} from "@/components/protected-route-email"

export default function SettingsPage() {
  const [users, setUsers] = useState([
    { id: 1, name: "Juan Pérez", email: "juan@example.com", role: "Admin" },
    { id: 2, name: "María López", email: "maria@example.com", role: "User" },
  ]);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [selectedTable, setSelectedTable] = useState("");
  const tables = ["Usuarios", "Pedidos", "Productos"];

  const addUser = () => {
    if (!newUser.name || !newUser.email) return;
    setUsers([...users, { ...newUser, id: users.length + 1, role: "User" }]);
    setNewUser({ name: "", email: "" });
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const deleteTable = () => {
    if (!selectedTable) return;
    if (confirm(`¿Seguro que quieres borrar la tabla ${selectedTable}?`)) {
      console.log(`Tabla ${selectedTable} eliminada`);
      setSelectedTable("");
    }
  };

  return (
    <ProtectedRouteComponentemail empresa="Marcobre">
      <div className="min-h-screen bg-gray-950 flex flex-col items-center p-10 text-white space-y-6">
        <h1 className="text-3xl font-bold">⚙️ Configuración</h1>

        {/* Gestión de Usuarios */}
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>👥 Gestión de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                type="text"
                placeholder="Nombre"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
              />
              <Input
                type="email"
                placeholder="Correo"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
              <Button onClick={addUser}>Agregar</Button>
            </div>
            <ul className="space-y-2">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="flex justify-between bg-gray-800 p-2 rounded"
                >
                  <span>
                    {user.name} - {user.email}
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteUser(user.id)}
                  >
                    Eliminar
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Gestión de Base de Datos */}
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>📂 Base de Datos</CardTitle>
          </CardHeader>
          <CardContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full">
                  {selectedTable || "Selecciona una tabla"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {tables.map((table) => (
                  <DropdownMenuItem
                    key={table}
                    onClick={() => setSelectedTable(table)}
                  >
                    {table}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="destructive"
              className="w-full mt-4"
              disabled={!selectedTable}
              onClick={deleteTable}
            >
              Borrar {selectedTable || "Tabla"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </ProtectedRouteComponentemail>
  );
}
