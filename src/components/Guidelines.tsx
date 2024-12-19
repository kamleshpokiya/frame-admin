import React from 'react';
import { GuidelineType } from '../types';

interface GuidelinesProps {
  guidelines: GuidelineType[];
}

export const Guidelines: React.FC<GuidelinesProps> = ({ guidelines }) => {
  return (
    <>
      {guidelines.map((guide, index) => (
        <div
          key={index}
          className="absolute bg-blue-500 pointer-events-none"
          style={{
            [guide.type === 'vertical' ? 'left' : 'top']: `${guide.position}px`,
            [guide.type === 'vertical' ? 'top' : 'left']: `${guide.start}px`,
            [guide.type === 'vertical' ? 'width' : 'height']: '1px',
            [guide.type === 'vertical' ? 'height' : 'width']: `${
              guide.end - guide.start
            }px`,
            opacity: 0.5,
          }}
        />
      ))}
    </>
  );
};