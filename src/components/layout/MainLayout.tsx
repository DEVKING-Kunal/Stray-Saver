
import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Camera, User, Settings, FileText, DollarSign } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

type MainLayoutProps = {
  children: ReactNode;
  hideNav?: boolean;
};

const MainLayout = ({ children, hideNav = false }: MainLayoutProps) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const { signOut } = useAuth();

  const navItems = [
    { to: "/report", icon: Camera, label: "Report" },
    { to: "/dashboard", icon: FileText, label: "Current" },
    { to: "/subscription", icon: DollarSign, label: "Sponsor" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-30 glass">
        <div className="container flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-bold text-primary">Stray Saver</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container px-4 py-4 animate-fade-in">
        {children}
      </main>

      {!hideNav && (
        <nav className="sticky bottom-0 glass z-30 px-4 py-2">
          <ul className="flex justify-between">
            {navItems.map((item) => (
              <li key={item.to} className="flex-1">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex flex-col items-center justify-center py-2 text-xs",
                      isActive
                        ? "text-primary font-medium"
                        : "text-muted-foreground"
                    )
                  }
                >
                  <item.icon
                    className={cn(
                      "h-6 w-6 mb-1",
                      location.pathname === item.to
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default MainLayout;
