import React from 'react';

import { 
    Text,
    DefaultButton,
    TooltipHost,
    Stack,
    getTheme
 } from '@fluentui/react';

import Circle from 'react-circle';

const chipStyle = { borderRadius: '20px', width: '40px', height: '28px' };
const circleProps = {
    animate: false,
    size: 300,
    lineWidth: 20,
    roundedStroke: true,
    showPercentage: false
}


export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        return (

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>

                {/* Circular progress bar */}
                <Circle
                    {...circleProps}
                    progress={this.props.progressBarValue}
                    progressColor={ getTheme().palette.themePrimary }
                    bgColor={ getTheme().palette.neutralLighter }
                />

                {/* Timer information */}
                <div className='time' style={{ position: 'absolute' }}>
                    <Stack vertical horizontalAlign='center'>

                        {/* Remaining time */}
                        <Text variant={'xxLarge'} style={{ fontSize: '4rem' }} block>
                            <div id='remainingTimeText'>
                                {this.props.text}
                            </div>
                        </Text>

                        {/* Chip */}
                        {this.props.showChip &&
                            <TooltipHost content={this.props.chipTooltip}>
                                <DefaultButton
                                    style={{ ...chipStyle }}
                                    iconProps={{ iconName: this.props.chipIconName }}
                                    text={this.props.chipText}
                                    disabled
                                />
                            </TooltipHost>
                        }

                    </Stack>
                </div>

            </div>

        );
    }
}