import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  ScanFace,
  UtensilsCrossed,
  ShoppingCart,
  CalendarDays,
  HeartPulse,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Brain,
  Eye,
  Timer,
} from 'lucide-react';
import Button from '../components/ui/Button';

const features = [
  {
    title: 'Body Scan',
    description: 'AI-powered body composition analysis from a single photo.',
    icon: <ScanFace className="w-6 h-6" />,
    gradient: 'from-primary to-emerald-400',
  },
  {
    title: 'Meal Scanner',
    description: 'Snap your meal. Get instant calorie and macro breakdowns.',
    icon: <UtensilsCrossed className="w-6 h-6" />,
    gradient: 'from-accent-blue to-cyan-400',
  },
  {
    title: 'Grocery Scanner',
    description: 'Analyze your grocery cart for healthier alternatives.',
    icon: <ShoppingCart className="w-6 h-6" />,
    gradient: 'from-accent-purple to-pink-400',
  },
  {
    title: 'Recovery Coach',
    description: 'Personalized recovery plans based on how you feel.',
    icon: <HeartPulse className="w-6 h-6" />,
    gradient: 'from-primary to-teal-400',
  },
  {
    title: 'Meal Planner',
    description: 'Budget-friendly meal plans tailored to your goals.',
    icon: <CalendarDays className="w-6 h-6" />,
    gradient: 'from-accent-blue to-indigo-400',
  },
  {
    title: 'AI Coach',
    description: 'Chat with your personal AI fitness assistant anytime.',
    icon: <MessageCircle className="w-6 h-6" />,
    gradient: 'from-accent-purple to-violet-400',
  },
];

const benefits = [
  {
    icon: <Timer className="w-5 h-5" />,
    title: 'Lightning Fast',
    description: 'Get results in seconds, not hours.',
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: 'Personalized',
    description: 'Every recommendation is tailored to you.',
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: 'AI Powered',
    description: 'Built on cutting-edge AI models.',
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: 'Vision Enabled',
    description: 'Understands images like a human expert.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-primary overflow-hidden">
      {/* ==================== NAV ==================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="text-base font-bold text-text-primary">beFit AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              Log In
            </Button>
            <Button size="sm" onClick={() => navigate('/dashboard')}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* ==================== HERO ==================== */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-primary/8 via-accent-blue/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary font-medium mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              Powered by Advanced AI
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
          >
            <span className="text-text-primary">Your </span>
            <span className="gradient-text">AI Fitness</span>
            <br />
            <span className="text-text-primary">Copilot</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Analyze meals, scan groceries, track recovery, and get personalized
            fitness coaching — all powered by AI vision and intelligence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              onClick={() => navigate('/dashboard')}
            >
              Get Started Free
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/dashboard')}
            >
              View Demo
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold text-primary tracking-wider uppercase mb-3">
              Features
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Everything you need to optimize fitness
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-text-secondary max-w-xl mx-auto">
              Six powerful AI tools working together to help you reach your health goals faster.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="group relative bg-bg-secondary rounded-2xl border border-border p-7 hover:border-border-hover transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300"
                  style={{
                    backgroundImage: `linear-gradient(135deg, var(--color-primary), var(--color-accent-blue))`,
                  }}
                />
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-5`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== BENEFITS ==================== */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold text-accent-blue tracking-wider uppercase mb-3">
              Why beFit?
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-bold text-text-primary">
              Built different
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-bg-secondary border border-border flex items-center justify-center text-primary mx-auto mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-1.5">{benefit.title}</h3>
                <p className="text-sm text-text-muted">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl bg-gradient-to-br from-bg-secondary to-bg-tertiary border border-border p-10 sm:p-14 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent-blue/5 pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                Ready to transform your fitness?
              </h2>
              <p className="text-text-secondary mb-8 max-w-md mx-auto">
                Join thousands using AI to optimize their health, nutrition, and recovery.
              </p>
              <Button
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                onClick={() => navigate('/dashboard')}
              >
                Start for Free
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-sm font-semibold text-text-primary">beFit AI</span>
          </div>
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} beFit AI. Built with ♥ for a healthier world.
          </p>
        </div>
      </footer>
    </div>
  );
}
