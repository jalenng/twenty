import React from 'react';

import { 
    Stack,
    ActivityItem,
    Icon,
    Text
} from '@fluentui/react';

const navStyles = {
    root: {
        width: '420px'
    },
};

export default class extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            blockers: []
        };
        this.updateState = this.updateState.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        blockerSys.eventSystem.on('update', (event, blockers) => this.updateState(blockers));

        blockerSys.getBlockers();
        setInterval(blockerSys.getBlockers, 100);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    updateState(blockers) {
        this.setState({
            blockers: blockers
        });
    }

    render() {

        const hasBlockers = this.state.blockers.length !== 0;

        if (hasBlockers)
            return (

                <Stack styles={navStyles} tokens={{ childrenGap: '16px' }}>

                    <Text variant={'xLarge'} block>
                        We've paused your timer for you.
                    </Text>

                    <Stack tokens={{ childrenGap: '3px' }}>
                        
                        { this.state.blockers.map( blocker => {

                            const description = blocker.type === "app"
                            ? `${blocker.message} is open`
                            : `${blocker.message}`;

                            return (
                                <ActivityItem 
                                    activityDescription={description} 
                                    activityIcon={ <Icon iconName="Blocked2" /> }
                                    isCompact={true}
                                />
                            )

                        })}

                    </Stack>

                    <Text variant={'medium'} block>
                        Click the blue button to ignore these blockers for now.
                    </Text>

                </Stack>

            )
        else return <div></div>
    }
}