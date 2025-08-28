<!-- Document.vue -->
<template>
  <div class="category-page">
    <div class="top">
      <div>文档</div>
    </div>
    <div class="file-list">
      <Table
        :columns="columns"
        :dataSource="{ list: filteredList, totalCount: filteredList.length }"
        :useLocalData="true"
        :showPagination="false"
        @rowSelected="rowSelected"
      >
        <!-- 文件名列插槽 -->
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

// ✅ 使用 getter 获取文档
const filteredList = computed(() => filesStore.documents);

// 表格列配置
const columns = [
  { label: '文件名', prop: 'fileName', slotName: 'fileName' },
  { label: '大小', prop: 'filesize', width: 120 },
  { label: '类型', prop: 'fileType', width: 120 },
  { label: '修改时间', prop: 'lastUpdateTime', width: 180 }
];

// 图标映射（可抽到 utils/fileIcons.js）
const fileTypeIcons = {
  'Word文档': '/src/assets/icon/Word-Color.png',
  'PDF文件': '/src/assets/icon/pdf1.png',
  'Excel表格': '/src/assets/icon/excel.png',
  'PPT演示文稿': '/src/assets/icon/PPT.png',
  '文本文档': '/src/assets/icon/txt.png'
};


const rowSelected = (rows) => {
  console.log('选中文档:', rows);
};
</script>

<style scoped>
.top {
  padding: 20px;
  font-size: 18px;
  font-weight: 600;
}
.file-list {
  padding: 0 20px;
}
.file-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  vertical-align: middle;
}
.file-name-text {
  vertical-align: middle;
}
</style>