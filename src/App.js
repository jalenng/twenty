import React from 'react';

import HomeScreen from './HomeScreen';
import UsageScreen from './usage/UsageScreen';
import InsightsScreen from './InsightsScreen';
import PrefsScreen from './preferences/PrefsScreen'

import { 
    MessageBar, MessageBarType,
    Text,
    Pivot, PivotItem,
    Persona, PersonaSize,
    DefaultButton,
    Stack
} from '@fluentui/react';

const topRightCornerProps = {
    horizontal: true,
    verticalAlign: 'center',
    style: {
        position: 'fixed',
        top: '3px',
        right: '3px',
    },
    styles: { root: { height: 42 } },
    tokens: { childrenGap: 16 }
}

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            account: store.accounts.getAll()
        }
    }

    componentDidMount() {

        // Update this component's state when account is updated
        store.accounts.eventSystem.on('changed', () => {
            this.updateAccountState();
        })

        // Update this component's state when the list of in-app messages is changed
        store.messages.eventSystem.on('changed', () => {
            this.updateMessagesState();
        })

        // Fetch the latest account info from the server
        const isSignedIn = this.state.account.token != null
        if (isSignedIn) {
            store.accounts.fetchInfo().then(result => {

                // If information retrieval was not successful, show error message
                if (!result.success) store.messages.add({
                    type: MessageBarType.error,
                    contents: `Failed to retrieve account info: ${result.data.message}`
                })

            });
        }

    }

    updateAccountState() {
        let state = this.state;
        state.account = store.accounts.getAll();
        this.setState(state);
    }

    updateMessagesState() {
        let state = this.state;
        state.messages = store.messages.getAll();
        this.setState(state);
    }

    render() {        
        const isSignedIn = this.state.account.token != null
        const displayName = this.state.account.accountInfo.displayName.toString()

        const messages = this.state.messages.map((message, index) => {
            return (
                <MessageBar
                    messageBarType={message.type}
                    onDismiss={() => store.messages.dismiss(index)}
                >
                    {message.contents}
                </MessageBar>
            )
        })

        return (
            <div>

                <Pivot linkSize='large'>
                    <PivotItem itemIcon='Home'>
                        <HomeScreen />
                    </PivotItem>
                    <PivotItem itemIcon='BarChartVertical'>
                        <UsageScreen />
                    </PivotItem>
                    <PivotItem itemIcon='Lightbulb'>
                        <InsightsScreen />
                    </PivotItem>
                    <PivotItem itemIcon='Settings'>
                        <PrefsScreen />
                    </PivotItem>
                </Pivot>

                {/* If signed in: show display name and persona */}
                {isSignedIn && (
                    <Stack {...topRightCornerProps}>
                        <Text>{displayName}</Text>
                        <Persona
                            size={PersonaSize.size40}
                            hidePersonaDetails={true}
                            text={displayName}
                        />
                    </Stack>
                )}

                {/* If not signed in: show sign in button */}
                {!isSignedIn && (
                    <Stack {...topRightCornerProps}>
                        <DefaultButton
                            id='signInPopupButton'
                            text='Sign in'
                            onClick={showPopup.signIn}
                        />
                    </Stack>
                )}

                {/* Show app messages */}
                <Stack reversed
                    tokens={{ childrenGap: 8 }}
                    style={{
                        position: 'fixed',
                        bottom: '8px',
                        right: '8px',
                        width: '300px'
                    }}
                >
                    {messages}
                </Stack>

            </div>
        );
    }
}