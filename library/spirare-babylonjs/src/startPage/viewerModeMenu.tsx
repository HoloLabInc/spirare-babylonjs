import React from 'react'
import { useTranslation } from 'react-i18next'

export const ViewerModeMenu: React.FC<{
  viewerPageUrl: string
}> = ({ viewerPageUrl: viewerPageUrl }) => {
  const { t } = useTranslation()
  return (
    <>
      <h1 className="title is-3">2D View Mode</h1>
      <div>
        <a
          className="button is-primary"
          href={`${viewerPageUrl}?run-mode=viewer&placement-mode=geodetic`}
          style={{ margin: '3px' }}
        >
          {t('geo-placement-mode')}
        </a>
        <a
          className="button is-link"
          href={`${viewerPageUrl}?run-mode=viewer&placement-mode=space`}
          style={{ margin: '3px' }}
        >
          {t('space-placement-mode')}
        </a>
      </div>
    </>
  )
}
