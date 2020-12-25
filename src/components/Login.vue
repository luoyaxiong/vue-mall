<template>
  <div class="login_container">
    <div class="login_box">
      <!-- avatar -->
      <div class="avatar_box">
        <img src="@/assets/logo.png" alt="logo" />
      </div>
      <!-- form -->
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginForm"
        class="login_form"
        label-width="0px"
      >
        <!-- user name -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <!-- password -->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <!-- button -->
          <el-button type="primary" @click="submitLoginForm('loginForm')"
            >Login</el-button
          >
          <el-button type="info" @click="resetLoginForm('loginForm')"
            >Reset</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
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
        ]
      }
    }
  },
  methods: {
    submitLoginForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          alert('error submit!!')
          return false
        }
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.$message.error('Login failed')
        }
        this.$message.success('Login success')

        // token
        window.sessionStorage.setItem('token', res.data.token)
        // redirect
        this.$router.push('/home')
      })
    },
    resetLoginForm (formName) {
      console.log(this)
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  .avatar_box {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%);
    height: 130px;
    width: 130px;
    padding: 10px;
    border: 1px solid #eee;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
