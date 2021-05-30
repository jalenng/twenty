/**
 * @file Entry point for Electron's renderer processes
 * @author jalenng
 */

/* eslint-disable no-undef */

import React from 'react'
import ReactDOM from 'react-dom'
import './css/index.css'

import MainWindow from './MainWindow'
import PreferencesWindow from './PreferencesWindow'
import FullscreenNotification from './notifications/FullscreenNotification'
import PopupNotification from './notifications/PopupNotification'

import { HashRouter, Route, Switch } from 'react-router-dom'
import { initializeIcons } from '@fluentui/react'

/* Styling for components to make sure text is unselectable */
const unselectableTextStyle = {
  MozUserSelect: 'none',
  WebkitUserSelect: 'none',
  msUserSelect: 'none'
}

initializeIcons()

/* Render the application */
ReactDOM.render(
  <div style={unselectableTextStyle}>
    <React.StrictMode>
      <HashRouter>
        <Switch>
          <Route path='/' exact component={MainWindow} />

          <Route path='/fullscreenNotification' exact component={FullscreenNotification} />
          <Route path='/popupNotification' exact component={PopupNotification} />

          <Route path='/preferences' exact component={PreferencesWindow} />
        </Switch>
      </HashRouter>
    </React.StrictMode>
  </div>,
  document.getElementById('root')
)
