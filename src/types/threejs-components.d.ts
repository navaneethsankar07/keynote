declare module "threejs-components/build/cursors/tubes1.min.js" {
  export interface TubesCursorOptions {
    bloom?: {
      strength?: number;
      radius?: number;
      threshold?: number;
    };
    tubes?: {
      colors?: string[];
      lights?: {
        intensity?: number;
        colors?: string[];
      };
    };
    sleepRadiusX?: number;
    sleepRadiusY?: number;
    sleepTimeScale1?: number;
    sleepTimeScale2?: number;
  }

  export interface TubesApp {
    three: unknown;
    options: TubesCursorOptions;
    tubes: {
      setColors: (colors: string[]) => void;
      setLightsColors: (colors: string[]) => void;
    };
    dispose: () => void;
  }

  const TubesCursor: (
    canvas: HTMLCanvasElement,
    options?: TubesCursorOptions
  ) => TubesApp;

  export default TubesCursor;
}

