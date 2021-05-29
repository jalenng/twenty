/**
 * @file Serves as the container and background for the application.
 * @author jalenng
 */

import React from 'react';

import { ThemeProvider, createTheme, loadTheme } from '@fluentui/react';

import ErrorBoundary from './ErrorBoundary';
import themes from './Themes';

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = { currentThemeName: getThemeName() };
        this.updateTheme = this.updateTheme.bind(this);

        // Load theme globally
        loadTheme(createTheme(themes[this.state.currentThemeName]));
    }

    updateTheme(themeName) {
        this.setState({ currentThemeName: themeName });

        // Load theme globally
        loadTheme(createTheme(themes[this.state.currentThemeName]));
    }

    componentDidMount() {
        /* Update the theme when the theme to display changes */
        themeSys.eventSystem.on('update', themeName => this.updateTheme(themeName));
    }

    render() {

        const theme = themes[this.state.currentThemeName];

        return (

            <ThemeProvider theme={theme}>
                <div style={{
                    background: theme.background,
                    border: `1px solid ${theme.palette.neutralLight}`,
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    borderRadius: '8px',
                    boxSizing: 'border-box'
                }}>

                    <ErrorBoundary>
                        {this.props.children}
                    </ErrorBoundary>

                </div>
            </ThemeProvider>

        );
    }
}

