/**
 * @file The main window of the application. Provides an interface for the user to interact with the timer.
 * @author jalenng
 */

/* eslint-disable no-undef */

import React from 'react'

import { Stack } from '@fluentui/react'

import TimerDisplay from './timer/TimerDisplay'
import TimerControls from './timer/TimerControls'
import BlockersTooltip from './timer/BlockersTooltip'

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.updateState = this.updateState.bind(this)
  }

  componentDidMount () {
    // Register listener that listens to timer status updates
    timer.eventSystem.on('update', (event, status) => this.updateState(status))
  }

  updateState (status) {
    // Process end time to a string in H:MM format that the chip can display
    let endTimeHours = status.endDate.getHours()
    endTimeHours = endTimeHours === 0 // Enforce 12-hour format. For hours, display 12 instead of 0.
      ? '12'
      : endTimeHours > 12
        ? (endTimeHours % 12).toString()
        : endTimeHours.toString()

    let endTimeMinutes = status.endDate.getMinutes()
    endTimeMinutes = ('00' + endTimeMinutes).substr(-2, 2)
    const endTimeString = `${endTimeHours}:${endTimeMinutes}`

    this.setState({

      remainingTime: status.remainingTime,
      totalDuration: status.totalDuration,

      // Determine chip properties
      chipProps: status.isBlocked
        ? {
            hidden: status.isStopped,
            iconName: 'Blocked2',
            tooltip: <BlockersTooltip />

          }
        : {
            hidden: status.isStopped,
            iconName: 'Ringer',
            text: endTimeString,
            tooltip: 'End time'
          },

      // Determine timer control properties based on status
      isStopped: status.isStopped,
      controlsDisabled: status.isBlocked || status.isIdle
    })
  }

  // Render the timer display and controls
  render () {
    return (
      <div id='timer'>
        <Stack vertical tokens={{ childrenGap: 8 }} horizontalAlign='center'>

          <TimerDisplay
            totalDuration={this.state.totalDuration}
            remainingTime={this.state.remainingTime}
            chipProps={this.state.chipProps}
          />

          <TimerControls
            isStopped={this.state.isStopped}
            disabled={this.state.controlsDisabled}
          />

        </Stack>

      </div>
    )
  }
}
