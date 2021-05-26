import React from 'react';

import { 
    Toggle, 
    Stack, 
    Text 
} from '@fluentui/react';

import { level1Props, level2Props } from './PrefsStackProps';

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = store.preferences.getAll().dataUsage;
    }

    componentDidMount() {
        // Update this component's state when preferences are updated
        store.preferences.eventSystem.on('changed', () => {
            this.updateState();
        })
    }

    updateState() {
        this.setState(store.preferences.getAll().dataUsage);
    }

    render() {

        return (

            <Stack id='data_usage' {...level1Props}>

                <Stack {...level2Props}>

                    <Text variant={'xLarge'} block> Data usage </Text>

                    <Toggle label='Track my application usage statistics'
                        id="appUsageToggle"
                        onText='On' offText='Off'
                        checked={this.state.trackAppUsageStats}
                        onChange={(event, checked) => store.preferences.set('dataUsage.trackAppUsageStats', checked)}
                    />
                    <Toggle label='Enable weekly usage statistics'
                        id="dataUsageToggle"
                        onText='On' offText='Off'
                        checked={this.state.enableWeeklyUsageStats}
                        onChange={(event, checked) => store.preferences.set('dataUsage.enableWeeklyUsageStats', checked)}
                    />

                </Stack>

            </Stack>

        )
    }
}