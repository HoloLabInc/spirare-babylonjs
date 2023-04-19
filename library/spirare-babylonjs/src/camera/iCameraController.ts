import {
  TargetCamera,
  TransformNode
} from '@babylonjs/core';


export interface ICameraController {
  camera: TargetCamera;

  alignWithTerrain(terrainHeight: number): void;
  setGeodeticCameraTarget(latitude: number, longitude: number): void;
  restoreCameraPose(): void;
  adjust(node: TransformNode, useAnimation: boolean): Promise<boolean>;
  toggleCameraTargetMarker(): void;
}
