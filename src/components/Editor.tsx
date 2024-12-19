import { useEffect, useState } from "react";
import { useCollageStore } from "../store/useCollageStore";

const FRAMES = [
  {
    id: 1,
    name: "Frame 1",
    src: "https://d29mtkonxnc5fw.cloudfront.net/site_assets/swatches/black-maple2-swatch.jpg",
    frontFrame:
      "https://d29mtkonxnc5fw.cloudfront.net/site_assets/black-frame-face17.jpg",
    sideFrame:
      "https://d29mtkonxnc5fw.cloudfront.net/site_assets/black-vector-side9.jpg",
  },
  {
    id: 2,
    name: "Frame 2",
    src: "https://d29mtkonxnc5fw.cloudfront.net/site_assets/swatches/white-maple4-swatch.jpg",
    frontFrame:
      "https://d29mtkonxnc5fw.cloudfront.net/site_assets/white-frame-vector2.jpg",
    sideFrame:
      "	https://d29mtkonxnc5fw.cloudfront.net/site_assets/white-vector-side.jpg",
  },
  {
    id: 3,
    name: "Frame 3",
    src: "https://d29mtkonxnc5fw.cloudfront.net/site_assets/swatches/natural-maple2-swatch.jpg",
    frontFrame:
      "https://d29mtkonxnc5fw.cloudfront.net/site_assets/natural-frame-face.jpg",
    sideFrame:
      "https://d29mtkonxnc5fw.cloudfront.net/site_assets/natural-maple-side2.jpg",
  },
  {
    id: 4,
    name: "Frame 4",
    src: "https://d29mtkonxnc5fw.cloudfront.net/site_assets/swatches/natural-walnut-new-swatch.jpg",
    frontFrame:
      "https://d29mtkonxnc5fw.cloudfront.net/site_assets/natural-walnut-render-face2.jpg",
    sideFrame:
      "https://d29mtkonxnc5fw.cloudfront.net/site_assets/natural-walnut-side-render2.jpg",
  },
];

const Editor = () => {
  const [selctedFrame, setSelectedFrame] = useState(FRAMES[0]);

  const handleFrameClick = (frame: any) => {
    setSelectedFrame(frame);
  };

  const { generatedHtml, containerStyle } = useCollageStore();

  useEffect(() => {
    console.log("generatedHtml", generatedHtml);
  }, [generatedHtml]);

  return (
    <div>
      <div
        style={{
          perspective: "1200px",
        }}
      >
        <div
        //   style={{
        //     maxWidth: containerStyle.width + 30 + "px",
        //     transform: "rotateY(0deg)",
        //     transition: "transform 1s",
        //   }}
        //   className="box_container"
        >
          <figure
            className="three_dimensional_frame front relative shadow-[0_8px_30px_0_rgba(0,0,0,0.3)]"
            style={{
              borderImageSlice: 38,
              width: containerStyle.width + 30 + "px",
              height: containerStyle.height + 30 + "px",
              background: "transparent",
              transform: "translateZ(0px)",
              borderStyle: "solid",
              borderImageSource: `url("${selctedFrame.frontFrame}")`,
              borderImageWidth: "15px",
              borderImageRepeat: "stretch",
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: generatedHtml }}></div>
          </figure>
        </div>
      </div>

      <div className="mt-20">
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
                  selctedFrame.id === frame.id
                    ? "border-black"
                    : "border-gray-400"
                } cursor-pointer`}
                onClick={() => handleFrameClick(frame)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Editor;
