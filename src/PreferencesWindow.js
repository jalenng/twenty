/**
 * @file
 * @author jalenng
 */

/* eslint-disable no-undef */

import React from 'react'

import PreferencesContent from './preferences/PreferencesContent'

import Container from './window/Container'

export default class extends React.Component {
  render () {
    return (

      <div>
        <Container>
          <PreferencesContent />
        </Container>
      </div>

    )
  }
}
