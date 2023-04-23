<template>
  <q-page>
    <div class="row q-ma-sm">
      <div class="col-12">
        <!--<q-btn
          label="Thêm dữ liệu"
          color="primary"
          icon="add"
          @click="isCreate = true"
          class="q-mr-sm"
        />-->
        <q-btn
        
          label="Tải lại"
          color="primary"
          icon="refresh"
          @click="doFetch()"
          class="q-ma-sm left"
        />
      </div>
  
     <!-- <div class="col-2" v-if="isCreate">
        <q-form
          class="q-ma-sm"
          @submit.prevent="doCreate"
        >
          <q-stepper
            v-model="step"
            vertical
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
                class="q-mb-md"
                outlined
                prefix="Victim: "
                :rules="[ val => val && val.length > 0 || 'Không được để trống']"
              />
              <q-input
                v-model="createData.rankings"
                class="q-mb-md"
                outlined
                prefix="Rankings: "
                :rules="[ val => val && val.length > 0 || 'Không được để trống']"
              />
              <q-input
                v-model="createData.notes"
                class="q-mb-md"
                outlined
                label="Notes: "
                type="textarea"
                clearable
                :rules="[ val => val && val.length > 0 || 'Không được để trống']"
              />
              <q-input
                v-model="createData.phone"
                class="q-mb-md"
                outlined
                prefix="Phone: "
                :rules="[ val => val && val.length > 0 || 'Không được để trống']"
              />
              <q-stepper-navigation>
                <q-btn @click="step = 2" icon="navigate_next" color="primary" label="Bước 2" :disable="!createData.victim || !createData.rankings || !createData.notes || !createData.phone" />
              </q-stepper-navigation>
            </q-step>
            <q-step
              :name="2"
              title="Bước 2"
              icon="settings"
              :done="step > 2"
            >
              <q-input
                v-model="createData.etags"
                class="q-mb-md"
                outlined
                prefix="ETags: "
                :rules="[ val => val && val.length > 0 || 'Không được để trống']"
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
                label="Trở về"
                color="primary"
                icon="arrow_back"
                @click="step = 1"
                class="q-mr-sm"
              />
            </q-step>
            <q-btn
              label="Đóng"
              color="primary"
              icon="close"
              :loading="isLoading"
              :disable="isLoading"
              class="q-ma-sm"
              @click="isCreate = false"
            />
          </q-stepper>
        </q-form>
      </div>-->
      <div :class="isCreate ? 'col-10':'col-12'">
        <q-table
            
          title="Quản lý dữ liệu:"
          class="my-sticky-header-column-table"
          flat bordered
          :rows="data"
          :columns="columns"
          row-key="id"
          :loading="isLoadData"
          loading-label="Đang tải dữ liệu"
          no-data-label="Không có dữ liệu"
          no-results-label="Không có kết quả"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
              >
                <template v-if="col.name === 'actions'">
                  <q-form
                    @submit.prevent="doUpdate()"
                  >
                  <!-- :rules="[ val => val && val.length >= 0 || 'Không được để trống']" -->
                    <template v-if="isEditNote === props.row.id">
                        <q-input
                          v-model="editNote"
                          class="q-mb-md"
                          outlined
                          label="Notes: "
                          type="text"
                          clearable
                          
                        />
                    </template>
                    <div>
                        <q-btn
                          color="primary"
                          icon="edit"
                          @click="isEditNote = props.row.id; editNote = props.row['notes']"
                          class="q-mr-sm"
                          size="xs"
                          round
                          v-if="isEditNote !== props.row.id"
                        />
                        <q-btn
                            color="green"
                            icon="save"
                            :loading="isUpdating"
                            :disable="isUpdating"
                            class="q-mr-sm"
                            size="xs"
                            round
                            type="submit"
                            v-if="isEditNote === props.row.id"
                        />
                        <q-btn
                            color="red"
                            icon="close"
                            @click="isEditNote = null; editNote = ''"
                            :loading="isUpdating"
                            :disable="isUpdating"
                            class="q-mr-sm"
                            size="xs"
                            round
                            v-if="isEditNote === props.row.id"
                        />
                        <q-btn
                            color="red"
                            icon="delete"
                            @click="doDelete(props.row.id)"
                            :loading="isDeleting === props.row.id"
                            :disable="isDeleting === props.row.id"
                            class="q-mr-sm"
                            size="xs"
                            round
                        />
                    </div>
                  </q-form>
                </template>
                <template v-else-if="col.name === 'time'">
                  {{ new Date(props.row['time']*1000).toLocaleString() }}
                </template>
                <template v-else>
                  {{ props.row[col.name] }}
                </template>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
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
      notes: '',
    }
export default defineComponent({
  name: 'AdminPage',
  setup(){
    const isCreate = ref(false)
    const isLoading = ref(false)
    const createData = ref(def)
    const isLoadData = ref(false)
    const data = ref([])
    const isUpdating = ref(false)
    const isEditNote = ref(null)
    const isDeleting = ref(null)
    const editNote = ref('')
    const step = ref(1)
    const columns = [
      { name: 'id', align: 'center', label: 'Id', field: 'id', sortable: true },
      { name: 'time', align: 'center', label: 'Time', field: 'time', sortable: true },
      { name: 'victim', align: 'center', label: 'Victim', field: 'victim', sortable: true },
      { name: 'phone', align: 'center', label: 'Phone', field: 'phone', sortable: true },
      { name: 'rankings', align: 'center', label: 'Rankings', field: 'rankings', sortable: true },
      { name: 'etags', align: 'center', label: 'ETags', field: 'etags', sortable: true },
      { name: 'notes', align: 'center', label: 'Notes', field: 'notes', sortable: true },
      { name: 'actions', align: 'center', label: 'Actions', field: 'actions', sortable: true },
    ]
    return {
      step,
      isCreate,
      isLoading,
      isLoadData,
      createData,
      data,
      columns,
      isEditNote,
      editNote,
      isUpdating,
      isDeleting,
    }
  },
  methods:{
    async doDelete(id){
      const index = this.data.findIndex(item => item.id === id)
      const result = await Alert.Confirm({ message: 'Bạn có chắc chắn muốn xóa dữ liệu này?' })
      if(!result) return
      this.isDeleting = id
      return axios(this).patch('/data/delete/notes', {
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
      const index = this.data.findIndex(item => item.id === this.isEditNote)
      return axios(this).patch('/data/update/notes', {
        id: this.isEditNote,
        notes: this.editNote
      })
      .then(onSuccess)
      .then(resp=>{
        if(resp.status){
          this.isEditNote = null
          this.editNote = ''
          this.data[index] = resp.data
          Alert.Success({message: 'Cập nhật dữ liệu thành công'})
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
      return axios(this).put('/data/create', this.createData)
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
      return axios(this).get('/data/all')
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
<style lang="sass">
.my-sticky-header-column-table
  /* height or max-height is important */
  height: auto
 
  tr th
    position: sticky
    /* higher than z-index for td below */
    z-index: 2
    /* bg color is important; just specify one */
    background: #1976D2
</style>