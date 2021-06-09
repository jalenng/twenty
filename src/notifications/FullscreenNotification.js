/**
 * @file The fullscreen timer notification
 * @author jalenng
 */

/* eslint-disable no-undef */

import React from 'react'

import {
  FontIcon,
  Stack,
  Text,
  getTheme
} from '@fluentui/react'

const baseIconStyle = {
  fontSize: 128,
  height: 128,
  width: 128,
  margin: '0 25px',
  color: 'deepskyblue'
}

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      remainingTimeString: ''
    }
    this.updateState = this.updateState.bind(this)
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
      remainingTimeString: remainingTimeString
    })
  }

  render () {
    const iconStyle = { ...baseIconStyle, color: getTheme().palette.themePrimary }

    return (
      <div>

        {/* Center graphic and text */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
        >

          <Stack tokens={{ childrenGap: 16 }}>
            <Stack.Item align='center'>
              <Stack horizontal verticalAlign='center'>
                <FontIcon iconName='RedEye' style={iconStyle} />
                <FontIcon iconName='Remove' style={iconStyle} />
                <FontIcon iconName='Street' style={iconStyle} />
              </Stack>

            </Stack.Item>

            <Stack.Item align='center'>
              <Text variant='xxLarge'>
                Look at something 20 feet away.
              </Text>
            </Stack.Item>

            <Stack.Item align='center'>
              <Text variant='xLarge' align='center'>
                {this.state.remainingTimeString}
              </Text>
            </Stack.Item>

          </Stack>

        </div>

        {/* Bottom text */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '90%',
          transform: 'translate(-50%, -50%)'
        }}
        >
          <Text variant='large' align='center'>
            The timer will reset upon mouse movement.
          </Text>
        </div>

      </div>

    )
  }
}
