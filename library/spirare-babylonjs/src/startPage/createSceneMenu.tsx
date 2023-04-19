import React from 'react'
import { useTranslation } from 'react-i18next'

export const CreateSceneMenu: React.FC<{
  newScenePageUrl: string
}> = ({ newScenePageUrl }) => {
  const { t } = useTranslation()

  return (
    <>
      <h1 className="title is-3">{t('create-new-scene')}</h1>
      <div>
        <a
          className="button is-primary"
          href={`${newScenePageUrl}?run-mode=editor&placement-mode=geodetic`}
          style={{ margin: '3px' }}
        >
          {t('geo-placement-mode')}
        </a>
        <a
          className="button is-link"
          href={`${newScenePageUrl}?run-mode=editor&placement-mode=space`}
          style={{ margin: '3px' }}
        >
          {t('space-placement-mode')}
        </a>
      </div>
    </>
  )
}
