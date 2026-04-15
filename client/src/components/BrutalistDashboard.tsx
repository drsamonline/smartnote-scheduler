import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

interface BrutalistDashboardProps {
  children: React.ReactNode;
  currentCategory?: string;
  categoryCounts?: Record<string, number>;
}

export function BrutalistDashboard({ children, currentCategory, categoryCounts = {} }: BrutalistDashboardProps) {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  const categories = [
    { name: "Tasks", icon: "✓", color: "bg-blue-600" },
    { name: "Deadlines", icon: "⏰", color: "bg-red-600" },
    { name: "Schedule", icon: "📅", color: "bg-green-600" },
    { name: "Thoughts", icon: "💭", color: "bg-purple-600" },
    { name: "Learning", icon: "📚", color: "bg-yellow-600" },
  ];

  if (!user) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-7xl font-bold text-white mb-8">SMARTNOTE</h1>
          <div className="w-full h-1 bg-red-600 my-8"></div>
          <p className="text-white text-2xl mb-8">SCHEDULER</p>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-4"
          >
            ENTER
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-64 border-r-2 border-white p-8 flex flex-col">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">SMARTNOTE</h1>
          <div className="h-0.5 bg-red-600 w-full mb-4"></div>
          <p className="text-sm font-bold tracking-widest">SCHEDULER</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-4">
          <button
            onClick={() => navigate("/")}
            className={`w-full text-left px-4 py-3 font-bold text-lg transition-colors ${
              !currentCategory
                ? "bg-red-600 text-white"
                : "hover:bg-gray-900 text-white"
            }`}
          >
            ALL NOTES
          </button>

          <button
            onClick={() => navigate("/search")}
            className="w-full text-left px-4 py-3 font-bold text-lg transition-colors hover:bg-gray-900 text-white"
          >
            SEARCH
          </button>

          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate(`/category/${cat.name}`)}
              className={`w-full text-left px-4 py-3 font-bold text-lg transition-colors flex items-center justify-between gap-3 ${
                currentCategory === cat.name
                  ? "bg-red-600 text-white"
                  : "hover:bg-gray-900 text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`${cat.color} w-8 h-8 flex items-center justify-center text-white font-bold`}>
                  {cat.icon}
                </span>
                {cat.name.toUpperCase()}
              </div>
              <span className="text-sm font-bold text-gray-300">
                {categoryCounts[cat.name] || 0}
              </span>
            </button>
          ))}
        </nav>

        {/* Divider */}
        <div className="h-0.5 bg-red-600 w-full my-8"></div>

        {/* User Info */}
        <div className="space-y-4">
          <div className="border-2 border-white p-4">
            <p className="text-xs font-bold tracking-widest text-gray-400">USER</p>
            <p className="text-lg font-bold truncate">{user.name || user.email}</p>
          </div>
          <Button
            onClick={() => logout()}
            variant="outline"
            className="w-full border-2 border-white text-white hover:bg-red-600 hover:border-red-600 font-bold"
          >
            <LogOut className="w-4 h-4 mr-2" />
            LOGOUT
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
