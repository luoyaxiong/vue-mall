<template >
  <div>
    <!-- nav -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Order</el-breadcrumb-item>
      <el-breadcrumb-item>Order list</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card -->
    <el-card>
      <!-- search input -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input></el-input>
        </el-col>
        <el-col :span="4">
          <!-- button -->
          <el-button type="primary">Add order</el-button>
        </el-col>
      </el-row>

      <!-- table -->
      <el-table :data="orderList" stripe border style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column
          prop="order_number"
          label="Order number"
          min-width="200"
        >
        </el-table-column>
        <el-table-column prop="order_price" label="Price"> </el-table-column>
        <el-table-column prop="pay_status" label="Pay status" width="100">
          <template v-slot="slotProps">
            <div>
              <el-tag
                v-if="slotProps.row.pay_status === '1'"
                type="success"
                plain
                >Already pay</el-tag
              >
              <el-tag v-else type="danger" plain>Not pay yet</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="Delivery"> </el-table-column>
        <el-table-column label="Order time" min-width="150">
          <template v-slot="slotProps">
            {{ slotProps.row.create_time | getDate }}
          </template>
        </el-table-column>
        <el-table-column label="Action" min-width="180">
          <template v-slot="slotProps">
            <div>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="showEditDialog(slotProps.row.id)"
                >Edit</el-button
              >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-map-location"
                @click="showTrackDialog(slotProps.row.id)"
                >Track</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- pagination -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- Edit dialog -->
    <el-dialog
      title="Edit Address"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        ref="addressForm"
        :model="addressForm"
        :rules="addressRules"
        label-width="60px"
      >
        <el-form-item label="City" prop="city">
          <el-select v-model="addressForm.city" placeholder="Please select">
            <el-option
              clearable
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Street" prop="detailAddress">
          <el-input v-model="addressForm.detailAddress"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="editDialogVisible = false"
          >Confirm</el-button
        >
      </span>
    </el-dialog>

    <!-- Track dialog -->
    <el-dialog
      title="Tracking information"
      :visible.sync="trackDialogVisible"
      width="50%"
    >
      <div class="block">
        <div class="radio">
          Sort：
          <el-radio-group v-model="reverse">
            <el-radio :label="true">Descending</el-radio>
            <el-radio :label="false">Ascending</el-radio>
          </el-radio-group>
        </div>

        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.timestamp"
          >
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="trackDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="trackDialogVisible = false"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'orders',
  data () {
    return {
      orderList: [],
      total: 0,
      queryInfo: {
        pagenum: 1,
        pagesize: 3
      },
      editDialogVisible: false,
      addressForm: {
        city: '',
        detailAddress: ''
      },
      addressRules: {
        city: [
          {
            required: true,
            message: 'Please select your city',
            trigger: 'blur'
          }
        ],
        detailAddress: [
          {
            required: true,
            message: 'Please input your street',
            trigger: 'blur'
          }
        ]
      },
      options: [
        {
          value: '1',
          label: 'Chengdu'
        },
        {
          value: '2',
          label: 'Lausanne'
        },
        {
          value: '3',
          label: 'Baltimore'
        }
      ],
      trackDialogVisible: false,
      reverse: true,
      activities: [
        {
          content: '活动按期开始',
          timestamp: '2018-04-15'
        },
        {
          content: '通过审核',
          timestamp: '2018-04-13'
        },
        {
          content: '创建成功',
          timestamp: '2018-04-11'
        }
      ],
      trackList: []
    }
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('Get order list fail')
      }
      console.log(res.data)
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getOrderList()
    },
    showEditDialog () {
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.addressForm.city = ''
      this.addressForm.detailAddress = ''
    },
    showTrackDialog () {
      this.trackDialogVisible = true
    },
    async getTrackList () {
      const { data: res } = await this.$http.getr('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('Track order fail')
      }
      this.trackList = res.data
    }
  },
  created () {
    this.getOrderList()
  }
}
</script>

<style scoped>
.el-timeline{
  margin-top: 20px;
}
</style>
