import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ScanFace,
  UtensilsCrossed,
  ShoppingCart,
  CalendarDays,
  HeartPulse,
  MessageCircle,
  Zap,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Body Scan', href: '/body-scan', icon: ScanFace },
  { label: 'Meal Scan', href: '/meal-scan', icon: UtensilsCrossed },
  { label: 'Grocery', href: '/grocery', icon: ShoppingCart },
  { label: 'Planner', href: '/planner', icon: CalendarDays },
  { label: 'Recovery', href: '/recovery', icon: HeartPulse },
  { label: 'AI Coach', href: '/chat', icon: MessageCircle },
];

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="
        fixed left-0 top-0 bottom-0 w-[260px] z-40
        bg-bg-secondary border-r border-border
        flex flex-col
      "
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-base font-bold text-text-primary tracking-tight">beFit</h1>
          <p className="text-[10px] text-text-muted font-medium tracking-widest uppercase">AI Copilot</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-200 group
              ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-muted hover:text-text-primary hover:bg-bg-tertiary'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-[18px] h-[18px] ${isActive ? 'text-primary' : 'text-text-muted group-hover:text-text-secondary'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center text-sm font-bold text-bg-primary">
            B
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">beFit</p>
            <p className="text-xs text-text-muted">Free Plan</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
