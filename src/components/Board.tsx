import React, { useCallback, useState, useRef, useEffect } from "react";
import { ResizableBox } from "./ResizableBox";
import { Guidelines } from "./Guidelines";
import { ContextMenu } from "./ContextMenu/ContextMenu";
import { useCollageStore } from "../store/useCollageStore";
import { useContextMenu } from "../hooks/useContextMenu";
import { Box, GuidelineType } from "../types";
import { Plus } from "lucide-react";
import { calculateSnapping } from "../utils/snapUtils";
import { useNavigate } from "react-router-dom";

export const Board: React.FC = () => {
  const {
    boxes,
    addBox,
    updateBox,
    selectedBox,
    pasteBox,
    setGeneratedHtml,
    containerStyle,
    updateContainerStyle,
  } = useCollageStore();
  const [guidelines, setGuidelines] = useState<GuidelineType[]>([]);
  const { contextMenu, handleContextMenu, closeContextMenu } = useContextMenu();
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement | null>(null);

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

  const handleContainerResize = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = containerRef.current;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    updateContainerStyle({
      width: rect.width,
      height: rect.height,
    });
  };

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

    const html = `<div
  style="
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${containerStyle.width}px;
    height: ${containerStyle.height}px;
    overflow: hidden;
    background: white;
    box-shadow: rgba(0, 0, 0, 0.7) 0px 2px 5px inset;
    transform: translate(-50%, -50%);
  "
>
    ${boxesHtml}
</div>`;

    return html;
  };

  const handleNext = () => {
    const html = generateHtml();
    setGeneratedHtml(html);
    navigate("/editor");
  };

  useEffect(() => {
    console.log("containerStyle", containerStyle);
  }, [containerStyle]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-4 flex gap-4">
        <button
          onClick={addBox}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus size={20} /> Add Box
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Next
        </button>
      </div>

      <div className="flex gap-8">
        <div
          ref={containerRef}
          style={{
            left: containerStyle.x,
            top: containerStyle.y,
            width: containerStyle.width,
            height: containerStyle.height,
          }}
          className="relative bg-white shadow-lg border-2 border-gray-200 resize overflow-auto"
          onMouseUp={handleContainerResize}
        >
          <div className="absolute inset-0">
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
                x={contextMenu.x}
                y={contextMenu.y}
                boxId={contextMenu.boxId}
                onClose={closeContextMenu}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
