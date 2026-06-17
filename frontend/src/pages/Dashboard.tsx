import { motion } from 'framer-motion';
import {
  ScanFace,
  UtensilsCrossed,
  ShoppingCart,
  CalendarDays,
  HeartPulse,
  MessageCircle,
  Activity,
  TrendingUp,
  Flame,
  Zap,
} from 'lucide-react';
import FeatureCard from '../components/ui/FeatureCard';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';

const featureCards = [
  {
    title: 'Body Scan',
    description: 'AI body composition analysis from a photo.',
    icon: <ScanFace className="w-5 h-5" />,
    href: '/body-scan',
    gradient: 'green' as const,
  },
  {
    title: 'Meal Scanner',
    description: 'Instant calorie and macro breakdowns.',
    icon: <UtensilsCrossed className="w-5 h-5" />,
    href: '/meal-scan',
    gradient: 'blue' as const,
  },
  {
    title: 'Grocery Scanner',
    description: 'Analyze your cart for healthier options.',
    icon: <ShoppingCart className="w-5 h-5" />,
    href: '/grocery',
    gradient: 'purple' as const,
  },
  {
    title: 'Meal Planner',
    description: 'Budget-friendly plans for your goals.',
    icon: <CalendarDays className="w-5 h-5" />,
    href: '/planner',
    gradient: 'blue' as const,
  },
  {
    title: 'Recovery Coach',
    description: 'Personalized recovery recommendations.',
    icon: <HeartPulse className="w-5 h-5" />,
    href: '/recovery',
    gradient: 'green' as const,
  },
  {
    title: 'AI Coach',
    description: 'Chat with your AI fitness assistant.',
    icon: <MessageCircle className="w-5 h-5" />,
    href: '/chat',
    gradient: 'purple' as const,
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Dashboard() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-6xl mx-auto"
    >
      {/* Greeting */}
      <motion.div variants={item}>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">{greeting} 👋</h1>
        <p className="text-text-secondary mt-1">Here&apos;s your fitness overview for today.</p>
      </motion.div>

      {/* Today's Recommendation */}
      <motion.div variants={item}>
        <Card glass className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent-blue/10 pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">Today&apos;s Recommendation</p>
              <h3 className="text-lg font-semibold text-text-primary">
                Try a 30-minute HIIT session today
              </h3>
              <p className="text-sm text-text-muted mt-1">
                Based on your recovery score, you&apos;re ready for high-intensity training.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Health Score"
          value="87/100"
          icon={<Activity className="w-5 h-5" />}
          color="green"
          trend="up"
        />
        <StatCard
          label="Calories Today"
          value="1,840"
          icon={<Flame className="w-5 h-5" />}
          color="blue"
          trend="neutral"
        />
        <StatCard
          label="Recovery"
          value="92%"
          icon={<HeartPulse className="w-5 h-5" />}
          color="purple"
          trend="up"
        />
        <StatCard
          label="Streak"
          value="12 days"
          icon={<TrendingUp className="w-5 h-5" />}
          color="green"
          trend="up"
        />
      </motion.div>

      {/* Feature Grid */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-text-primary">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureCards.map((card) => (
            <FeatureCard key={card.title} {...card} />
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={item}>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h2>
        <Card>
          <div className="space-y-4">
            {[
              { text: 'Meal scanned — Grilled Chicken Salad', time: '2 hours ago', icon: <UtensilsCrossed className="w-4 h-4" /> },
              { text: 'Recovery plan generated', time: '5 hours ago', icon: <HeartPulse className="w-4 h-4" /> },
              { text: 'Body scan completed', time: 'Yesterday', icon: <ScanFace className="w-4 h-4" /> },
            ].map((activity, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 ${i !== 2 ? 'pb-4 border-b border-border' : ''}`}
              >
                <div className="w-9 h-9 rounded-xl bg-bg-tertiary flex items-center justify-center text-text-muted">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary">{activity.text}</p>
                  <p className="text-xs text-text-muted">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
