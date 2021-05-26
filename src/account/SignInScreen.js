import React from 'react';
import { Link } from 'react-router-dom';

import DialogSpinner from '../DialogSpinner';

import {
    Text,
    Stack,
    TextField,
    PrimaryButton, ActionButton
} from '@fluentui/react';

const divStyle = {
    paddingTop: '10px',
    paddingLeft: '30px',
};

const textFieldStyles = {
    // Make error message more legible over a dark background
    errorMessage: { color: '#F1707B' }
}

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            inputs: {
                email: '',
                password: ''
            },
            errors: {
                email: '',
                password: ''
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Update title
    componentDidMount() {
        document.title = 'Sign in';
    }

    // Handles changes to the TextFields by updating the state
    handleChange(event) {
        let state = this.state;
        state.inputs[event.target.id] = event.target.value;
        this.setState(state);
    }

    // Change spinner status
    setSpinner(val) {
        this.setState({ ...this.state, isLoading: val });
    }

    // Handles a submit
    handleSubmit(event) {
        event.preventDefault();
        this.setSpinner(true);
        let state = this.state;

        // Authenticate user with sign-in
        let email = state.inputs.email;
        let password = state.inputs.password;

        store.accounts.signIn(email, password)
            .then(result => {

                // If sign-in was successful, close the window
                if (result.success) window.close()

                else {
                    state.errors.password = result.data.message;   // Update error message
                    this.setState(state);
                    this.setSpinner(false);
                }

            });
    }

    render() {
        return (
            <div style={divStyle}>

                {/* Show "Back" button on macOS because modal windows are sheets and don't have close buttons */}
                {platform === 'darwin' &&
                    <ActionButton
                        style={{ left: '-10px' }}
                        onClick={window.close}
                        iconProps={{ iconName: 'NavigateBack' }}
                        text={'Back to iCare'}
                    />
                }

                <Text variant={'xxLarge'} block>
                    <b>Sign in</b>
                </Text>

                <form>
                    <Stack
                        style={{ marginTop: '10px' }}
                        tokens={{ childrenGap: 15 }}>

                        <Stack style={{ width: 240 }}>
                            <TextField label='Email' id='email'
                                styles={textFieldStyles}
                                value={this.state.inputs.email}
                                onChange={this.handleChange}
                                errorMessage={this.state.errors.email}
                                autoFocus 
                            />
                            <TextField label='Password' type='password' id='password'
                                styles={textFieldStyles}
                                value={this.state.inputs.password}
                                onChange={this.handleChange}
                                errorMessage={this.state.errors.password}
                                canRevealPassword
                            />

                        </Stack>

                        <Stack
                            horizontal
                            verticalAlign='center'
                            tokens={{ childrenGap: 20 }}>

                            <PrimaryButton
                                id='submitButton'
                                text='Sign in'
                                type='submit'
                                onClick={this.handleSubmit}
                            />

                            <Link to='/signup' id='noAccountLink'>
                                <ActionButton text={"Don't have an account?"} />
                            </Link>

                        </Stack>

                    </Stack>
                </form>

                <DialogSpinner
                    show={this.state.isLoading}
                    text='Signing you in'
                />

            </div>
        );
    }
}