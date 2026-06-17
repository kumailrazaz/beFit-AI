import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  gradient?: 'green' | 'blue' | 'purple';
}

const gradientMap = {
  green: {
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    hoverBorder: 'hover:border-primary/30',
    arrowColor: 'text-primary',
    glowBg: 'group-hover:bg-primary/5',
  },
  blue: {
    iconBg: 'bg-accent-blue/10',
    iconColor: 'text-accent-blue',
    hoverBorder: 'hover:border-accent-blue/30',
    arrowColor: 'text-accent-blue',
    glowBg: 'group-hover:bg-accent-blue/5',
  },
  purple: {
    iconBg: 'bg-accent-purple/10',
    iconColor: 'text-accent-purple',
    hoverBorder: 'hover:border-accent-purple/30',
    arrowColor: 'text-accent-purple',
    glowBg: 'group-hover:bg-accent-purple/5',
  },
};

export default function FeatureCard({
  title,
  description,
  icon,
  href,
  gradient = 'green',
}: FeatureCardProps) {
  const navigate = useNavigate();
  const colors = gradientMap[gradient];

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25 }}
      onClick={() => navigate(href)}
      className={`
        group relative bg-bg-secondary rounded-xl border border-border p-6
        cursor-pointer transition-all duration-300
        ${colors.hoverBorder}
        overflow-hidden
      `}
    >
      {/* Glow background on hover */}
      <div className={`absolute inset-0 ${colors.glowBg} transition-colors duration-300`} />

      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center ${colors.iconColor} mb-4`}>
          {icon}
        </div>

        <h3 className="text-base font-semibold text-text-primary mb-2">{title}</h3>
        <p className="text-sm text-text-muted leading-relaxed mb-4">{description}</p>

        <div className={`flex items-center gap-1.5 text-sm font-medium ${colors.arrowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
          <span>Get started</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </motion.div>
  );
}
