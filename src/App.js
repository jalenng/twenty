/* eslint-disable no-undef */

import React from 'react'

import { Stack } from '@fluentui/react'

import TitleBar from './window/TitleBar'
import Timer from './timer/Timer'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alwaysOnTop: store.preferences.getAll().appearance.alwaysOnTop
    }
  }

  componentDidMount () {
    // Update this component's state when preferences are updated
    store.preferences.eventSystem.on('changed', () => {
      this.updateState()
    })
  }

  updateState () {
    this.setState({
      alwaysOnTop: store.preferences.getAll().appearance.alwaysOnTop
    })
  }

  render () {
    return (

      <Stack>

        <TitleBar secondaryButton={{
          tooltip: 'Always show on top',
          iconName: 'Pinned',
          checked: this.state.alwaysOnTop,
          onClick: () => {
            store.preferences.set('appearance.alwaysOnTop', !this.state.alwaysOnTop)
          }
        }}
        />

        <Timer />

      </Stack>

    )
  }
}
