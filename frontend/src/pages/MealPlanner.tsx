import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarDays, DollarSign, Target, Globe, AlertTriangle, CheckCircle2, ShoppingCart, Flame, Beef } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import { useApi } from '../hooks/useApi';
import { generateMealPlan } from '../services/api';
import type { MealPlanRequest } from '../types';

const schema = z.object({
  budget: z.coerce.number().min(1, 'Budget must be at least $1').max(1000, 'Budget too high'),
  goal: z.string().min(1, 'Goal is required'),
  country: z.string().min(1, 'Country is required'),
});

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function MealPlannerPage() {
  const { data, isLoading, error, execute } = useApi(generateMealPlan);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MealPlanRequest>({
    resolver: zodResolver(schema),
    defaultValues: { budget: 50, goal: '', country: '' },
  });

  const onSubmit = async (formData: MealPlanRequest) => {
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
          <div className="w-10 h-10 rounded-xl bg-accent-blue/15 flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-accent-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Meal Planner</h1>
            <p className="text-sm text-text-muted">Generate budget-friendly meal plans for your goals</p>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      {!data && (
        <motion.div variants={fadeIn}>
          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Daily Budget ($)"
                type="number"
                placeholder="e.g. 30"
                icon={<DollarSign className="w-4 h-4" />}
                error={errors.budget?.message}
                {...register('budget')}
              />
              <Input
                label="Fitness Goal"
                placeholder="e.g. Muscle gain, Fat loss, Maintenance"
                icon={<Target className="w-4 h-4" />}
                error={errors.goal?.message}
                {...register('goal')}
              />
              <Input
                label="Country / Region"
                placeholder="e.g. United States, Pakistan, India"
                icon={<Globe className="w-4 h-4" />}
                error={errors.country?.message}
                {...register('country')}
              />
              <Button type="submit" isLoading={isLoading} fullWidth size="lg" icon={<CalendarDays className="w-5 h-5" />}>
                {isLoading ? 'Generating Plan...' : 'Generate Meal Plan'}
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
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-bg-secondary rounded-xl border border-border p-6">
              <Skeleton variant="text" width="30%" className="mb-4" />
              <Skeleton lines={3} />
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
          <motion.div variants={fadeIn} className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">Your Meal Plan</h2>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeIn} className="grid grid-cols-3 gap-4">
            <StatCard label="Total Calories" value={data.calories} icon={<Flame className="w-5 h-5" />} color="green" />
            <StatCard label="Protein" value={`${data.protein}g`} icon={<Beef className="w-5 h-5" />} color="blue" />
            <StatCard label="Total Cost" value={`$${data.total_cost}`} icon={<DollarSign className="w-5 h-5" />} color="purple" />
          </motion.div>

          {/* Meals */}
          {[
            { title: '🌅 Breakfast', content: data.breakfast },
            { title: '☀️ Lunch', content: data.lunch },
            { title: '🌙 Dinner', content: data.dinner },
          ].map((meal) => (
            <motion.div key={meal.title} variants={fadeIn}>
              <Card>
                <h3 className="text-base font-semibold text-text-primary mb-2">{meal.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{meal.content}</p>
              </Card>
            </motion.div>
          ))}

          {/* Shopping List */}
          <motion.div variants={fadeIn}>
            <Card>
              <h3 className="text-sm font-semibold text-accent-purple mb-3 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" /> Shopping List
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.shopping_list.map((item, i) => (
                  <Badge key={i} variant="purple" size="md">{item}</Badge>
                ))}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
