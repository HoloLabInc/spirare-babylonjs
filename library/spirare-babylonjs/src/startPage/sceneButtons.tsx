import React from 'react'
import { SceneInfo } from '../types'
import { SceneButton } from './sceneButton'

export const SceneButtons: React.FC<{
  scenes: SceneInfo[]
  enableMenu?: boolean
  onSceneClick?: (scene: SceneInfo) => void
  onDeleteClick?: (scene: SceneInfo) => void
  getTemporaryUrl?: (scene: SceneInfo) => Promise<string>
  openSceneFolder?: (scene: SceneInfo) => Promise<void>
}> = ({
  scenes,
  enableMenu,
  onSceneClick,
  onDeleteClick,
  getTemporaryUrl,
  openSceneFolder,
}) => {
  return (
    <div className="columns is-multiline">
      {scenes.map((scene) => (
        <SceneButton
          scene={scene}
          enableMenu={enableMenu}
          onSceneClick={onSceneClick}
          onDeleteClick={onDeleteClick}
          getTemporaryUrl={getTemporaryUrl}
          openSceneFolder={openSceneFolder}
          key={scene.pomlId}
        />
      ))}
    </div>
  )
}
