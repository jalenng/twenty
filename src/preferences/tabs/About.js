/**
 * @file The "About" tab in Preferences
 * @author jalenng
 */

/* eslint-disable no-undef */

import React from 'react'

import {
  DefaultButton, ActionButton,
  Image, ImageFit,
  Stack,
  Text,
  PrimaryButton
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
      testText: '',
      isCheckingUpdates: false,
      licenseExpanded: false
    }
    this.handleUpdatesBtn = this.handleUpdatesBtn.bind(this)
    this.handleToggleLicenseExpandBtn = this.handleToggleLicenseExpandBtn.bind(this)
  }

  handleUpdatesBtn () {
    this.setState({
      ...this.state,
      isCheckingUpdates: true
    })
    checkUpdate()
      .then((result) => {
        if (result) {
          this.setState({
            ...this.state,
            testText: `Downloading version ${result.version}...`
          })
          downloadUpdate().then(() => {
            this.setState({
              ...this.state,
              testText: 'Download complete. Update will install upon app restart.',
              isCheckingUpdates: true
            })
          })
        } else {
          this.setState({
            ...this.state,
            testText: 'No new versions found.',
            isCheckingUpdates: false
          })
        }
      })
      .catch(() => {
        this.setState({
          ...this.state,
          testText: 'There was an error. Please try again later.',
          isCheckingUpdates: false
        })
      })
  }

  handleToggleLicenseExpandBtn () {
    this.setState({
      ...this.state,
      licenseExpanded: !this.state.licenseExpanded
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

        {/* Version info */}
        <Stack {...StackProps.level2}>

          {/* App banner */}
          <Stack {...StackProps.level2Horizontal}>

            <Image
              imageFit={ImageFit.centerContain}
              src={logo}
              width={96}
              height={96}
            />

            <Text variant='xxLarge' style={{ fontSize: '3.5rem' }} block>
              {`${appInfo.name} ${appInfo.version}`}
            </Text>

          </Stack>

          {/* Chips for Electron, Chrome, Node, and v8 engine */}
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

        {/* Check for updates */}
        <Stack {...StackProps.level2}>

          <Stack {...StackProps.level2Horizontal}>
            <PrimaryButton
              text='Check for updates'
              iconProps={{ iconName: 'Sync' }}
              onClick={this.handleUpdatesBtn}
              disabled={this.state.isCheckingUpdates}
            />
          </Stack>

          <Text>{this.state.testText}</Text>

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
              onClick={this.handleReset}
            />
          </Stack>

        </Stack>

      </Stack>
    )
  }
}
