import React from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
  FloatingArrow,
  inline,
  placement,
} from '@floating-ui/react';

interface TooltipProps {
  content: string;
  isOpen: boolean;
  onClose?: () => void;
  onNext?: () => void;
  isLastStep?: boolean;
  targetElement: Element | null;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  isOpen,
  onClose,
  onNext,
  isLastStep = false,
  targetElement,
}) => {
  const arrowRef = React.useRef(null);
  
  // Determine the best placement based on the target's position
  const getPlacement = () => {
    if (!targetElement) return 'top';
    const rect = targetElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    if (rect.top < viewportHeight / 3) return 'bottom';
    if (rect.bottom > viewportHeight * 2 / 3) return 'top';
    if (rect.left < viewportWidth / 3) return 'right';
    if (rect.right > viewportWidth * 2 / 3) return 'left';
    return 'top';
  };

  const { refs, floatingStyles, context } = useFloating({
    elements: {
      reference: targetElement ?? undefined,
    },
    open: isOpen,
    middleware: [
      inline(),
      offset(12),
      flip({
        fallbackAxisSideDirection: 'start',
        padding: 8,
      }),
      shift({ padding: 8 }),
      arrow({ element: arrowRef }),
    ],
    whileElementsMounted: autoUpdate,
    placement: getPlacement(),
  });

  if (!isOpen || !targetElement) return null;

  return (
    <div
      ref={refs.setFloating}
      style={floatingStyles}
      className="z-50 bg-indigo-600 text-white p-4 rounded-lg shadow-lg max-w-xs animate-fadeIn"
    >
      <FloatingArrow
        ref={arrowRef}
        context={context}
        className="fill-indigo-600"
      />
      <p className="mb-3">{content}</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-3 py-1 text-sm bg-indigo-500 hover:bg-indigo-700 rounded transition-colors"
        >
          {isLastStep ? 'Finish' : 'Skip'}
        </button>
        {!isLastStep && (
          <button
            onClick={onNext}
            className="px-3 py-1 text-sm bg-white text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};