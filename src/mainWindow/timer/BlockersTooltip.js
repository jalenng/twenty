/* eslint-disable no-undef */

import React from 'react'

import {
  Stack,
  ActivityItem,
  Icon,
  Text
} from '@fluentui/react'

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
      blockers: blockers
    })
  }

  render () {
    const hasBlockers = this.state.blockers.length !== 0

    if (hasBlockers) {
      return (

        <Stack tokens={{ childrenGap: '16px' }}>

          <Stack tokens={{ childrenGap: '3px' }}>

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

          <Text variant='medium' block>
            Click the blue button to ignore these blockers for now.
          </Text>

        </Stack>

      )
    } else return <div />
  }
}
