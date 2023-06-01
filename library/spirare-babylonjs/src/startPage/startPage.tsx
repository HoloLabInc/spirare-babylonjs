import React from 'react'
import { useTranslation } from 'react-i18next'
import { SceneInfo, getUrlParamString } from '../types'
import { CreateSceneMenu } from './createSceneMenu'
import { SceneButtons } from './sceneButtons'

export const StartPage: React.FC<{
  newScenePageUrl: string
  editorPageUrl: string
  scenes: SceneInfo[]
  onDeleteClick?: (scene: SceneInfo) => void
  openSceneFolder?: (scene: SceneInfo) => Promise<void>
}> = ({
  newScenePageUrl,
  editorPageUrl,
  scenes,
  onDeleteClick,
  openSceneFolder,
}) => {
  const { t } = useTranslation()

  const onSceneClick = (sceneInfo: SceneInfo) => {
    const urlParams = getUrlParamString({
      runMode: 'editor',
      placementMode: sceneInfo.placementMode,
      pomlId: sceneInfo.pomlId,
      pomlPath: sceneInfo.pomlPath,
    })

    console.log(urlParams)

    const href = `${editorPageUrl}?${urlParams}`
    location.href = href
  }

  return (
    <>
      <section className="hero is-info">
        <div className="hero-body">
          <p className="title">Spirare Editor</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <CreateSceneMenu newScenePageUrl={newScenePageUrl}></CreateSceneMenu>

          <h1 className="title is-3 mt-6">{t('recently-opened-scene')}</h1>

          <SceneButtons
            scenes={scenes}
            enableMenu={true}
            onSceneClick={onSceneClick}
            onDeleteClick={onDeleteClick}
            openSceneFolder={openSceneFolder}
          />
        </div>
      </section>
    </>
  )
}
