/**
 * @file The "Startup" tab in Preferences
 * @author jalenng
 */

/* eslint-disable no-undef */

import React from 'react'

import {
  Stack,
  Text,
  Toggle
} from '@fluentui/react'

import { StackProps } from '../../SharedProps'

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
    const appName = aboutAppInfo.appInfo.name

    return (
      <Stack id='startup' {...StackProps.level1}>

        <Stack {...StackProps.level2}>
          <Text variant='xLarge' block> Startup </Text>

          <Toggle
            label={`Start ${appName} when your computer starts up`}
            onText='On' offText='Off'
            checked={this.state.startAppOnLogin}
            onChange={(event, checked) => {
              store.preferences.set('startup.startAppOnLogin', checked)
            }}
          />
          <Toggle
            label={`Start the timer when ${appName} starts up`}
            onText='On' offText='Off'
            checked={this.state.startTimerOnAppStartup}
            onChange={(event, checked) => {
              store.preferences.set('startup.startTimerOnAppStartup', checked)
            }}
          />
          <Toggle
            label={`Hide the window when ${appName} starts up`}
            onText='On' offText='Off'
            checked={this.state.hideOnAppStartup}
            onChange={(event, checked) => {
              store.preferences.set('startup.hideOnAppStartup', checked)
            }}
          />
          <Toggle
            label={`Automatically restart the timer at 6 AM when ${appName} was stopped`}
            onText='On' offText='Off'
            checked={this.state.autoRestartTimer}
            onChange={(event, checked) => {
              store.preferences.set('startup.autoRestartTimer', checked)
            }}
          />
        </Stack>

      </Stack>
    )
  }
}
