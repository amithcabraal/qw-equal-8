import { useState, useCallback } from 'react';
import { TOUR_STEPS } from '../config/tourSteps';

export interface TourStep {
  target: string;
  content: string;
}

export const useTour = () => {
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [showTour, setShowTour] = useState(false);

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setShowTour(true);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev === null || prev >= TOUR_STEPS.length - 1) {
        return null;
      }
      return prev + 1;
    });
  }, []);

  const endTour = useCallback(() => {
    setCurrentStep(null);
    setShowTour(false);
  }, []);

  return {
    currentStep,
    showTour,
    startTour,
    nextStep,
    endTour,
    steps: TOUR_STEPS,
  };
};