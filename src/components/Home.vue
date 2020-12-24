<template >
  <el-container>
    <!-- head -->
    <el-header>
      <div class="header">
        <img src="@/assets/EPFL-logo.png" alt="epfl-logo" />
        <span>data management system</span>
      </div>
      <el-button type="info" @click="logout"> Logout </el-button>
    </el-header>
    <!-- body -->
    <el-container>
      <!-- aside -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleAsideMenu">|||</div>
        <!-- aside menu -->
        <el-menu
          class="el-menu-vertical-demo"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="pathName"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
        >
          <!-- first level -->
          <el-submenu
            :index="'/'+fisrtLevelItem.path"
            v-for="fisrtLevelItem of menuList"
            :key="fisrtLevelItem.id"
          >
            <template slot="title">
              <i :class="iconObj[fisrtLevelItem.id]"></i>
              <span>{{ fisrtLevelItem.authName }}</span>
            </template>
            <!-- seconde level -->
            <el-menu-item
              :index="'/home/'+secondLevelItem.path"
              v-for="secondLevelItem of fisrtLevelItem.children"
              :key="secondLevelItem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ secondLevelItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- aside main -->
      <el-main>
        <router-view>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: 'home',
  data () {
    return {
      menuList: [],
      iconObj: {
        125: 'el-icon-user',
        103: 'el-icon-s-cooperation',
        101: 'el-icon-s-shop',
        102: 'el-icon-s-order',
        145: 'el-icon-s-data'
      },
      isCollapse: false
    }
  },
  computed: {
    pathName () {
      return this.$route.path
    }
  },
  methods: {
    logout () {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menuList = res.data
    },
    toggleAsideMenu () {
      this.isCollapse = !this.isCollapse
    }
  },
  created () {
    this.getMenuList()
  }
}
</script>
<style lang="less" scope>
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  background-color: #373d41;
  .header {
    display: flex;
    align-items: center;
    height: 100%;
    img {
      height: 70%;
      margin: 10px 0px;
      box-sizing: border-box;
      vertical-align: bottom;
    }
    span {
      margin-left: 55px;
      margin-top: 22px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: 0;
  }
}
.el-main {
  background-color: #eaedf1;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
