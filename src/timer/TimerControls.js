import React from 'react';

import { 
    PrimaryButton, DefaultButton,
    TooltipHost,
    Stack,
    FontIcon,
    mergeStyles,
} from '@fluentui/react';;

const buttonStyle = { borderRadius: '20px', width: '40px', height: '40px' };
const buttonIconClass = mergeStyles({ fontSize: 24, height: 24, width: 24 });

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        let mainButtonTooltip;
        let mainButtonIconName;
        let mainButtonOnClick;

        // Main button is a button to clear all blockers
        if (this.props.isBlocked) {
            mainButtonTooltip = 'Clear blockers' ;
            mainButtonIconName = 'Clear';
            mainButtonOnClick = blockerSys.clear;
        }

        // Main button is a button to toggle the timer
        else {
            mainButtonOnClick = timer.toggle;
            if (this.props.isPaused) {
                mainButtonTooltip = 'Start';
                mainButtonIconName = 'Play';
            }
            else {
                mainButtonTooltip = 'Pause';
                mainButtonIconName = 'Pause';
            }
        }

        let mainButtonDisabled = this.props.isIdle;
        let secondaryButtonDisabled = this.props.isBlocked;

        return (

            <Stack horizontal tokens={{ childrenGap: 20 }}>

                {/* Main button */}
                <TooltipHost content={mainButtonTooltip}>
                    <PrimaryButton
                        id='toggleButton'
                        disabled={mainButtonDisabled}
                        onClick={mainButtonOnClick}
                        style={buttonStyle}
                        onRenderText={() => {
                            return <FontIcon iconName={mainButtonIconName} className={buttonIconClass} />
                        }}
                    />
                </TooltipHost>

                {/* Other actions */}
                <TooltipHost content={'More'}>
                    <DefaultButton
                        id='buttonGroup'
                        disabled={secondaryButtonDisabled}
                        style={buttonStyle}
                        onRenderText={() => { 
                            return <FontIcon iconName='More' className={buttonIconClass} /> 
                        }}
                        menuProps={{
                            items: (() => {
                                let menu = [
                                    {
                                        key: 'resetTimer',
                                        text: 'Reset timer',
                                        iconProps: { iconName: 'Refresh' },
                                        onClick: timer.reset,
                                        disabled: secondaryButtonDisabled
                                    },
                                    {
                                        key: 'popOutTimer',
                                        text: 'Pop out',
                                        iconProps: { iconName: 'MiniExpand' },
                                        onClick: showPopup.timer,
                                        disabled: secondaryButtonDisabled
                                    }                                    
                                ]
                                if (isDev)
                                    menu.push({
                                        key: 'startBreak',
                                        text: 'Start break (for testing purposes)',
                                        iconProps: { iconName: 'FastForward' },
                                        onClick: timer.end,
                                        disabled: secondaryButtonDisabled
                                    })
                                return menu;
                            })()
                        }}
                    />
                </TooltipHost>

            </Stack>

        );
    }
}