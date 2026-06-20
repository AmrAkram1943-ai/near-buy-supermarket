import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();

    localStorage.removeItem("supermarket");

    navigate("/login");
  };

  const menu = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "My Orders",
      icon: ShoppingCart,
      path: "/my-orders",
    },

    {
      name: "Analytics",
      icon: FileText,
      path: "/analytics",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
    {
      name: "Logout",
      icon: LogOut,
    },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-gray-800 to-gray-900 p-4 text-white lg:min-h-screen lg:w-64 lg:shrink-0 lg:bg-gradient-to-b">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-green-400">
          Shop Admin
        </h1>

        <p className="text-sm text-gray-400">
          Realtime Dashboard
        </p>
      </div>

      <div className="space-y-3">
        {menu.map((item) => {
          const Icon = item.icon;

          if (item.name === "Logout") {
            return (
              <button
                key={item.name}
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-gray-700"
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl p-3 transition ${
                  isActive
                    ? "bg-green-500 text-white"
                    : "hover:bg-gray-700"
                }`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}