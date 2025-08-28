<!-- Picture.vue -->
<template>
  <div class="category-page">
    <div class="top-header">
      <h2>🖼️ 图片</h2>
      <span class="file-count">{{ sortedImages.length }} 个文件</span>
    </div>
    <div class="view-tabs">
      <button :class="{ active: currentView === 'timeline' }" @click="currentView = 'timeline'">时光轴</button>
      <button :class="{ active: currentView === 'recent' }" @click="currentView = 'recent'">最近上传</button>
    </div>
    <div v-if="currentView === 'timeline'" class="timeline-container">
      <div v-for="(group, index) in groupedFiles" :key="index" class="date-group">
        <div class="date-label">
          <input type="checkbox" :id="'date-checkbox-' + index" />
          <label :for="'date-checkbox-' + index">{{ group.date }}</label>
        </div>
        <div class="image-grid">
          <div v-for="file in group.files" :key="file.id" class="image-item">
            <img :src="file.filePath" alt="" class="image" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="currentView === 'recent'" class="recent-container">
      <div class="image-grid">
        <div v-for="file in sortedImages" :key="file.id" class="image-item">
          <img :src="file.filePath" alt="" class="image" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useFilesStore } from '@/store/files';

const filesStore = useFilesStore();
const currentView = ref('recent');

// 确保在组件挂载时加载文件
onMounted(async () => {
  await filesStore.loadAllFiles();
});

// 获取所有图片并按时间排序
const sortedImages = computed(() => {
  return [...filesStore.images].sort((a, b) => new Date(b.lastUpdateTime) - new Date(a.lastUpdateTime));
});

// 将图片按日期分组
const groupedFiles = computed(() => {
  const groups = {};
  sortedImages.value.forEach(file => {
    const date = new Date(file.lastUpdateTime).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = { date, files: [] };
    }
    groups[date].files.push(file);
  });
  return Object.values(groups);
});
</script>

<style scoped>
.category-page {
  padding: 20px;
}
.top-header {
  margin-bottom: 16px;
}
.top-header h2 {
  margin: 0;
  color: #333;
  font-size: 20px;
}
.file-count {
  color: #666;
  font-size: 14px;
  margin-left: 8px;
}

.view-tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.view-tabs button {
  padding: 8px 16px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-weight: bold;
  color: #333;
}

.view-tabs button.active {
  color: #007bff;
  border-bottom: 2px solid #007bff;
}

.timeline-container,
.recent-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.date-group {
  display: flex;
  flex-direction: column;
}

.date-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  color: #333;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.image-item {
  position: relative;
}

.image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
}
</style>