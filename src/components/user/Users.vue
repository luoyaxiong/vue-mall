<template lang="">
  <div>
    <!-- nav -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item>Users</el-breadcrumb-item>
        <el-breadcrumb-item>User list</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card -->
    <el-card class="box-card">
      <!-- search -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="Please input content" class="input-with-select">
              <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">Add user</el-button>
        </el-col>
      </el-row>
        <!-- table -->
       <el-table
        :data="userList"
        border
        stripe
        style="width: 100%">
        <el-table-column
          type ="index"
          label="#"
          >
        </el-table-column>
        <el-table-column
          label="Created time"
          >
           <template v-slot="slotProps">
            {{new Date (slotProps.row.create_time).toLocaleDateString() }}
          </template>
        </el-table-column>
         <el-table-column
          prop="username"
          label="Username"
          >
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="Mobile"
          >
        </el-table-column>
        <el-table-column
          prop="email"
          label="Email"
          >
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="Role"
          >
        </el-table-column>
        <el-table-column
          label="State"
          width="80"
          >
          <template v-slot="slotProps">
            <el-switch
              v-model="slotProps.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="Action"
          width="200"
        >
        <!-- action -->
          <templates>
            <el-tooltip class="item" effect="dark" content="Edit" :enterable="false">
              <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
             </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Delete" :enterable="false">
              <el-button size="mini"  type="danger" icon="el-icon-delete"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Set role" :enterable="false">
              <el-button size="mini"  type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </templates>
        </el-table-column>
      </el-table>

         <!-- pagniation -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
    </el-pagination>
    </el-card>

  </div>
</template>
<script>
export default {
  name: 'users',
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0
    }
  },
  computed: {},
  methods: {
    async getUsersList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.userList = res.data.users
      this.total = res.data.total
    }
  },
  created () {
    this.getUsersList()
  }
}
</script>
<style lang="less" scoped>
</style>
