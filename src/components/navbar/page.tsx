"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Home,
  Clipboard,
  Users,
  Settings,
  NotebookPen,
  Gauge,
  Wrench,
  House,
  CircleDollarSign,
  CircleUser,
} from "lucide-react";
import { signIn, useSession, signOut } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();
  // console.log(session?.user?.name);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/", icon: House },
    { name: "Parada Planta", href: "/paradadeplanta", icon: Wrench },
    { name: "Reportes", href: "/reportes", icon: NotebookPen },
    { name: "Costos", href: "/costos", icon: CircleDollarSign },
    // { name: "Dashboards", href: "/dashboard", icon: Gauge },
    { name: "Dashboards", href: "/dashboard", icon: Gauge },
    { name: "Configuraciones", href: "/settings", icon: Settings },
    { name: "Sesion", href: "/settings", icon: CircleUser },
  ];

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <span className="text-xl font-bold">
                  Mantenimiento Marcobre
                </span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.name === "Sesion" ? "/api/auth/signin" : item.href}
                    onClick={
                      item.name === "Sesion" && session?.user?.name
                        ? () => signOut()
                        : undefined
                    }
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition duration-150 ease-in-out"
                  >
                    <item.icon className="inline-block w-5 h-5 mr-2" />
                    {item.name === "Sesion" && session?.user?.name
                      ? session?.user?.name
                      : item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.name === "Sesion" ? "/api/auth/signin" : item.href}
                  onClick={
                    item.name === "Sesion" && session?.user?.name
                      ? () => signOut()
                      : undefined
                  }
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 transition duration-150 ease-in-out"
                >
                  <item.icon className="inline-block w-5 h-5 mr-2" />
                  {item.name === "Sesion" && session?.user?.name
                    ? session?.user?.name
                    : item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
