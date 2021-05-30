/* eslint-disable no-undef */

/**
 * @file Provides a draggable title bar with a Close button and optional secondary button.
 * @author jalenng
 */

import React from 'react'

import {
  TooltipHost,
  DefaultButton,
  Stack,
  IconButton,
  DirectionalHint,
  getTheme
} from '@fluentui/react'

const sharedStackProps = {
  horizontal: true,
  verticalAlign: 'center',
  styles: { root: { height: '36px' } },
  tokens: { childrenGap: '6px' }
}

const topLeftStyle = {
  position: 'absolute',
  top: '6px',
  left: '6px'
}

const topCenterStyle = {
  position: 'absolute',
  top: '6px',
  left: '50%',
  transform: 'translate(-50%, 0%)'
}

const topRightStyle = {
  position: 'absolute',
  top: '6px',
  right: '6px'
}

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isPinned: false
    }
    this.handlePin = this.handlePin.bind(this)
    this.updatePinnedState = this.updatePinnedState.bind(this)
  }

  handleClose () {
    window.close()
  }

  updatePinnedState (isPinned) {
    this.setState({
      ...this.state,
      isPinned: isPinned
    })
  }

  handlePin () {
    togglePin().then(isPinned => { this.updatePinnedState(isPinned) })
  }

  render () {
    const isMacOS = platform === 'darwin'

    const buttonIconColor = getTheme().palette.neutralPrimary

    return (

      <div style={{ display: 'inline-block', height: '42px', WebkitAppRegion: 'drag' }}>

        {/* Handle decor */}
        <Stack {...sharedStackProps} style={topCenterStyle}>
          <DefaultButton
            style={{ borderRadius: '20px', width: '16px', height: '8px', margin: '0px 8px' }}
            disabled
          />
        </Stack>

        {/* Top left */}
        <Stack {...sharedStackProps} style={topLeftStyle}>

          {/* macOS: Close button */}
          {isMacOS && !this.props.hideClose &&
            <TooltipHost
              content='Close'
              calloutProps={{ directionalHint: DirectionalHint.bottomCenter }}
            >
              <IconButton
                iconProps={{ iconName: 'CircleFill' }}
                style={{ WebkitAppRegion: 'no-drag' }}
                styles={{
                  root: { color: '#ff6159' },
                  rootHovered: { color: '#ff6159' },
                  rootPressed: { color: '#bf4942' }
                }}
                onClick={this.handleClose}
              />
            </TooltipHost>}

        </Stack>

        {/* Top right */}
        <Stack {...sharedStackProps} style={topRightStyle}>

          {/* Secondary button */}
          <TooltipHost
            content='Always show on top'
            calloutProps={{ directionalHint: DirectionalHint.bottomCenter }}
          >
            <IconButton
              iconProps={{ iconName: 'Pinned' }}
              style={{ WebkitAppRegion: 'no-drag' }}
              styles={{ root: { color: buttonIconColor } }}
              toggle
              checked={this.state.isPinned}
              onClick={this.handlePin}
            />
          </TooltipHost>

          {/* non-macOS: Close button */}
          {!isMacOS && !this.props.hideClose &&
            <TooltipHost
              content='Close'
              calloutProps={{ directionalHint: DirectionalHint.bottomCenter }}
            >
              <IconButton
                iconProps={{ iconName: 'Cancel' }}
                style={{ WebkitAppRegion: 'no-drag' }}
                styles={{
                  root: { color: buttonIconColor },
                  rootHovered: { color: '#ffffff', background: '#E81123' },
                  rootPressed: { color: '#ffffff', background: '#f1707a' }
                }}
                onClick={this.handleClose}
              />
            </TooltipHost>}

        </Stack>

      </div>

    )
  }
}
