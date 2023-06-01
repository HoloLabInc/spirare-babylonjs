export type PlacementMode = 'space' | 'geodetic'
export type PomlPathMode = 'id' | 'path'

export type SceneInfo = {
  title: string | undefined
  pomlPathMode: PomlPathMode
  pomlId: string | undefined
  pomlPath: string | undefined
  placementMode: PlacementMode
}
