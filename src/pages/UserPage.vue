<template>
  <q-page>
    <div class="row q-ma-sm">
      <div class="col-12">
        <h4>Quản lý dữ liệu</h4>
        <q-btn
          label="Thêm dữ liệu"
          color="primary"
          icon="add"
          @click="isCreate = true"
          class="q-mr-sm"
        />
        <q-btn
          label="Tải lại"
          color="primary"
          icon="refresh"
          @click="doFetch()"
          class="q-mr-sm"
        />
      </div>
      <div class="col-2" v-if="isCreate">
        <q-form
          class="q-ma-sm"
          @submit.prevent="doCreate"
        >
          <q-input
            v-model="createData[key]"
            class="q-mb-md"
            outlined
            :prefix="`${columns.filter(col=>col.name === key)[0].label}: `"
            :rules="[ val => val && val.length > 0 || 'Không được để trống']"
            v-for="key in Object.keys(createData)"
            :key="key"
          />

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
            label="Đóng"
            color="primary"
            icon="close"
            :loading="isLoading"
            :disable="isLoading"
            class="q-mr-sm"
            @click="isCreate = false"
          />
        </q-form>
      </div>
      <div :class="isCreate ? 'col-10':'col-12'">
        <q-table
          grid
          :filter="filter"
          hide-header
          title="Dữ liệu"
          :rows="data"
          :columns="columns"
          row-key="id"
          class="q-mt-sm"
          :loading="isLoadData"
          loading-label="Đang tải dữ liệu"
          no-data-label="Không có dữ liệu"
          no-results-label="Không có kết quả"
        >
          <template v-slot:top-right>
            <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:item="props">
            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-2">
              <q-card bordered>
                <q-card-section class="text-center">
                  <strong>{{ props.row.username }} ({{ props.row.userId }})</strong>
                </q-card-section>
                <q-separator />
                <q-card-section class="flex flex-center">
                  <q-form
                    @submit.prevent="doUpdate()"
                  >
                    <div class="row" v-if="isEdit === props.row.userId">
                      <q-input
                        v-model="new_password"
                        class="q-mb-md"
                        outlined
                        :prefix="`Mật khẩu mới: `"
                        :rules="[ val => val && val.length > 0 || 'Không được để trống']"
                      />
                    </div>
                    <q-btn
                      label="Xóa"
                      color="red"
                      icon="delete"
                      class="q-ma-sm"
                      size="sm"
                      :loading="isDeleting === props.row.userId"
                      :disable="isDeleting === props.row.userId"
                      @click="doDelete(props.row.userId)"
                      v-if="data.length > 1"
                    />
                    <q-btn
                      label="Đổi mật khẩu"
                      color="primary"
                      icon="edit"
                      class="q-ma-sm"
                      size="sm"
                      @click="isEdit = props.row.userId"
                      v-if="isEdit === null"
                    />
                    <q-btn
                      label="Đổi mật khẩu"
                      color="green"
                      icon="save"
                      type="submit"
                      class="q-ma-sm"
                      size="sm"
                      :loading="isUpdating"
                      :disable="isUpdating"
                      v-if="isEdit === props.row.userId"
                    />
                    <q-btn
                      label="Huỷ"
                      color="red"
                      icon="close"
                      class="q-ma-sm"
                      size="sm"
                      @click="isEdit = null"
                      v-if="isEdit === props.row.userId"
                    />
                  </q-form>
                </q-card-section>
              </q-card>
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import useQuasar from 'quasar/src/composables/use-quasar.js'
import { defineComponent, ref, computed } from 'vue'
import alert from '../helpers/alert'
import axios, {onError, onSuccess} from '../helpers/axios'
const Alert = new alert()
const def = {
  username : '',
  password: '',
}
export default defineComponent({
  name: 'UserPage',
  setup(){
    const $q = useQuasar()
    const isCreate = ref(false)
    const isLoading = ref(false)
    const createData = ref(def)
    const isLoadData = ref(false)
    const data = ref([])
    const isUpdating = ref(false)
    const isEdit = ref(null)
    const isDeleting = ref(null)
    const new_password = ref('')
    const columns = [
      { name: 'id', label: 'Id', field: 'userId'},
      { name: 'username', label: 'Username', field: 'username'},
      { name: 'password', label: 'Password'}
    ]
    const filter = ref('')
    return {
      isCreate,
      isLoading,
      isLoadData,
      createData,
      data,
      columns,
      isEdit,
      new_password,
      isUpdating,
      isDeleting,
      filter,
    }
  },
  methods:{
    async doDelete(id){
      const index = this.data.findIndex(item => item.userId === id)
      const result = await Alert.Confirm({ message: 'Bạn có chắc chắn muốn xóa dữ liệu này?' })
      if(!result) return
      this.isDeleting = id
      return axios(this).patch('/account/delete', {
        id
      })
      .then(onSuccess)
      .then(resp=>{
        if(resp.status){
          Alert.Success({message: 'Xóa dữ liệu thành công'})
          this.data.splice(index, 1)
        }else{
          const message = typeof resp.message === 'string' ? resp.message : 'Xóa dữ liệu thất bại'
          Alert.Error({message})
        }
      })
      .catch(onError)
      .finally(()=>{
        this.isDeleting = null
      })
    },
    doUpdate(){
      this.isUpdating = true
      const index = this.data.findIndex(item => item.userId === this.isEdit)
      return axios(this).patch('/account/password', {
        id: this.isEdit,
        password: this.new_password
      })
      .then(onSuccess)
      .then(resp=>{
        if(resp.status){
          this.isEdit = null
          this.new_password = ''
          Alert.Success({message: 'Đổi mật khẩu thành công'})
        }else{
          const message = typeof resp.message === 'string' ? resp.message : 'Cập nhật dữ liệu thất bại'
          Alert.Error({message})
        }
      })
      .catch(onError)
      .finally(()=>{
        this.isUpdating = false
      })
    },
    doCreate(){
      this.isLoading = true
      return axios(this).put('/account/create', this.createData)
        .then(onSuccess)
        .then(res => {
          if(res.status){
            this.createData = def
            Alert.Success({message: 'Thêm dữ liệu thành công'})
            this.doFetch()
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
    doFetch(){
      this.isLoadData = true
      return axios(this).get('/account/all')
      .then(onSuccess)
      .then(resp=>{
        if(resp.status){
          this.data = resp.data
        }else{
          const message = typeof resp.message === 'string' ? resp.message : 'Lấy dữ liệu thất bại'
          Alert.Error({message})
        }
      })
      .catch(onError)
      .finally(()=>{
        this.isLoadData = false
      })
    }
  },
  mounted(){
    this.doFetch()
  }
})
</script>
