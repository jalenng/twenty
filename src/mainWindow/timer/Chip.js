/**
 * @file
 * @author jalenng
 */

/* eslint-disable no-undef */

import React from 'react'

import {
  DirectionalHint,
  DefaultButton,
  TooltipHost
} from '@fluentui/react'

const chipStyle = { borderRadius: '20px', width: '40px', height: '28px' }

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    if (this.props.hidden) {
      return null
    } else {
      return (
        <TooltipHost
          content={this.props.tooltip}
          calloutProps={{ directionalHint: DirectionalHint.bottomCenter }}
        >
          <DefaultButton
            id='timerChip'
            style={chipStyle}
            iconProps={{ iconName: this.props.iconName }}
            text={this.props.text}
            disabled
          />
        </TooltipHost>
      )
    }
  }
}
