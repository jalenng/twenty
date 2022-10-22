/**
 * @file The "About" tab in Preferences
 * @author jalenng
 */

/* eslint-disable no-undef */

import React from 'react'

import {
  DefaultButton, PrimaryButton, ActionButton,
  Stack,
  Dialog, DialogFooter, DialogType,
  Text
} from '@fluentui/react'

import logo from '../../assets/icon.png'
import { StackProps } from '../../SharedProps'

const versionComponents = [
  { key: 'electron', text: 'Electron' },
  { key: 'chrome', text: 'Chrome' },
  { key: 'node', text: 'Node' },
  { key: 'v8', text: 'V8' }
]

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      licenseExpanded: false,
      resetDialogVisible: false
    }
    this.handleToggleLicenseExpandBtn = this.handleToggleLicenseExpandBtn.bind(this)
    this.handleToggleResetDialogBtn = this.handleToggleResetDialogBtn.bind(this)
  }

  handleToggleLicenseExpandBtn () {
    this.setState({
      ...this.state,
      licenseExpanded: !this.state.licenseExpanded
    })
  }

  handleToggleResetDialogBtn () {
    this.setState({
      ...this.state,
      resetDialogVisible: !this.state.resetDialogVisible
    })
  }

  handleResetBtn () {
    store.reset()
  }

  render () {
    const appInfo = aboutAppInfo.appInfo
    const versions = aboutAppInfo.versions
    const links = aboutAppInfo.links
    const openSourceLibraries = aboutAppInfo.openSourceLibraries
    const licenseParagraphs = this.state.licenseExpanded
      ? aboutAppInfo.license
      : aboutAppInfo.license.slice(0, 2)

    return (
      <Stack {...StackProps.level1} id='about'>

        {/* App banner */}
        <Stack {...StackProps.level2}>

          <Stack {...StackProps.level2Horizontal}>

            <img
              src={logo}
              style={{ objectFit: 'contain', width: 32, height: 32 }}
            />

            <Text variant='xxLarge' block>
              {`${appInfo.name} ${appInfo.version}`}
            </Text>

          </Stack>

        </Stack>

        {/* Chips for Electron, Chrome, Node, and v8 engine versions */}
        <Stack {...StackProps.level2Horizontal}>

          <Stack {...StackProps.level2Horizontal}>

            {versionComponents.map((component) => {
              return (
                <DefaultButton
                  key={component.key}
                  style={{ height: '52px' }}
                  disabled
                  onRenderText={() => {
                    return (
                      <Stack horizontalAlign='start'>
                        <b>{component.text}</b>
                        {versions[component.key]}
                      </Stack>
                    )
                  }}
                />
              )
            })}

          </Stack>

        </Stack>

        {/* Links */}
        <Stack {...StackProps.level2}>
          <Text variant='xLarge' block> Links </Text>

          <div style={{ display: 'inline' }}>

            {links.map(linkElem => {
              return (
                <DefaultButton
                  iconProps={{ iconName: linkElem.iconName }}
                  key={linkElem.name}
                  style={{ marginRight: '8px', marginBottom: '8px' }}
                  text={linkElem.name}
                  onClick={() => openExternalLink(linkElem.link)}
                />
              )
            })}

          </div>
        </Stack>

        {/* Attributions to open-source libraries */}
        <Stack {...StackProps.level2}>
          <Text variant='xLarge' block> Open source libraries </Text>

          <div style={{ display: 'inline' }}>

            {openSourceLibraries.map(library => {
              return (
                <DefaultButton
                  key={library.name}
                  style={{ marginRight: '8px', marginBottom: '8px' }}
                  text={library.name}
                  onClick={() => openExternalLink(library.link)}
                />
              )
            })}

          </div>
        </Stack>

        {/* License */}
        <Stack {...StackProps.level2}>
          <Text variant='xLarge' block> License </Text>

          {licenseParagraphs.map(paragraph => {
            return (
              <Text
                block
                key={paragraph.number}
                variant='medium'
                style={{ paddingRight: '30px' }}
              >
                {paragraph.text}
              </Text>
            )
          })}

          {/* Show more / show less button */}
          <ActionButton
            iconProps={
              this.state.licenseExpanded
                ? { iconName: 'Movers' }
                : { iconName: 'Sell' }
            }
            text={this.state.licenseExpanded ? 'Show less' : 'Show more'}
            onClick={this.handleToggleLicenseExpandBtn}
          />

        </Stack>

        {/* Options to reset the app */}
        <Stack {...StackProps.level2}>

          <Text variant='xLarge' block> Reset app </Text>

          <Stack {...StackProps.level2Horizontal}>
            <DefaultButton
              text={`Reset ${appInfo.name}`}
              iconProps={{ iconName: 'Refresh' }}
              onClick={this.handleToggleResetDialogBtn}
            />
          </Stack>

        </Stack>

        <Dialog
          hidden={!this.state.resetDialogVisible}
          dialogContentProps={{
            type: DialogType.largeHeader,
            title: `Reset ${appInfo.name}?`,
            subText: `${appInfo.name} will restart, and your preferences will revert to its defaults.`
          }}
        >
          <DialogFooter>
            <DefaultButton onClick={this.handleToggleResetDialogBtn} text='No' />
            <PrimaryButton onClick={this.handleResetBtn} text='Yes' />
          </DialogFooter>
        </Dialog>

      </Stack>
    )
  }
}
