import React, { forwardRef } from 'react';
import Draggable, { DraggableEventHandler } from 'react-draggable';

interface DraggableWrapperProps {
  position: { x: number; y: number };
  onDrag: DraggableEventHandler;
  children: React.ReactNode;
}

export const DraggableWrapper = forwardRef<HTMLDivElement, DraggableWrapperProps>(
  ({ position, onDrag, children }, ref) => {
    return (
      <Draggable
        position={position}
        onDrag={onDrag}
        bounds="parent"
        handle=".handle"
        nodeRef={ref}
      >
        <div ref={ref} className="absolute">
          {children}
        </div>
      </Draggable>
    );
  }
);