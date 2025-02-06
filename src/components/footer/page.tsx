"use client"
import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Home,
  Clipboard,
  Users,
  Settings,
  BarChart2,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Equipment", href: "/equipment" },
    { name: "Tasks", href: "/tasks", icon: Clipboard },
    { name: "Team", href: "/team", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p>&copy; 2023 Marcobre. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a
                href="https://linkedin.com/in/edgard-carrillo-iparraguirre-pmp®-mba-5a953755"
                target="_blank"
                className="text-gray-400 hover:text-white transition duration-150 ease-in-out"
              >
                Developed by Edgard Carrillo
              </a>
              {/* <a
                href="#"
                className="text-gray-400 hover:text-white transition duration-150 ease-in-out"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition duration-150 ease-in-out"
              >
                Contact Us
              </a> */}
            </div>
          </div>
        </div>
      </footer>
  );
}
