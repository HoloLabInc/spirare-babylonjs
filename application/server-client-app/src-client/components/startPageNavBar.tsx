import React, { useState } from 'react'
import { PageMode } from './startPageApp'

export const StartPageNavBar: React.FC<{
  pageMode: PageMode
  setPageMode: (pageMode: PageMode) => void
}> = ({ pageMode, setPageMode }) => {
  const [menuActive, setMenuActive] = useState(false)

  return (
    <>
      <nav
        className="navbar is-dark"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <p
            className="navbar-item"
            style={{ marginLeft: '10px', marginRight: '10px' }}
          >
            Spirare Editor
          </p>
          <a
            role="button"
            className={'navbar-burger ' + (menuActive ? 'is-active' : '')}
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarMenu"
            onClick={() => setMenuActive(!menuActive)}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div
          id="navbarMenu"
          className={'navbar-menu ' + (menuActive ? 'is-active' : '')}
        >
          <div className="navbar-start">
            <a
              className={
                'navbar-item ' + (pageMode === 'edit' ? 'is-active' : '')
              }
              onClick={() => {
                setPageMode('edit')
                setMenuActive(false)
              }}
              href="/"
            >
              Edit
            </a>
            <a
              className={
                'navbar-item ' + (pageMode === 'view' ? 'is-active' : '')
              }
              onClick={() => {
                setPageMode('view')
                setMenuActive(false)
              }}
              href="#view"
            >
              2D View
            </a>
            <a
              className={
                'navbar-item ' + (pageMode === 'ar-view' ? 'is-active' : '')
              }
              onClick={() => {
                setPageMode('ar-view')
                setMenuActive(false)
              }}
              href="#ar-view"
            >
              AR View
            </a>
            <a
              className={
                'navbar-item ' + (pageMode === 'webar-view' ? 'is-active' : '')
              }
              onClick={() => {
                setPageMode('webar-view')
                setMenuActive(false)
              }}
              href="#webar-view"
            >
              WebAR View
            </a>
          </div>
        </div>
      </nav>
    </>
  )
}
