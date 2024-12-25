import React, { useCallback, useEffect, useState, useRef } from "react";
import { useCollageStore } from "../store/useCollageStore";
import { Box } from "../types";
import { DraggableWrapper } from "./DraggableWrapper";
import { ResizableWrapper } from "./ResizableWrapper";
import { BoxContent } from "./BoxContent";

interface Props {
  box: Box;
  onDrag: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  isSelected: boolean;
  onContextMenu: (e: React.MouseEvent, boxId: string) => void;
}

export const ResizableBox: React.FC<Props> = ({
  box,
  onDrag,
  onResize,
  isSelected,
  onContextMenu,
}) => {
  const setSelectedBox = useCollageStore((state) => state.setSelectedBox);
  const [position, setPosition] = useState({ x: box.x, y: box.y });
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPosition({ x: box.x, y: box.y });
  }, [box.x, box.y]);

  const handleDrag = useCallback(
    (_: any, data: { x: number; y: number }) => {
      setPosition({ x: data.x, y: data.y });
      onDrag(box.id, data.x, data.y);
    },
    [box.id, onDrag]
  );

  const handleResize = useCallback(
    (_: any, { size }: { size: { width: number; height: number } }) => {
      onResize(box.id, size.width, size.height);
    },
    [box.id, onResize]
  );

  const handleBoxContextMenu = (e: React.MouseEvent) => {
    onContextMenu(e, box.id);
  };

  return (
    <DraggableWrapper ref={nodeRef} position={position} onDrag={handleDrag}>
      <ResizableWrapper
        width={box.width}
        height={box.height}
        onResize={handleResize}
      >
        <BoxContent
          width={box.width}
          height={box.height}
          isSelected={isSelected}
          onClick={() => setSelectedBox(box.id)}
          onContextMenu={handleBoxContextMenu}
        />
      </ResizableWrapper>
    </DraggableWrapper>
  );
};
