import React from 'react';

import { Stack } from '@fluentui/react';

import Window from './Window';
import TitleBar from './TitleBar';
import Timer from './timer/Timer';

export default class App extends React.Component {

    render() {

        return (

            <Window>

                <Stack>

                    <TitleBar />

                    <Timer />

                </Stack>

            </Window>

        );
    }
}