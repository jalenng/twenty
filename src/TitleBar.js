import React from 'react';

import {
    TooltipHost,
    DefaultButton,
    Stack,
    IconButton
} from '@fluentui/react';

const sharedStackProps = {
    horizontal: true,
    verticalAlign: 'center',
    styles: { root: { height: '36px' } },
    tokens: { childrenGap: '6px' }
}

const topLeftStyle = {
    position: 'absolute',
    top: '6px',
    left: '6px',
}

const topCenterStyle = {
    position: 'absolute',
    top: '6px',
    left: '50%',
    transform: 'translate(-50%, 0%)'
}

const topRightStyle = {
    position: 'absolute',
    top: '6px',
    right: '6px',
}

export default class extends React.Component {

    static defaultProps = {
        hideClose: false,
        hidePin: false
    };

    render() {

        const isMacOS = platform === 'darwin';

        return (

            <div style={{ display: 'inline-block', height: '42px' }}>

                {/* Handle */}
                <Stack {...sharedStackProps} style={{ ...topCenterStyle, WebkitAppRegion: 'drag' }}>
                    <DefaultButton
                        style={{ borderRadius: '20px', width: '16px', height: '8px', margin: '0px 8px' }}
                        disabled
                    />
                </Stack>

                {/* Top left */}
                <Stack {...sharedStackProps} style={topLeftStyle}>

                    {/* macOS: Close button */}
                    {isMacOS && !this.props.hideClose &&
                        <TooltipHost content="Close">
                            <IconButton
                                iconProps={{ iconName: 'CircleFill' }}
                                styles={{ 
                                    root: { color: '#ff6159' },
                                    rootHovered: { color: '#ff6159' },
                                    rootPressed: { color: '#bf4942' },
                                }}
                                onClick={() => window.close()}
                            />
                        </TooltipHost>
                    }

                </Stack>

                {/* Top right */}
                <Stack {...sharedStackProps} style={topRightStyle}>

                    {/* Pin button */}
                    {!this.props.hidePin &&
                        <TooltipHost content="Always show on top">
                            <IconButton
                                iconProps={{ iconName: 'Pinned' }}
                                styles={{ root: { color: '#ffffff' } }}
                                toggle={true}
                                checked={true}
                            />
                        </TooltipHost>
                    }

                    {/* non-macOS: Close button */}
                    {!isMacOS && !this.props.hideClose &&
                        <TooltipHost content="Close">
                            <IconButton
                                iconProps={{ iconName: 'Cancel' }}
                                styles={{ root: { color: '#ffffff' } }}
                                onClick={() => window.close()}
                            />
                        </TooltipHost>
                    }

                </Stack>

            </div>

        );
    }
}

