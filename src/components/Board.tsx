import React, { useState, useEffect } from "react";
import { useCollageStore } from "../store/useCollageStore";
import { useNavigate } from "react-router-dom";
import { FRAMES } from "../constants/frames";
import { IFrames } from "../constants/types";

export const Board: React.FC = () => {
  const {
    boxes,
    setGeneratedHtml,
    updateContainerStyle,
    matSize,
    updateMatSize,
    updatedFrame,
  } = useCollageStore();

  const [selectedFrame, setSelectedFrame] = useState(FRAMES[0]);
  const [selectedDimension, setSelectedDimension] = useState({
    width: FRAMES[0].dimensions[0].width,
    height: FRAMES[0].dimensions[0].width,
  });
  const [sliderValue, setSliderValue] = useState(1);
  const [figureSize, setFigureSize] = useState({ width: 600, height: 600 });
  const [matsSize, setMatsSize] = useState({
    width: 500,
    height: 500,
  });
  const [selectedFrameWidth, setSelectedFrameWidth] = useState(1);

  // Handle Dimension Change
  const handleDimensionChange = (dimension: {
    width: number;
    height: number;
  }) => {
    const { width, height } = dimension;

    const newWidth =
      width >= height
        ? {
            width: 600,
            height: (height * 600) / width,
          }
        : {
            width: (width * 600) / height,
            height: 600,
          };
    setFigureSize(newWidth);
    updateContainerStyle({
      width: newWidth.width,
      height: newWidth.height,
    });
    setMatsSize({
      width: newWidth.width - 100,
      height: newWidth.height - 100,
    });
  };

  // Handle Mate Size based on Slider
  useEffect(() => {
    const step = sliderValue - 1; // Steps after the default value (1)
    const decreasePercentage = step * 3; // 3% decrease per step

    const newWidth = matsSize.width * (1 - decreasePercentage / 100);
    const newHeight = matsSize.height * (1 - decreasePercentage / 100);

    updateMatSize({
      width: newWidth,
      height: newHeight,
    });
  }, [sliderValue, matsSize]);

  const navigate = useNavigate();

  const handleFrameClick = (frame: IFrames) => {
    setSelectedFrame(frame);
    handleDimensionChange(frame.dimensions[0]);
    updatedFrame(frame);
    setSelectedFrameWidth(frame.depth[0]);
  };

  const handleDimensionSelect = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedDimension = selectedFrame.dimensions.find(
      (d) => d.id === Number(event.target.value)
    );
    if (selectedDimension) {
      handleDimensionChange(selectedDimension);
      setSelectedDimension(selectedDimension);
    }
  };

  const generateHtml = () => {
    const boxesHtml = boxes
      .map(
        (box) => `<div style="
  position: absolute;
  left: ${box.x}px;
  top: ${box.y}px;
  width: ${box.width}px;
  height: ${box.height}px;
  background: ${box.background};
"></div>`
      )
      .join("\n");
    return boxesHtml;
  };

  const handleNext = () => {
    const html = generateHtml();
    setGeneratedHtml(html);
    navigate("/editor");
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
        <div className="w-[90vw] h-[90vh]">
          <figure
            style={{
              borderImageSlice: 38,
              width: `${figureSize.width}px`,
              height: `${figureSize.height}px`,
              transform: "translateZ(0px)",
              borderStyle: "solid",
              borderImageSource: `url("${selectedFrame.frontFrame}")`,
              borderImageWidth:
                (600 /
                  Math.max(
                    selectedFrame.dimensions[0].width,
                    selectedFrame.dimensions[0].height
                  )) *
                  selectedFrameWidth +
                "px",
              borderImageRepeat: "stretch",
              transition: "all 0.5s",
              boxSizing: "border-box",
            }}
            className="relative bg-white shadow-lg  border-gray-200 overflow-auto"
          >
            <div
              className="absolute"
              style={{
                width: matSize.width,
                height: matSize.height,
                background: "#f5f5f5",
                transform: "translate(-50%, -50%)",
                top: "50%",
                left: "50%",
              }}
            ></div>
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
                onChange={(e) => setSelectedFrameWidth(Number(e.target.value))}
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
              value={sliderValue}
              onChange={(e) => setSliderValue(parseFloat(e.target.value))}
              style={{ width: "300px" }}
              className="custom-slider"
            />
            <div className="border p-1 w-fit border-[#D9D9D9] rounded-[3px] mt-2">
              {sliderValue}" MAT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
