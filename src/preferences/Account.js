import React from 'react';

import { 
    DefaultButton, ActionButton, IconButton,
    Persona, PersonaSize,
    Stack,
    Text,
    TooltipHost
} from '@fluentui/react';

import { level1Props, level2Props, level2HorizontalProps } from './PrefsStackProps';

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = store.accounts.getAll();
    }

    componentDidMount() {
        // Update this component's state when account is updated
        store.accounts.eventSystem.on('changed', () => {
            this.updateState();
        })
    }

    updateState() {
        this.setState(store.accounts.getAll());
    }

    render() {

        // Get account store info from account store
        const isSignedIn = this.state.token != null
        const displayName = this.state.accountInfo.displayName.toString()
        const email = this.state.accountInfo.email.toString()

        return (

            <Stack {...level1Props} id="accounts">

                
                <Stack {...level2Props}>
                    <Stack {...level2HorizontalProps}>
                        <Text variant={'xLarge'} block> iCare account </Text>

                        {/* Show Edit button only if signed in */}
                        { isSignedIn && 
                            <TooltipHost content="Edit account details">
                                <IconButton
                                    iconProps={{ iconName: 'Edit' }}
                                    onClick={ showPopup.editAccount }
                                />
                            </TooltipHost>
                            
                        }
                    </Stack>

                    <Persona
                        text = {displayName}
                        size={PersonaSize.size100}

                        // Display email address only if signed in
                        onRenderSecondaryText={ () => {
                            if (isSignedIn) {
                                return (
                                    <Text> {email} </Text> 
                                )
                            }
                        }}
            
                        // Display "Sign out" and "Delete account" button only if signed in
                        onRenderTertiaryText = { () => {
                            if (isSignedIn) {
                                return (
                                    <Stack horizontal
                                        verticalAlign="center"
                                        style={{ marginTop: "12px" }}
                                        tokens={{ childrenGap: 20 }}
                                    >
                                        <DefaultButton text="Sign out" onClick={ store.accounts.signOut } />
                                        <ActionButton onClick={ showPopup.deleteAccount }> 
                                            Delete account 
                                        </ActionButton>
                                    </Stack>
                                )
                            }
                        }}
                    />

                </Stack>

            </Stack>
        )
    }
}