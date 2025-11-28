import { Check } from 'lucide-react';
import { cn } from './ui/utils';

export default function Stepper({ sections, currentStep, setStep, completedSteps }) {
  return (
    <nav aria-label="Form Steps" className="w-full">
      <ol className="flex items-start">
        {sections.map((section, index) => {
          const step = index + 1;
          const isCompleted = completedSteps[index];
          const isActive = step === currentStep;

          return (
            <li
              key={section.id}
              className={cn('relative flex-1', { 'pr-8': step < sections.length })}
            >
              <div className="flex flex-col items-center text-center">
                <button
                  type="button"
                  onClick={() => (isCompleted || isActive) && setStep(step)}
                  disabled={!isCompleted && !isActive}
                  className={cn(
                    'flex size-10 items-center justify-center rounded-full font-bold transition-all duration-300 z-10',
                    isActive
                      ? 'bg-blue-600 text-white scale-110 shadow-lg'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  )}
                >
                  {isCompleted && !isActive ? <Check className="h-6 w-6" /> : <span>{step}</span>}
                </button>
                <span className="mt-2 block text-xs font-medium text-gray-600">
                  {section.title}
                </span>
              </div>
              {step < sections.length && (
                <div className="absolute top-5 left-1/2 -z-10 h-0.5 w-full bg-gray-200" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
