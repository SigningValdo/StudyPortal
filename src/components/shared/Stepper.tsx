import { FC } from 'react';

export type StepStatus = 'completed' | 'active' | 'pending';

export interface Step {
  label: string;
  description?: string;
  status: StepStatus;
}

export interface StepperProps {
  steps: Step[];
  orientation?: 'horizontal' | 'vertical';
  variant?: 'numbered' | 'icon';
  /**
   * Offset added to the displayed step number. Defaults to 0 (so the first
   * circle renders "01"). Use this when a wizard splits its steps across
   * multiple visual groups but the numbering must stay continuous (e.g.
   * group B starting at 04).
   */
  startIndex?: number;
}

const COLORS = {
  active: '#495AFF',
  dark: '#0D0B26',
  muted: '#ABB7C2',
};

const CheckIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="17"
    height="13"
    viewBox="0 0 17 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.4915 9.67517L1.64967 5.83333L0 7.483L5.4915 12.9745L16.8163 1.64967L15.1667 0L5.4915 9.67517Z"
      fill="currentColor"
    />
  </svg>
);

const formatIndex = (index: number) => String(index + 1).padStart(2, '0');

const HorizontalCircle: FC<{
  step: Step;
  displayIndex: number;
}> = ({ step, displayIndex }) => {
  const base =
    'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white text-sm font-medium transition-colors';

  if (step.status === 'completed') {
    // Une étape complétée affiche toujours une coche (maquette Figma),
    // quel que soit le variant (numbered ou icon).
    return (
      <div
        className={base}
        style={{
          borderColor: COLORS.active,
          color: COLORS.active,
          backgroundColor: '#EEF0FF',
        }}
      >
        <CheckIcon />
      </div>
    );
  }

  if (step.status === 'active') {
    return (
      <div
        className={base}
        style={{
          borderColor: COLORS.active,
          backgroundColor: COLORS.active,
          color: '#FFFFFF',
        }}
      >
        {formatIndex(displayIndex)}
      </div>
    );
  }

  return (
    <div
      className={base}
      style={{ borderColor: COLORS.muted, color: COLORS.muted }}
    >
      {formatIndex(displayIndex)}
    </div>
  );
};

const HorizontalStepper: FC<Omit<StepperProps, 'orientation'>> = ({
  steps,
  startIndex = 0,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-start overflow-x-auto pb-1 sm:overflow-visible">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const nextCompletedOrActive =
            !isLast &&
            (step.status === 'completed' ||
              (step.status === 'active' && steps[index + 1].status !== 'pending'));
          const connectorColor = nextCompletedOrActive ? COLORS.active : COLORS.muted;
          const connectorWeight = nextCompletedOrActive ? 2 : 1;

          const labelColor =
            step.status === 'pending' ? COLORS.muted : COLORS.dark;
          const descriptionColor = COLORS.muted;

          return (
            <div key={step.label} className="relative flex min-w-[60px] flex-1 flex-col items-center sm:min-w-0">
              <div className="flex w-full items-center">
                <div className="flex-1">
                  {index !== 0 && (
                    <div
                      className="h-0 w-full"
                      style={{
                        borderTopWidth: steps[index - 1].status === 'completed' ? 2 : 1,
                        borderColor:
                          steps[index - 1].status === 'completed' ||
                          (steps[index - 1].status === 'active' && step.status !== 'pending')
                            ? COLORS.active
                            : COLORS.muted,
                      }}
                    />
                  )}
                </div>
                <HorizontalCircle
                  step={step}
                  displayIndex={startIndex + index}
                />
                <div className="flex-1">
                  {!isLast && (
                    <div
                      className="h-0 w-full"
                      style={{
                        borderTopWidth: connectorWeight,
                        borderColor: connectorColor,
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="mt-3 hidden px-1 text-center sm:block sm:mt-4">
                <div
                  className="text-sm font-semibold lg:text-base"
                  style={{
                    color: step.status === 'active' ? COLORS.active : labelColor,
                  }}
                >
                  {step.label}
                </div>
                {step.description && (
                  <div
                    className="mt-1 text-xs lg:text-sm"
                    style={{ color: descriptionColor }}
                  >
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const VerticalStepper: FC<Omit<StepperProps, 'orientation' | 'variant'>> = ({ steps }) => {
  return (
    <div className="flex flex-col">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const connectorColor =
          step.status === 'completed' ? COLORS.active : COLORS.muted;

        let circle;
        if (step.status === 'completed') {
          circle = (
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: COLORS.active }}
            >
              <CheckIcon className="h-5 w-5" />
            </div>
          );
        } else if (step.status === 'active') {
          circle = (
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white"
              style={{ borderColor: COLORS.active }}
            >
              <div
                className="h-5 w-5 rounded-full"
                style={{ backgroundColor: COLORS.active }}
              />
            </div>
          );
        } else {
          circle = (
            <div
              className="h-12 w-12 rounded-full border-2 bg-white"
              style={{ borderColor: COLORS.muted }}
            />
          );
        }

        const labelColor =
          step.status === 'active'
            ? COLORS.active
            : step.status === 'pending'
              ? COLORS.muted
              : COLORS.dark;

        return (
          <div key={step.label} className="flex items-start">
            <div className="flex flex-col items-center">
              {circle}
              {!isLast && (
                <div
                  className="w-0"
                  style={{
                    height: 60,
                    borderLeftWidth: step.status === 'completed' ? 2 : 1,
                    borderColor: connectorColor,
                  }}
                />
              )}
            </div>
            <div className="ml-4 pt-3">
              <div className="text-base font-semibold" style={{ color: labelColor }}>
                {step.label}
              </div>
              {step.description && (
                <div className="mt-1 text-sm" style={{ color: COLORS.muted }}>
                  {step.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Stepper: FC<StepperProps> = ({
  steps,
  orientation = 'horizontal',
  variant = 'numbered',
  startIndex = 0,
}) => {
  if (orientation === 'vertical') {
    return <VerticalStepper steps={steps} />;
  }
  return (
    <HorizontalStepper steps={steps} variant={variant} startIndex={startIndex} />
  );
};

export default Stepper;
