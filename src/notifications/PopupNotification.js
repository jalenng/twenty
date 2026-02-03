/**
 * @file The popup timer notification
 * @author jalenng
 */

/* eslint-disable no-undef */

import React from 'react'

import {
  FontIcon,
  Stack,
  Text,
  getTheme,
  DefaultButton,
  PrimaryButton
} from '@fluentui/react'

const baseIconStyle = {
  fontSize: 24,
  height: 24,
  width: 24,
  marginRight: 12
}

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      remainingTimeString: ''
    }
    this.updateState = this.updateState.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleDelay = this.handleDelay.bind(this)
  }

  componentDidMount () {
    // Register listener that listens to break status updates
    breakSys.eventSystem.on('update', (event, status) => this.updateState(status))
  }

  updateState (status) {
    const milliseconds = status.remainingTime
    const seconds = Math.floor((milliseconds % 60000) / 1000)

    const remainingTimeString = seconds === 1 ? `${seconds} more second` : `${seconds} more seconds`

    this.setState({
      remainingTimeString
    })
  }

  handleCancel () {
    window.cancelBreak()
  }

  handleDelay () {
    const snoozeSeconds = window.store.preferences.getAll().notifications.snoozeSeconds || 120
    window.delayBreak(snoozeSeconds)
  }

  render () {
    const iconStyle = { ...baseIconStyle, color: getTheme().palette.themePrimary }

    return (
      <div style={{
        position: 'absolute',
        paddingTop: '12px',
        paddingLeft: '18px'
      }}>
        <Stack horizontal token={{ childrenGap: 32 }}>
          <Stack.Item>
            <FontIcon iconName='RedEye' style={iconStyle} />
          </Stack.Item>
          <Stack.Item>
            <Stack>
              <Text variant='large'> <b>Time for a break. </b> </Text>
              <Text variant='medium'> Look at something 20 feet away. </Text>
              <Text variant='medium' align='center'>
                {this.state.remainingTimeString}
              </Text>
              <Stack horizontal tokens={{ childrenGap: 8 }} style={{ marginTop: 16 }}>
                <PrimaryButton onClick={this.handleCancel}>Cancel</PrimaryButton>
                <DefaultButton onClick={this.handleDelay}>Snooze for {window.store.preferences.getAll().notifications.snoozeSeconds || 120} seconds</DefaultButton>
              </Stack>
            </Stack>
          </Stack.Item>
        </Stack>
      </div>
    )
  }
}
