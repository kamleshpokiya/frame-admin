import React, { forwardRef } from 'react';
import { ResizableBox as ReactResizableBox } from 'react-resizable';

interface ResizableWrapperProps {
  width: number;
  height: number;
  onResize: (e: React.SyntheticEvent, { size }: { size: { width: number; height: number } }) => void;
  children: React.ReactNode;
}

export const ResizableWrapper = forwardRef<HTMLDivElement, ResizableWrapperProps>(
  ({ width, height, onResize, children }, ref) => {
    return (
      <ReactResizableBox
        width={width}
        height={height}
        onResize={onResize}
        minConstraints={[50, 50]}
        // maxConstraints={[500, 500]}
        handle={<div className="react-resizable-handle react-resizable-handle-se" />}
      >
        <div ref={ref}>{children}</div>
      </ReactResizableBox>
    );
  }
);