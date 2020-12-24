<template >
    <el-container>
      <!-- head -->
      <el-header>
        Header
        <el-button type="info" @click="logout"> logout </el-button>
      </el-header>
      <!-- body -->
      <el-container>
        <!-- aside -->
        <el-aside width="200px">Aside</el-aside>
        <!-- aside main -->
        <el-main>Main</el-main>
      </el-container>
    </el-container>

</template>
<script>
export default {
  name: 'home',
  methods: {
    logout () {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scope>
.el-container{
  height: 100%;
}
.el-header {
  background-color: #373d41;
}
.el-asid {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
</style>
