<template>
  <div class="table-container">
    <el-table
      ref="dataTable"
      :data="dataSource.list || []"
      :height="tableHeight"
      :stripe="options.stripe"
      :border="options.border"
      header-row-class-name="table-header-row"
      highlight-current-row
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      :loading="loading"
    >
      <!-- 多选列 -->
      <el-table-column
        v-if="options.selectType === 'checkbox'"
        type="selection"
        width="50"
        align="center"
      />

      <!-- 序号列 -->
      <el-table-column
        v-if="options.showIndex"
        label="序号"
        type="index"
        width="60"
        align="center"
      />

      <!-- 动态列 -->
      <el-table-column
        v-for="(column, index) in columns"
        :key="index"
        :prop="column.prop"
        :label="column.label"
        :align="column.align || 'left'"
        :width="column.width"
        :fixed="column.fixed"
        :sortable="column.sortable ? 'custom' : false"
      >
        <!-- 插槽支持 -->
        <template v-if="column.slotName" #default="scope">
          <slot
            :name="column.slotName"
            :index="scope.$index"
            :row="scope.row"
          ></slot>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div v-if="showPagination" class="pagination">
      <el-pagination
        :total="dataSource.totalCount"
        :page-sizes="[10, 15, 30, 50, 100]"
        :page-size="localPageSize"
        :current-page="localPageNo"
        :layout="layout"
        @size-change="handlePageSizeChange"
        @current-change="handlePageNoChange"
      >
        <!-- 自定义页码输入框 -->
        <template #jumper>
          <span class="el-pagination__jump">
            跳至
            <el-input-number
              v-model="localPageNo"
              :min="1"
              :max="Math.ceil(dataSource.totalCount / localPageSize)"
              size="small"
              @change="handlePageNoChange"
            />
            页
          </span>
        </template>
      </el-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';

// Props 定义
const props = defineProps({
  dataSource: {
    type: Object,
    required: true,
    default: () => ({
      list: [],
      totalCount: 0,
    }),
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  options: {
    type: Object,
    default: () => ({
      stripe: false,
      border: false,
      extHeight: 0,
      showIndex: false,
      tableHeight: null,
      selectType: 'checkbox', // 确保默认支持多选
    }),
  },
  columns: {
    type: Array,
    required: true,
    default: () => [],
  },
  fetch: {
    type: Function,
    required: false,
  },
  initFetch: {
    type: Boolean,
    default: true,
  },
  sortable: {
    type: Boolean,
    default: false,
  },
});

// 事件定义
const emit = defineEmits(['rowSelected', 'rowClick']);

// 分页数据（使用 reactive 管理响应式状态）
const pagination = reactive({
  pageNo: 1,
  pageSize: 15,
  sort: '',
  order: '',
});

const localPageNo = computed({
  get: () => pagination.pageNo,
  set: (val) => {
    pagination.pageNo = val;
  },
});

const localPageSize = computed({
  get: () => pagination.pageSize,
  set: (val) => {
    pagination.pageSize = val;
  },
});

// 分页 layout 计算
const layout = computed(() => {
  return `total,${props.showPageSize ? 'sizes,' : ''}prev,pager,next,jumper`;
});

// 表格高度计算
const tableHeight = ref(0);
const topHeight = 60 + 20 + 30 + 46; // 根据你的页面结构调整

onMounted(() => {
  if (!props.options.tableHeight) {
    tableHeight.value = window.innerHeight - topHeight - props.options.extHeight;
  } else {
    tableHeight.value = props.options.tableHeight;
  }

  if (props.initFetch && props.fetch) {
    load();
  }
});

// 加载数据
const loading = ref(false);
const load = async () => {
  if (!props.fetch) return;

  loading.value = true;
  try {
    await props.fetch({
      pageNo: pagination.pageNo,
      pageSize: pagination.pageSize,
      sort: pagination.sort,
      order: pagination.order,
    });
  } finally {
    loading.value = false;
  }
};

// 清除选中
const dataTable = ref();
const clearSelection = () => {
  if (dataTable.value) {
    dataTable.value.clearSelection();
  }
};

// 设置当前行高亮
const setCurrentRow = (rowKey, rowValue) => {
  const row = props.dataSource.list.find((item) => item[rowKey] === rowValue);
  if (row && dataTable.value) {
    dataTable.value.setCurrentRow(row);
  }
};

// ✅ 修复：获取选中行（正确使用 getSelectionRows）
const getSelectedRows = () => {
  if (!dataTable.value) return [];
  return dataTable.value.getSelectionRows(); // ✅ Element Plus 正确 API
};

// 暴露方法给父组件使用
defineExpose({
  clearSelection,
  setCurrentRow,
  getSelectedRows,
  load,
});

// 行点击事件
const handleRowClick = (row) => {
  emit('rowClick', row);
};

// 多选事件：同步选中状态
const handleSelectionChange = (rows) => {
  emit('rowSelected', rows);
};

// 切换每页大小
const handlePageSizeChange = (size) => {
  pagination.pageSize = size;
  load();
};

// 切换页码
const handlePageNoChange = (pageNo) => {
  pagination.pageNo = pageNo;
  load();
};

// 排序事件
const handleSortChange = ({ column, prop, order }) => {
  pagination.sort = prop;
  pagination.order = order === 'ascending' ? 'asc' : (order === 'descending' ? 'desc' : '');
  load();
};
</script>

<style lang="scss" scoped>
.table-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.pagination {
  margin-top: 15px;
  padding: 8px 10px;
  background-color: #f9f9f9;
  border-top: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);
  border-radius: 4px;

  .el-pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .el-pagination__jump {
    font-size: 14px;
    color: #606266;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .el-input-number {
    width: 60px;
    margin: 0 5px;
  }

  .el-pagination__total {
    margin-right: 10px;
  }
}

:deep(.el-table__cell) {
  padding: 4px 0;
}
</style>