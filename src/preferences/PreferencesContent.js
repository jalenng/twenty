/**
 * @file Provides an interface for configuring app settings.
 * @author jalenng
 */

/* eslint-disable no-undef */

import React from 'react'

import { ScrollablePane } from '@fluentui/react'

import PrefsSidebar from './PrefsSidebar'
import Notifications from './tabs/Notifications'
import Blockers from './tabs/Blockers'
import Startup from './tabs/Startup'
import Appearance from './tabs/Appearance'
import About from './tabs/About'

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

    )
  }
}
