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
    calloutProps: { directionalHint: DirectionalHint.bottomCenter }
  },

  {
    headline: 'The 20-20-20 rule',
    contents: `Looking at computer screens for long periods of time strains our eyes. Every 20 minutes, ${appName} will remind you to look at something at least 20 feet away for 20 seconds, the duration it takes for your eyes to fully relax. `,
    target: '#timer',
    calloutProps: { directionalHint: DirectionalHint.rightCenter }
  },

  {
    headline: 'Start/stop button',
    contents: 'Start or stop the timer here. When the timer is stopped, you will not receive notifications. ',
    target: '#toggleButton',
    calloutProps: { directionalHint: DirectionalHint.bottomLeftEdge }
  },

  {
    headline: 'Preferences button',
    contents: 'Customize your notification intervals, sounds, blockers, and more here. ',
    target: '#prefsButton',
    calloutProps: { directionalHint: DirectionalHint.bottomRightEdge }
  },

  {
    headline: 'You\'re all set!',
    target: '#container',
    calloutProps: { directionalHint: DirectionalHint.topCenter }
  }
]

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      stageNumber: 0
    }
    this.handlePreviousStage = this.handlePreviousStage.bind(this)
    this.handleNextStage = this.handleNextStage.bind(this)
    this.handleClose = this.handleClose.bind(this)
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

    const stageNumber = this.state.stageNumber

    const primaryButtonProps = stageNumber === tutorialStages.length - 1
      ? buttonProps.finish
      : buttonProps.next

    const secondaryButtonProps = stageNumber === 0
      ? buttonProps.skip
      : buttonProps.previous

    if (stageNumber >= 0 && stageNumber < tutorialStages.length) {
      return (

        <Overlay isDarkThemed={true}>

          <TeachingBubble
            footerContent={`${stageNumber + 1}/${tutorialStages.length}`}
            hasSmallHeadline
            primaryButtonProps={primaryButtonProps}
            secondaryButtonProps={secondaryButtonProps}
            {...tutorialStages[stageNumber]}
          >
            {tutorialStages[stageNumber].contents}
          </TeachingBubble>

          {this.props.children}

        </Overlay>

      )
    } else {
      return (null)
    }
  }
}
