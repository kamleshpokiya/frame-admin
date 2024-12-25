import { IFrames } from "../constants/types";

const MatContainer = ({
  frameContext,
  children,
}: {
  frameContext: {
    dimensions: { width: number; height: number };
    depth: number;
    pxUnit: number;
    mat: number;
    frame: IFrames | null;
  };
  children: React.ReactNode;
}) => {
  return (
    <div
      className="absolute bg-gray-100 translate-y-[-50%] translate-x-[-50%] top-1/2 left-1/2"
      style={{
        width:
          frameContext.pxUnit *
            (frameContext.dimensions.width -
              (frameContext.mat + frameContext.depth) * 2) +
          "px",
        height:
          frameContext.pxUnit *
            (frameContext.dimensions.height -
              (frameContext.mat + frameContext.depth) * 2) +
          "px",
      }}
    >
      {children}
    </div>
  );
};

export default MatContainer;
