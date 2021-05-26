import React from 'react';

import { Stack } from '@fluentui/react';

import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';

export default class extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {};
        this.updateState = this.updateState.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        timer.eventSystem.on('update', (event, status) => this.updateState(status));

        timer.getStatus();
        setInterval(timer.getStatus, 100);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    updateState(status) {
        // Don't update state if component is not mounted
        if (!this._isMounted) return;

        let remainingTime = status.remainingTime;
        let totalDuration = status.totalDuration;

        this.setState({
            // Get remaining percentage for progress bar
            remainingPercentage: remainingTime / totalDuration * 100,

            // Convert remaining time to M:SS format
            remainingTimeString: (() => {
                let minutes = Math.floor(remainingTime / 60000).toString();
                let seconds = Math.floor((remainingTime % 60000) / 1000);
                seconds = ('00' + seconds).substr(-2, 2);

                return `${minutes}:${seconds}`
            })(),

            // Convert end time to H:MM format
            endTimeString: (() => {
                let hours = status.endDate.getHours();
                hours = hours === 0 // Enforce 12-hour format. For hours, display 12 instead of 0.
                    ? '12'
                    : hours > 12
                        ? (hours % 12).toString()
                        : hours.toString();

                let minutes = status.endDate.getMinutes();
                minutes = ('00' + minutes).substr(-2, 2);

                return `${hours}:${minutes}`
            })(),

            isPaused: status.isPaused,
            isBlocked: status.isBlocked,
            isIdle: status.isIdle,
            disableButtons: status.isBlocked || status.isIdle,
        })
    }

    render() {

        let timerDisplayChipProps;

        // Chip shows end time
        if (!this.state.isPaused && !this.state.isBlocked) {
            timerDisplayChipProps = {
                showChip: true,
                chipTooltip: 'End time',
                chipIconName: 'Ringer',
                chipText: this.state.endTimeString
            }
        }

        // Chip shows blocked indicator
        else if (this.state.isBlocked) {
            timerDisplayChipProps = {
                showChip: true,
                chipIconName: 'Blocked2'
            }
        }

        else {
            timerDisplayChipProps = {
                showChip: false,
            }
        }


        return (
            <div>
                <Stack vertical tokens={{ childrenGap: 8 }} horizontalAlign='center'>

                    <TimerDisplay
                        progressBarValue={this.state.remainingPercentage}
                        text={this.state.remainingTimeString}
                        {...timerDisplayChipProps}
                    />

                    <TimerControls
                        isBlocked={this.state.isBlocked}
                        isPaused={this.state.isPaused}
                        isIdle={this.state.isIdle}
                    />

                </Stack>

            </div>
        );
    }
}