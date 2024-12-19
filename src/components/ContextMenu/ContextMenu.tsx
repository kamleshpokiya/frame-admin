import React from 'react';
import { useCollageStore } from '../../store/useCollageStore';
import { Copy, Trash2 } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  boxId: string;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, boxId, onClose }) => {
  const { copyBox, deleteBox } = useCollageStore();

  const handleCopy = () => {
    copyBox(boxId);
    onClose();
  };

  const handleDelete = () => {
    deleteBox(boxId);
    onClose();
  };

  return (
    <div
      className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
      style={{ left: x, top: y }}
    >
      <button
        className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100"
        onClick={handleCopy}
      >
        <Copy size={16} />
        Copy
      </button>
      <button
        className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 text-red-600"
        onClick={handleDelete}
      >
        <Trash2 size={16} />
        Delete
      </button>
    </div>
  );
};