import React, { useState, useEffect } from "react";
import { useCollageStore } from "../store/useCollageStore";
import { useNavigate } from "react-router-dom";
import { FRAMES } from "../constants/frames";
import { IFrames } from "../constants/types";

export const Board: React.FC = () => {
  const { setFrameContext, frameContext } = useCollageStore();

  const [selectedFrame, setSelectedFrame] = useState(
    frameContext?.frame || FRAMES[0]
  );
  const [selectedDimension, setSelectedDimension] = useState(
    frameContext.dimensions.width === 0
      ? {
          width: FRAMES[0].dimensions[0].width,
          height: FRAMES[0].dimensions[0].height,
        }
      : frameContext.dimensions
  );
  const [pxUnit, setPxUnit] = useState(
    frameContext.pxUnit === 0
      ? 600 / Math.max(selectedDimension.width, selectedDimension.height)
      : frameContext.pxUnit
  );
  const [matValue, setMatValue] = useState(frameContext.mat);
  const [selectedFrameWidth, setSelectedFrameWidth] = useState(
    frameContext.depth
  );
  useEffect(() => {
    setPxUnit(
      600 / Math.max(selectedDimension.width, selectedDimension.height)
    );
  }, [selectedDimension]);

  const navigate = useNavigate();

  const handleFrameClick = (frame: IFrames) => {
    setSelectedFrame(frame);
    setSelectedFrameWidth(frame.depth[0]);

    setSelectedDimension({
      width: frame.dimensions[0].width + (frame.depth[0] - 1) * 2,
      height: frame.dimensions[0].height + (frame.depth[0] - 1) * 2,
    });
  };

  const handleDimensionSelect = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedDimension = selectedFrame.dimensions.find(
      (d) => d.id === Number(event.target.value)
    );
    if (selectedDimension) {
      setSelectedDimension(selectedDimension);
      setMatValue(1);
      setSelectedFrameWidth(1);
    }
  };

  const handleNext = () => {
    navigate("/editor");
    setFrameContext({
      depth: selectedFrameWidth,
      dimensions: selectedDimension,
      mat: matValue,
      pxUnit,
      frame: selectedFrame,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex gap-10 items-center">
        <p>
          {`${selectedDimension.width}"`} x {`${selectedDimension.height}"`}
        </p>
        <div className="">
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      </div>

      <div className="flex gap-8 mt-2">
        <div className="w-[90vw] h-[90vh] box-border">
          <figure
            style={{
              borderImageSlice: 38,
              width: `${selectedDimension.width * pxUnit}px`,
              height: `${selectedDimension.height * pxUnit}px`,
              transform: "translateZ(0px)",
              borderStyle: "solid",
              borderImageSource: `url("${selectedFrame.frontFrame}")`,
              borderImageWidth: pxUnit * selectedFrameWidth + "px",
              borderImageRepeat: "stretch",
              transition: "all 0.5s",
            }}
            className="relative bg-white shadow-lg  border-gray-200 overflow-auto"
          >
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-[#f5f5f5]"
              style={{
                width:
                  pxUnit *
                    (selectedDimension.width -
                      (matValue + selectedFrameWidth) * 2) +
                  "px",
                height:
                  pxUnit *
                    (selectedDimension.height -
                      (matValue + selectedFrameWidth) * 2) +
                  "px",
              }}
            >
              {/* controlls inside content */}

              {/* {boxes.map((box) => {
                return (
                  <div
                    style={{
                      width: (box.width / frameContext.pxUnit) * pxUnit,
                      height: (box.height / frameContext.pxUnit) * pxUnit,
                      left: (box.x / frameContext.pxUnit) * pxUnit,
                      top: (box.y / frameContext.pxUnit) * pxUnit,
                      position: "absolute",
                      backgroundColor: box.background,
                    }}
                  ></div>
                );
              })} */}
            </div>
          </figure>
        </div>

        <div>
          <div>
            <h2 className="text-start mb-2 text-lg text-gray-500 uppercase">
              Frames Styles
            </h2>
            <div className="flex items-center gap-2">
              {FRAMES.map((frame, index) => (
                <div key={index} className="">
                  <img
                    src={frame.src}
                    alt={frame.name}
                    className={`rounded-[2px] h-10 w-10 p-1 border ${
                      selectedFrame.id === frame.id
                        ? "border-black"
                        : "border-gray-400"
                    } cursor-pointer`}
                    onClick={() => handleFrameClick(frame)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-5 mt-5">
            <div>
              <h2 className="text-start mb-2 text-lg text-gray-500 uppercase">
                Dimention
              </h2>
              <select
                name="frame-dimention"
                className="p-2 border border-gray-300 rounded-lg text-gray-700"
                onChange={handleDimensionSelect}
              >
                {selectedFrame.dimensions.map((dimention, index) => (
                  <option key={index} value={dimention.id}>
                    {dimention.width} x {dimention.height}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <h2 className="text-start mb-2 text-lg text-gray-500 uppercase">
                Depth
              </h2>
              <select
                name="frame-depth"
                className="p-2 border border-gray-300 rounded-lg text-gray-700"
                onChange={(e) => {
                  const oldWidth = selectedFrameWidth;
                  setSelectedFrameWidth(Number(e.target.value));
                  setSelectedDimension((prev) => ({
                    width: prev.width + (Number(e.target.value) - oldWidth) * 2,
                    height:
                      prev.height + (Number(e.target.value) - oldWidth) * 2,
                  }));
                }}
                value={selectedFrameWidth}
              >
                {selectedFrame.depth.map((depth, index) => (
                  <option key={index} value={depth}>
                    {depth}"
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="slider-wrapper mt-10">
            <input
              id="box-slider"
              type="range"
              min={1}
              max={7}
              step={0.5} // Step for fractional values
              value={matValue}
              onChange={(e) => {
                setMatValue(parseFloat(e.target.value));
                setSelectedDimension((prev) => ({
                  width:
                    prev.width + (parseFloat(e.target.value) - matValue) * 2,
                  height:
                    prev.height + (parseFloat(e.target.value) - matValue) * 2,
                }));
              }}
              className="custom-slider w-[300px]"
            />
            <div className="border p-1 w-fit border-[#D9D9D9] rounded-[3px] mt-2">
              {matValue}" MAT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
