import React from 'react'
import { SceneInfo } from '../types'
import { SceneButton } from './sceneButton'

export const SceneButtons: React.FC<{
  scenes: SceneInfo[]
  enableMenu?: boolean
  onSceneClick?: (scene: SceneInfo) => void
  onDeleteClick?: (scene: SceneInfo) => void
  getTemporaryUrl?: (scene: SceneInfo) => Promise<string>
}> = ({ scenes, enableMenu, onSceneClick, onDeleteClick, getTemporaryUrl }) => {
  return (
    <div className="columns is-multiline">
      {scenes.map((scene) => (
        <SceneButton
          scene={scene}
          enableMenu={enableMenu}
          onSceneClick={onSceneClick}
          onDeleteClick={onDeleteClick}
          getTemporaryUrl={getTemporaryUrl}
          key={scene.pomlId}
        />
      ))}
    </div>
  )
}
