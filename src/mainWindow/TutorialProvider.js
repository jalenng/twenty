/**
 * @file
 * @author jalenng
 */

/* eslint-disable no-undef */

import React from 'react'

import { TeachingBubble, Overlay, DirectionalHint } from '@fluentui/react'

const appName = aboutAppInfo.appInfo.name

const tutorialModeSize = {
  width: 1280,
  height: 720
}

const tutorialStages = [
  {
    headline: `Welcome to ${appName}.`,
    contents: 'For a quick overview, click ‘Next’.',
    target: '#container',
    direction: 'topCenter'
  },

  {
    headline: 'The 20-20-20 rule',
    contents: 'Looking at screens for long periods of time strains our eyes. The 20-20-20 rule suggests that for every 20 minutes, look at something at least 20 feet away for 20 seconds. ',
    target: '#container',
    direction: 'leftCenter'
  },

  {
    headline: 'Timer',
    contents: 'This timer keeps track of the 20-minute intervals for you. When the timer ends, you will be reminded and the timer will be restarted automatically. ',
    target: '#timer',
    direction: 'leftCenter'
  },

  {
    headline: 'Start/stop button',
    contents: 'Start and stop the timer here. When the timer is stopped, you will not receive notifications. ',
    target: '#toggleButton',
    direction: 'bottomRightEdge'
  },

  {
    headline: 'Preferences button',
    contents: 'Customize your notifications, blockers, and more here. ',
    target: '#prefsButton',
    direction: 'bottomLeftEdge'
  },

  {
    headline: 'You\'re all set!',
    target: '#container',
    direction: 'rightCenter'
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
    // Open tutorial if the tutorial has not been completed or skipped yet
    if (!store.tutorialFlag.get()) this.handleOpen()
  }

  handleOpen () {
    this.savedWidth = window.innerWidth
    this.savedHeight = window.innerHeight
    window.resizeTo(tutorialModeSize.width, tutorialModeSize.height)

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
    store.tutorialFlag.set(true)
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
        text: 'Let\'s start!',
        onClick: this.handleClose
      },
      skip: {
        text: 'Skip',
        onClick: this.handleClose
      }
    }

    // Create the TeachingBubbles
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

    // Render the UI
    if (this.state.stageNumber === -1) {
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
