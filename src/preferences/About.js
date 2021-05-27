import React from 'react';

import {
    DefaultButton,
    Image, ImageFit,
    Stack,
    Text
} from '@fluentui/react';

import logo from '../assets/icon.png';
import { level1Props, level2Props, level2HorizontalProps } from './PrefsStackProps';

const versionComponents = [
    { key: 'electron', text: 'Electron' },
    { key: 'chrome', text: 'Chrome' },
    { key: 'node', text: 'Node' },
    { key: 'v8', text: 'v8' },
]

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            appInfo: {
                name: '',
                version: ''
            },
            versions: {

            },
            contributors: [],
            openSourceLibraries: [],
            license: []
        }
    }

    componentDidMount() {
        this.setState(getAboutInfo());
    }

    render() {

        return (
            <Stack {...level1Props} id='about'>

                {/* Version info */}
                <Stack {...level2Props}>

                    {/* iCare banner */}
                    <Stack {...level2HorizontalProps}>

                        <Image
                            imageFit={ImageFit.centerContain}
                            src={logo}
                            width={96}
                            height={96}
                        />

                        <Text variant={'xxLarge'} style={{ fontSize: '3.5rem' }} block>
                            {`${this.state.appInfo.name} ${this.state.appInfo.version}`}
                        </Text>

                    </Stack>

                    {/* Chips for Electron, Chrome, Node, and v8 engine */}
                    <Stack {...level2HorizontalProps} >

                        {versionComponents.map((component) => {
                            return (
                                <DefaultButton
                                    style={{ height: '52px', borderRadius: '8px'}}
                                    disabled
                                    onRenderText={() => {
                                        return (
                                            <Stack horizontalAlign='start'>
                                                <b>{component.text}</b>
                                                {this.state.versions[component.key]}
                                            </Stack>
                                        )
                                    }}
                                />
                            )
                        })}

                    </Stack>

                </Stack>

                {/* Attributions to open-source libraries */}
                <Stack {...level2Props}>
                    <Text variant={'xLarge'} block> Open-source libraries </Text>

                    <div style={{ display: 'inline' }}>

                        {this.state.openSourceLibraries.map(library => {
                            return (
                                <DefaultButton
                                    style={{ borderRadius: '8px', marginRight: '8px', marginBottom: '8px'}}
                                    text={library.name}
                                    onClick={() => openExternalLink(library.link)}
                                />
                            )
                        })}

                    </div>
                </Stack>

                {/* License */}
                <Stack {...level2Props}>
                    <Text variant={'xLarge'} block> License </Text>

                    {this.state.license.map(paragraph => {
                        return (
                            <Text block variant={'medium'} style={{ paddingRight: '30px' }}> 
                                {paragraph} 
                            </Text>
                        )
                    })}
                </Stack>

                {/* Options to reset the app */}
                <Stack {...level2Props}>

                    <Text variant={'xLarge'} block> Reset app </Text>

                    <Stack {...level2HorizontalProps}>
                        <DefaultButton
                            text='Reset iCare'
                            iconProps={{ iconName: 'Refresh' }}
                            onClick={store.reset}
                        />
                    </Stack>

                </Stack>

            </Stack>
        )
    }
}

