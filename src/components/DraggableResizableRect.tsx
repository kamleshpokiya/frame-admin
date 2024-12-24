import React, { useState, useEffect } from "react";

interface RectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  onUpdate?: (x: number, y: number, width: number, height: number) => void;
}

const DraggableResizableRect: React.FC<RectProps> = ({
  x,
  y,
  width,
  height,
  strokeColor = "black",
  fillColor = "transparent",
  strokeWidth = 2,
  onUpdate,
}) => {
  const [rect, setRect] = useState({ x, y, width, height });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        const newX = e.clientX - offset.x;
        const newY = e.clientY - offset.y;
        setRect((prev) => ({ ...prev, x: newX, y: newY }));
        onUpdate?.(newX, newY, rect.width, rect.height);
      }

      if (resizing) {
        const newWidth = Math.max(20, e.clientX - rect.x);
        const newHeight = Math.max(20, e.clientY - rect.y);
        setRect((prev) => ({ ...prev, width: newWidth, height: newHeight }));
        onUpdate?.(rect.x, rect.y, newWidth, newHeight);
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
      setResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, resizing, offset, rect, onUpdate]);

  // Start Drag
  const handleDragStart = (e: React.MouseEvent) => {
    setDragging(true);
    setOffset({
      x: e.clientX - rect.x,
      y: e.clientY - rect.y,
    });
  };

  // Start Resizing
  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResizing(true);
  };

  return (
    <>
      {/* Main Rectangle */}
      <rect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        onMouseDown={handleDragStart}
        style={{ cursor: dragging ? "grabbing" : "grab" }}
      />

      {/* Resize Handle */}
      <circle
        cx={rect.x + rect.width}
        cy={rect.y + rect.height}
        r={8}
        fill="blue"
        onMouseDown={handleResizeStart}
        style={{ cursor: "nwse-resize" }}
      />
    </>
  );
};

export default DraggableResizableRect;
