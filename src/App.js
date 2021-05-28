import React from 'react';

import { Stack } from '@fluentui/react';

import TitleBar from './TitleBar';
import Timer from './timer/Timer';

export default class App extends React.Component {

    render() {

        return (

            <Stack>

                <TitleBar />

                <Timer />

            </Stack>

        );
    }
}