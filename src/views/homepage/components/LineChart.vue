<template>
  <div style="width: 1500px;height:400px;"/>
</template>

<script>
var echarts = require("echarts");

export default {
  data() {
    return {
      timeData: []
    };
  },
  created() {},
  mounted() {
    this.initCharts();
  },
  methods: {
    initCharts() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions();
    },
    setOptions() {
      //获取当前时间
      let now = new Date();
      let nowDate = now.toLocaleDateString();
      let nowHour = now.getHours();
      this.timeData.push(nowDate);
      for (let index = 0; index < nowHour; index++) {
        console.log(nowHour);
        let timeItem;
        if (index < 10) {
          timeItem = "0" + index + ":00";
        } else {
          timeItem = index + ":00";
        }
        this.timeData.push(timeItem);
      }

      this.chart.setOption({
        tooltip: {
          trigger: "axis"
        },
        legend: {
          color: ["#F58080", "#47D8BE", "#F9A589"],
          data: ["手表", "驱蚊器", "化妆品"],
          left: "center",
          bottom: "bottom"
        },
        grid: {
          top: "middle",
          left: "3%",
          right: "4%",
          bottom: "3%",
          height: "80%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: this.timeData,
          axisLine: {
            lineStyle: {
              color: "#999"
            }
          }
        },
        yAxis: {
          type: "value",

          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "#DDD"
            }
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "#333"
            }
          },
          nameTextStyle: {
            color: "#999"
          },
          splitArea: {
            show: false
          }
        },
        series: [
          {
            name: "手表",
            type: "line",
            data: [
              105,
              77,
              39,
              37,
              50,
              69,
              142,
              135,
              157,
              302,
              215,
              151,
              224,
              236,
              237,
              231,
              149,
              133,
              58
            ],
            color: "#F58080",
            lineStyle: {
              normal: {
                width: 5,
                color: {
                  type: "linear",

                  colorStops: [
                    {
                      offset: 0,
                      color: "#FFCAD4" // 0% 处的颜色
                    },
                    {
                      offset: 0.4,
                      color: "#F58080" // 100% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#F58080" // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                },
                shadowColor: "rgba(245,128,128, 0.5)",
                shadowBlur: 10,
                shadowOffsetY: 7
              }
            },
            itemStyle: {
              normal: {
                color: "#F58080",
                borderWidth: 10,
                /*shadowColor: 'rgba(72,216,191, 0.3)',
                     shadowBlur: 100,*/
                borderColor: "#F58080"
              }
            },
            smooth: true
          },
          {
            name: "驱蚊器",
            type: "line",
            data: [
              3,
              6,
              3,
              11,
              14,
              6,
              15,
              20,
              21,
              10,
              5,
              10,
              3,
              2,
              2,
              8,
              2,
              1,
              0
            ],
            lineStyle: {
              normal: {
                width: 5,
                color: {
                  type: "linear",

                  colorStops: [
                    {
                      offset: 0,
                      color: "#AAF487" // 0% 处的颜色
                    },
                    {
                      offset: 0.4,
                      color: "#47D8BE" // 100% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#47D8BE" // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                },
                shadowColor: "rgba(71,216,190, 0.5)",
                shadowBlur: 10,
                shadowOffsetY: 7
              }
            },
            itemStyle: {
              normal: {
                color: "#AAF487",
                borderWidth: 10,
                /*shadowColor: 'rgba(72,216,191, 0.3)',
                     shadowBlur: 100,*/
                borderColor: "#AAF487"
              }
            },
            smooth: true
          },
          {
            name: "化妆品",
            type: "line",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
            lineStyle: {
              normal: {
                width: 5,
                color: {
                  type: "linear",

                  colorStops: [
                    {
                      offset: 0,
                      color: "#F6D06F" // 0% 处的颜色
                    },
                    {
                      offset: 0.4,
                      color: "#F9A589" // 100% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#F9A589" // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                },
                shadowColor: "rgba(249,165,137, 0.5)",
                shadowBlur: 10,
                shadowOffsetY: 7
              }
            },
            itemStyle: {
              normal: {
                color: "#F6D06F",
                borderWidth: 10,
                /*shadowColor: 'rgba(72,216,191, 0.3)',
                     shadowBlur: 100,*/
                borderColor: "#F6D06F"
              }
            },
            smooth: true
          }
        ]
      });
    }
  }
};
</script>
