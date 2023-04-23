<template>
        <q-header reveal elevated>
        <q-toolbar>
          <q-btn flat round dense icon="menu" class="q-mr-sm" />
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>

          <q-toolbar-title>Quasar Framework</q-toolbar-title>

          <q-btn flat round dense icon="whatshot" src="google.com"></q-btn>
        </q-toolbar>
      </q-header>
<div class="row">
  <div class="col-12 col-sm-2"></div>
    <div class="col-12 col-sm-3">
      <q-form
          class="q-ma-sm full-wdith"
          @submit.prevent="doCreate"
        >
          <q-stepper
            v-model="step"
            contracted
            color="primary"
            animated
          >
            <q-step
              :name="1"
              title="Bước 1"
              icon="settings"
              :done="step > 1"
            >
              <q-input
                v-model="createData.victim"
                label="Your name *"
                lazy-rules
                outlined
                :rules="[ val => val && val.length > 0 || 'Không được để trống']"
              />
              <q-select 
              
              clearable filled color="purple-12" 
              v-model="createData.rankings" :options="options" 
              outlined
              label="Your name *"
              lazy-rules
                :rules="[ val => val && val.length > 0 || 'Không được để trống']"
              />
              <q-input
                v-model="createData.phone"
                
                outlined
                label="Your name *"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Không được để trống']"
              />
              <q-stepper-navigation>
                <q-btn @click="step = 2" icon="navigate_next" color="primary" label="Tiếp tục" :disable="!createData.victim || !createData.rankings /*|| !createData.notes */|| !createData.phone" />
              </q-stepper-navigation>
            </q-step>
            <q-step
              :name="2"
              title="Bước 2"
              icon="settings"
              :done="step > 2"
            >
            <q-card-section>
        <div class="text-h6">Our Changing đang test nhé</div>
        <div class="text-subtitle2">by John hihi</div>
      </q-card-section>

              <q-input
                v-model="createData.etags"
                outlined
                label="eTags *"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Không được để trống']"
                :type="isPwd ? 'password' : 'text'" 
              >
              <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
            </q-input>
              
              <q-btn
                label="Thêm"
                color="green"
                icon="add"
                type="submit"
                :loading="isLoading"
                :disable="isLoading"
                class="q-mr-sm"
              />
              <q-btn
                label="Trở về"
                color="primary"
                icon="arrow_back"
                @click="step = 1"
                class="q-mr-sm"
              />
            </q-step>
          </q-stepper>
        </q-form>
    </div>
    <div class="col-12 col-sm-6">
    <q-img
          class="q-ma-sm full-wdith"
          src="https://m.media-amazon.com/images/I/91TrVCCNN0L._SX1200_.jpg"
          :ratio="16/9"
        />
  </div>
    <div class="col-12 col-sm-2"></div>
</div>
<q-separator inset />
<div class="row">
  <div class="col-12 col-sm-3"></div>
  <div class="col-12 col-sm-6">
    <q-img
          class="q-ma-sm full-wdith"
          src="https://m.media-amazon.com/images/I/91TrVCCNN0L._SX1200_.jpg"
          :ratio="16/9"
        />
  </div>
  <div class="col-12 col-sm-3"></div>
</div>
<q-separator inset />
<div class="row">
  <div class="col-12 col-sm-3">LIÊN HỆ</div>
  <div class="col-12 col-sm-6">THÔNG TIN</div>
  <div class="col-12 col-sm-3">DỊCH VỤ</div>
</div>
<q-footer reveal elevated>
        <q-toolbar>
          <q-toolbar-title>Footers</q-toolbar-title>
        </q-toolbar>
      </q-footer>
</template>
<script>
import { defineComponent, ref } from 'vue'
import alert from '../helpers/alert'
import axios, {onError, onSuccess} from '../helpers/axios'

const Alert = new alert()
const def = {
      victim : '',
      phone: '',
      rankings: '',
      etags: '',
      notes: ' ',
    }
export default defineComponent({
  name: 'IndexPage',
  setup(){
    const isCreate = ref(false)
    const isLoading = ref(false)
    const createData = ref(def)
    const isLoadData = ref(false)
    const isUpdating = ref(false)
    const isEditNote = ref(null)
    const isDeleting = ref(null)
    const editNote = ref('')
    const step = ref(1)
    return {
      model: ref('Google'),
      password: ref(''),
      isPwd: ref(true),

options: [
  'Google', 'For grids that are the same from the smallest', 'Twitter', 'Apple', 'Oracle'
],
      step,
      isCreate,
      isLoading,
      isLoadData,
      createData,
      isEditNote,
      editNote,
      isUpdating,
      isDeleting,
    }
  },
  methods:{
    doCreate(){
      this.isLoading = true
      return axios(this).put('/data/create', this.createData)
        .then(onSuccess)
        .then(res => {
          if(res.status){
            this.step=1
            this.createData = {}
            Alert.Success({message: 'Thêm dữ liệu thành công'})
          }else{
            const message = typeof res.message === 'string' ? res.message : 'Thêm dữ liệu thất bại'
            Alert.Error({message})
          }
        })
        .catch(onError)
        .catch(err => {
          const message = typeof err === 'string' ? err : 'Thêm dữ liệu thất bại'
          Alert.Error({message})
        })
        .finally(() => {
          this.isLoading = false
        })
    },
  },
})
</script>
