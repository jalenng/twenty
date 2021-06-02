/**
 * @file The "Appearance" tab in Preferences
 * @author jalenng
 */

/* eslint-disable no-undef */

import React from 'react'

import {
  Stack,
  Text,
  Toggle,
  ChoiceGroup
} from '@fluentui/react'

import { StackProps } from '../../SharedProps'

const themeOptions = [
  {
    key: 'system',
    text: 'System default ',
    iconProps: { iconName: 'Personalize' }
  },
  {
    key: 'light',
    text: 'Light',
    iconProps: { iconName: 'Sunny' }
  },
  {
    key: 'dark',
    text: 'Dark',
    iconProps: { iconName: 'ClearNight' }
  }
]

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = store.preferences.getAll().appearance
  }

  componentDidMount () {
    // Update this component's state when preferences are updated
    store.preferences.eventSystem.on('changed', () => {
      this.updateState()
    })
  }

  updateState () {
    this.setState(store.preferences.getAll().appearance)
  }

  render () {
    return (
      <Stack id='appearance' {...StackProps.level1}>

        <Stack {...StackProps.level2}>
          <Text variant='xLarge' block> Appearance </Text>

          <ChoiceGroup
            label='Theme'
            styles={{ dropdown: { width: 300 } }}
            selectedKey={this.state.theme}
            options={themeOptions}
            onChange={(event, selection) => {
              store.preferences.set('appearance.theme', selection.key)
            }}
          />

          <Toggle
            label='Show the main window above other windows'
            onText='On' offText='Off'
            checked={this.state.alwaysOnTop}
            onChange={(event, checked) => {
              store.preferences.set('appearance.alwaysOnTop', checked)
            }}
          />
        </Stack>

      </Stack>
    )
  }
}
