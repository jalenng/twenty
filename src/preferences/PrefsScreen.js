import React from 'react';

import { Stack, ScrollablePane } from '@fluentui/react';

import TitleBar from '../TitleBar';

import PrefsSidebar from './PrefsSidebar';
import Notifications from './Notifications';
import Blockers from './Blockers';
import Startup from './Startup';
import Appearance from './Appearance';
import About from './About';

const divStyle = {
    paddingLeft: '30px',
    display: 'grid'
};

const preferencePages = {
    notifications: <Notifications />,
    blockers: <Blockers />,
    startup: <Startup />,
    appearance: <Appearance />,
    about: <About />
}
    

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = { selectedKey: 'notifications' };
    }

    render() {
        const selectedKey = this.state.selectedKey;
        let preferencesPage = preferencePages[selectedKey];

        return (

            <Stack>
                
                <TitleBar/>

                <div style={divStyle}>

                    <ScrollablePane style={{
                        position: 'absolute',
                        left: '260px',
                        top: '48px',
                        paddingRight: '40px'
                    }}>

                        {preferencesPage}

                    </ScrollablePane>

                    <PrefsSidebar
                        selectedKey={selectedKey}
                        onUpdateSelectedKey={(key) => {
                            this.setState({ selectedKey: key });
                        }}
                    />

                </div>

            </Stack>

        );
    }
}

