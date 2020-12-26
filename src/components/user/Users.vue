<template >
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
          <el-input placeholder="Please input content" class="input-with-select"
          v-model="queryInfo.query"
          @clear="getUsersList"
          clearable>
              <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersList"
              ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
          @click="addDialogVisible=true"
          >
          Add user
          </el-button>
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
              inactive-color="#ff4949"
              @change="userStateChange(slotProps.row)">
            </el-switch>
          </template>
        </el-table-column>
        <!-- action -->
        <el-table-column
          label="Action"
          width="200"
        >
        <!-- action -->
          <template v-slot="slotProps">
              <el-tooltip class="item" effect="dark" content="Edit" :enterable="false">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(slotProps.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="Delete" :enterable="false">
                <el-button size="mini"  type="danger" icon="el-icon-delete" @click="showDeleteDialog(slotProps.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="Set role" :enterable="false" >
                <el-button size="mini"  type="warning" icon="el-icon-setting" @click="showSetDialog(slotProps.row)" ></el-button>
              </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

         <!-- pagniation -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum"
        :page-sizes="[3, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
    </el-card>

    <!-- add user -->
    <el-dialog
      title="Add user"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
      >
      <!-- body -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addForm"
        label-width="80px"
      >
        <!-- user name -->
        <el-form-item label="Username" prop="username">
          <el-input
            v-model="addForm.username"
          ></el-input>
        </el-form-item>
        <!-- password -->
        <el-form-item label="Password" prop="password">
          <el-input
            type="password"
            v-model="addForm.password"
          ></el-input>
        </el-form-item>
        <!-- email -->
        <el-form-item label="Email" prop="email">
          <el-input
            type="email"
            v-model="addForm.email"
          ></el-input>
        </el-form-item>
        <!-- mobile -->
        <el-form-item label="Mobile" prop="mobile">
          <el-input
            type="number"
            v-model="addForm.mobile"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- footer -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addUserConfirm">Confirm</el-button>
      </span>
    </el-dialog>

    <!-- edit user -->
    <el-dialog
      title="Edit user"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
      >
      <!-- body -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editForm"
        label-width="80px"
      >
        <!-- user name -->
        <el-form-item label="Username" >
          <el-input
            disabled
            v-model="editForm.username"
          ></el-input>
        </el-form-item>
        <!-- email -->
        <el-form-item label="Email" prop="email">
          <el-input
            v-model="editForm.email"
          ></el-input>
        </el-form-item>
        <!-- mobile -->
        <el-form-item label="Mobile" prop="mobile">
          <el-input
            type="number"
            v-model="editForm.mobile"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- footer -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="editUserConfirm">confirm</el-button>
      </span>
    </el-dialog>

    <!-- delete user -->
    <el-dialog
      title="Delete user"
      :visible.sync="deleteDialogVisible"
      width="50%"
      >
      <span>Do you confirm to delete this user ?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">cancel</el-button>
        <el-button type="primary" @click="deleteUserConfirm">Confirm</el-button>
      </span>
    </el-dialog>

    <!-- set role -->
    <el-dialog
      title="Set Role"
      :visible.sync="roleDialogVisible"
      width="30%"
      @close="setRoleDialogClosed"
      >
      <div>
        <p>Username:  {{selectedUser.username}}</p>
        <p>    Role:  {{selectedUser.role_name}}</p>
        <el-select v-model="selecteRoleId" placeholder="Please select">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="confirmSetRole">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'users',
  data () {
    const checkEmail = (rule, value, callback) => {
      const testRegEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/gi.test(value)
      if (!testRegEmail) {
        return callback(new Error('Email is not valid'))
      }
      setTimeout(() => {
        callback()
      }, 1000)
    }

    const checkMobile = (rule, value, callback) => {
      const testRegMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/gi.test(value)
      if (!testRegMobile) {
        return callback(new Error('Mobile is not valid'))
      }
      setTimeout(() => {
        callback()
      }, 1000)
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 3
      },
      userList: [],
      filteredUserList: [],
      total: 2,
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: 'Please input username', trigger: 'blur' },
          {
            min: 3,
            max: 15,
            message: 'The length of username should be from 3 to 15',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: 'Please input password', trigger: 'blur' },
          {
            min: 6,
            max: 12,
            message: 'The length of password should be from 6 to 12',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: 'Please input Email', trigger: 'blur' },
          { validator: checkEmail }
        ],
        mobile: [
          { required: true, message: 'Please input mobile number', trigger: 'blur' },
          { validator: checkMobile },
          {
            min: 9,
            max: 13,
            message: 'The length of mobile number should be from 9 to 13',
            trigger: 'blur'
          }
        ]
      },
      editDialogVisible: false,
      editForm: {
      },
      editFormRules: {
        username: [
          { required: true, message: 'Please input username', trigger: 'blur' },
          {
            min: 3,
            max: 15,
            message: 'The length of username should be from 3 to 15',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: 'Please input Email', trigger: 'blur' },
          { validator: checkEmail }
        ],
        mobile: [
          { required: true, message: 'Please input mobile number', trigger: 'blur' },
          { validator: checkMobile },
          {
            min: 9,
            max: 13,
            message: 'The length of mobile number should be from 9 to 13',
            trigger: 'blur'
          }
        ]
      },
      deleteDialogVisible: false,
      deleteId: null,
      roleDialogVisible: false,
      selectedUser: {},
      roleList: [],
      selecteRoleId: ''

    }
  },
  computed: {},
  methods: {
    async getUsersList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.userList = res.data.users
      this.filteredUserList = this.userList
      this.total = res.data.total
    },
    async getRoleList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.err('Get roles fail')
      }
      this.roleList = res.data
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUsersList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUsersList()
    },
    async userStateChange (userInfo) {
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('Update data fail')
      }
      this.$message.success('Update success')
    },
    filterUserList (value) {
      if (value === '') {
        this.filteredUserList = this.userList
        this.total = this.filteredUserList.length
      } else {
        this.filteredUserList = this.userList.filter((e) => {
          return e.username.includes(value)
        })
        this.total = this.filteredUserList.length
      }
    },
    addDialogClose () {
      this.$refs.addForm.resetFields()
    },
    addUserConfirm () {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('Add user fail')
        }
        this.$message.success('Add user success')
        this.addDialogVisible = false
        this.getUsersList()
      })
    },
    async showEditDialog (id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.status)
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClose () {
      this.$refs.editForm.resetFields()
    },
    editUserConfirm () {
      this.$refs.editForm.validate(async valid => {
        console.log(this.editForm)
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) {
          console.log(res)
          return this.$message.error('Update user fail')
        }
        this.editDialogVisible = false
        this.getUsersList()
        this.$message.success('Update user success')
      })
    },
    async showDeleteDialog (id) {
      this.deleteDialogVisible = true
      this.deleteId = id
    },
    async deleteUserConfirm () {
      const { data: res } = await this.$http.delete('users/' + this.deleteId)
      if (res.meta.status !== 200) {
        console.log(res)
        return this.$message.error('Delete user fail')
      }
      this.deleteDialogVisible = false
      this.deleteId = null
      this.getUsersList()
      this.$message('Delete user success')
    },
    showSetDialog (role) {
      this.roleDialogVisible = true
      this.selectedUser = role
      this.getRoleList()
    },
    async confirmSetRole () {
      if (!this.selecteRoleId) {
        return this.$message.error('Please select a role')
      }
      const { data: res } = await this.$http.put(`users/${this.selectedUser.id}/role`, {
        rid: this.selecteRoleId
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('Set role fail')
      }
      this.$message.success('Set role success')
      this.getUsersList()
      this.roleDialogVisible = false
    },
    setRoleDialogClosed () {
      this.selectedUser = {}
      this.selecteRoleId = ''
    }

  },
  created () {
    this.getUsersList()
  }
}
</script>
<style lang="less" scoped>
</style>
