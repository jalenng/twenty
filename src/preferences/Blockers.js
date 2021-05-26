import React from 'react';

import {
    ActionButton,
    DefaultButton,
    DetailsList,
    Dropdown,
    Stack,
    Text,
    Toggle,
    Selection
} from '@fluentui/react';

import { level1Props, level2Props, level2HorizontalProps } from './PrefsStackProps';

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            appDropdownSelection: null,
            blockers: store.preferences.getAll().blockers
        };
        this.handleAppDropdown = this.handleAppDropdown.bind(this);
        this.handleAppAdd = this.handleAppAdd.bind(this);
        this.handleAppDelete = this.handleAppDelete.bind(this);
        this.selection = new Selection();
    };

    componentDidMount() {
        // Update this component's state when preferences are updated
        store.preferences.eventSystem.on('changed', () => this.updateState())
    };

    updateState() {
        let state = this.state;
        state.blockers = store.preferences.getAll().blockers;
        this.setState(state);
    };

    // Update the state to reflect the selected value of the app dropdown menu
    handleAppDropdown(value) {
        let state = this.state;
        state.appDropdownSelection = value;
        this.setState(state);
    };

    // Add the selected value of the app dropbown menu to the list of blocker apps
    handleAppAdd() {
        // Ignore if there is no selection
        const selection = this.state.appDropdownSelection;
        if (selection === null) return 

        let appBlockers = this.state.blockers.apps;

        // Check if app is already in the list
        const foundExistingEntry = appBlockers.find(blocker => blocker === selection);
        if (foundExistingEntry != undefined) return;

        // Go ahead and append it to the list
        appBlockers.push(this.state.appDropdownSelection);
        store.preferences.set('blockers.apps', appBlockers);
    }

    // Delete the checked value of the blocker apps list
    handleAppDelete() {
        let selectionKeys = this.selection.getSelection().map(selection => selection.key);
        let appBlockers = this.state.blockers.apps;
        appBlockers = appBlockers.filter(path => {
            return selectionKeys.indexOf(path) === -1
        })
        store.preferences.set('blockers.apps', appBlockers);
    }

    render() {
        const appNames = store.appNames.getAll();

        // Map the list of objects about each window to a list of selectable options...
        let openWindowsOptions = getOpenWindows().map(process => {
            return {
                key: process.path,
                text: appNames[process.path],
            }
        })
            // ...then sort the list alphabetically.
            .sort((a, b) => {
                var textA = a.text.toUpperCase();
                var textB = b.text.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });

        // Columns of the list of blocker apps
        let blockerAppsColumns = [
            { key: '1', name: 'Name', fieldName: 'name', isResizable: true },
            { key: '2', name: 'Path', fieldName: 'key', isResizable: true }
        ];

        let blockerApps = this.state.blockers.apps.map( path => {
            console.log(path)
            return {
                key: path,
                name: appNames[path],
            }
        });

        return (

            <Stack id='blockers' {...level1Props}>

                {/* Blocker app settings */}
                <Stack {...level2Props}>

                    <Text variant={'xLarge'} block> Blocker apps </Text>

                    <Text variant={'medium'} block> Apps in this list will block the timer from running. </Text>

                    {/* Add app blockers */}
                    <Stack {...level2HorizontalProps} verticalAlign='end'>

                        <Dropdown label='Add an app'
                            styles={{ dropdown: { width: 300 } }}
                            options={openWindowsOptions}
                            selectedKey={this.state.appDropdownSelection}
                            placeholder='Select an app'
                            onChange={(event, option, index) => {
                                this.handleAppDropdown(openWindowsOptions[index].key)
                            }}
                        />

                        <DefaultButton
                            text='Add'
                            onClick={this.handleAppAdd}
                        />

                    </Stack>

                    {/* Manage existing app blockers */}
                    <ActionButton
                        iconProps={{ iconName: 'Delete' }}
                        text='Delete'
                        onClick={this.handleAppDelete}
                    />

                    <DetailsList
                        compact={true}
                        items={blockerApps}
                        columns={blockerAppsColumns}
                        selectionPreservedOnEmptyClick={true}
                        selection={this.selection}
                    />

                </Stack>

                {/* Other blocker settings */}
                <Stack {...level2Props}>

                    <Text variant={'xLarge'} block> Other blockers </Text>

                    <Toggle
                        label='Block timer when on battery power'
                        onText='On' offText='Off'
                        checked={this.state.blockers.blockOnBattery}
                        onChange={(event, checked) => store.preferences.set('blockers.blockOnBattery', checked)}
                    />

                </Stack>

            </Stack>
        )
    }
}