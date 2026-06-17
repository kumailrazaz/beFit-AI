import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanFace,
  UtensilsCrossed,
  HeartPulse,
  MessageCircle,
} from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Scan', href: '/body-scan', icon: ScanFace },
  { label: 'Meals', href: '/meal-scan', icon: UtensilsCrossed },
  { label: 'Recovery', href: '/recovery', icon: HeartPulse },
  { label: 'Coach', href: '/chat', icon: MessageCircle },
];

export default function BottomNav() {
  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-50
        bg-bg-secondary/95 backdrop-blur-xl
        border-t border-border
        px-2 pb-[env(safe-area-inset-bottom)]
      "
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) => `
              flex flex-col items-center justify-center gap-1 flex-1 py-1
              transition-colors duration-200
              ${isActive ? 'text-primary' : 'text-text-muted'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon className="w-5 h-5" />
                <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-text-muted'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute top-0 w-8 h-0.5 rounded-full bg-primary" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
