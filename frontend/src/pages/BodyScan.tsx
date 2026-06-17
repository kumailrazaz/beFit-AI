import { motion } from 'framer-motion';
import { ScanFace, Dumbbell, Target, AlertTriangle, CheckCircle2, Apple } from 'lucide-react';
import UploadArea from '../components/ui/UploadArea';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Skeleton from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';
import { useFileUpload } from '../hooks/useFileUpload';
import { useApi } from '../hooks/useApi';
import { bodyScan } from '../services/api';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function BodyScanPage() {
  const upload = useFileUpload();
  const { data, isLoading, error, execute } = useApi(bodyScan);

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
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <ScanFace className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Body Scan</h1>
            <p className="text-sm text-text-muted">Upload a photo for AI body composition analysis</p>
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
          label="Upload a body photo"
          description="Full body photo works best for accurate analysis"
        />
      </motion.div>

      {/* Analyze Button */}
      {upload.file && !data && (
        <motion.div variants={fadeIn}>
          <Button
            onClick={handleAnalyze}
            isLoading={isLoading}
            fullWidth
            size="lg"
            icon={<ScanFace className="w-5 h-5" />}
          >
            {isLoading ? 'Analyzing...' : 'Analyze Body Composition'}
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
                <Button variant="danger" size="sm" className="mt-3" onClick={handleAnalyze}>
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <motion.div variants={fadeIn} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-bg-secondary rounded-xl border border-border p-5">
                <Skeleton variant="text" width="60%" className="mb-3" />
                <Skeleton variant="text" width="40%" height="28px" />
              </div>
            ))}
          </div>
          <div className="bg-bg-secondary rounded-xl border border-border p-6">
            <Skeleton lines={4} />
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
            <h2 className="text-lg font-semibold text-text-primary">Analysis Complete</h2>
          </motion.div>

          {/* Key Metrics */}
          <motion.div variants={fadeIn} className="grid grid-cols-2 gap-4">
            <StatCard
              label="Body Fat Estimate"
              value={data.body_fat}
              icon={<Target className="w-5 h-5" />}
              color="blue"
            />
            <StatCard
              label="Muscle Development"
              value={data.muscle_development}
              icon={<Dumbbell className="w-5 h-5" />}
              color="purple"
            />
          </motion.div>

          {/* Strengths & Weaknesses */}
          <motion.div variants={fadeIn} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Strengths
              </h3>
              <div className="space-y-2">
                {data.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Badge variant="success" size="sm">{i + 1}</Badge>
                    <span className="text-sm text-text-secondary">{s}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <h3 className="text-sm font-semibold text-warning mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Areas to Improve
              </h3>
              <div className="space-y-2">
                {data.weaknesses.map((w, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Badge variant="warning" size="sm">{i + 1}</Badge>
                    <span className="text-sm text-text-secondary">{w}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Workout Split */}
          <motion.div variants={fadeIn}>
            <Card>
              <h3 className="text-sm font-semibold text-accent-blue mb-3 flex items-center gap-2">
                <Dumbbell className="w-4 h-4" /> Recommended Workout Split
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{data.workout_split}</p>
            </Card>
          </motion.div>

          {/* Nutrition */}
          <motion.div variants={fadeIn}>
            <Card>
              <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                <Apple className="w-4 h-4" /> Nutrition Advice
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{data.nutrition_advice}</p>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
