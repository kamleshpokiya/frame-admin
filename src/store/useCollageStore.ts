import { create } from "zustand";
import { Box } from "../types";
import { IFrames } from "../constants/types";
import { FRAMES } from "../constants/frames";

interface CollageStore {
  boxes: Box[];
  selectedBox: string | null;
  copiedBox: Box | null;
  addBox: () => void;
  updateBox: (id: string, updates: Partial<Box>) => void;
  setSelectedBox: (id: string | null) => void;
  copyBox: (id: string) => void;
  deleteBox: (id: string) => void;
  pasteBox: () => void;
  frameContext: {
    dimensions: { width: number; height: number };
    depth: number;
    pxUnit: number;
    mat: number;
    frame: IFrames | null;
  };
  setFrameContext: (
    updates: Partial<{
      dimensions: { width: number; height: number };
      depth: number;
      pxUnit: number;
      mat: number;
      frame: IFrames | null;
    }>
  ) => void;
}

export const useCollageStore = create<CollageStore>((set, get) => ({
  boxes: [],
  selectedBox: null,
  copiedBox: null,

  selectedFrame: FRAMES[0],
  frameContext: {
    dimensions: { width: 0, height: 0 },
    depth: 1,
    pxUnit: 0,
    mat: 1,
    frame: null,
  },

  addBox: () => {
    set((state) => ({
      boxes: [
        ...state.boxes,
        {
          id: `box-${state.boxes.length + 1}`,
          x: 20,
          y: 20,
          width: 4 * state.frameContext.pxUnit,
          height: 4 * state.frameContext.pxUnit,
          background: "#333333",
        },
      ],
    }));
  },

  updateBox: (id, updates) => {
    set((state) => ({
      boxes: state.boxes.map((box) =>
        box.id === id ? { ...box, ...updates } : box
      ),
    }));
  },

  setSelectedBox: (id) => set({ selectedBox: id }),

  copyBox: (id) => {
    const boxToCopy = get().boxes.find((box) => box.id === id);
    if (boxToCopy) {
      set({ copiedBox: boxToCopy });
    }
  },

  deleteBox: (id) => {
    set((state) => ({
      boxes: state.boxes.filter((box) => box.id !== id),
      selectedBox: state.selectedBox === id ? null : state.selectedBox,
    }));
  },

  pasteBox: () => {
    const { copiedBox, boxes } = get();
    if (copiedBox) {
      set({
        boxes: [
          ...boxes,
          {
            ...copiedBox,
            id: `box-${boxes.length + 1}`,
            x: copiedBox.x + 20,
            y: copiedBox.y + 20,
          },
        ],
      });
    }
  },

  setFrameContext(updates) {
    set((state) => ({
      frameContext: {
        ...state.frameContext,
        ...updates,
      },
    }));
  },
}));
