/* eslint-disable no-undef */

import React from 'react'

import {
  Stack,
  ActivityItem,
  Icon,
  Text,
  DefaultButton
} from '@fluentui/react'

import { UnselectableTextStyle } from '../../SharedStyles'
import { StackProps } from '../../SharedProps'

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      blockers: []
    }
    this.updateState = this.updateState.bind(this)
    this._isMounted = false
  }

  componentDidMount () {
    this._isMounted = true
    blockerSys.eventSystem.on('update', (event, blockers) => this.updateState(blockers))

    blockerSys.getBlockers()
    setInterval(blockerSys.getBlockers, 100)
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  updateState (blockers) {
    this.setState({
      blockers
    })
  }

  handleClearBtn () {
    blockerSys.clear()
  }

  render () {
    return (

      <div style={{ ...UnselectableTextStyle, minWidth: '240px' }}>

        <Stack {...StackProps.level1}>

          <Text>The timer is blocked. </Text>

          <Stack {...StackProps.level2}>

            {this.state.blockers.map(blocker => {
              const description = blocker.type === 'app'
                ? `${blocker.message} is open`
                : `${blocker.message}`

              return (
                <ActivityItem
                  key={blocker.key}
                  activityDescription={description}
                  activityIcon={<Icon iconName='Blocked2' />}
                  isCompact
                />
              )
            })}

          </Stack>

          <Stack {...StackProps.level2Horizontal}>
            <DefaultButton
              text='Ignore'
              iconProps={{ iconName: 'Clear' }}
              onClick={this.handleClearBtn}
            />
          </Stack>

        </Stack>

      </div>

    )
  }
}
