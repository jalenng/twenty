/* eslint-disable no-undef */

import React from 'react'

import {
  Stack,
  Text,
  Toggle
} from '@fluentui/react'

import { level1Props, level2Props } from './PrefsStackProps'

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = store.preferences.getAll().startup
  }

  componentDidMount () {
    // Update this component's state when preferences are updated
    store.preferences.eventSystem.on('changed', () => {
      this.updateState()
    })
  }

  updateState () {
    this.setState(store.preferences.getAll().startup)
  }

  render () {
    return (
      <Stack id='startup' {...level1Props}>

        <Stack {...level2Props}>
          <Text variant='xLarge' block> Startup </Text>

          <Toggle
            label='Start iCare when your computer starts up'
            onText='On' offText='Off'
            checked={this.state.startAppOnLogin}
            onChange={(event, checked) => {
              store.preferences.set('startup.startAppOnLogin', checked)
            }}
          />
          <Toggle
            label='Start the timer when iCare starts up'
            onText='On' offText='Off'
            checked={this.state.startTimerOnAppStartup}
            onChange={(event, checked) => {
              store.preferences.set('startup.startTimerOnAppStartup', checked)
            }}
          />
          <Toggle
            label='Hide the window when iCare starts up'
            onText='On' offText='Off'
            checked={this.state.hideOnAppStartup}
            onChange={(event, checked) => {
              store.preferences.set('startup.hideOnAppStartup', checked)
            }}
          />
        </Stack>

      </Stack>
    )
  }
}
