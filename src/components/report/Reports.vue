<template >
  <div>
    <!-- nav -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Report</el-breadcrumb-item>
      <el-breadcrumb-item>Report view</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div id="main" style="width: 1000px; height: 500px">Loading the data</div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'reports',
  data () {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  methods: {

  },
  created () {
  },
  async mounted () {
    const { data: res } = await this.$http.get('reports/type/1')
    console.log(res)

    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'))

    const combinedData = { ...this.options, ...res.data }

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(combinedData)
  }
}
</script>
<style>
</style>
