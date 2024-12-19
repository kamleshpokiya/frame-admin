import { useState, useCallback, useEffect } from 'react';

interface ContextMenuState {
  show: boolean;
  x: number;
  y: number;
  boxId: string;
}

export const useContextMenu = () => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    show: false,
    x: 0,
    y: 0,
    boxId: '',
  });

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, boxId: string) => {
      e.preventDefault();
      setContextMenu({
        show: true,
        x: e.pageX,
        y: e.pageY,
        boxId,
      });
    },
    []
  );

  const closeContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, show: false }));
  }, []);

  useEffect(() => {
    const handleClick = () => {
      closeContextMenu();
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [closeContextMenu]);

  return {
    contextMenu,
    handleContextMenu,
    closeContextMenu,
  };
};