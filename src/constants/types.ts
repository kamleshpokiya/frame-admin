export interface IFrames {
  id: number;
  name: string;
  src: string;
  frontFrame: string;
  sideFrame: string;
  dimensions: {
    id: number;
    width: number;
    height: number;
  }[];
  depth: number[];
}
