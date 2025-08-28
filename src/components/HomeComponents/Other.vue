<!-- Other.vue -->
<template>
  <div class="category-page">
    <div class="top">
      <div>其他</div>
    </div>
    <div class="file-list">
      <Table
        :columns="columns"
        :dataSource="{ list: filteredList, totalCount: filteredList.length }"
        :useLocalData="true"
        :showPagination="false"
        @rowSelected="rowSelected"
      >
        <template #fileName="{ row }">
          <div class="file-name-wrapper">
            <img :src="getIcon(row.fileType)" alt="" class="file-icon" />
            <span class="file-name-text">{{ row.fileName }}</span>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useFilesStore } from '@/store/files';
import Table from '@/components/Table.vue';

const filesStore = useFilesStore();
const filteredList = computed(() => filesStore.others);

const columns = [
  { label: '文件名', prop: 'fileName', slotName: 'fileName' },
  { label: '大小', prop: 'filesize', width: 120 },
  { label: '类型', prop: 'fileType', width: 120 },
  { label: '修改时间', prop: 'lastUpdateTime', width: 180 }
];

// 图标映射（可扩展）
const iconMap = {
  'zip压缩文件': '/src/assets/icon/zip.png',
  'rar压缩文件': '/src/assets/icon/rar.png',
  // 默认图标
  default: '/src/assets/icon/file.png'
};

// 动态获取图标
const getIcon = (fileType) => {
  return iconMap[fileType] || iconMap.default;
};

const rowSelected = (rows) => {
  console.log('选中其他文件:', rows);
};
</script>

<style scoped>
.top { padding: 20px; font-size: 18px; font-weight: 600; }
.file-list { padding: 0 20px; }
.file-icon { width: 24px; height: 24px; margin-right: 8px; vertical-align: middle; }
.file-name-text { vertical-align: middle; }
</style>