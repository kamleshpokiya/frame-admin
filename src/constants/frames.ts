import { IFrames } from "./types";

export const FRAMES: IFrames[] = [
  {
    id: 1,
    name: "Frame 1",
    src: "https://d29mtkonxnc5fw.cloudfront.net/site_assets/swatches/black-maple2-swatch.jpg",
    frontFrame:
      "https://d29mtkonxnc5fw.cloudfront.net/site_assets/black-frame-face17.jpg",
    sideFrame:
      "https://d29mtkonxnc5fw.cloudfront.net/site_assets/black-vector-side9.jpg",
    dimensions: [
      { id: 1, width: 25, height: 25 },
      { id: 2, width: 25, height: 12 },
      { id: 3, width: 12, height: 25 },
    ],
    depth: [0.75, 1, 1.5],
  },
  {
    id: 2,
    name: "Frame 2",
    src: "https://d29mtkonxnc5fw.cloudfront.net/site_assets/swatches/white-maple4-swatch.jpg",
    frontFrame:
      "https://d29mtkonxnc5fw.cloudfront.net/site_assets/white-frame-vector2.jpg",
    sideFrame:
      "	https://d29mtkonxnc5fw.cloudfront.net/site_assets/white-vector-side.jpg",
    dimensions: [
      { id: 1, width: 25, height: 25 },
      { id: 2, width: 25, height: 12 },
      { id: 3, width: 12, height: 25 },
    ],
    depth: [0.75, 1, 1.5],
  },
  {
    id: 3,
    name: "Frame 3",
    src: "https://d29mtkonxnc5fw.cloudfront.net/site_assets/swatches/natural-maple2-swatch.jpg",
    frontFrame:
      "https://d29mtkonxnc5fw.cloudfront.net/site_assets/natural-frame-face.jpg",
    sideFrame:
      "https://d29mtkonxnc5fw.cloudfront.net/site_assets/natural-maple-side2.jpg",
    dimensions: [
      { id: 1, width: 25, height: 25 },
      { id: 2, width: 25, height: 12 },
      { id: 3, width: 12, height: 25 },
    ],
    depth: [0.75, 1, 1.5],
  },
  {
    id: 4,
    name: "Frame 4",
    src: "https://d29mtkonxnc5fw.cloudfront.net/site_assets/swatches/natural-walnut-new-swatch.jpg",
    frontFrame:
      "https://d29mtkonxnc5fw.cloudfront.net/site_assets/natural-walnut-render-face2.jpg",
    sideFrame:
      "https://d29mtkonxnc5fw.cloudfront.net/site_assets/natural-walnut-side-render2.jpg",
    dimensions: [
      { id: 1, width: 50, height: 30 },
      { id: 2, width: 25, height: 12 },
      { id: 3, width: 12, height: 25 },
    ],
    depth: [0.75, 1, 1.5],
  },
];
