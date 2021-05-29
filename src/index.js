/**
 * @file Entry point for Electron's renderer processes
 * @author jalenng
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';

import App from './App';
import Preferences from './Preferences';
import FullscreenNotification from './notifications/FullscreenNotification';
import PopupNotification from './notifications/PopupNotification';
import Container from './window/Container';

import { HashRouter, Route, Switch } from 'react-router-dom';
import { initializeIcons } from '@fluentui/react';

/* Styling for components to make sure text is unselectable */
const unselectableTextStyle = {
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
}

initializeIcons();

/* Render the application */
ReactDOM.render(
    <div style={unselectableTextStyle}>
        <React.StrictMode>
            <Container>
                <HashRouter>
                    <Switch>
                        <Route path='/' exact component={App} />

                        <Route path='/fullscreenNotification' exact component={FullscreenNotification} />
                        <Route path='/popupNotification' exact component={PopupNotification} />

                        <Route path='/preferences' exact component={Preferences} />
                    </Switch>
                </HashRouter>
            </Container>
        </React.StrictMode>
    </div>,
    document.getElementById('root')
);