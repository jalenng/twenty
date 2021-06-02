/**
 * @file Presents a first-run experience providing an overview of the features and UI.
 * @author jalenng
 */

/* eslint-disable no-undef */

import React from 'react'

import { TeachingBubble, Overlay, DirectionalHint } from '@fluentui/react'

import { AbsoluteCenterStyle } from '../../SharedStyles'
import TutorialStages from './TutorialStages'

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
  }

  componentDidMount () {
    // Open tutorial if the tutorial has not been completed
    if (!store.tutorialFlag.get()) this.handleOpen()
  }

  handleOpen () {
    // Save original size of window to use in the tutorial
    this.savedWidth = window.innerWidth
    this.savedHeight = window.innerHeight

    // Make window unmovable and fullscreen in the tutorial
    setMovable(false)
    setFullscreen(true)

    setTimeout(() => {
      this.setState({
        ...this.state,
        stageNumber: 0
      })
    }, 100) // Small delay needed so teaching bubbles can be placed in the correct positions
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
      stageNumber: Math.min(this.state.stageNumber + 1, TutorialStages.length - 1)
    })
  }

  handleClose () {
    this.setState({
      ...this.state,
      stageNumber: -1
    })

    // Marks completion of tutorial, ensuring it will not show again on next launch
    store.tutorialFlag.set(true)

    // Make window movable once again, and restore window to original size
    setMovable(true)
    setFullscreen(false)
  }

  render () {
    // Map the stages to teaching bubbles
    const teachingBubbles = TutorialStages.map((stage, index) => {
      // Determine props for pagination buttons
      const primaryButtonProps = index === TutorialStages.length - 1
        ? {
            text: 'Let\'s start!',
            onClick: this.handleClose // Concludes the tutorial if on the last stage
          }
        : {
            text: 'Next',
            onClick: this.handleNextStage
          }

      const secondaryButtonProps = index === 0
        ? {
            text: 'Skip',
            onClick: this.handleClose // Skips the tutorial if on the first stage
          }
        : {
            text: 'Previous',
            onClick: this.handlePreviousStage
          }

      return (

        <TeachingBubble
          key={index}
          footerContent={`${index + 1} of ${TutorialStages.length}`}
          primaryButtonProps={primaryButtonProps}
          secondaryButtonProps={secondaryButtonProps}
          {...stage.props}
          calloutProps={{
            directionalHint: DirectionalHint[stage.direction],
            hidden: this.state.stageNumber !== index
          }}
        >
          {stage.contents}
        </TeachingBubble>

      )
    })

    if (this.state.stageNumber === -1) { // Check if not in tutorial mode
      // Render only the window contents
      return (this.props.children)
    } else {
      // Render the tutorial and the window contents
      return (

        <Overlay isDarkThemed>

          {teachingBubbles}

          <div style={{
            ...AbsoluteCenterStyle,
            width: this.savedWidth,
            height: this.savedHeight
          }}
          >

            {this.props.children}

          </div>

        </Overlay>

      )
    }
  }
}
