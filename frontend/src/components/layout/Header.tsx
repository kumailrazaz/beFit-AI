import { useLocation } from 'react-router-dom';
import { Search, Bell, Zap } from 'lucide-react';
import { useIsMobile } from '../../hooks/useMediaQuery';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/body-scan': 'Body Scan',
  '/meal-scan': 'Meal Scanner',
  '/grocery': 'Grocery Scanner',
  '/planner': 'Meal Planner',
  '/recovery': 'Recovery Coach',
  '/chat': 'AI Coach',
};

export default function Header() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const title = pageTitles[location.pathname] || 'beFit AI';

  return (
    <header className="sticky top-0 z-30 bg-bg-primary/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Left side */}
        <div className="flex items-center gap-3">
          {isMobile && (
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
          )}
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-[18px] h-[18px]" />
          </button>

          {/* Notifications */}
          <button
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
          </button>

          {/* Avatar */}
          <button
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-sm font-bold text-white cursor-pointer"
            aria-label="Profile"
          >
            U
          </button>
        </div>
      </div>
    </header>
  );
}
