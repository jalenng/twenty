/**
 * @file The main window of the application. Provides an interface for the user to interact with the timer.
 * @author jalenng
 */

/* eslint-disable no-undef */

import React from 'react'

import { Stack } from '@fluentui/react'

import TimerDisplay from './timer/TimerDisplay'
import TimerControls from './timer/TimerControls'
import Dashboard from './timer/Dashboard'

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.updateState = this.updateState.bind(this)
    this._isMounted = false
  }

  componentDidMount () {
    this._isMounted = true
    timer.eventSystem.on('update', (event, status) => this.updateState(status))
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  updateState (status) {
    // Don't update state if component is not mounted
    if (!this._isMounted) return

    const remainingTime = status.remainingTime
    const totalDuration = status.totalDuration

    this.setState({
      // Get remaining percentage for progress bar
      remainingPercentage: remainingTime / totalDuration * 100,

      // Convert remaining time to M:SS format
      remainingTimeString: (() => {
        const minutes = Math.floor(remainingTime / 60000).toString()
        let seconds = Math.floor((remainingTime % 60000) / 1000)
        seconds = ('00' + seconds).substr(-2, 2)

        return `${minutes}:${seconds}`
      })(),

      // Convert end time to H:MM format
      endTimeString: (() => {
        let hours = status.endDate.getHours()
        hours = hours === 0 // Enforce 12-hour format. For hours, display 12 instead of 0.
          ? '12'
          : hours > 12
            ? (hours % 12).toString()
            : hours.toString()

        let minutes = status.endDate.getMinutes()
        minutes = ('00' + minutes).substr(-2, 2)

        return `${hours}:${minutes}`
      })(),

      isStopped: status.isStopped,
      isBlocked: status.isBlocked,
      isIdle: status.isIdle,
      disableButtons: status.isBlocked || status.isIdle
    })
  }

  render () {
    let timerDisplayChipProps

    if (!this.state.isStopped && !this.state.isBlocked) { // Chip shows end time
      timerDisplayChipProps = {
        showChip: true,
        chipTooltip: 'End time',
        chipIconName: 'Ringer',
        chipText: this.state.endTimeString
      }
    } else if (this.state.isBlocked) { // Chip shows blocked indicator
      timerDisplayChipProps = {
        showChip: true,
        chipTooltip: (() => { return <Dashboard /> })(),
        chipIconName: 'Blocked2'
      }
    } else {
      timerDisplayChipProps = {
        showChip: false
      }
    }

    return (
      <div id='timer'>
        <Stack vertical tokens={{ childrenGap: 8 }} horizontalAlign='center'>

          <TimerDisplay
            progressBarValue={this.state.remainingPercentage}
            text={this.state.remainingTimeString}
            {...timerDisplayChipProps}
          />

          <TimerControls
            isBlocked={this.state.isBlocked}
            isStopped={this.state.isStopped}
            isIdle={this.state.isIdle}
          />

        </Stack>

      </div>
    )
  }
}
