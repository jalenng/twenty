import React from 'react';

import { 
    Dialog,
    Spinner, SpinnerSize 
} from '@fluentui/react';

export default class extends React.Component {

    render() {
        return (
            <Dialog hidden={!this.props.show}>
                <Spinner label={this.props.text} size={SpinnerSize.large} />
            </Dialog>
        )
    }

}