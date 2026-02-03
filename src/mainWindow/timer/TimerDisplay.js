/**
 * @file The display portion of the Timer. Sole purpose is to display timer status.
 * @author jalenng
 */

/* eslint-disable no-undef */

import React from 'react'

import {
  Text,
  Stack,
  getTheme
} from '@fluentui/react'
import Circle from 'react-circle'

import Chip from './Chip'

const circleProps = {
  animate: true,
  animationDuration: '1s',
  size: 200,
  lineWidth: 10,
  roundedStroke: true,
  showPercentage: false
}

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const remainingTime = this.props.remainingTime
    const totalDuration = this.props.totalDuration

    let percentage
    let timerString

    if (remainingTime === undefined || totalDuration === undefined) {
      percentage = 0
      timerString = '--:--'
    } else {
      // Get remaining percentage for progress bar
      percentage = remainingTime / totalDuration * 100

      // Convert remaining time to M:SS format
      const minutes = Math.floor(remainingTime / 60000).toString()
      let seconds = Math.floor((remainingTime % 60000) / 1000)
      seconds = ('00' + seconds).substr(-2, 2)

      timerString = `${minutes}:${seconds}`
    }

    return (

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      onDoubleClick={() => window.triggerBreak()}
      >

        {/* Circular progress bar */}
        <Circle
          {...circleProps}
          progress={percentage}
          progressColor={getTheme().palette.themePrimary}
          bgColor={getTheme().palette.neutralLighter}
        />

        {/* Timer information */}
        <div className='time' style={{ position: 'absolute' }}>
          <Stack vertical horizontalAlign='center'>

            {/* Remaining time */}
            <Text variant='xLarge' style={{ fontSize: '3rem' }} block>
              <div id='remainingTimeText'>
                {timerString}
              </div>
            </Text>

            {/* Chip */}
            <Chip {...this.props.chipProps} />

          </Stack>
        </div>

      </div>

    )
  }
}
