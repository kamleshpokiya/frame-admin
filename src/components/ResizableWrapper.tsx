import React, { forwardRef } from "react";
import { ResizableBox as ReactResizableBox } from "react-resizable";
import { useCollageStore } from "../store/useCollageStore";

interface ResizableWrapperProps {
  width: number;
  height: number;
  onResize: (
    e: React.SyntheticEvent,
    { size }: { size: { width: number; height: number } }
  ) => void;
  children: React.ReactNode;
}

export const ResizableWrapper = forwardRef<
  HTMLDivElement,
  ResizableWrapperProps
>(({ width, height, onResize, children }, ref) => {
  const { frameContext } = useCollageStore();

  return (
    <ReactResizableBox
      width={width}
      height={height}
      onResize={onResize}
      minConstraints={[50, 50]}
      maxConstraints={[
        (frameContext.dimensions.width -
          (frameContext.depth + frameContext.mat) * 2) *
          frameContext.pxUnit,
        (frameContext.dimensions.height -
          (frameContext.depth + frameContext.mat) * 2) *
          frameContext.pxUnit,
      ]}
      handle={
        <div className="react-resizable-handle react-resizable-handle-se" />
      }
    >
      <div ref={ref}>{children}</div>
    </ReactResizableBox>
  );
});
