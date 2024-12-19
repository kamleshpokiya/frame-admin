export interface Box {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  background: string;
}

export interface GuidelineType {
  type: 'horizontal' | 'vertical';
  position: number;
  start: number;
  end: number;
}