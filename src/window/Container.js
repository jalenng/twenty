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

  static defaultProps = {
    width: '100%',
    height: '100%',
    noBorder: false
  }

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

    return (

      <ThemeProvider theme={theme}>

        <div 
          id='container'
          style={{
            background: theme.background,
            width: this.props.width,
            height: this.props.height,
            border: this.props.noBorder ? '0px' : `1px solid ${theme.palette.neutralLight}`,
            borderRadius: this.props.noBorder ? '0px' : '8px',
            boxSizing: 'border-box',
            position: 'absolute',
          }}
        >
        
          <Stack>

            {showTitleBar && <TitleBar {...this.props.titleBarProps}/>}
            
            {this.props.children}
          
          </Stack>

        </div>

      </ThemeProvider>

    )
  }
}
