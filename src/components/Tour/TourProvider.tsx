import React from 'react';
import { Tooltip } from './Tooltip';
import { TourHighlight } from './TourHighlight';
import { useTour } from '../../hooks/useTour';

interface TourProviderProps {
  children: React.ReactNode;
}

export const TourContext = React.createContext<{
  startTour: () => void;
  endTour: () => void;
}>({
  startTour: () => {},
  endTour: () => {},
});

export const TourProvider: React.FC<TourProviderProps> = ({ children }) => {
  const { currentStep, showTour, startTour, nextStep, endTour, steps } = useTour();
  const [targetElement, setTargetElement] = React.useState<Element | null>(null);

  React.useEffect(() => {
    if (showTour && currentStep !== null) {
      const element = document.querySelector(steps[currentStep].target);
      setTargetElement(element);

      // Scroll the element into view with a smooth animation
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setTargetElement(null);
    }
  }, [currentStep, showTour, steps]);

  return (
    <TourContext.Provider value={{ startTour, endTour }}>
      {children}
      <TourHighlight targetElement={targetElement} />
      {showTour && currentStep !== null && (
        <Tooltip
          targetElement={targetElement}
          content={steps[currentStep].content}
          isOpen={true}
          onClose={endTour}
          onNext={nextStep}
          isLastStep={currentStep === steps.length - 1}
        />
      )}
    </TourContext.Provider>
  );
};