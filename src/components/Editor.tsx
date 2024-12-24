import { useCallback, useEffect, useRef, useState } from "react";
import { useCollageStore } from "../store/useCollageStore";
import { Plus } from "lucide-react";
import { ResizableBox } from "./ResizableBox";
import { Guidelines } from "./Guidelines";
import { ContextMenu } from "./ContextMenu/ContextMenu";
import { calculateSnapping } from "../utils/snapUtils";
import { GuidelineType } from "../types";
import { useContextMenu } from "../hooks/useContextMenu";

const Editor = () => {
  // const [selectedWidth, setSelectedWidth] = useState(15);
  const [guidelines, setGuidelines] = useState<GuidelineType[]>([]);

  const {
    generatedHtml,
    containerStyle,
    boxes,
    matSize,
    addBox,
    updateBox,
    selectedBox,
    pasteBox,
    selectedFrame,
  } = useCollageStore();
  const { contextMenu, handleContextMenu, closeContextMenu } = useContextMenu();
  const [isPreview, setIsPreview] = useState(false);
  const matRef = useRef<HTMLDivElement>(null);
  const [matContainer, setMatContainer] = useState<DOMRect | null>(null);
  // const handleWidthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedWidth(Number(e.target.value));
  // };

  useEffect(() => {
    console.log("generatedHtml", generatedHtml);
  }, [generatedHtml]);

  const handleDrag = useCallback(
    (id: string, x: number, y: number) => {
      const activeBox = boxes.find((box) => box.id === id);
      if (activeBox) {
        const otherBoxes = boxes.filter((box) => box.id !== id);
        const {
          snappedX,
          snappedY,
          guidelines: newGuidelines,
        } = calculateSnapping({ ...activeBox, x, y }, otherBoxes);

        updateBox(id, { x: snappedX, y: snappedY });
        setGuidelines(newGuidelines);
      }
    },
    [boxes, updateBox]
  );

  const handleResize = useCallback(
    (id: string, width: number, height: number) => {
      updateBox(id, { width, height });
      setGuidelines([]); // Clear guidelines when resizing
    },
    [updateBox]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        pasteBox();
      }
    },
    [pasteBox]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
  useEffect(() => {
    if (matRef) {
      const data = matRef.current?.getBoundingClientRect();
      if (data) {
        setMatContainer(data);
      }
    }
  }, [matRef]);
  return (
    <div className="mt-10">
      <div className="flex gap-3 items-center">
        {!isPreview && (
          <button
            onClick={addBox}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-3"
          >
            <Plus size={20} /> Add Box
          </button>
        )}
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg mb-3"
          onClick={() => setIsPreview(!isPreview)}
        >
          {isPreview ? "Stop Preview" : "Preview"}
        </button>
      </div>
      {isPreview ? (
        <div
          style={{
            perspective: "1200px",
          }}
        >
          <div
            className="box_container relative"
            style={{
              opacity: 1,
              transform: "rotateY(0deg)",
              transition: "transform 1s",
              width: `${containerStyle.width}px`,
              height: `${containerStyle.height}px`,
            }}
          >
            <figure
              style={{
                borderImageSlice: 38,
                width: `${containerStyle.width}px`,
                height: `${containerStyle.height}px`,
                transform: "translateZ(0px)",
                borderStyle: "solid",
                borderImageSource: `url("${selectedFrame?.frontFrame}")`,
                borderImageWidth: `15px`,
                borderImageRepeat: "stretch",
                transition: "all 0.5s",
                boxSizing: "border-box",
              }}
              className="relative bg-white shadow-lg  border-gray-200 "
            >
              <div
                className="absolute bg-gray-100"
                style={{
                  width: matSize.width,
                  height: matSize.height,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                {boxes.map((box) => (
                  <div
                    style={{
                      width: box.width,
                      height: box.height,
                      left: box.x,
                      top: box.y,
                      position: "absolute",
                      backgroundColor: box.background,
                    }}
                  ></div>
                ))}
              </div>
            </figure>
            <figure
              className="right three_d_face absolute"
              style={{
                background: `url("${selectedFrame?.frontFrame}")`,
                width: "20.2532px",
                height: "100%",
                left: "-20px",
                top: 0,
                transform:
                  "rotateY(99deg) translateZ(10.1266px) translateY(0px) translateX(10.1266px)",
              }}
            ></figure>
            <figure
              className="left three_d_face absolute"
              style={{
                background: `url("${selectedFrame?.sideFrame}")`,
                width: "20.2532px",
                height: "100%",
                right: "-20px",
                top: 0,
                transform:
                  "rotateY(99deg) translateZ(-9.3966px) translateY(0px) translateX(11.1266px)",
              }}
            ></figure>
          </div>
        </div>
      ) : (
        <div
          className="relative bg-white"
          style={{
            width: containerStyle.width,
            height: containerStyle.height,
          }}
        >
          <figure
            style={{
              borderImageSlice: 38,
              width: `${containerStyle.width}px`,
              height: `${containerStyle.height}px`,
              transform: "translateZ(0px)",
              borderStyle: "solid",
              borderImageSource: `url("${selectedFrame?.frontFrame}")`,
              borderImageWidth: `15px`,
              borderImageRepeat: "stretch",
              transition: "all 0.5s",
              boxSizing: "border-box",
            }}
            className="relative bg-white shadow-lg  border-gray-200 "
          >
            <div
              className="absolute bg-gray-100"
              style={{
                width: matSize.width,
                height: matSize.height,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              ref={matRef}
            >
              {boxes.map((box) => (
                <ResizableBox
                  key={box.id}
                  box={box}
                  onDrag={handleDrag}
                  onResize={handleResize}
                  isSelected={box.id === selectedBox}
                  onContextMenu={handleContextMenu}
                />
              ))}
              <Guidelines guidelines={guidelines} />
              {contextMenu.show && (
                <ContextMenu
                  x={contextMenu.x - (matContainer ? matContainer.left : 0)}
                  y={contextMenu.y - (matContainer ? matContainer.top : 0)}
                  boxId={contextMenu.boxId}
                  onClose={closeContextMenu}
                />
              )}
            </div>
          </figure>
        </div>
      )}
    </div>
  );
};

export default Editor;
