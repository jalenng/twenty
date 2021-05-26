import React from 'react';

import { 
    IconButton,
    ScrollablePane,
    Stack,
    Text,
    ImageFit,
    DocumentCard, DocumentCardImage, DocumentCardActions,
    TooltipHost,
    MessageBarType 
} from '@fluentui/react';

import DialogSpinner from './DialogSpinner';

const divStyle = {
    paddingTop: '10px',
    paddingLeft: '30px'
};

const cardStyles = {
    root: {
        display: 'inline-block',
        width: 240,
        marginRight: '16px',
        marginBottom: '16px'
    }
}

const cardStackStyle = {
    marginTop: '8px',
    marginLeft: '16px',
    marginRight: '16px',
    height: 'auto'
}

export default class InsightsScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSignedIn: store.accounts.getAll().token !== null,
            cards: store.insights.getAll().cards
        };
        this.handleRefreshBtn = this.handleRefreshBtn.bind(this);
    };

    componentDidMount() {
        // Update this component's state when insights or accounts have updated
        store.insights.eventSystem.on('changed', () => this.updateState())
        store.accounts.eventSystem.on('changed', () => this.updateState())
    };

    setSpinner(isLoading) {
        let state = this.state;
        state.isLoading = isLoading;
        this.setState(state);
    }

    handleRefreshBtn() {
        this.setSpinner(true);
        store.insights.fetch()
            .then(result => {
                if (!result.success) {
                    store.messages.add({
                        type: MessageBarType.error,
                        contents: `Failed to retrieve insights: ${result.data.message}`
                    });
                } 
                this.setSpinner(false);
            });
    }

    updateState() {
        this.setState({
            isSignedIn: store.accounts.getAll().token !== null,
            cards: store.insights.getAll().cards
        });
    };

    render() {

        // Map all card objects in the state to React components
        const cards = this.state.cards.map(card => {
            return (
                <DocumentCard styles={cardStyles} >

                    {/* Card image */}
                    <DocumentCardImage
                        height={100}
                        imageFit={ImageFit.cover}
                        iconProps={{
                            iconName: 'RedEye',
                            styles: { root: { color: '#ffffff', fontSize: '96px', width: '96px', height: '96px' } }
                        }}
                    />

                    {/* Card contents/stack */}
                    <Stack style={cardStackStyle} tokens={{ childrenGap: 8 }}>
                        <Text variant='large' block> {card.header} </Text>
                        <Text block> {card.content} </Text>
                    </Stack>

                    {/* Card action buttons */}
                    <DocumentCardActions actions={[
                        {
                            key: 'like',
                            iconProps: { iconName: 'Like' },
                            onClick: () => { alert('Like clicked') }
                        },
                        {
                            key: 'dislike',
                            iconProps: { iconName: 'Dislike' },
                            onClick: () => { alert('Dislike clicked') }
                        }
                    ]} />

                </DocumentCard>
            );
        });

        // Create the Insights screen
        return (

            <div style={divStyle}>

                {/* Insights screen header */}
                <Stack horizontal
                    verticalAlign='center'
                    tokens={{ childrenGap: 16 }} >
                    <Text variant={'xxLarge'} block> <b>Insights</b> </Text>

                    {this.state.isSignedIn && 
                        <TooltipHost content='Refresh'>
                            <IconButton
                                iconProps={{ iconName: 'Refresh' }}
                                onClick={this.handleRefreshBtn}
                            />
                        </TooltipHost>
                    }

                </Stack>

                {/* Show message if not signed in */}
                {!this.state.isSignedIn && 
                    <Text>To view your insights, please sign in. </Text>
                }
                
                {/* Show message if signed in, but no cards */}
                {this.state.isSignedIn && cards.length === 0 &&
                    <Text>There are currently no insights. Click 'Refresh' or try again later. </Text>
                }

                {/* Show insights contents if signed in */}
                {this.state.isSignedIn && 
                    <ScrollablePane style={{
                        position: 'absolute',
                        top: '105px',
                        left: '30px',
                        paddingBottom: '260px',
                        paddingRight: '40px'
                    }}>
                        {cards}
                    </ScrollablePane>
                }

                <DialogSpinner
                    show={this.state.isLoading}
                    text='Retrieving your insights'
                />

            </div>

        );
    }
}