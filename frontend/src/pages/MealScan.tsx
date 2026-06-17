import { motion } from 'framer-motion';
import { UtensilsCrossed, Flame, Beef, Wheat, Droplets, Heart, AlertTriangle, CheckCircle2 } from 'lucide-react';
import UploadArea from '../components/ui/UploadArea';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import Skeleton from '../components/ui/Skeleton';
import { useFileUpload } from '../hooks/useFileUpload';
import { useApi } from '../hooks/useApi';
import { mealScan } from '../services/api';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function MealScanPage() {
  const upload = useFileUpload();
  const { data, isLoading, error, execute } = useApi(mealScan);

  const handleAnalyze = async () => {
    if (!upload.file) return;
    await execute(upload.file);
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
            <UtensilsCrossed className="w-5 h-5 text-accent-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Meal Scanner</h1>
            <p className="text-sm text-text-muted">Snap a meal photo for instant nutrition analysis</p>
          </div>
        </div>
      </motion.div>

      {/* Upload */}
      <motion.div variants={fadeIn}>
        <UploadArea
          isDragging={upload.isDragging}
          preview={upload.preview}
          onDrop={upload.handleDrop}
          onDragOver={upload.handleDragOver}
          onDragLeave={upload.handleDragLeave}
          onInputChange={upload.handleInputChange}
          onReset={upload.reset}
          label="Upload a meal photo"
          description="Clear, well-lit photos give the best results"
        />
      </motion.div>

      {/* Analyze Button */}
      {upload.file && !data && (
        <motion.div variants={fadeIn}>
          <Button onClick={handleAnalyze} isLoading={isLoading} fullWidth size="lg" icon={<UtensilsCrossed className="w-5 h-5" />}>
            {isLoading ? 'Analyzing Meal...' : 'Analyze Meal'}
          </Button>
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <motion.div variants={fadeIn}>
          <Card className="border-danger/30 bg-danger/5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-danger">Analysis Failed</p>
                <p className="text-sm text-text-muted mt-1">{error.message}</p>
                <Button variant="danger" size="sm" className="mt-3" onClick={handleAnalyze}>Try Again</Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Loading */}
      {isLoading && (
        <motion.div variants={fadeIn} className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-bg-secondary rounded-xl border border-border p-5">
                <Skeleton variant="text" width="60%" className="mb-3" />
                <Skeleton variant="text" width="40%" height="28px" />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Results */}
      {data && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="space-y-6"
        >
          <motion.div variants={fadeIn} className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">Nutrition Breakdown</h2>
          </motion.div>

          {/* Detected Foods */}
          <motion.div variants={fadeIn}>
            <Card>
              <h3 className="text-sm font-semibold text-text-primary mb-3">Detected Foods</h3>
              <div className="flex flex-wrap gap-2">
                {data.foods.map((food, i) => (
                  <Badge key={i} variant="info" size="md">{food}</Badge>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Macro Stats */}
          <motion.div variants={fadeIn} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Calories" value={data.calories} icon={<Flame className="w-5 h-5" />} color="green" />
            <StatCard label="Protein" value={`${data.protein}g`} icon={<Beef className="w-5 h-5" />} color="blue" />
            <StatCard label="Carbs" value={`${data.carbs}g`} icon={<Wheat className="w-5 h-5" />} color="purple" />
            <StatCard label="Fat" value={`${data.fat}g`} icon={<Droplets className="w-5 h-5" />} color="blue" />
          </motion.div>

          {/* Health Score */}
          <motion.div variants={fadeIn}>
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary" /> Health Score
                </h3>
                <span className="text-2xl font-bold text-primary">{data.health_score}/10</span>
              </div>
              <ProgressBar value={data.health_score} max={10} color={data.health_score >= 7 ? 'green' : data.health_score >= 4 ? 'warning' : 'danger'} />
            </Card>
          </motion.div>

          {/* Advice */}
          <motion.div variants={fadeIn}>
            <Card>
              <h3 className="text-sm font-semibold text-accent-blue mb-3">💡 AI Advice</h3>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{data.advice}</p>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
