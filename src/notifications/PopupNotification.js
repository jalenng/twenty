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
  getTheme
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
    const iconStyle = { ...baseIconStyle, color: getTheme().palette.themePrimary }

    return (

      <div style={{
        position: 'absolute',
        paddingTop: '12px',
        paddingLeft: '18px'
      }}
      >

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
            </Stack>
          </Stack.Item>

        </Stack>

      </div>

    )
  }
}
