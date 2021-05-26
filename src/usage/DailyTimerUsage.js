import React from "react";
import { Bar, defaults } from "react-chartjs-2"
import { Text } from '@fluentui/react/lib/Text';

defaults.global.tooltips.enabled = true;

export default class DailyTimerUsage extends React.Component {

  constructor(props) {
    super(props);
    this.state = store.dataUsage.getAll();

    // Get list of timer usage days.
    var timerUsageList = this.state.fetched.timerUsage;
    this.todaysUsage = 0;

    // Get todays timer usage from list of days.
    var todaysDate = getToday() + 'T00:00:00.000Z';
    console.log('todaysDate : ' + todaysDate);
    var i, usageObj;
    for (i=0; i<timerUsageList.length; i++) {
      usageObj = timerUsageList[i];
      if (usageObj.usageDate === todaysDate) {
        this.todaysUsage = usageObj;
      }
    }

    this.minutes = Math.floor(this.todaysUsage.screenTime/60);
    this.seconds = Math.floor(this.todaysUsage.screenTime%60);
  }

  render() {
    // Since this screen displays, "You've taken X breaks today"
    // If user took one break, display 'break today' instead of 'breaks today'
    let endingBreakStr, minuteStr = '';
    if (this.todaysUsage.timerCount == 1) {
      endingBreakStr = 'break today';
    }
    else {
      endingBreakStr = 'breaks today';
    }
    // same logic for the word minute
    if (this.minutes == 1) {
      minuteStr = 'minute'
    }
    else {
      minuteStr = 'minutes'
    }
    
    return (
      <div style={{alignItems: 'center', verticalAlign: 'center'}}>
        {/* Screen Usage Duration */}
        <Text variant={"xxLarge"} block>
          Smart Screen  Usage : 
            <span style={{color: 'green'}}> {this.minutes} {minuteStr} {this.seconds} seconds</span> 
        </Text>
        {/*  Number of Breaks */}
        <Text variant={"xxLarge"} block>
          You've taken 
          <span style={{color: 'green'}}> {this.todaysUsage.timerCount} </span> 
          {endingBreakStr}
        </Text>
      </div>
    );
  }
}
