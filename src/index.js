/**
 * @file Entry point for Electron's renderer processes
 * @author jalenng
 */

/* eslint-disable no-undef */

import React from 'react'
import ReactDOM from 'react-dom'
import './css/index.css'

import { UnselectableTextStyle } from './SharedStyles'

import Container from './window/Container'

import TutorialProvider from './mainWindow/tutorial/TutorialProvider'

import FullscreenNotification from './notifications/FullscreenNotification'
import PopupNotification from './notifications/PopupNotification'

import MainWindowContent from './mainWindow/MainWindowContent'
import PreferencesContent from './preferences/PreferencesContent'

import { HashRouter, Route, Routes } from 'react-router-dom'
import { initializeIcons } from '@fluentui/react'

initializeIcons('./assets/fonts/')

/* Function components for the windows */
function MainWindow (props) {
  return (

    <TutorialProvider>

      <Container>
        <MainWindowContent />
      </Container>

    </TutorialProvider>

  )
}

function PreferencesWindow (props) {
  return (
    <Container titleBarProps={{ noPin: true }}>
      <PreferencesContent />
    </Container>
  )
}

function FullscreenNotificationWindow (props) {
  return (
    <Container noBorder noTitleBar useSecondaryBackgroundColor>
      <FullscreenNotification />
    </Container>
  )
}

function PopupNotificationWindow (props) {
  return (
    <Container noTitleBar>
      <PopupNotification />
    </Container>
  )
}

/* Render the application */
ReactDOM.render(
  <div style={{ ...UnselectableTextStyle, width: '100%', height: '100%' }}>
    <React.StrictMode>
      <HashRouter>
        <Routes>
          <Route path='/' exact element={<MainWindow />} />

          <Route path='/fullscreenNotification' exact element={<FullscreenNotificationWindow />} />
          <Route path='/popupNotification' exact element={<PopupNotificationWindow />} />

          <Route path='/preferences' exact element={<PreferencesWindow />} />
        </Routes>
      </HashRouter>
    </React.StrictMode>
  </div>,
  document.getElementById('root')
)
