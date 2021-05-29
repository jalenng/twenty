/**
 * @file Provides an interface for configuring app settings.
 * @author jalenng
 */

/* eslint-disable no-undef */

import React from 'react'

import { Stack, ScrollablePane } from '@fluentui/react'

import TitleBar from './window/TitleBar'

import PrefsSidebar from './preferences/PrefsSidebar'
import Notifications from './preferences/Notifications'
import Blockers from './preferences/Blockers'
import Startup from './preferences/Startup'
import Appearance from './preferences/Appearance'
import About from './preferences/About'

const divStyle = {
  paddingLeft: '30px',
  display: 'grid'
}

const preferencePages = {
  notifications: <Notifications />,
  blockers: <Blockers />,
  startup: <Startup />,
  appearance: <Appearance />,
  about: <About />
}

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = { selectedKey: 'notifications' }
  }

  render () {
    const selectedKey = this.state.selectedKey
    const preferencesPage = preferencePages[selectedKey]

    return (

      <Stack>

        <TitleBar />

        <div style={divStyle}>

          <ScrollablePane style={{
            position: 'absolute',
            left: '260px',
            top: '48px',
            paddingRight: '40px'
          }}
          >

            {preferencesPage}

          </ScrollablePane>

          <PrefsSidebar
            selectedKey={selectedKey}
            onUpdateSelectedKey={(key) => {
              this.setState({ selectedKey: key })
            }}
          />

        </div>

      </Stack>

    )
  }
}
