<!-- Music.vue -->
<template>
  <div class="category-page">
    <div class="top">
      <div>音乐</div>
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
            <img :src="fileTypeIcons[row.fileType]" alt="" class="file-icon" />
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
const filteredList = computed(() => filesStore.audios);

const columns = [
  { label: '文件名', prop: 'fileName', slotName: 'fileName' },
  { label: '大小', prop: 'filesize', width: 120 },
  { label: '类型', prop: 'fileType', width: 120 },
  { label: '修改时间', prop: 'lastUpdateTime', width: 180 }
];

const fileTypeIcons = {
  'mp3音频文件': '/src/assets/icon/mp3.png',
  'wav音频文件': '/src/assets/icon/wav.png'
};

const rowSelected = (rows) => {
  console.log('选中音乐:', rows);
};
</script>

<style scoped>
/* 同上 */
.top { padding: 20px; font-size: 18px; font-weight: 600; }
.file-list { padding: 0 20px; }
.file-icon { width: 24px; height: 24px; margin-right: 8px; vertical-align: middle; }
.file-name-text { vertical-align: middle; }
</style>