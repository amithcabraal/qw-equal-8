import React, { useState, useEffect, useContext } from 'react';
import { PlayCircle, Trash2, Scale } from 'lucide-react';
import { Menu } from './components/Menu';
import { HowToPlay } from './components/HowToPlay';
import { ThemeToggle } from './components/ThemeToggle';
import { BalanceBeam } from './components/BalanceBeam';
import { NumberBlock } from './components/NumberBlock';
import { OperatorButton } from './components/OperatorButton';
import { CurrentOperation } from './components/CurrentOperation';
import { BalanceResult } from './components/BalanceResult';
import { TourProvider, TourContext } from './components/Tour/TourProvider';

interface Operation {
  id: string;
  num1: number;
  num2: number;
  operator: string;
  result: number;
}

interface NumberWithId {
  id: string;
  value: number;
}

const generateRandomNumbers = () => {
  return Array.from({ length: 6 }, () => ({
    id: Math.random().toString(36).substr(2, 9),
    value: Math.floor(Math.random() * 9) + 1
  }));
};

const AppContent: React.FC = () => {
  const { startTour } = useContext(TourContext);
  const [leftNumbers, setLeftNumbers] = useState<NumberWithId[]>(generateRandomNumbers());
  const [rightNumbers, setRightNumbers] = useState<NumberWithId[]>(generateRandomNumbers());
  const [leftOperations, setLeftOperations] = useState<Operation[]>([]);
  const [rightOperations, setRightOperations] = useState<Operation[]>([]);
  const [selectedNumber1, setSelectedNumber1] = useState<NumberWithId | null>(null);
  const [selectedNumber2, setSelectedNumber2] = useState<NumberWithId | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  const [selectedSide, setSelectedSide] = useState<'left' | 'right'>('left');
  const [showHowToPlay, setShowHowToPlay] = useState(true);
  const [showBalanceResult, setShowBalanceResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const operators = ['+', '-', '*', '/'];

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      startTour();
      localStorage.setItem('hasSeenTour', 'true');
    }
  }, [startTour]);

  const calculateResult = (num1: number, num2: number, operator: string): number => {
    switch (operator) {
      case '+': return num1 + num2;
      case '-': return num1 - num2;
      case '*': return num1 * num2;
      case '/': return num1 / num2;
      default: return 0;
    }
  };

  const leftTotal = leftOperations.reduce((sum, op) => sum + op.result, 0);
  const rightTotal = rightOperations.reduce((sum, op) => sum + op.result, 0);

  const handleNumberClick = (numWithId: NumberWithId, side: 'left' | 'right') => {
    setSelectedSide(side);
    
    if (selectedNumber1?.id === numWithId.id) {
      setSelectedNumber1(null);
    } else if (selectedNumber2?.id === numWithId.id) {
      setSelectedNumber2(null);
    } else if (!selectedNumber1) {
      setSelectedNumber1(numWithId);
    } else if (!selectedNumber2) {
      setSelectedNumber2(numWithId);
    }
  };

  const handleOperatorClick = (op: string) => {
    setSelectedOperator(op);
  };

  const handleAddOperation = (side: 'left' | 'right') => {
    if (!selectedNumber1 || !selectedNumber2 || !selectedOperator) return;

    const result = calculateResult(selectedNumber1.value, selectedNumber2.value, selectedOperator);
    const operation: Operation = {
      id: Date.now().toString(),
      num1: selectedNumber1.value,
      num2: selectedNumber2.value,
      operator: selectedOperator,
      result,
    };

    if (side === 'left') {
      setLeftOperations([...leftOperations, operation]);
      setLeftNumbers(leftNumbers.filter(n => n.id !== selectedNumber1.id && n.id !== selectedNumber2.id));
    } else {
      setRightOperations([...rightOperations, operation]);
      setRightNumbers(rightNumbers.filter(n => n.id !== selectedNumber1.id && n.id !== selectedNumber2.id));
    }

    setSelectedNumber1(null);
    setSelectedNumber2(null);
    setSelectedOperator(null);
  };

  const handleCheckBalance = () => {
    setShowBalanceResult(true);
    if (leftTotal === rightTotal) {
      setGameComplete(true);
    }
  };

  const handleGiveUp = () => {
    setGameComplete(true);
    setShowBalanceResult(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Number Balance Game',
          text: `I balanced the numbers! Left total: ${leftTotal}, Right total: ${rightTotal}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const resetGame = () => {
    setLeftNumbers(generateRandomNumbers());
    setRightNumbers(generateRandomNumbers());
    setLeftOperations([]);
    setRightOperations([]);
    setSelectedNumber1(null);
    setSelectedNumber2(null);
    setSelectedOperator(null);
    setGameComplete(false);
    setShowBalanceResult(false);
  };

  const handleRemoveOperation = (id: string, side: 'left' | 'right') => {
    if (side === 'left') {
      const operation = leftOperations.find(op => op.id === id);
      if (operation) {
        setLeftNumbers([
          ...leftNumbers,
          { id: Math.random().toString(36).substr(2, 9), value: operation.num1 },
          { id: Math.random().toString(36).substr(2, 9), value: operation.num2 }
        ]);
        setLeftOperations(leftOperations.filter(op => op.id !== id));
      }
    } else {
      const operation = rightOperations.find(op => op.id === id);
      if (operation) {
        setRightNumbers([
          ...rightNumbers,
          { id: Math.random().toString(36).substr(2, 9), value: operation.num1 },
          { id: Math.random().toString(36).substr(2, 9), value: operation.num2 }
        ]);
        setRightOperations(rightOperations.filter(op => op.id !== id));
      }
    }
  };

  const renderSide = (side: 'left' | 'right') => {
    const numbers = side === 'left' ? leftNumbers : rightNumbers;
    const operations = side === 'left' ? leftOperations : rightOperations;
    const total = side === 'left' ? leftTotal : rightTotal;
    const isCurrentSide = selectedSide === side;

    return (
      <div className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-lg space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {side.charAt(0).toUpperCase() + side.slice(1)} Side
          </h2>
          <span data-tour="total" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {total}
          </span>
        </div>

        <div className="relative">
          <div data-tour="current-operation">
            <CurrentOperation
              number1={isCurrentSide ? selectedNumber1?.value : null}
              number2={isCurrentSide ? selectedNumber2?.value : null}
              operator={isCurrentSide ? selectedOperator : null}
            >
              <button
                onClick={() => handleAddOperation(side)}
                disabled={!isCurrentSide || !selectedNumber1 || !selectedNumber2 || !selectedOperator}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2
                         ${(!isCurrentSide || !selectedNumber1 || !selectedNumber2 || !selectedOperator)
                           ? 'text-gray-400 dark:text-gray-600'
                           : 'text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400'}
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors`}
              >
                <PlayCircle size={24} />
              </button>
            </CurrentOperation>
          </div>
        </div>

        <div className="flex flex-row-reverse gap-4">
          <div data-tour="operators" className="w-[40%] grid grid-cols-2 gap-2">
            {operators.map((op) => (
              <OperatorButton
                key={op}
                operator={op}
                onClick={() => handleOperatorClick(op)}
                isSelected={selectedOperator === op && isCurrentSide}
              />
            ))}
          </div>

          <div data-tour="numbers" className="w-[55%] grid grid-cols-3 gap-2">
            {numbers.map((num) => (
              <NumberBlock
                key={num.id}
                number={num.value}
                onClick={() => handleNumberClick(num, side)}
                isSelected={
                  (selectedNumber1?.id === num.id || selectedNumber2?.id === num.id) && 
                  selectedSide === side
                }
              />
            ))}
          </div>
        </div>

        <div data-tour="operations-list" className="space-y-2">
          {operations.map((op) => (
            <div
              key={op.id}
              className="flex items-center justify-between bg-gray-50 dark:bg-dark-hover p-3 rounded-lg"
            >
              <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                {op.num1} {op.operator} {op.num2} = {op.result}
              </span>
              <button
                onClick={() => handleRemoveOperation(op.id, side)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg p-4 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            Number Balance
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Menu
              onShowHowToPlay={() => setShowHowToPlay(true)}
              onNewGame={resetGame}
              onShare={handleShare}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {renderSide('left')}
          {renderSide('right')}
        </div>

        <div className="my-8 flex flex-col items-center gap-4">
          <button
            data-tour="check-balance"
            onClick={gameComplete ? resetGame : handleCheckBalance}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg
                     hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transform transition-transform hover:scale-105"
          >
            {gameComplete ? 'Play Again' : (
              <>
                <Scale size={24} />
                Check Balance
              </>
            )}
          </button>
          <BalanceBeam leftWeight={leftTotal} rightWeight={rightTotal} />
        </div>

        {showHowToPlay && (
          <HowToPlay
            onClose={() => setShowHowToPlay(false)}
            onDontShowAgain={() => {
              setShowHowToPlay(false);
              localStorage.setItem('hideHowToPlay', 'true');
            }}
          />
        )}

        {showBalanceResult && (
          <BalanceResult
            isBalanced={leftTotal === rightTotal}
            leftTotal={leftTotal}
            rightTotal={rightTotal}
            onClose={() => setShowBalanceResult(false)}
            onGiveUp={handleGiveUp}
            onShare={handleShare}
          />
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <TourProvider>
      <AppContent />
    </TourProvider>
  );
};

export default App;