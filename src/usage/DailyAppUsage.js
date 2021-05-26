import React from "react";
import { Pie, defaults} from "react-chartjs-2";

defaults.global.tooltips.enabled = true;

export default class DailyAppUsage extends React.Component {

  constructor(props) {
    super(props);

    // Get data usage values.
    let usage = store.dataUsage.getAll();
    this.appUsage = usage.fetched.appUsage;

    // Get apps names & usage from unsynced.
    this.labels = [];
    this.usage = [];
    var today = getToday() + 'T00:00:00.000Z'
    console.log(today)
    for (var i=0; i < this.appUsage.length; i++) {
      if (this.appUsage[i].usageDate == today) {
        this.labels.push(this.appUsage[i].appName);
        var seconds = this.appUsage[i].appTime / 1000;
        var minutes = Math.floor(seconds / 60);
        this.usage.push(minutes);
        }
      }
    }

  render() {
    return (
      <div>
        <Pie
          data={{
            labels: this.labels,
            datasets: [
              {
                data: this.usage,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgb(219,112,147, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 159, 64, 0.2)",
                  "rgba(30, 130, 76, 0.2)",
                  "rgba(0, 30, 128, 0.2)",
                  "rgba(149, 165, 166, 0.2)",
                  "rgba(230, 25, 75, 0.2)",
                  "rgba(220, 190, 225, 0.2)",
                  "rgba(245, 130, 48, 0.2)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgb(219,112,147, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
                  "rgba(30, 130, 76, 1)",
                  "rgba(0, 30, 128, 1)",
                  "rgba(149, 165, 166, 1)",
                  "rgba(230, 25, 75, 1)",
                  "rgba(220, 190, 225, 1)",
                  "rgba(245, 130, 48, 1)",
                ],
                borderWidth: 1,
              },
            ],
          }}
          height={400}
          width={800}
          options={{
            title: {
              display: true,
              text: "Daily App Usage (Seconds)",
              fontColor: "#FFFFFF",
              fontSize: 20,
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
