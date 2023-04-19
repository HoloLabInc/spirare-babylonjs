import React from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import { ScenesResponse } from '../src/types'
import { SceneInfo } from 'spirare-babylonjs/src/types'
import { StartPageApp } from './components/startPageApp'

const getScenes = async (): Promise<SceneInfo[]> => {
  const result = await fetch('/api/scenes')
  const response: ScenesResponse = await result.json()
  return response
}

;(async () => {
  const startPageElement = document.getElementById('start-page')
  if (startPageElement == null) {
    return
  }

  try {
    const scenes = await getScenes()

    createRoot(startPageElement).render(
      <StartPageApp
        newScenePageUrl="./editor"
        editorPageUrl="./editor"
        viewerPageUrl="./editor"
        webArPageUrl="./8thwall"
        scenes={scenes}
      ></StartPageApp>
    )
  } catch (ex) {
    console.log(ex)
  }
})()
