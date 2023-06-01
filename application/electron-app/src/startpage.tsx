import React from 'react'
import { createRoot } from 'react-dom/client'
import { StartPage } from 'spirare-babylonjs/src/startPage/startPage'
import { SceneInfo } from 'spirare-babylonjs/src/types'

import './i18n'

import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'

const getScenes = async (): Promise<SceneInfo[]> => {
  const scenes = await window.electronAPI.getRecentScenes()
  return scenes
}

const onDeleteClick = async (scene: SceneInfo): Promise<void> => {
  await window.electronAPI.deletePoml(scene)
  location.reload()
}

const openSceneFolder = async (scene: SceneInfo): Promise<void> => {
  await window.electronAPI.openSceneFolder(scene)
}

;(async () => {
  const startPageElement = document.getElementById('start-page')
  if (startPageElement == null) {
    return
  }

  try {
    const scenes = await getScenes()

    createRoot(startPageElement).render(
      <StartPage
        newScenePageUrl="./index.html"
        editorPageUrl="./index.html"
        scenes={scenes}
        onDeleteClick={onDeleteClick}
        openSceneFolder={openSceneFolder}
      ></StartPage>
    )
  } catch (ex) {
    console.log(ex)
  }
})()
