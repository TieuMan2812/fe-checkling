<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          ThanhCode
        </q-toolbar-title>

        <div>0.0.2</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Xin chào, <strong>{{ user }}</strong>
          <q-btn
            color="orange"
            icon="logout"
            @click="doLogout()"
            round
            size="xs"
            class="q-ml-sm"
          />
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import Login from '../helpers/login'
const linksList = [
  {
    title: 'Dữ liệu',
    caption: 'Quản lí dữ liệu nhập vào',
    icon: 'analytics',
    link: '/home'
  },
  {
    title: 'Tài khoản',
    caption: 'Quản lí tài khoản',
    icon: 'group',
    link: '/account'
  },
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },
  mounted(){
    const loginCheck = new Login().Check()
    if(!loginCheck) this.$router.push('/login')
    else this.$router.push('/admin/home')
  },
  setup () {
    const leftDrawerOpen = ref(false)
    const user = new Login().User()
    return {
      user,
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },
  methods:{
    doLogout(){
      new Login().Remove()
      this.$router.push('/login')
    }
  }
})
</script>
