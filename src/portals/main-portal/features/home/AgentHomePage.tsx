import { FC } from 'react';

const PieChartIllustration: FC = () => (
  <svg
    viewBox="0 0 500 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-auto w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[500px]"
  >
    <path
      d="M133.176 103.317C160.799 81.3191 194.073 67.5677 229.167 63.6458V270.833H436.354C432.432 305.927 418.681 339.201 396.683 366.824C374.684 394.447 345.333 415.298 312.008 426.976C278.682 438.654 242.737 440.685 208.308 432.835C173.879 424.985 142.366 407.573 117.396 382.604C92.4266 357.634 75.0147 326.121 67.1648 291.692C59.3148 257.263 61.3457 221.318 73.0238 187.992C84.7019 154.666 105.552 125.316 133.176 103.317Z"
      stroke="#D8D8D8"
      stroke-width="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M312.5 187.5H426.833C417.481 161.138 402.364 137.195 382.585 117.415C362.805 97.6362 338.862 82.5194 312.5 73.1667V187.5Z"
      stroke="#D8D8D8"
      stroke-width="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const AgentHomePage: FC = () => {
  return (
    <section className="h-full overflow-y-auto rounded-2xl border border-brand-border-soft bg-white p-4 sm:p-6 lg:p-8">
      <div className="flex h-full min-h-[320px] w-full items-center justify-center sm:min-h-[480px]">
        <PieChartIllustration />
      </div>
    </section>
  );
};

export default AgentHomePage;
