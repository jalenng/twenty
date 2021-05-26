import React from 'react';

import { 
    Stack,
    Text,
    ActionButton, PrimaryButton 
} from '@fluentui/react';

const divStyle = {
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
};

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div style={divStyle}>

                    <div style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}>

                        <Stack tokens={{ childrenGap: 24 }}>

                            <Stack.Item align='center'>
                                <Text variant={'xxLarge'} align='center'>
                                    Sorry, something went wrong.
                                </Text>
                            </Stack.Item>

                            <Stack.Item align='center'>
                                <PrimaryButton
                                    iconProps={{ iconName: 'Refresh' }}
                                    text='Restart app'
                                    onClick={restartApp}
                                />
                            </Stack.Item>

                        </Stack>

                    </div>

                    <div style={{
                        position: 'absolute',
                        left: '50%',
                        top: '90%',
                        transform: 'translate(-50%, -50%)'
                    }}>
                        <ActionButton
                            iconProps={{ iconName: 'Refresh' }}
                            text='Reset iCare if you are still having trouble'
                            onClick={store.reset}
                        />
                    </div>

                </div>

            );
        }

        return this.props.children;
    }
}