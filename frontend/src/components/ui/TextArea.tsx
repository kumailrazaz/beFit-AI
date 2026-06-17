import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full bg-bg-tertiary text-text-primary rounded-xl
            border border-border px-4 py-3 text-sm
            placeholder:text-text-muted
            focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20
            transition-all duration-200 resize-none min-h-[100px]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-danger/50 focus:border-danger/50 focus:ring-danger/20' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-xs text-danger mt-1">{error}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
