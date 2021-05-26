import React from 'react';

import { 
    DefaultButton,
    Image, ImageFit,
    Stack, 
    Text 
} from '@fluentui/react';

import logo from '../assets/icon.png';
import { level1Props, level2Props, level2HorizontalProps } from './PrefsStackProps';

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
            openSourceLibraries: []
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
                    <Stack {...level2HorizontalProps}>
                        
                        <Image
                            imageFit={ImageFit.centerContain}
                            src={ logo }
                            width={96}
                            height={96}
                        />

                        <Text variant={'xxLarge'} block>  
                            {`${this.state.appInfo.name} ${this.state.appInfo.version}`}
                        </Text>
                        
                    </Stack>

                    <Stack>

                        <Text variant={'medium'} block>
                            <b>Electron:&nbsp;</b> {this.state.versions.electron}
                        </Text>

                        <Text variant={'medium'} block>
                            <b>Chrome:&nbsp;</b> {this.state.versions.chrome}
                        </Text>

                        <Text variant={'medium'} block>
                            <b>Node:&nbsp;</b> {this.state.versions.node}
                        </Text>

                        <Text variant={'medium'} block>
                            <b>v8:&nbsp;</b> {this.state.versions.v8}
                        </Text>

                    </Stack>

                </Stack>

                {/* Contributors */}
                <Stack {...level2Props}>
                    <Text variant={'xLarge'} block> Contributors </Text>

                    <Stack>
                        {this.state.contributors.map( contributor => {
                            return ( <Text variant={'medium'} block> {contributor} </Text> )
                        })}
                    </Stack>
                </Stack>

                {/* Attributions to open-source libraries */}
                <Stack {...level2Props}>
                    <Text variant={'xLarge'} block> Open-source libraries </Text>

                    <div style={{
                        display: 'grid',
                        gridColumn: '2'
                    }}>
                        {this.state.openSourceLibraries.map( libName => {
                            return ( <Text variant={'medium'} block> {libName} </Text> )
                        })}
                    </div>
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

