<template >
  <div>
    <!-- nav -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/roles' }">Roles</el-breadcrumb-item>
        <el-breadcrumb-item>Role list</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary"
          @click="addDialogVisible=true"
          >
          Add role
          </el-button>
        </el-col>
      </el-row>
        <!-- table -->
       <el-table
        :data="roleList"
        border
        stripe
        style="width: 100%">
        <!-- show rights  -->
        <el-table-column
          type ="expand"
          >
          <template v-slot="slotProps">
            <el-row
              v-for="(item1,i1) of slotProps.row.children"
              :key="item1.id"
              :class="['vcenter','bdbottom',i1 === 0?'bdtop':'']">

              <!-- children level 1 -->
              <el-col :span="5" >
                <el-tag closable
                @close="removeRightById(slotProps.row,item3.id)">
                {{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- children level 2 and 3 -->
              <el-col :span="19">
                <el-row
                    v-for="(item2,i2) of item1.children"
                    :key="item2.id"
                    :class="['vcenter',i2 === 0?'0':'bdtop']">

                    <!-- children level 2 -->
                    <el-col :span="6" >
                      <el-tag closable type="success"
                      @close="removeRightById(slotProps.row,item2.id)">
                      {{item2.authName}}
                      </el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>

                    <!-- children level 3 -->
                    <el-col :span="13">
                      <el-tag
                        closable
                        type="warning"
                        v-for="(item3) of item2.children"
                        :key="item3.id"
                        @close="removeRightById(slotProps.row,item3.id)"
                        >
                           {{item3.authName}}
                      </el-tag>
                    </el-col>

                </el-row>
              </el-col>

            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          type ="index"
          label="#"
          >
        </el-table-column>
         <el-table-column
          prop="roleName"
          label="Role name"
          >
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="Role description"
          >
        </el-table-column>

        <el-table-column
          label="Actions"
          min-width="150"
        >
          <template v-slot="slotProps">

            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(slotProps.row.id)">Edit</el-button>

            <el-button size="mini"  type="danger" icon="el-icon-delete" @click="showDeleteDialog(slotProps.row.id)">Delete</el-button>

            <el-button size="mini"  type="warning" icon="el-icon-setting" @click="showSetDialog(slotProps.row)">Set rights</el-button>

          </template>
        </el-table-column>
      </el-table>

      <!-- set rights -->
      <el-dialog
        title="Set Rights"
        :visible.sync="rightDialogVisible"
        width="50%"
        @close="setRightDiglogClosed()"
        >
        <!-- tree list -->
        <el-tree
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          :data="rightTree"
          :default-checked-keys="defaultRightList"
          :props="rightProps">
        </el-tree>
        <!-- button -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="rightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>

    </el-card>

  </div>
</template>
<script>
export default {
  name: 'roles',
  data () {
    return {
      roleList: [],
      rightDialogVisible: false,
      rightTree: [],
      rightProps: {
        children: 'children',
        label: 'authName'
      },
      defaultRightList: [],
      setRoleId: ''
    }
  },
  methods: {
    async getRoleList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('Get role list fail')
      }
      this.roleList = res.data
    },
    removeRightById (role, rightId) {
      this.$confirm('Do you confirm to delete it ?', {
        distinguishCancelAndClose: true,
        confirmButtonText: 'Cancel',
        cancelButtonText: 'Comfirm'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: 'Deleted'
          })
          this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            .then(({ data: res }) => {
              role.children = res.data
            })
            .catch(() => {
              this.$message.info('fail to delete')
            })
        })
        .catch(action => {
          this.$message({
            type: 'info',
            message: 'Canceled'
          })
        })
    },
    getDefaultRightList (role, arr) {
      if (!role.children) {
        return arr.push(role.id)
      }

      role.children.forEach(e => {
        this.getDefaultRightList(e, arr)
      })
    },
    async showSetDialog (role) {
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('Get rights fail')
      }
      this.rightTree = res.data
      this.getDefaultRightList(role, this.defaultRightList)
      this.setRoleId = role.id
      this.rightDialogVisible = true
    },
    setRightDiglogClosed () {
      this.defaultRightList = []
    },
    // !!!!! set rights fail
    async allotRights () {
      const checkedIds = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ]
      const keys = checkedIds.join(',')
      const { data: res } = await this.$http.post(`roles/${this.setRoleId}/rights`, keys)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('Set rights success')
      this.getRoleList()
      this.setRightDiglogClosed = false
    }
  },
  created () {
    this.getRoleList()
  }
}
</script>
<style lang="less" scoped>
.el-tag{
  margin: 7px;
}

.bdtop{
  border-top: 1px solid #eee;
}

.bdbottom{
  border-bottom: 1px solid #eee;
}

.vcenter{
  display: flex;
  align-items: center ;
}
</style>
