import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'green' | 'blue' | 'purple' | 'danger';
  className?: string;
}

const colorMap = {
  green: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    glow: 'shadow-glow-green',
    iconBg: 'bg-primary/15',
  },
  blue: {
    bg: 'bg-accent-blue/10',
    text: 'text-accent-blue',
    glow: 'shadow-glow-blue',
    iconBg: 'bg-accent-blue/15',
  },
  purple: {
    bg: 'bg-accent-purple/10',
    text: 'text-accent-purple',
    glow: 'shadow-glow-purple',
    iconBg: 'bg-accent-purple/15',
  },
  danger: {
    bg: 'bg-danger/10',
    text: 'text-danger',
    glow: '',
    iconBg: 'bg-danger/15',
  },
};

const trendIcons = {
  up: <TrendingUp className="w-4 h-4" />,
  down: <TrendingDown className="w-4 h-4" />,
  neutral: <Minus className="w-4 h-4" />,
};

export default function StatCard({
  label,
  value,
  icon,
  trend,
  color = 'green',
  className = '',
}: StatCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`
        bg-bg-secondary rounded-xl border border-border p-5
        hover:border-border-hover transition-all duration-300
        ${colors.glow}
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-text-muted">{label}</p>
          <p className={`text-2xl font-bold ${colors.text}`}>{value}</p>
        </div>
        {icon && (
          <div className={`w-10 h-10 rounded-xl ${colors.iconBg} flex items-center justify-center ${colors.text}`}>
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 mt-3 text-xs ${
          trend === 'up' ? 'text-primary' : trend === 'down' ? 'text-danger' : 'text-text-muted'
        }`}>
          {trendIcons[trend]}
          <span>{trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'}</span>
        </div>
      )}
    </motion.div>
  );
}
