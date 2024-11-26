import React from 'react';
import { X, PlayCircle, Target } from 'lucide-react';
import { TourContext } from './Tour/TourProvider';

interface HowToPlayProps {
  onClose: () => void;
  onDontShowAgain: () => void;
}

export const HowToPlay: React.FC<HowToPlayProps> = ({ onClose, onDontShowAgain }) => {
  const { startTour } = React.useContext(TourContext);

  const handleStartTour = () => {
    onClose();
    startTour();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-card p-8 rounded-xl shadow-2xl max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-400">How to Play</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
              <Target size={20} />
              Game Objective
            </h3>
            <p className="mt-2">
              Your goal is to achieve the highest possible total that's equal on both sides of the balance beam.
              Use strategic combinations of numbers and operations to maximize your score!
            </p>
          </div>

          <p className="font-semibold">How to achieve this:</p>
          <ol className="list-decimal ml-6 space-y-2">
            <li>Start with the numbers provided on each side of the balance beam</li>
            <li>Create mathematical expressions by:
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Selecting a number</li>
                <li>Choosing an operator (+, -, *, /)</li>
                <li>Selecting another number</li>
                <li>Clicking the play button to add your expression</li>
              </ul>
            </li>
            <li>Think strategically about which combinations will give you higher totals</li>
            <li>You don't need to use all numbers - focus on the ones that help maximize your total</li>
            <li>Remove and retry operations using the trash icon if you want to optimize your score</li>
            <li>When you've achieved the highest possible equal total, click "Check Balance" to win!</li>
          </ol>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              onChange={onDontShowAgain}
              className="form-checkbox h-5 w-5 text-indigo-600"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">Don't show this again</span>
          </label>
          <div className="flex gap-4">
            <button
              onClick={handleStartTour}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
            >
              <PlayCircle size={20} />
              Start Tour
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};