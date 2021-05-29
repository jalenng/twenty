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
const buttonIconClass = mergeStyles({ fontSize: 22, height: 22, width: 22 })

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    let mainButtonTooltip
    let mainButtonIconName
    let mainButtonOnClick

    if (this.props.isBlocked) {
      // Main button is a button to clear all blockers
      mainButtonTooltip = 'Clear blockers'
      mainButtonIconName = 'Clear'
      mainButtonOnClick = blockerSys.clear
    } else { // Main button is a button to toggle the timer
      mainButtonOnClick = timer.toggle
      if (this.props.isStopped) {
        mainButtonTooltip = 'Start'
        mainButtonIconName = 'Play'
      } else {
        mainButtonTooltip = 'Stop'
        mainButtonIconName = 'Pause'
      }
    }

    const mainButtonDisabled = this.props.isIdle

    return (

      <Stack horizontal tokens={{ childrenGap: 20 }}>

        {/* Main button */}
        <TooltipHost content={mainButtonTooltip}>
          <PrimaryButton
            id='toggleButton'
            disabled={mainButtonDisabled}
            onClick={mainButtonOnClick}
            style={buttonStyle}
            onRenderText={() => {
              return <FontIcon iconName={mainButtonIconName} className={buttonIconClass} />
            }}
          />
        </TooltipHost>

        {/* Preferences */}
        <TooltipHost content='Preferences'>
          <DefaultButton
            id='prefsButton'
            disabled={false}
            style={buttonStyle}
            onClick={openPrefs}
            onRenderText={() => {
              return <FontIcon iconName='Settings' className={buttonIconClass} />
            }}
          />
        </TooltipHost>

      </Stack>

    )
  }
}
