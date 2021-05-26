import React from "react";
import { Bar, defaults } from "react-chartjs-2"

defaults.global.tooltips.enabled = true;

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default class BarChart extends React.Component {

  constructor(props) {
    super(props);

    this.appUsage = store.dataUsage.getAll().fetched.appUsage;
    this.backgroundColor = [];

    // Get apps names & usage from unsynced.
    this.labels = [];
    this.usage = [];
    for (var i=0; i < this.appUsage.length; i++) {
      this.labels.push(this.appUsage[i].appName);
      var appTime = this.appUsage[i].appTime;
      this.usage.push(Math.floor(appTime/60000));
      this.backgroundColor.push("rgba(72, 121, 240, 1)");
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
                label: "Seconds",
                data: this.usage,
                backgroundColor: this.backgroundColor,
              },
            ],
          }}
          height={400}
          width={30}
          options={{
            title: {
              display: true,
              text: "Weekly App Usage",
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
