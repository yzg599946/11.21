(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6acd0022"],{a418:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{ref:"echarts",staticStyle:{height:"600px",width:"100%"}})},r=[],o=(a("7f7f"),a("ac6a"),a("5118"),a("c6aa")),n=a("313e"),s={data:function(){return{dataSource:[],chart:null,nameList:[],dataList:[],timeData:[],tableHeight:"",echartHeight:0}},mounted:function(){this.initCharts()},methods:{initCharts:function(){var t=this;Object(o["a"])().then(function(e){var a=t.$refs.echarts.offsetWidth,i=Math.ceil(100*e.data.length/a),r=0,o="";switch(i){case 1:r=300,o="10%";break;case 2:r=280,o="14%";break;case 3:r=260,o="18%";break;case 4:r=240,o="22%";break;case 5:r=220,o="26%";break;case 6:r=200,o="30%";break;case 7:r=180,o="34%";break;case 8:r=160,o="38%";break;case 9:r=140,o="42%";break;case 10:r=120,o="48%";break;case 11:r=80,o="52%";break;case 12:r=60,o="56%";break;default:break}t.echartHeight="desktop"==t.$store.state.app.device?300:r,t.tableHeight="desktop"==t.$store.state.app.device?"30%":o;for(var s=["#FFC0CB","#DA70D6","#6A5ACD","#87CEFA","#00FA9A","#FFD700","#FFA500","#FFA07A","#FF6347","#B22222","#1E90FF","#F0E68C","#FFEFD5","#90EE90","#A52A2A","#7FFF00","#008080","#48D1CC","#5F9EA0","#C71585","#B0C4DE"],c=(new Date).getHours(),h=0;h<=c;h++)t.timeData.push("".concat(h,":00"));var l=e.data;l.forEach(function(e){var a=parseInt(21*Math.random());t.nameList.push(e.name);var i={name:e.name,type:"line",barWidth:"15%",showAllSymbol:!0,symbol:"emptyCircle",symbolSize:10,itemStyle:{normal:{width:5,color:s[a],barBorderRadius:11}},smooth:!0,lineStyle:{normal:{width:3,shadowColor:"rgba(73,140,252, 0.5)",shadowBlur:10,shadowOffsetY:7}},data:e.data};t.dataList.push(i)}),t.chart=n.init(t.$el),t.setOptions(),window.onresize=t.chart.resize})},setOptions:function(){this.chart.setOption({tooltip:{trigger:"axis",axisPointer:{type:"line"}},grid:{left:"2%",right:"4%",bottom:"4%",top:this.tableHeight,height:this.echartHeight,containLabel:!0},legend:{data:this.nameList,right:10,top:12,textStyle:{color:"#2b3b60"},itemWidth:12,itemHeight:10},xAxis:{type:"category",data:this.timeData,axisLine:{lineStyle:{color:"#d2d9e4"}},axisLabel:{textStyle:{fontFamily:"Microsoft YaHei",color:"#6175a2"}}},yAxis:{type:"value",axisLine:{show:!1,lineStyle:{color:"#6175a2"}},splitLine:{show:!0,lineStyle:{type:"dashed",color:"#d2d9e4"}},axisLabel:{}},series:this.dataList})}}},c=s,h=a("2877"),l=Object(h["a"])(c,i,r,!1,null,null,null);e["default"]=l.exports},c6aa:function(t,e,a){"use strict";a.d(e,"c",function(){return r}),a.d(e,"b",function(){return o}),a.d(e,"a",function(){return n});var i=a("b775");function r(){return Object(i["a"])({url:"/main/common/order/operating/time",method:"post"})}function o(){return Object(i["a"])({url:"/main/common/order/count",method:"post"})}function n(){return Object(i["a"])({url:"/main/common/today",method:"post"})}}}]);