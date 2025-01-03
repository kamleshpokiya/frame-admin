import { useCallback, useEffect, useRef, useState } from "react";
import { useCollageStore } from "../store/useCollageStore";
import { Plus } from "lucide-react";
import { ResizableBox } from "./ResizableBox";
import { Guidelines } from "./Guidelines";
import { ContextMenu } from "./ContextMenu/ContextMenu";
import { calculateSnapping } from "../utils/snapUtils";
import { GuidelineType } from "../types";
import { useContextMenu } from "../hooks/useContextMenu";
import MatContainer from "./MatContainer";

const Editor = () => {
  const [guidelines, setGuidelines] = useState<GuidelineType[]>([]);

  const { boxes, addBox, updateBox, selectedBox, pasteBox, frameContext } =
    useCollageStore();
  const { contextMenu, handleContextMenu, closeContextMenu } = useContextMenu();
  const [isPreview, setIsPreview] = useState(false);
  const matRef = useRef<HTMLDivElement>(null);
  const [matContainer, setMatContainer] = useState<DOMRect | null>(null);

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
        {frameContext.dimensions.width} x {frameContext.dimensions.height}
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
            className="box_container relative shadow-[0_8px_30px_0_rgba(0,0,0,0.3)]"
            style={{
              opacity: 1,
              transform: "rotateY(0deg)",
              transition: "transform 1s",
              width: `${frameContext.dimensions.width * frameContext.pxUnit}px`,
              height: `${
                frameContext.dimensions.height * frameContext.pxUnit
              }px`,
            }}
          >
            <figure
              style={{
                borderImageSlice: 38,
                width: `${
                  frameContext.dimensions.width * frameContext.pxUnit
                }px`,
                height: `${
                  frameContext.dimensions.height * frameContext.pxUnit
                }px`,
                transform: "translateZ(0px)",
                borderStyle: "solid",
                borderImageSource: `url("${frameContext?.frame?.frontFrame}")`,
                borderImageWidth:
                  frameContext.pxUnit * frameContext.depth + "px",
                borderImageRepeat: "stretch",
                transition: "all 0.5s",
                boxShadow: "rgba(0, 0, 0, 0.7) 0px 2px 5px inset",
              }}
              className="bg-white"
            >
              <MatContainer frameContext={frameContext}>
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
              </MatContainer>
            </figure>
            <figure
              className="right three_d_face absolute h-full top-0 -left-5"
              style={{
                background: `url("${frameContext?.frame?.frontFrame}")`,
                width: "20.2532px",
                transform:
                  "rotateY(99deg) translateZ(10.1266px) translateY(0px) translateX(10.1266px)",
              }}
            ></figure>
            <figure
              className="left three_d_face absolute h-full top-0 -right-5"
              style={{
                background: `url("${frameContext?.frame?.sideFrame}")`,
                width: "20.2532px",
                transform:
                  "rotateY(99deg) translateZ(-9.3966px) translateY(0px) translateX(11.1266px)",
              }}
            ></figure>
          </div>
        </div>
      ) : (
        <div
          className="relative bg-white mt-5"
          style={{
            width: `${frameContext.dimensions.width * frameContext.pxUnit}px`,
            height: `${frameContext.dimensions.height * frameContext.pxUnit}px`,
          }}
        >
          <figure
            style={{
              borderImageSlice: 38,
              width: `${frameContext.dimensions.width * frameContext.pxUnit}px`,
              height: `${
                frameContext.dimensions.height * frameContext.pxUnit
              }px`,
              transform: "translateZ(0px)",
              borderStyle: "solid",
              borderImageSource: `url("${frameContext?.frame?.frontFrame}")`,
              borderImageWidth: frameContext.pxUnit * frameContext.depth + "px",
              borderImageRepeat: "stretch",
              transition: "all 0.5s",
              zIndex: 10,
            }}
            className="bg-white shadow-lg  border-gray-200 box-border"
          >
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
                zIndex: 10,
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
