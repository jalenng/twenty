import React from 'react';

import { 
    mergeStyles,
    FontIcon,
    Stack,
    Text 
} from '@fluentui/react';

const divStyle = {
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
};

const iconClass = mergeStyles({
    fontSize: 24,
    height: 24,
    width: 24,
    marginRight: 12,
    color: 'deepskyblue'
});

export default class extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            remainingTimeString: ''
        };

        breakSys.eventSystem.on('update', (event, breakStatus) => {
            var milliseconds = breakStatus.remainingTime;
            var seconds = Math.floor((milliseconds % 60000) / 1000);

            var remainingTimeString = seconds === 1 ? `${seconds} more second` : `${seconds} more seconds`

            this.setState({
                remainingTimeString: remainingTimeString,
            });

        })
    }
    
    componentDidMount() {
        breakSys.getStatus();
        setInterval(breakSys.getStatus, 100);
    }

    render() {
        return (    
            <div style={divStyle}>
                
                <div style={{
                    position: 'absolute', 
                    paddingTop: '12px', 
                    paddingLeft: '18px'
                }}>

                    <Stack horizontal token={{childrenGap: 32}}>
                        <Stack.Item>
                            <FontIcon iconName='RedEye' className={iconClass} />
                        </Stack.Item>

                        <Stack.Item>
                            <Stack>
                                <Text variant={'large'}> <b>Time for a break. </b> </Text>
                                <Text variant={'medium'}> Look at something 20 feet away. </Text>
                                <Text variant={'medium'} align='center'>
                                    {this.state.remainingTimeString}
                                </Text>
                            </Stack>
                        </Stack.Item>
                        
                    </Stack>

                </div>

            </div>

        );
    }
}

