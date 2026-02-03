/**
 * @file The controls portion of the Timer. Allows user to start, stop, and unblock the timer,
 * as well as open the preferences window.
 * @author jalenng
 */

/* eslint-disable no-undef */

import React from 'react'

import {
  PrimaryButton, DefaultButton,
  TooltipHost,
  Stack,
  FontIcon,
  mergeStyles
} from '@fluentui/react'

const buttonStyle = { borderRadius: '20px', width: '40px', height: '40px' }
const buttonIconClass = mergeStyles({ fontSize: 20, height: 20, width: 20 })

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  handleToggleBtn () {
    timer.toggle()
  }

  render () {
    const primaryButtonIconName = this.props.isStopped ? 'Play' : 'Stop'
    const primaryButtonTooltip = this.props.isStopped ? 'Start' : 'Stop'

    return (

      <Stack horizontal tokens={{ childrenGap: 20 }}>

        {/* Main button */}
        <TooltipHost content={primaryButtonTooltip}>
          <PrimaryButton
            id='toggleBtn'
            disabled={this.props.disabled}
            onClick={this.handleToggleBtn}
            style={buttonStyle}
            onRenderText={() => {
              return <FontIcon key={primaryButtonIconName} iconName={primaryButtonIconName} className={buttonIconClass} />
            }}
          />
        </TooltipHost>

        {/* Preferences */}
        <TooltipHost content='Preferences'>
          <DefaultButton
            id='prefsBtn'
            disabled={false}
            style={buttonStyle}
            onClick={openPrefs}
            onRenderText={() => {
              return <FontIcon key="Settings" iconName='Settings' className={buttonIconClass} />
            }}
          />
        </TooltipHost>

      </Stack>

    )
  }
}
