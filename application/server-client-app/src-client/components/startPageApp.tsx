import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CreateSceneMenu } from 'spirare-babylonjs/src/startPage/createSceneMenu'
import { ViewerModeMenu } from 'spirare-babylonjs/src/startPage/viewerModeMenu'
import { SceneButtons } from 'spirare-babylonjs/src/startPage/sceneButtons'
import { SceneInfo, getUrlParamString } from 'spirare-babylonjs/src/types'
import { StartPageNavBar } from './startPageNavBar'

export type PageMode = 'edit' | 'view' | 'ar-view' | 'webar-view'

const getPageModeFromUrl = (): PageMode => {
  switch (window.location.hash) {
    case '#view':
      return 'view'
    case '#ar-view':
      return 'ar-view'
    case '#webar-view':
      return 'webar-view'
    default:
      return 'edit'
  }
}

export const StartPageApp: React.FC<{
  newScenePageUrl: string
  editorPageUrl: string
  viewerPageUrl: string
  webArPageUrl: string
  scenes: SceneInfo[]
}> = ({
  newScenePageUrl,
  editorPageUrl,
  viewerPageUrl,
  webArPageUrl,
  scenes,
}) => {
  const initialPageMode = getPageModeFromUrl()
  const [pageMode, setPageMode] = useState<PageMode>(initialPageMode)
  const { t } = useTranslation()

  const onSceneClick: (info: SceneInfo) => void = (() => {
    switch (pageMode) {
      case 'edit':
        return (sceneInfo: SceneInfo) => {
          const urlParams = getUrlParamString({
            runMode: 'editor',
            placementMode: sceneInfo.placementMode,
            pomlId: sceneInfo.pomlId,
          })

          const href = `${editorPageUrl}?${urlParams}`
          location.href = href
        }
      case 'view':
        return (sceneInfo: SceneInfo) => {
          const urlParams = getUrlParamString({
            runMode: 'viewer',
            placementMode: sceneInfo.placementMode,
            pomlId: sceneInfo.pomlId,
          })

          const href = `${editorPageUrl}?${urlParams}`
          location.href = href
        }
      case 'ar-view':
        return async (sceneInfo: SceneInfo) => {
          try {
            if (sceneInfo.pomlId !== undefined) {
              const response = await getTemporaryPoml(sceneInfo.pomlId)
              location.href = `spirare-geodetic:${response.url}`
            }
          } catch (ex) {
            console.log(ex)
          }
        }
      case 'webar-view':
        return (sceneInfo: SceneInfo) => {
          const urlParams = getUrlParamString({
            runMode: 'viewer',
            placementMode: sceneInfo.placementMode,
            pomlId: sceneInfo.pomlId,
          })

          const href = `${webArPageUrl}?${urlParams}&vps=enable`
          location.href = href
        }
    }
  })()

  const onDeleteClick = async (sceneInfo: SceneInfo): Promise<void> => {
    if (sceneInfo.pomlId !== undefined) {
      const result = await deletePoml(sceneInfo.pomlId)
      // Reload the page if the deletion is successful
      if (result) {
        location.reload()
      }
    }
  }

  const getTemporaryUrl = async (sceneInfo: SceneInfo): Promise<string> => {
    if (sceneInfo.pomlId !== undefined) {
      const response = await getTemporaryPoml(sceneInfo.pomlId)
      return response.url
    } else {
      return ''
    }
  }

  if (pageMode == 'ar-view') {
    // Show buttons for the geodetic placement mode only until the spirare-geospatial schema is created
    scenes = scenes.filter((scene) => scene.placementMode == 'geodetic')
  }

  if (pageMode == 'webar-view') {
    // Currently, only support for the space placement mode
    scenes = scenes.filter((scene) => scene.placementMode == 'space')
  }

  return (
    <>
      <StartPageNavBar
        pageMode={pageMode}
        setPageMode={setPageMode}
      ></StartPageNavBar>

      <section className="section">
        <div className="container">
          {pageMode == 'view' && (
            <>
              <ViewerModeMenu viewerPageUrl={viewerPageUrl}></ViewerModeMenu>
            </>
          )}

          {pageMode == 'edit' && (
            <>
              <CreateSceneMenu
                newScenePageUrl={newScenePageUrl}
              ></CreateSceneMenu>
              <div className="mt-6"></div>
            </>
          )}

          {(pageMode == 'edit' || pageMode == 'ar-view') && (
            <>
              <h1 className="title is-3">{t('recently-opened-scene')}</h1>

              <SceneButtons
                scenes={scenes}
                enableMenu={pageMode === 'edit'}
                onSceneClick={onSceneClick}
                onDeleteClick={onDeleteClick}
                getTemporaryUrl={getTemporaryUrl}
              />
            </>
          )}

          {pageMode == 'webar-view' && (
            <>
              <h1 className="title is-3">{t('recently-opened-scene')}</h1>

              <SceneButtons
                scenes={scenes}
                enableMenu={false}
                onSceneClick={onSceneClick}
              />
            </>
          )}
        </div>
      </section>
    </>
  )
}

type TemporaryPomlResponse = {
  url: string
}

const getTemporaryPoml = async (
  pomlId: string
): Promise<TemporaryPomlResponse> => {
  const result = await fetch(`/api/temporary-poml/${pomlId}`)

  const response: TemporaryPomlResponse = await result.json()
  return response
}

const deletePoml = async (pomlId: string): Promise<boolean> => {
  const result = await fetch(`/api/poml/${pomlId}`, {
    method: 'DELETE',
  })

  return result.ok
}
