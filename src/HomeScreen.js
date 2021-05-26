import React from 'react';

import { Stack } from '@fluentui/react';

import Dashboard from './Dashboard';
import Timer from './timer/Timer';

const homeStyle = {
    paddingTop: '30px',

    // Align home screen in center of Electron window.
    position: 'absolute', left: '50%', top: '50%',
    transform: 'translate(-50%, -50%)'
};

export default class HomeScreen extends React.Component {

    render() {
        return (
            <div style={homeStyle}>
                <Stack horizontal verticalAlign='center' tokens={{ childrenGap: '24px' }}>
                    <Timer/>
                    <Dashboard/>
                </Stack>
            </div>
        );
    }
}