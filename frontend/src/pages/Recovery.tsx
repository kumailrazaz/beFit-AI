import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  HeartPulse, Moon, Zap, Brain, Dumbbell, Droplets,
  AlertTriangle, CheckCircle2, Activity,
} from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import Skeleton from '../components/ui/Skeleton';
import { useApi } from '../hooks/useApi';
import { getRecoveryPlan } from '../services/api';
import type { RecoveryRequest } from '../types';

const schema = z.object({
  sleep: z.coerce.number().min(0).max(24, 'Max 24 hours'),
  energy: z.coerce.number().min(1).max(10),
  stress: z.coerce.number().min(1).max(10),
  soreness: z.coerce.number().min(1).max(10),
  water: z.coerce.number().min(0).max(20, 'Max 20 liters'),
});

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function RecoveryPage() {
  const { data, isLoading, error, execute } = useApi(getRecoveryPlan);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoveryRequest>({
    resolver: zodResolver(schema),
    defaultValues: { sleep: 7, energy: 5, stress: 5, soreness: 5, water: 2 },
  });

  const onSubmit = async (formData: RecoveryRequest) => {
    await execute(formData);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div variants={fadeIn}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <HeartPulse className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Recovery Coach</h1>
            <p className="text-sm text-text-muted">Tell us how you feel for a personalized recovery plan</p>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      {!data && (
        <motion.div variants={fadeIn}>
          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Sleep Hours (last night)"
                type="number"
                step="0.5"
                placeholder="e.g. 7.5"
                icon={<Moon className="w-4 h-4" />}
                error={errors.sleep?.message}
                {...register('sleep')}
              />
              <Input
                label="Energy Level (1–10)"
                type="number"
                placeholder="1 = exhausted, 10 = fully energized"
                icon={<Zap className="w-4 h-4" />}
                error={errors.energy?.message}
                {...register('energy')}
              />
              <Input
                label="Stress Level (1–10)"
                type="number"
                placeholder="1 = calm, 10 = very stressed"
                icon={<Brain className="w-4 h-4" />}
                error={errors.stress?.message}
                {...register('stress')}
              />
              <Input
                label="Muscle Soreness (1–10)"
                type="number"
                placeholder="1 = fresh, 10 = very sore"
                icon={<Dumbbell className="w-4 h-4" />}
                error={errors.soreness?.message}
                {...register('soreness')}
              />
              <Input
                label="Water Intake (liters)"
                type="number"
                step="0.5"
                placeholder="e.g. 2.5"
                icon={<Droplets className="w-4 h-4" />}
                error={errors.water?.message}
                {...register('water')}
              />
              <Button type="submit" isLoading={isLoading} fullWidth size="lg" icon={<HeartPulse className="w-5 h-5" />}>
                {isLoading ? 'Generating Plan...' : 'Generate Recovery Plan'}
              </Button>
            </form>
          </Card>
        </motion.div>
      )}

      {error && (
        <motion.div variants={fadeIn}>
          <Card className="border-danger/30 bg-danger/5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-danger">Generation Failed</p>
                <p className="text-sm text-text-muted mt-1">{error.message}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {isLoading && (
        <motion.div variants={fadeIn} className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-bg-secondary rounded-xl border border-border p-6">
              <Skeleton variant="text" width="40%" className="mb-4" />
              <Skeleton lines={2} />
            </div>
          ))}
        </motion.div>
      )}

      {data && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="space-y-6"
        >
          {/* Recovery Score */}
          <motion.div variants={fadeIn}>
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" /> Recovery Score
                </h3>
                <span className={`text-3xl font-bold ${data.score >= 70 ? 'text-primary' : data.score >= 40 ? 'text-warning' : 'text-danger'}`}>
                  {data.score}%
                </span>
              </div>
              <ProgressBar
                value={data.score}
                max={100}
                color={data.score >= 70 ? 'green' : data.score >= 40 ? 'warning' : 'danger'}
                size="lg"
              />
            </Card>
          </motion.div>

          {/* Recommendations */}
          {[
            { title: 'Hydration', icon: <Droplets className="w-4 h-4" />, content: data.hydration, color: 'text-accent-blue' },
            { title: 'Nutrition Advice', icon: <HeartPulse className="w-4 h-4" />, content: data.nutrition, color: 'text-primary' },
            { title: 'Workout Recommendation', icon: <Dumbbell className="w-4 h-4" />, content: data.workout, color: 'text-accent-purple' },
            { title: 'Sleep Advice', icon: <Moon className="w-4 h-4" />, content: data.sleep_advice, color: 'text-warning' },
          ].map((rec) => (
            <motion.div key={rec.title} variants={fadeIn}>
              <Card>
                <h3 className={`text-sm font-semibold ${rec.color} mb-3 flex items-center gap-2`}>
                  {rec.icon} {rec.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{rec.content}</p>
              </Card>
            </motion.div>
          ))}

          <motion.div variants={fadeIn}>
            <Button variant="secondary" fullWidth onClick={() => window.location.reload()}>
              <CheckCircle2 className="w-4 h-4 mr-2" /> Start New Assessment
            </Button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
