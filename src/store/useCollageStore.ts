import { create } from "zustand";
import { Box } from "../types";

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
  setGeneratedHtml: (html: string) => void;
  generatedHtml: string;
  containerStyle: { width: number; height: number; x: number; y: number };
  updateContainerStyle: (
    updates: Partial<{ width: number; height: number; x: number; y: number }>
  ) => void;
}

export const useCollageStore = create<CollageStore>((set, get) => ({
  boxes: [],
  selectedBox: null,
  copiedBox: null,
  containerStyle: {
    width: 800,
    height: 600,
    x: 0,
    y: 0,
  },
  generatedHtml: "",

  addBox: () => {
    set((state) => ({
      boxes: [
        ...state.boxes,
        {
          id: `box-${state.boxes.length + 1}`,
          x: 20,
          y: 20,
          width: 150,
          height: 150,
          background: "#9ca2ae",
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
  setGeneratedHtml: (html) => {
    set({ generatedHtml: html });
  },
  updateContainerStyle: (updates) => {
    set((state) => ({
      containerStyle: {
        ...state.containerStyle,
        ...updates,
      },
    }));
  },
}));
