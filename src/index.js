import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';

import App from './App';
import PrefsScreen from './preferences/PrefsScreen';
import FullscreenNotification from './notifications/FullscreenNotification';
import PopupNotification from './notifications/PopupNotification';
import Window from './Window';
import ErrorBoundary from './ErrorBoundary';

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
            <ErrorBoundary>
                <HashRouter>
                    <Window>
                        <Switch>
                            <Route path='/' exact component={App} />

                            <Route path='/fullscreenNotification' exact component={FullscreenNotification} />
                            <Route path='/popupNotification' exact component={PopupNotification} />

                            <Route path='/prefs' exact component={PrefsScreen} />
                        </Switch>
                    </Window>
                </HashRouter>
            </ErrorBoundary>
        </React.StrictMode>
    </div>,
    document.getElementById('root')
);