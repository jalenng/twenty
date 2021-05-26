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

const navLinkGroups = [
    {
        links: [
            {
                name: 'Account',
                icon: 'ContactInfo',
                key: 'account'
            },
            {
                name: 'Notifications',
                icon: 'Ringer',
                key: 'notifications'
            },
            {
                name: 'Blockers',
                icon: 'Blocked2',
                key: 'blockers'
            },
            {
                name: 'Startup',
                icon: 'PowerButton',
                key: 'startup'
            },
            {
                name: 'Data usage',
                icon: 'BarChartVertical',
                key: 'data_usage'
            },
            {
                name: 'Sync',
                icon: 'CloudImportExport',
                key: 'sync'
            },
            {
                name: 'About',
                icon: 'Info',
                key: 'about'
            }
        ],
    },
];

export default class extends React.Component {

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

                <Text variant={'xxLarge'} block>
                    <b>Preferences</b>
                </Text>

                <Nav
                    selectedKey={this.props.selectedKey}
                    groups={navLinkGroups}
                    onLinkClick={this.handleChange}
                />

            </Stack>
        )
    }
}

