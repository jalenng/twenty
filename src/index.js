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

import { HashRouter, Route, Switch } from 'react-router-dom'
import { initializeIcons } from '@fluentui/react'

initializeIcons()

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
        <Switch>
          <Route path='/' exact component={MainWindow} />

          <Route path='/fullscreenNotification' exact component={FullscreenNotificationWindow} />
          <Route path='/popupNotification' exact component={PopupNotificationWindow} />

          <Route path='/preferences' exact component={PreferencesWindow} />
        </Switch>
      </HashRouter>
    </React.StrictMode>
  </div>,
  document.getElementById('root')
)
