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
  Text
} from '@fluentui/react'

import logo from '../../assets/icon.png'
import { level1Props, level2Props, level2HorizontalProps } from './PrefsStackProps'

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
      licenseExpanded: false
    }
    this.handleToggleLicenseExpand = this.handleToggleLicenseExpand.bind(this)
  }

  handleToggleLicenseExpand () {
    this.setState({
      ...this.state,
      licenseExpanded: !this.state.licenseExpanded
    })
  }

  handleReset () {
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
      <Stack {...level1Props} id='about'>

        {/* Version info */}
        <Stack {...level2Props}>

          {/* App banner */}
          <Stack {...level2HorizontalProps}>

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
          <Stack {...level2HorizontalProps}>

            {versionComponents.map((component) => {
              return (
                <DefaultButton
                  key={component.key}
                  style={{ height: '52px', borderRadius: '8px' }}
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
        <Stack {...level2Props}>
          <Text variant='xLarge' block> Links </Text>

          <div style={{ display: 'inline' }}>

            {links.map(linkElem => {
              return (
                <DefaultButton
                  iconProps={{ iconName: linkElem.iconName }}
                  key={linkElem.name}
                  style={{ borderRadius: '8px', marginRight: '8px', marginBottom: '8px' }}
                  text={linkElem.name}
                  onClick={() => openExternalLink(linkElem.link)}
                />
              )
            })}

          </div>
        </Stack>

        {/* Attributions to open-source libraries */}
        <Stack {...level2Props}>
          <Text variant='xLarge' block> Open source libraries </Text>

          <div style={{ display: 'inline' }}>

            {openSourceLibraries.map(library => {
              return (
                <DefaultButton
                  key={library.name}
                  style={{ borderRadius: '8px', marginRight: '8px', marginBottom: '8px' }}
                  text={library.name}
                  onClick={() => openExternalLink(library.link)}
                />
              )
            })}

          </div>
        </Stack>

        {/* License */}
        <Stack {...level2Props}>
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
            onClick={this.handleToggleLicenseExpand}
          />

        </Stack>

        {/* Options to reset the app */}
        <Stack {...level2Props}>

          <Text variant='xLarge' block> Reset app </Text>

          <Stack {...level2HorizontalProps}>
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
