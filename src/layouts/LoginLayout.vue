<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          ThanhCode
        </q-toolbar-title>
        <q-btn
          color="orange-9"
          to="/admin"
          icon="lock"
          round
          size="xs"
        />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'LoginLayout',
  setup () {
    return {
      openAdmin(){
        this.$router.push('/admin')
      }
    }
  }
})
</script>
