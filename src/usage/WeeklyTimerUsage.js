import React from "react";
import { Bar, defaults } from "react-chartjs-2"

defaults.global.tooltips.enabled = true;

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default class BarChart extends React.Component {

  constructor(props) {
    super(props);

    var weeklyUsage = this.getPastWeek();
    this.labels = weeklyUsage.names;
    this.formatted = weeklyUsage.formatted;
    this.usage = store.dataUsage.getAll();
    this.date = new Date();

    var i;
    this.timerUsage = {
      screenUsage:  [],
      timerCount: []
    }

    this.formattedDate = this.getFormattedDate(this.date);
    for (i=0; i < this.formatted.length; i++) {
      var usageObj = this.getUsage(this.usage.fetched.timerUsage, this.formatted[i]);
      var minsUsage = Math.floor(usageObj.screenTime/60);
      this.timerUsage.screenUsage.push(minsUsage);
      this.timerUsage.timerCount.push(usageObj.timerCount);
    }
  }

   // Gets the past week's 
  //  1. Date objects (ex. 'Sun May 02 2021 01:48:55 GMT-0700 (Pacific Daylight Time)') 
  //  2. Names (ex. 'Sunday', 'Monday', etc)
  //  3. Formatted Dates ('2021-05-02')
  getPastWeek() {
    var dates = [];
    var names = [];
    var formatted = [];
    var i, day;
    for (i = weekdays.length-1; i >= 0; i--) {
      day = new Date();
      day.setDate(day.getDate() - i);
      dates.push(day); 
      names.push(weekdays[day.getDay()]);
      formatted.push(this.getFormattedDate(day));
    }

    return {
      dates: dates,
      names: names,
      formatted: formatted,
    }
  }

  // Format: YEAR-MONTH-DAY  
  // ex. '2021-05-07'
  getFormattedDate(theDate) {
    var year = theDate.getFullYear();
    var month = ("00" + (theDate.getMonth() + 1)).substr(-2, 2);
    var day = ("00" + theDate.getDate()).substr(-2, 2);
    return  `${year}-${month}-${day}`;
  }

    // Returns the data usage for specified date from given usage list. 
  getUsage(usageList, dateFormatted) {
    // will remove when db stops storing values with attached string.
    var todaysDate = dateFormatted + 'T00:00:00.000Z';
    var i, usageObj;
    for (i=0; i<usageList.length; i++) {
      usageObj = usageList[i];
      if (usageObj.usageDate === todaysDate) {
        return usageObj;
      }
    }
    return {
        appUsage: [],
        timerUsage: []
    }
  }

  render() {
    return (
      <div>
        <Bar
          data={{
            labels: this.labels,
            datasets: [
              {
                label: "Screen usage (Minutes)",
                data: this.timerUsage.screenUsage,
                backgroundColor: [
                  "rgba(72, 121, 240, 1)",
                  "rgba(72, 121, 240, 1)",
                  "rgba(72, 121, 240, 1)",
                  "rgba(72, 121, 240, 1)",
                  "rgba(72, 121, 240, 1)",
                  "rgba(72, 121, 240, 1)",
                  "rgba(72, 121, 240, 1)",
                  "rgba(72, 121, 240, 1)",
                ],
              },
              {
                label: "Total # of breaks",
                data: this.timerUsage.timerCount,
                backgroundColor: "lightblue",
              },
            ],
          }}
          height={400}
          width={30}
          options={{
            title: {
              display: true,
              text: "Weekly Timer Usage",
              fontColor: "#FFFFFF",
              fontSize: 20,
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    fontColor: "#FFFFFF",
                  },
                },
              ],
              xAxes: [
                {
                  ticks: { fontColor: "#FFFFFF" },
                },
              ],
            },
            maintainAspectRatio: false,
            legend: {
              position: "right",
              labels: {
                fontSize: 15,
                fontColor: "#FFFFFF",
              },
            },
          }}
        />
      </div>
    );
  }
}
