<template>
  <div ref="echarts" style="height:600px;width:100%" />
</template>

<script>
import { clearInterval, setInterval } from "timers";
import { getEchartData } from "@/api/homepage";

var echarts = require("echarts");

export default {
  data() {
    return {
      dataSource: [],
      chart: null,
      nameList: [],
      dataList: [],
      timeData: [],
      tableHeight: "",
      echartHeight: 0
    };
  },
  mounted() {
    this.initCharts();
  },
  methods: {
    initCharts() {
      getEchartData().then(res => {
        let clientWidth = this.$refs.echarts.offsetWidth;
        let rows = Math.ceil((res.data.length * 100) / clientWidth);
        let mobileEchartHeight = 0;
        let mobileTableHeight = "";
        switch (rows) {
          case 1:
            mobileEchartHeight = 300;
            mobileTableHeight = "10%";
            break;
          case 2:
            mobileEchartHeight = 280;
            mobileTableHeight = "14%";
            break;
          case 3:
            mobileEchartHeight = 260;
            mobileTableHeight = "18%";
            break;
          case 4:
            mobileEchartHeight = 240;
            mobileTableHeight = "22%";
            break;
          case 5:
            mobileEchartHeight = 220;
            mobileTableHeight = "26%";
            break;
          case 6:
            mobileEchartHeight = 200;
            mobileTableHeight = "30%";
            break;
          case 7:
            mobileEchartHeight = 180;
            mobileTableHeight = "34%";
            break;
          case 8:
            mobileEchartHeight = 160;
            mobileTableHeight = "38%";
            break;
          case 9:
            mobileEchartHeight = 140;
            mobileTableHeight = "42%";
            break;
          case 10:
            mobileEchartHeight = 120;
            mobileTableHeight = "48%";
            break;
          case 11:
            mobileEchartHeight = 80;
            mobileTableHeight = "52%";
            break;
          case 12:
            mobileEchartHeight = 60;
            mobileTableHeight = "56%";
            break;

          default:
            break;
        }
        // this.echartHeight = 600 - (80 * rows);
        this.echartHeight =
          this.$store.state.app.device == "desktop" ? 300 : mobileEchartHeight;
        this.tableHeight =
          this.$store.state.app.device == "desktop" ? "30%" : mobileTableHeight;
        let colorList = [
          "#FFC0CB",
          "#DA70D6",
          "#6A5ACD",
          "#87CEFA",
          "#00FA9A",
          "#FFD700",
          "#FFA500",
          "#FFA07A",
          "#FF6347",
          "#B22222",
          "#1E90FF",
          "#F0E68C",
          "#FFEFD5",
          "#90EE90",
          "#A52A2A",
          "#7FFF00",
          "#008080",
          "#48D1CC",
          "#5F9EA0",
          "#C71585",
          "#B0C4DE"
        ];
        let time = new Date().getHours();
        for (let index = 0; index <= time; index++) {
          this.timeData.push(`${index}:00`);
        }
        let lineChartdata = res.data; //获取数据
        lineChartdata.forEach(item => {
          let index = parseInt(Math.random() * 21);
          this.nameList.push(item.name);
          let dataOjb = {
            name: item.name,
            type: "line",
            barWidth: "15%",
            showAllSymbol: true,
            symbol: "emptyCircle",
            symbolSize: 10, //圆圈圈的大小
            itemStyle: {
              normal: {
                width: 5,
                color: colorList[index],
                barBorderRadius: 11
              }
            },
            // symbol:'none',//去掉点的
            smooth: true, //曲线变平滑的
            lineStyle: {
              normal: {
                width: 3, //折线的borderWidth 宽
                shadowColor: "rgba(73,140,252, 0.5)",
                shadowBlur: 10,
                shadowOffsetY: 7
              }
            },
            data: item.data
          };
          this.dataList.push(dataOjb);
        });
        this.chart = echarts.init(this.$el); //创建实例
        this.setOptions(); //设置数据
        window.onresize = this.chart.resize; //自适应
      });
    },
    setOptions() {
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "line" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "2%",
          right: "4%",
          bottom: "4%",
          top: this.tableHeight,
          height: this.echartHeight,
          containLabel: true
        },
        legend: {
          data: this.nameList,
          right: 10,
          top: 12,
          textStyle: {
            color: "#2b3b60"
          },
          itemWidth: 12,
          itemHeight: 10
          // itemGap: 35
        },
        xAxis: {
          type: "category",
          data: this.timeData,
          axisLine: {
            lineStyle: {
              color: "#d2d9e4"
            }
          },
          axisLabel: {
            textStyle: {
              fontFamily: "Microsoft YaHei",
              color: "#6175a2"
            }
          }
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false,
            lineStyle: {
              color: "#6175a2"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              color: "#d2d9e4"
            }
          },
          axisLabel: {}
        },
        series: this.dataList
      });
    }
  }
};
</script>
