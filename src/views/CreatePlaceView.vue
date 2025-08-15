<template>
  <div class="home-view p-6">
    <!-- دکمه افزودن ابر مکان -->
    <button 
      @click="showAddCloudModal = true"
      class="glass-effect p-4 rounded-xl mb-6 hover:bg-white/20 transition-colors" 
    >  {{ $t('add_place') }}
      
    </button>

    <!-- کارت‌های ابر مکان -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="cloud in cloudLocations" 
        :key="cloud.id"
        class="glass-effect rounded-2xl overflow-hidden relative"
      >
        <!-- تصویر با دکمه‌های روی آن -->
        <div class="relative">
          <img 
            :src="cloud.image" 
            alt="ابر مکان"
            class="w-full h-48 object-cover"
          >
          
          <!-- دکمه‌های ویرایش و حذف در گوشه چپ بالا -->
          <div class="absolute top-2 left-2 flex flex-col gap-2">
            <button 
              @click.stop="editCloud(cloud)"
              class="p-2 w-8 h-8 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm flex items-center justify-center shadow-md"
              :title = "$t('edit')"
            >
              ✏️
            </button>
            <button 
              @click.stop="deleteCloud(cloud)"
              class="p-2 w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm flex items-center justify-center shadow-md"
              :title="$t('delete')"
            >
              🗑️
            </button>
          </div>
        </div>

        <!-- محتوای پایین کارت -->
        <div class="p-4 text-center">
          <h3 class="text-xl font-bold text-center">{{ cloud.name }}</h3>
          
          <!-- دکمه مشاهده -->
          <div class="flex justify-center mt-4">
            <button 
              @click="viewCloud(cloud)"
              class="p-2 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm"
            >
            {{ $t('show') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- مودال افزودن / ویرایش -->
    <div 
      v-if="showAddCloudModal || showEditModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="glass-effect p-6 rounded-2xl w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">
          {{ $t(showAddCloudModal ? 'add_place' : 'edit')}}
        </h3>
        
        <input
          v-model="newCloud.name"
          type="text"
          :placeholder= "$t('place_name')"
          class="w-full p-3 mb-4 bg-white/10 rounded-lg border border-white/20 text-center"
          dir="auto"
        >
        
        <input
          type="file"
          @change="handleImageUpload"
          accept="image/*"
          class="w-full p-3 mb-4 bg-white/10 rounded-lg border border-white/20"
        >
        
        <!-- نمایش تصویر فعلی در حالت ویرایش -->
        <div v-if="showEditModal && currentEditingImage" class="mb-4">
          <img :src="currentEditingImage" alt="پیش‌نمایش" class="h-32 mx-auto object-cover rounded">
        </div>
        
        <div class="flex justify-end space-x-2 space-x-reverse">
          <button 
            @click="closeModal"
            class="px-4 py-2 rounded-lg hover:bg-white/20"
          >
            {{$t('cancel')}}
          </button>
          <button 
            @click="confirmSave"
            class="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white"
          >
          {{$t('save')}}
          </button>
        </div>
      </div>
    </div>

    <!-- مودال تأیید حذف -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="glass-effect p-6 rounded-2xl w-full max-w-xs text-center">
        
        <h3 class="text-lg font-bold mb-4"> {{ $t('delete_confirm_text') }}</h3>
       
        <div class="flex justify-center gap-2 mt-6">
          <button @click="showDeleteConfirm = false" class="px-4 py-2 rounded-lg hover:bg-white/20">
            {{$t('no')}}
          </button>
          <button @click="confirmDelete" class="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white">
            {{$t('yes')}}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();


const showAddCloudModal = ref(false);
const showEditModal = ref(false);
const showDeleteConfirm = ref(false);

export type SubLocation = {
  id: string
  name: string
  image?: string
};
type CloudLocation = {
  id: string
  name: string
  image: string
  subLocations: SubLocation[]
};

const cloudLocations = ref<CloudLocation[]>([]);
  cloudLocations.value.push({
  id: '1',
  name: 'خانه',
  image: 'data:image/...',
  subLocations: [] // ✅ حالا میدونیم subLocations یک آرایه از SubLocation هست
})
const newCloud = ref({
  id: '',
  name: '',
  image: ''
});

const deleteTarget = ref<CloudLocation | null>(null);
const currentEditingImage = ref<string | null>(null);

// بارگیری از localStorage
const loadFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem('cloudCards');
    if (saved) {
      const parsed = JSON.parse(saved);
      // اطمینان از وجود id
      cloudLocations.value = parsed.map((item: any) => ({
        id: item.id || Date.now() + Math.random().toString(36),
        name: item.name || 'ناشناس',
        image: item.image || ''
      }));
    }
  } catch (e) {
    console.error('Failed to load cloud locations from localStorage', e);
    cloudLocations.value = [];
  }
};

const saveToLocalStorage = () => {
  try {
    localStorage.setItem('cloudCards', JSON.stringify(cloudLocations.value));
  } catch (e) {
    console.error('Failed to save cloud locations to localStorage', e);
  }
};

onMounted(() => {
  loadFromLocalStorage();
});

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      newCloud.value.image = e.target?.result as string;
    };
    reader.readAsDataURL(input.files[0]);
  }
};



// باز کردن مودال ویرایش
const editCloud = (cloud: CloudLocation) => {
  newCloud.value = { ...cloud };
  currentEditingImage.value = cloud.image;
  showEditModal.value = true;
};

// مشاهده ابر مکان
const viewCloud = (cloud: CloudLocation) => {
  console.log('مشاهده کلیک شد:', cloud) // ✅ برای تست
  router.push(`/dashboard/sub-locations/${cloud.id}`)
};

// حذف کارت
const deleteCloud = (cloud: CloudLocation) => {
  deleteTarget.value = { ...cloud }; // کپی ایمن
  showDeleteConfirm.value = true;
};

// تأیید حذف
const confirmDelete = () => {
  if (deleteTarget.value?.id) {
    cloudLocations.value = cloudLocations.value.filter(c => c.id !== deleteTarget.value?.id);
    saveToLocalStorage();
  }
  showDeleteConfirm.value = false;
  deleteTarget.value = null;
};

// بستن مودال
const closeModal = () => {
  showAddCloudModal.value = false;
  showEditModal.value = false;
  newCloud.value = { id: '', name: '', image: '' };
  currentEditingImage.value = null;
};

// ذخیره (افزودن یا ویرایش)
const confirmSave = () => {
  if (!newCloud.value.name || !newCloud.value.image) return;

  if (showAddCloudModal.value) {
    // افزودن جدید
    cloudLocations.value.push({
      id: Date.now().toString(),
      name: newCloud.value.name,
      image: newCloud.value.image
    });
  } else if (showEditModal.value && newCloud.value.id) {
    // ویرایش
    const index = cloudLocations.value.findIndex(c => c.id === newCloud.value.id);
    if (index !== -1) {
      cloudLocations.value[index] = { ...newCloud.value };
    }
  }

  saveToLocalStorage();
  closeModal();
};

// باز کردن مودال افزودن

</script>

<style scoped>
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

input[type="text"] {
  text-align: center;
  direction: ltr;
  font-family: inherit;
}
</style>