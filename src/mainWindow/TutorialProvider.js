/**
 * @file
 * @author jalenng
 */

/* eslint-disable no-undef */

import React from 'react'

import { TeachingBubble, Overlay, DirectionalHint } from '@fluentui/react'

const appName = aboutAppInfo.appInfo.name

const tutorialStages = [
  {
    headline: `Welcome to ${appName}.`,
    contents: 'For a quick overview, click ‘Next’.',
    target: '#container',
    direction: 'bottomCenter'
  },

  {
    headline: 'The 20-20-20 rule',
    contents: `Looking at computer screens for long periods of time strains our eyes. Every 20 minutes, ${appName} will remind you to look at something at least 20 feet away for 20 seconds, the duration it takes for your eyes to fully relax. `,
    target: '#timer',
    direction: 'rightCenter'
  },

  {
    headline: 'Start/stop button',
    contents: 'Start or stop the timer here. When the timer is stopped, you will not receive notifications. ',
    target: '#toggleButton',
    direction: 'bottomLeftEdge'
  },

  {
    headline: 'Preferences button',
    contents: 'Customize your notification intervals, sounds, blockers, and more here. ',
    target: '#prefsButton',
    calloutProps: 'bottomRightEdge'
  },

  {
    headline: 'You\'re all set!',
    target: '#container',
    calloutProps: 'topCenter'
  }
]

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      stageNumber: -1
    }
    this.handlePreviousStage = this.handlePreviousStage.bind(this)
    this.handleNextStage = this.handleNextStage.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleOpen = this.handleOpen.bind(this)

    this.savedWidth = 0
    this.savedHeight = 0
  }

  componentDidMount () {
    setTimeout(this.handleOpen, 3000)
  }

  handleOpen () {
    this.savedWidth = window.innerWidth
    this.savedHeight = window.innerHeight
    window.resizeTo(1280, 960)

    setTimeout(() => {
      this.setState({
        ...this.state,
        stageNumber: 0
      })
    }, 10)
  }

  handlePreviousStage () {
    this.setState({
      ...this.state,
      stageNumber: Math.max(this.state.stageNumber - 1, 0)
    })
  }

  handleNextStage () {
    this.setState({
      ...this.state,
      stageNumber: Math.min(this.state.stageNumber + 1, tutorialStages.length - 1)
    })
  }

  handleClose () {
    this.setState({
      ...this.state,
      stageNumber: -1
    })
    window.resizeTo(this.savedWidth, this.savedHeight)
  }

  render () {
    const buttonProps = {
      previous: {
        text: 'Previous',
        onClick: this.handlePreviousStage
      },
      next: {
        text: 'Next',
        onClick: this.handleNextStage
      },
      finish: {
        text: 'Finish!',
        onClick: this.handleClose
      },
      skip: {
        text: 'Skip',
        onClick: this.handleClose
      }
    }

    const tutorialPopups = tutorialStages.map((stageProps, index) => {
      
      const primaryButtonProps = index === tutorialStages.length - 1
        ? buttonProps.finish
        : buttonProps.next

      const secondaryButtonProps = index === 0
        ? buttonProps.skip
        : buttonProps.previous

      return (

        <TeachingBubble
          key={index}
          footerContent={`${index + 1}/${tutorialStages.length}`}
          hasSmallHeadline
          primaryButtonProps={primaryButtonProps}
          secondaryButtonProps={secondaryButtonProps}
          headline={stageProps.headline}
          contents={stageProps.contents}
          target={stageProps.target}
          calloutProps={{
            directionalHint: DirectionalHint[stageProps.direction],
            hidden: this.state.stageNumber !== index
          }}
        >
          {stageProps.contents}
        </TeachingBubble>


      )
    })

    if (this.props.stageNumber === -1) {
      return (this.props.children)
    } else {
      return (

        <Overlay isDarkThemed>

          {tutorialPopups}

          <div style={{
            width: this.savedWidth,
            height: this.savedHeight,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            position: 'absolute'
          }}
          >

            {this.props.children}

          </div>

        </Overlay>

      )
    }
  }
}
