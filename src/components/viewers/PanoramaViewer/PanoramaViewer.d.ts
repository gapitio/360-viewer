import { PanoramaViewer } from "./PanoramaViewer";

declare global {
  interface Window {
    panoramaViewer: PanoramaViewer;
  }
}
