import React from 'react';

import { 
  ScrollablePane,
  Text
} from '@fluentui/react';

import UsageSidebar from './UsageSidebar';
import DailyAppUsage from './DailyAppUsage';
import WeeklyAppUsage from './WeeklyAppUsage';
import DailyTimerUsage from './DailyTimerUsage'
import WeeklyTimerUsage from './WeeklyTimerUsage';

const divStyle = {
  paddingTop: '10px',
  paddingLeft: '30px',
  display: "grid"
};

const usagePages = {
  daily_app_usage: <DailyAppUsage/>,
  weekly_app_usage: <WeeklyAppUsage/>,
  daily_timer_usage: <DailyTimerUsage/>,
  weekly_timer_usage: <WeeklyTimerUsage/>,
}

export default class UsageScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      isSignedIn: store.accounts.getAll().token !== null,
      selectedKey: 'daily_app_usage' 
    };
  }

  componentDidMount() {
    store.accounts.eventSystem.on('changed', () => this.updateState())
    if (this.state.isSignedIn === true) {
      this.syncUsage();
      setInterval(this.syncUsage, 10000);
    }
  }

  updateState() {
    this.setState({
        ...this.state,
        isSignedIn: store.accounts.getAll().token !== null,
    });
    this.syncUsage();
  };

  // 
  /**
   * Pushes unsynced data usage to server & resets its values 
   * 
   */
  syncUsage() {
    // only push to server if updates exist
    store.dataUsage.push().then(result => {
      if (result.success) {
          store.dataUsage.fetch();
          // console.logs for debugging purposes. remove later.
          console.log("SUCCESS: Unsynced data usage pushed to server");
      }
      else {
        console.log("FAILURE: Cant push unsynced data usage to server");
      }
    });
  }

  render() {
    const selectedKey = this.state.selectedKey;
    let usagePage = usagePages[selectedKey];
    
    return (
      <div style={divStyle}>

        <ScrollablePane style={{
          position: "absolute",
          top: "60px",
          left: "260px",
          paddingBottom: "260px",
          paddingRight: "40px"
        }}>
          {/* Show message if not signed in */}
          {!this.state.isSignedIn &&
            <Text>To view your usage statistics, please sign in. </Text>
          }

          {/* Show usage page if signed in */}
          {this.state.isSignedIn && 
            usagePage
          }

        </ScrollablePane>
                
        <UsageSidebar
          selectedKey={selectedKey} 
          onUpdateSelectedKey={(key) => {
            this.setState({...this.state, selectedKey: key });
          }}
        />

      </div>
    );
  }
}

