import React from 'react'
import { WithTranslation, withTranslation } from 'react-i18next'
import { SceneInfo } from '../types'

const getSceneTitle = (scene: SceneInfo) => {
  return scene.title ?? '(no title)'
}

type SceneMenuProps = WithTranslation & {
  scene: SceneInfo
  onDeleteClick?: (scene: SceneInfo) => void
  getTemporaryUrl?: (scene: SceneInfo) => Promise<string>
  openSceneFolder?: (scene: SceneInfo) => Promise<void>
}

type SceneButtonState = {
  showClipboardNotification: boolean
}

class SceneMenu extends React.Component<SceneMenuProps, SceneButtonState> {
  state: SceneButtonState = {
    showClipboardNotification: false,
  }

  render() {
    const { t, scene, openSceneFolder } = this.props
    const onDeleteClick = this.props.onDeleteClick

    return (
      <>
        {this.state.showClipboardNotification && (
          <div
            className="notification is-primary is-light"
            style={{
              position: 'fixed',
              top: 60,
              right: 20,
              pointerEvents: 'none',
            }}
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            Copied to clipboard
          </div>
        )}
        <div className="level-right">
          <div
            className="dropdown is-hoverable post-options level-item"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <div className="dropdown-trigger mx-2">
              <span className="icon is-small">
                <i className="fas fa-ellipsis-h"></i>
              </span>
            </div>
            <div className="dropdown-menu" id="dropdown-menu-post">
              <div className="dropdown-content">
                {navigator.clipboard && this.props.getTemporaryUrl && (
                  <a
                    className="dropdown-item has-text-left"
                    onClick={async (_) => {
                      const temporaryUrl = await this.props.getTemporaryUrl?.(
                        scene
                      )
                      if (temporaryUrl !== undefined) {
                        await navigator.clipboard.writeText(temporaryUrl)
                        this.setState({ showClipboardNotification: true })
                        setTimeout(() => {
                          this.setState({ showClipboardNotification: false })
                        }, 2000)
                      }
                    }}
                  >
                    Copy temporary URL to clipboard
                  </a>
                )}
                {openSceneFolder && (
                  <a
                    className="dropdown-item has-text-left"
                    onClick={(_) => openSceneFolder(scene)}
                  >
                    Open scene folder
                  </a>
                )}
                <a
                  className="dropdown-item has-text-left"
                  onClick={(_) => {
                    const title = getSceneTitle(scene)
                    const result = confirm(
                      t('delete-scene-confirmation', { title }) ?? ''
                    )
                    if (result) {
                      onDeleteClick?.(scene)
                    }
                  }}
                >
                  Delete scene
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

const SceneMenuWithTranslation = withTranslation()(SceneMenu)

const getTooltipText = (scene: SceneInfo) => {
  switch (scene.pomlPathMode) {
    case 'id':
      return `Id: ${scene.pomlId}`
    case 'path':
      return `Filepath: ${scene.pomlPath}`
  }
}

export const SceneButton: React.FC<{
  scene: SceneInfo
  enableMenu?: boolean
  onSceneClick?: (scene: SceneInfo) => void
  onDeleteClick?: (scene: SceneInfo) => void
  getTemporaryUrl?: (scene: SceneInfo) => Promise<string>
  openSceneFolder?: (scene: SceneInfo) => Promise<void>
}> = ({
  scene,
  enableMenu,
  onSceneClick,
  onDeleteClick,
  getTemporaryUrl,
  openSceneFolder,
}) => {
  const title = getSceneTitle(scene)
  const tooltip = getTooltipText(scene)

  return (
    <div
      className={`card column is-one-quarter mx-5 button level ${
        scene.placementMode === 'space' ? 'is-link' : 'is-primary'
      }`}
      onClick={() => onSceneClick?.(scene)}
      title={tooltip}
      style={{
        height: 'max-content',
        whiteSpace: 'inherit',
      }}
    >
      {enableMenu && (
        <SceneMenuWithTranslation
          scene={scene}
          onDeleteClick={onDeleteClick}
          getTemporaryUrl={getTemporaryUrl}
          openSceneFolder={openSceneFolder}
        />
      )}

      <p
        className={`has-text-centered ${enableMenu ? 'mb-5' : 'my-3'}`}
        style={{
          overflowWrap: 'break-word',
        }}
      >
        {title}
      </p>
    </div>
  )
}
