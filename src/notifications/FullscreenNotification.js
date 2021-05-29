/**
 * @file The fullscreen timer notification
 * @author jalenng
 */

/* eslint-disable no-undef */

import React from 'react'

import {
  mergeStyles,
  FontIcon,
  Stack,
  Text
} from '@fluentui/react'

const iconClass = mergeStyles({
  fontSize: 128,
  height: 128,
  width: 128,
  margin: '0 25px',
  color: 'deepskyblue'
})

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      remainingTimeString: ''
    }

    breakSys.eventSystem.on('update', (event, breakStatus) => {
      const milliseconds = breakStatus.remainingTime
      const seconds = Math.floor((milliseconds % 60000) / 1000)

      const remainingTimeString = seconds === 1 ? `${seconds} more second` : `${seconds} more seconds`

      this.setState({
        remainingTimeString: remainingTimeString
      })
    })
  }

  componentDidMount () {
    breakSys.getStatus()
    setInterval(breakSys.getStatus, 100)
  }

  render () {
    return (
      <div>

        {/* Black background */}
        <div
          style={{
            background: '#000000',
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: -100
          }}
        />

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
                <FontIcon iconName='RedEye' className={iconClass} />
                <FontIcon iconName='Remove' className={iconClass} />
                <FontIcon iconName='Street' className={iconClass} />
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
