import React from 'react';

import { 
    MessageBarType,
    DefaultButton,
    Stack,
    Text 
} from '@fluentui/react';

import DialogSpinner from '../DialogSpinner';
import { level1Props, level2Props, level2HorizontalProps } from './PrefsStackProps';

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        };
        this.handleUploadBtn = this.handleUploadBtn.bind(this);
        this.handleDownloadBtn = this.handleDownloadBtn.bind(this);
    }

    // Change spinner status
    setSpinner(val) {
        this.setState({...this.state, isLoading: val});
    }
    
    handleUploadBtn() {
        this.setSpinner(true);
        store.preferences.push()
            .then(result => {
                console.log(result);

                // Show message
                store.messages.add({
                    type: result.success 
                        ? MessageBarType.success 
                        : MessageBarType.error,
                    contents: result.success
                        ? 'Successfully uploaded preferences'
                        : `Failed to upload preferences: ${result.data.message}`
                })
                    
                this.setSpinner(false);
            });
    }

    handleDownloadBtn() {
        this.setSpinner(true);
        store.preferences.fetch()
            .then(result => {
                console.log(result);

                // Show message
                store.messages.add({
                    type: result.success 
                        ? MessageBarType.success 
                        : MessageBarType.error,
                    contents: result.success
                        ? 'Successfully downloaded preferences'
                        : `Failed to download preferences: ${result.data.message}`
                })
                    
                this.setSpinner(false);
            });
    }

    render() {
        return (
            <div>
                <Stack id='startup' {...level1Props}>

                    <Stack {...level2Props}>

                        <Text variant={'xLarge'} block> Sync preferences </Text>

                        <Stack {...level2HorizontalProps}>

                            <DefaultButton
                                text='Upload'
                                iconProps={{ iconName: 'CloudUpload' }}
                                onClick={this.handleUploadBtn}
                            />

                            <DefaultButton
                                text='Download'
                                iconProps={{ iconName: 'CloudDownload' }}
                                onClick={this.handleDownloadBtn}
                            />

                        </Stack>

                    </Stack>

                </Stack>

                <DialogSpinner
                    show={this.state.isLoading}
                    text='Syncing your preferences'
                />

            </div>
        )
    }
}