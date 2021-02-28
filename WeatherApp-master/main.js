var app = new Vue({
  el: "#app",
  data: {
    chart: null,
    city: "",
    dates: [],
    temps: [],
    hum: [],
    wind: [],
    loading: false,
    errored: false
  },
  methods: {
    getData: function() {
      this.loading = true;

      if (this.chart != null) {
        this.chart.destroy();
      }

      axios
        .get("https://api.openweathermap.org/data/2.5/forecast", {
          params: {
            q: this.city,
            units: "metric",
            appid: "6841e5450643e5d4ff59981dbf58944e"
          }
        })
        .then(response => {
          this.dates = response.data.list.map(list => {
            return list.dt_txt;
          });

          this.temps = response.data.list.map(list => {
            return list.main.temp;
          });

          this.hum = response.data.list.map(list => {
            return list.main.humidity;
          });

          this.wind = response.data.list.map(list => {
            return list.wind.speed;
          });

          var ctx = document.getElementById("myChart");

          this.chart = new Chart(ctx, {
            type: "bar",
            data: {
              labels: this.dates,
              datasets: [
                {
                  label: "Bar: Temp(°C)",
                  backgroundColor: "rgba(217, 74, 38)",
                  // borderColor: "rgb(54, 162, 235)",
                  fill: false,
                  data: this.temps
                },
                {
                  label: "Bar: Humidity(%)",
                  backgroundColor: "rgba(54, 162, 235)",
                  fill: false,
                  data: this.hum
                },
                {
                  label: "Bar: WindSpeed(m/s)",
                  backgroundColor: "rgba(0, 0, 0)",
                  fill: false,
                  data: this.wind
                },
                {
                  label: "Line: Temp(°C)",
                  backgroundColor: "rgba(217, 74, 38)",
                  borderColor: "rgba(217, 74, 38)",
                  type:'line',
                  fill: false,
                  data: this.temps,
                  
                },
                {
                  label: "Line: Humidity(%)",
                  backgroundColor: "rgba(54, 162, 235)",
                  borderColor: "rgba(54, 162, 235)",
                  fill: false,
                  data: this.hum,
                  type:'line'
                },
                {
                  label: "Line: WindSpeed(m/s)",
                  backgroundColor: "rgba(0, 0, 0)",
                  borderColor: "rgba(0, 0, 0)",
                  fill: false,
                  data: this.wind,
                  type:'line'

                }
              ]
            },
            options: {
              title: {
                display: true,
                text: "Plotting of the Weather Forecast",
                fontSize : 25
              },
              legend: {
                position: 'right',
                labels: {
                  fontColor: '#000'
                }
              },
              tooltips: {
                callbacks: {
                  label: function(tooltipItem, data) {
                    var label =
                      data.datasets[tooltipItem.datasetIndex].label || "";

                    if (label) {
                      label += ": ";
                    }

                    label += Math.floor(tooltipItem.yLabel);
                    return label ;
                  }
                }
              },
              scales: {
                xAxes: [
                  {
                    type: "time",
                    time: {
                      unit: "hour",
                      displayFormats: {
                        hour: "DD/MM/YY"
                      },
                      tooltipFormat: "MMM. DD @ hA"
                    },
                    scaleLabel: {
                      display: true,
                      labelString: "Date/Time"
                    }
                  }
                ],
                yAxes: [
                  {
                    scaleLabel: {
                      display: true,
                      labelString: "Respective Units"
                    },
                    ticks: {
                      callback: function(value, index, values) {
                        return value ;
                      }
                    }
                  }
                ]
              }
            }
          });
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => (this.loading = false));
    }
  }
});


