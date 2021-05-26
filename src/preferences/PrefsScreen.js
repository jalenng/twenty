import React from 'react';

import { ScrollablePane } from '@fluentui/react/lib/ScrollablePane';

import PrefsSidebar from './PrefsSidebar';
import Account from './Account';
import Notifications from './Notifications';
import Blockers from './Blockers';
import Startup from './Startup';
import DataUsage from './DataUsage';
import Sync from './Sync';
import About from './About';

const divStyle = {
    paddingTop: '10px',
    paddingLeft: '30px',
    display: 'grid'
};

const preferencePages = {
    account: <Account />,
    notifications: <Notifications />,
    blockers: <Blockers />,
    startup: <Startup />,
    data_usage: <DataUsage />,
    sync: <Sync />,
    about: <About />
}


export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = { selectedKey: 'account' };
    }

    render() {
        const selectedKey = this.state.selectedKey;
        let preferencesPage = preferencePages[selectedKey];

        return (
            <div style={divStyle}>

                <ScrollablePane style={{
                    position: 'absolute',
                    top: '60px',
                    left: '260px',
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
        );
    }
}

