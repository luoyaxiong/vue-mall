<template >
  <div>
     <!-- nav -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item>Rights</el-breadcrumb-item>
        <el-breadcrumb-item>Rights list</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
       <!-- table -->
       <el-table
        :data="rightList"
        border
        stripe
        style="width: 100%">
        <el-table-column
          type ="index"
          label="#"
          >
        </el-table-column>
         <el-table-column
          prop="authName"
          label="auth name"
          >
        </el-table-column>
        <el-table-column
          prop="path"
          label="Path"
          >
        </el-table-column>

        <el-table-column
          prop="level"
          label="Level"
          >
          <template v-slot="slotProps">
            <el-tag v-if="slotProps.row.level==='0'">level 1</el-tag>
            <el-tag v-if="slotProps.row.level==='1'" type="success">level 2</el-tag>
            <el-tag v-if="slotProps.row.level==='2'" type="warning">level 3</el-tag>
          </template>
        </el-table-column>

       </el-table>

    </el-card>
  </div>
</template>
<script>
export default {
  name: 'rights',
  data () {
    return {
      rightList: []
    }
  },
  methods: {
    async getRightList () {
      const requestType = 'list'
      const { data: res } = await this.$http.get('rights/' + requestType)
      if (res.meta.status !== 200) {
        return this.$message.error('Get rights list fail')
      }
      this.rightList = res.data
    }
  },
  created () {
    this.getRightList()
  }
}
</script>
<style lang="">

</style>
