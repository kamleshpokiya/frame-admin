import { Box, GuidelineType } from '../types';

const SNAP_THRESHOLD = 10;

interface SnapResult {
  snappedX: number;
  snappedY: number;
  guidelines: GuidelineType[];
}

export const calculateSnapping = (
  activeBox: Box,
  otherBoxes: Box[],
): SnapResult => {
  const guidelines: GuidelineType[] = [];
  let snappedX = activeBox.x;
  let snappedY = activeBox.y;

  otherBoxes.forEach((box) => {
    if (box.id === activeBox.id) return;

    // Vertical alignment (left edges)
    if (Math.abs(activeBox.x - box.x) < SNAP_THRESHOLD) {
      snappedX = box.x;
      guidelines.push({
        type: 'vertical',
        position: box.x,
        start: Math.min(activeBox.y, box.y),
        end: Math.max(activeBox.y + activeBox.height, box.y + box.height),
      });
    }

    // Vertical alignment (right edges)
    if (Math.abs((activeBox.x + activeBox.width) - (box.x + box.width)) < SNAP_THRESHOLD) {
      snappedX = box.x + box.width - activeBox.width;
      guidelines.push({
        type: 'vertical',
        position: box.x + box.width,
        start: Math.min(activeBox.y, box.y),
        end: Math.max(activeBox.y + activeBox.height, box.y + box.height),
      });
    }

    // Horizontal alignment (top edges)
    if (Math.abs(activeBox.y - box.y) < SNAP_THRESHOLD) {
      snappedY = box.y;
      guidelines.push({
        type: 'horizontal',
        position: box.y,
        start: Math.min(activeBox.x, box.x),
        end: Math.max(activeBox.x + activeBox.width, box.x + box.width),
      });
    }

    // Horizontal alignment (bottom edges)
    if (Math.abs((activeBox.y + activeBox.height) - (box.y + box.height)) < SNAP_THRESHOLD) {
      snappedY = box.y + box.height - activeBox.height;
      guidelines.push({
        type: 'horizontal',
        position: box.y + box.height,
        start: Math.min(activeBox.x, box.x),
        end: Math.max(activeBox.x + activeBox.width, box.x + box.width),
      });
    }

    // Center alignment vertical
    const activeBoxCenterX = activeBox.x + activeBox.width / 2;
    const boxCenterX = box.x + box.width / 2;
    if (Math.abs(activeBoxCenterX - boxCenterX) < SNAP_THRESHOLD) {
      snappedX = boxCenterX - activeBox.width / 2;
      guidelines.push({
        type: 'vertical',
        position: boxCenterX,
        start: Math.min(activeBox.y, box.y),
        end: Math.max(activeBox.y + activeBox.height, box.y + box.height),
      });
    }

    // Center alignment horizontal
    const activeBoxCenterY = activeBox.y + activeBox.height / 2;
    const boxCenterY = box.y + box.height / 2;
    if (Math.abs(activeBoxCenterY - boxCenterY) < SNAP_THRESHOLD) {
      snappedY = boxCenterY - activeBox.height / 2;
      guidelines.push({
        type: 'horizontal',
        position: boxCenterY,
        start: Math.min(activeBox.x, box.x),
        end: Math.max(activeBox.x + activeBox.width, box.x + box.width),
      });
    }
  });

  return { snappedX, snappedY, guidelines };
};