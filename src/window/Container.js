/**
 * @file Serves as the container and background for the application.
 * @author jalenng
 */

/* eslint-disable no-undef */

import React from 'react'

import { ThemeProvider, createTheme, loadTheme, Stack } from '@fluentui/react'

import TitleBar from './TitleBar'
import themes from './Themes'

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = { currentThemeName: getThemeName() }
    this.updateTheme = this.updateTheme.bind(this)

    // Load theme globally
    loadTheme(createTheme(themes[this.state.currentThemeName]))
  }

  updateTheme (themeName) {
    this.setState({ currentThemeName: themeName })

    // Load theme globally
    loadTheme(createTheme(themes[this.state.currentThemeName]))
  }

  componentDidMount () {
    /* Update the theme when the theme to display changes */
    themeSys.eventSystem.on('update', themeName => this.updateTheme(themeName))
  }

  render () {
    const theme = themes[this.state.currentThemeName]
    const showTitleBar = !this.props.noTitleBar

    const width = this.props.width || '100%'
    const height = this.props.height || '100%'
    const noBorder = this.props.noBorder

    return (

      <ThemeProvider theme={theme}>

        <div
          id='container'
          style={{
            background: this.props.useSecondaryBackgroundColor ? theme.secondaryBackground : theme.background,
            width: width,
            height: height,
            border: noBorder ? '0px' : `1px solid ${theme.palette.neutralLight}`,
            borderRadius: noBorder ? '0px' : '8px',
            boxSizing: 'border-box',
            position: 'absolute'
          }}
        >

          <Stack>

            {showTitleBar && <TitleBar {...this.props.titleBarProps} />}

            {this.props.children}

          </Stack>

        </div>

      </ThemeProvider>

    )
  }
}
