import React from 'react';

import { 
  Nav,
  Stack,
  Text 
} from '@fluentui/react';

const navStyles = {
  root: {
    width: 200,
    height: '100%',
    position: 'fixed',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
};

const groups = [
  {
    links: [
      {
        name: 'Daily App Usage',
        icon: 'Favicon',
        key: 'daily_app_usage'
      },
      {
        name: 'Weekly App Usage',
        icon: 'Favicon',
        key: 'weekly_app_usage'
      },
      {
        name: 'Daily Timer Usage',
        icon: 'GoToToday',
        key: 'daily_timer_usage'
      },
      {
        name: 'Weekly Timer Usage',
        icon: 'CalendarWorkWeek',
        key: 'weekly_timer_usage'
      },
    ],
  },
];

export default class UsageSidebar extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, item) {
    const key = item.key;
    this.props.onUpdateSelectedKey(key);
  }

  render() {
    return (
      <Stack 
        tokens={{ childrenGap: 12 }} 
        styles={navStyles}>
        <Text variant={'xxLarge'}>
          <b>Statistics</b>
        </Text>
        <Nav
          selectedKey={this.props.selectedKey}
          groups={groups}
          onLinkClick={this.handleChange}
        />
      </Stack>
    )
  }
}
 
