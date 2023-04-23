<template>
  <q-page class="flex flex-center">
    <div>
      <h6 class="q-pa-md q-ma-md">ĐĂNG NHẬP</h6>
    </div>
    <q-form
      @submit="doLogin"
    >
      <q-input
        v-model="username"
        class="q-mb-md"
        outlined
        prefix="Tài khoản: "
        :rules="[ val => val && val.length > 0 || 'Điền tài khoản vào đây']"
      >
        <template v-slot:prepend>
            <q-icon name="person" />
        </template>
      </q-input>
      <q-input
        v-model="password"
        outlined
        :type="isPwd ? 'password':'text'"
        class="q-mb-md"
        prefix="Mật khẩu: "
        :rules="[ val => val && val.length > 0 || 'Điền mật khẩu vào đây']"
      >
        <template v-slot:prepend>
            <q-icon name="lock" />
        </template>
        <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
        </template>
      </q-input>
      <q-btn
        label="Đăng nhập"
        color="primary"
        icon="login"
        :loading="isLoading"
        :disable="isLoading"
        @click="doLogin"
      />
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import axios, {onError, onSuccess} from '../helpers/axios'
import alert from '../helpers/alert'
import login from '../helpers/login'
export default defineComponent({
  name: 'LoginPage',
  setup(){
    const username = ref('')
    const password = ref('')
    const isPwd = ref(true)
    const isLoading = ref(false)
    return {
      username,
      password,
      isPwd,
      isLoading,
    }
  },
  methods:{
    doLogin(){
        const body = {
          username: this.username,
          password: this.password
        }
        this.isLoading = true
        return axios().post('/login', body)
        .then(onSuccess)
        .then(resp=>{
          if(resp.status && resp.token){
            new login().Save({
              token: resp.token,
              user: this.username
            })
            this.$router.push('/admin')
          }else{
            const message = resp.message || 'Đăng nhập thất bại'
            new alert().Error({message})
          }
        })
        .catch(onError)
        .finally(()=>{
          this.isLoading = false
        })
    }
  }
})
</script>
