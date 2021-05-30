/**
 * @file
 * @author jalenng
 */

/* eslint-disable no-undef */

import React from 'react'

import MainWindowContent from './mainWindow/MainWindowContent'
import Tutorial from './mainWindow/Tutorial'

import Container from './window/Container'

export default class extends React.Component {
  render () {
    return (

      <div>
        <Tutorial />

        <Container>
          <MainWindowContent />
        </Container>
      </div>

    )
  }
}
