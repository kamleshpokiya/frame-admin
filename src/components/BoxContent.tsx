import React from 'react';

interface BoxContentProps {
  width: number;
  height: number;
  isSelected: boolean;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

export const BoxContent: React.FC<BoxContentProps> = ({
  width,
  height,
  isSelected,
  onClick,
  onContextMenu,
}) => {
  return (
    <div
      className={`relative bg-[#333333] border-2 ${
        isSelected ? 'border-blue-500' : 'border-gray-200'
      }  cursor-move handle`}
      style={{ width, height }}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <div className="absolute inset-0 flex items-center justify-center text-white">
        {width} x {height}
      </div>
    </div>
  );
};