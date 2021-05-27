import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';

import App from './App';

import PrefsScreen from './preferences/PrefsScreen';

import FullscreenNotification from './notifications/FullscreenNotification';
import PopupNotification from './notifications/PopupNotification';

import Timer from './timer/Timer';

import ErrorBoundary from './ErrorBoundary';

import { HashRouter, Route, Switch } from 'react-router-dom';
import { loadTheme, createTheme, initializeIcons } from '@fluentui/react';

const myTheme = createTheme({
    palette: {
        themePrimary: '#309fff',
        themeLighterAlt: '#02060a',
        themeLighter: '#081929',
        themeLight: '#0f304d',
        themeTertiary: '#1d5f99',
        themeSecondary: '#2b8ce0',
        themeDarkAlt: '#45a8ff',
        themeDark: '#62b6ff',
        themeDarker: '#8bc9ff',
        neutralLighterAlt: '#3c3c3c',
        neutralLighter: '#444444',
        neutralLight: '#515151',
        neutralQuaternaryAlt: '#595959',
        neutralQuaternary: '#5f5f5f',
        neutralTertiaryAlt: '#7a7a7a',
        neutralTertiary: '#c8c8c8',
        neutralSecondary: '#d0d0d0',
        neutralPrimaryAlt: '#dadada',
        neutralPrimary: '#ffffff',
        neutralDark: '#f4f4f4',
        black: '#f8f8f8',
        white: '#1b1a19',
    }
});
loadTheme(myTheme);

initializeIcons();

// document.body.style = "background: #222222";

const unselectableTextStyle = {
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
}

ReactDOM.render(
    <div style={unselectableTextStyle}>
        <React.StrictMode>
            <ErrorBoundary>
                <HashRouter>
                    <Switch>
                        <Route path='/' exact component={App} />

                        <Route path='/fullscreenNotification' exact component={FullscreenNotification} />
                        <Route path='/popupNotification' exact component={PopupNotification} />

                        <Route path='/prefs' exact component={PrefsScreen} />
                    </Switch>
                </HashRouter>
            </ErrorBoundary>
        </React.StrictMode>
    </div>,
    document.getElementById('root')
);

