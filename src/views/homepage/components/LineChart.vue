<template>
  <div style="height:400px;width:100%"/>
</template>

<script>
import { clearInterval, setInterval } from "timers";
import { getLineChartData } from "@/api/lineChartData";

var echarts = require("echarts");

export default {
  data() {
    return {
      timeData: null,
      timer: null,
      dataSource: [],
      chart: null
    };
  },
  watch: {},
  created() {},
  mounted() {
    if (!this.chart) {
      this.initCharts();
    }
    if (this.timer) {
      clearInterval(this.timer);
    } else {
      this.timer = setInterval(() => {
        this.initCharts();
      }, 1800000);
    }
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    getData() {
      let lineChartdata = getLineChartData();
      this.dataSource = lineChartdata;

      //获取时间
      this.timeData = [];
      let now = new Date();
      let nowDate = now.toLocaleDateString();
      let nowHour = now.getHours();
      this.timeData.push(nowDate);
      for (let index = 1; index <= nowHour; index++) {
        let timeItem;
        if (index < 10) {
          timeItem = "0" + index + ":00";
        } else {
          timeItem = index + ":00";
        }
        this.timeData.push(timeItem);
      }
    },
    initCharts() {
      this.getData(); //获取数据
      this.chart = echarts.init(this.$el); //创建实例
      this.setOptions(); //设置数据
      window.onresize = this.chart.resize; //自适应
    },
    setOptions() {
      this.chart.setOption({
        tooltip: {
          trigger: "axis"
        },
        legend: {
          color: ["#F58080", "#47D8BE", "#F9A589"],
          data: [
            this.dataSource[0].name,
            this.dataSource[1].name,
            this.dataSource[2].name
          ],
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
            name: this.dataSource[0].name,
            type: "line",
            data: this.dataSource[0].data,
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
            name: this.dataSource[1].name,
            type: "line",
            data: this.dataSource[1].data,
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
            name: this.dataSource[2].name,
            type: "line",
            data: this.dataSource[2].data,
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
