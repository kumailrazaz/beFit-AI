import { motion } from 'framer-motion';
import { ShoppingCart, CheckCircle2, XCircle, Lightbulb, AlertTriangle, Heart } from 'lucide-react';
import UploadArea from '../components/ui/UploadArea';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import Skeleton from '../components/ui/Skeleton';
import { useFileUpload } from '../hooks/useFileUpload';
import { useApi } from '../hooks/useApi';
import { groceryScan } from '../services/api';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function GroceryScanPage() {
  const upload = useFileUpload();
  const { data, isLoading, error, execute } = useApi(groceryScan);

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
          <div className="w-10 h-10 rounded-xl bg-accent-purple/15 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-accent-purple" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Grocery Scanner</h1>
            <p className="text-sm text-text-muted">Analyze your grocery cart for healthier choices</p>
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
          label="Upload grocery cart photo"
          description="Take a photo of your grocery haul or shopping cart"
        />
      </motion.div>

      {upload.file && !data && (
        <motion.div variants={fadeIn}>
          <Button onClick={handleAnalyze} isLoading={isLoading} fullWidth size="lg" icon={<ShoppingCart className="w-5 h-5" />}>
            {isLoading ? 'Analyzing Cart...' : 'Analyze Groceries'}
          </Button>
        </motion.div>
      )}

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

      {isLoading && (
        <motion.div variants={fadeIn} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-bg-secondary rounded-xl border border-border p-6">
                <Skeleton variant="text" width="50%" className="mb-4" />
                <Skeleton lines={3} />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {data && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="space-y-6"
        >
          {/* Health Score */}
          <motion.div variants={fadeIn}>
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary" /> Cart Health Score
                </h3>
                <span className="text-2xl font-bold text-primary">{data.score}/10</span>
              </div>
              <ProgressBar value={data.score} max={10} color={data.score >= 7 ? 'green' : data.score >= 4 ? 'warning' : 'danger'} />
            </Card>
          </motion.div>

          {/* Healthy / Unhealthy */}
          <motion.div variants={fadeIn} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Healthy Items
              </h3>
              <div className="space-y-2">
                {data.healthy_items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Badge variant="success" size="sm">✓</Badge>
                    <span className="text-sm text-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <h3 className="text-sm font-semibold text-danger mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Needs Improvement
              </h3>
              <div className="space-y-2">
                {data.unhealthy_items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Badge variant="danger" size="sm">✗</Badge>
                    <span className="text-sm text-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Suggestions */}
          <motion.div variants={fadeIn}>
            <Card>
              <h3 className="text-sm font-semibold text-accent-blue mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> Suggested Replacements
              </h3>
              <div className="space-y-2">
                {data.suggestions.map((suggestion, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-accent-blue text-sm font-medium mt-0.5">→</span>
                    <span className="text-sm text-text-secondary">{suggestion}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
