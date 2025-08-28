<template>
  <div class="top">
    <div class="top-op">
      <div class="btn">
        <el-upload 
          :action="'#'"
          :show-file-list="false"
          :with-credentials="true"
          :multiple="true"
          :http-request="addFile"
          :accept="fileAccept"
        >
          <el-button type="primary">
            <span class="iconfont icon-shangchuan-copy iconstyle"></span>
            上传
          </el-button>
        </el-upload>
      </div>
      
      <!-- 新建文件夹 -->
      <el-button type="success" @click="createNewFolder">
        <span class="iconfont icon-xinjianwenjian iconstyle"></span>
        新建文件夹
      </el-button>
      
      <!-- 批量删除 -->
      <el-button type="danger" @click="batchDelete">
        <span class="iconfont icon-lajitong iconstyle"></span>
        批量删除
      </el-button>
      
      <div class="search-panel">
        <el-input v-model="fileNameFuzzy" clearable placeholder="提示信息">
          <template #suffix>
            <i class="iconfont icon-icon_sousuo"></i>
          </template>
        </el-input>
      </div>
      <div class="iconfont icon-gengxin" @click="refresh"></div>
    </div>
    <div>全部文件</div>
  </div>
  <div class="file-list">
      <Table
        :columns="columns"
        :dataSource="tableData"
        :fetch="loadDataList"
        :initFetch="true"
        :options="tableOptions"
        :sortable="true"
        @rowSelected="rowSelected"
        ref="dataTabelRef"
      >
        <!-- 文件名列插槽 -->
        <template #fileName="{ row }">
          <div class="file-name-wrapper" @mouseenter="showOp(row)" @mouseleave="cancelShowOp(row)">
            <!-- 图标 -->
            <img 
              v-if="row.isFolder" 
              :src="fileTypeIcons[row.fileType]" 
              alt="folder icon" 
              class="file-icon"
            />
            <img 
              v-else 
              :src="fileTypeIcons[row.fileType]" 
              alt="file icon" 
              class="file-icon" 
            />

            <!-- 文件名 -->
            <span class="file-name-text">{{ row.fileName }}</span>

            <!-- 操作按钮（悬停显示） -->
            <div class="file-actions" v-show="row.showOp">
              <span class="action-btn" @click.stop="onShare(row)">
                <i class="iconfont icon-fenxiang"></i>
              </span>
              <span class="action-btn" @click.stop="onDownload(row)">
                <i class="iconfont icon-xiazai"></i>
              </span>
              <span class="action-btn" @click.stop="onDelete(row)">
                <i class="iconfont icon-lajitong"></i>
              </span>
              <span class="action-btn more" @click.stop="onMore(row)">
                <i class="iconfont icon-gengduo"></i>
              </span>
            </div>
          </div>
        </template>
      </Table>
    </div>
</template>

<script setup>
import { ref, provide, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import Table from '../Table.vue';

// 引入 API 方法
import {
  loadFileList,
  deleteFile,
  deleteFolder,
  uploadFile as apiUploadFile,
  downloadFile as apiDownloadFile,
  createShare,
  createFolder as apiCreateFolder,
  batchDeleteItems
} from '@/apis/Allfile';

// 引入图标
import tupian from '@/assets/icon/tupian.png';
import WordColor from '@/assets/icon/Word-Color.png';
import wenjianjia from '@/assets/icon/wenjianjia.png';
import pdf from '@/assets/icon/pdf1.png';
import Excel from '@/assets/icon/Excel.png';
import PPT from '@/assets/icon/PPT.png';
import zip from '@/assets/icon/zip.png';
import rar from '@/assets/icon/rar.png';
import mp3 from '@/assets/icon/mp3.png';
import mp4 from '@/assets/icon/mp4-1.png';

// 常量定义
const fileAccept = '.jpg,.png,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.mp3,.mp4';
const SHARE_BASE_URL = 'http://39.105.113.157:8080';

// 文件类型图标映射
const fileTypeIcons = {
  '文件夹': wenjianjia,
  '图片': tupian,
  'Word文档': WordColor,
  'PDF文件': pdf,
  'Excel表格': Excel,
  'PPT演示文稿': PPT,
  'zip压缩文件': zip,
  'rar压缩文件': rar,
  '7z压缩文件': zip,
  'mp3音频文件': mp3,
  'wav音频文件': mp3,
  'mp4视频文件': mp4,
  'avi视频文件': mp4,
  'mkv视频文件': mp4,
  'mov视频文件': mp4
};

// 表格列配置
const columns = [
  {
    label: '文件名',
    prop: 'fileName',
    slotName: 'fileName'
  },
  {
    label: '大小',
    prop: 'filesize',
    width: 120
  },
  {
    label: '类型',
    prop: 'fileType',
    width: 100
  },
  {
    label: '修改时间',
    prop: 'lastUpdateTime',
    width: 180
  }
];

// Refs
const dataTabelRef = ref();
const tableData = ref({ list: [], totalCount: 0 });
const fileNameFuzzy = ref('');
const currentUserName = localStorage.getItem('username') || '123';

// 表格选项
const tableOptions = ref({
  selectType: 'checkbox',
  extHeight: 50,
  showIndex: false,
  stripe: false,
  border: false
});

// 时间格式化

const formatTime = (timeStr) => {
  if (timeStr.includes('T')) {
    const date = new Date(timeStr);
    return date.toLocaleString();
  }
  return timeStr;
};

// 获取文件类型

const getFileType = (postfix) => {
  const ext = (postfix || '').toLowerCase();
  const imageTypes = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  const docTypes = {
    '.doc': 'Word文档', '.docx': 'Word文档', '.pdf': 'PDF文件', '.txt': '文本文档',
    '.ppt': 'PPT演示文稿', '.pptx': 'PPT演示文稿', '.xls': 'Excel表格', '.xlsx': 'Excel表格',
    '.zip': 'zip压缩文件', '.rar': 'rar压缩文件', '.7z': '7z压缩文件',
    '.mp3': 'mp3音频文件', '.wav': 'wav音频文件',
    '.mp4': 'mp4视频文件', '.avi': 'avi视频文件', '.mkv': 'mkv视频文件', '.mov': '视频文件'
  };
  return imageTypes.includes(ext) ? '图片' : docTypes[ext] || `${ext.slice(1).toUpperCase()}文件`;
};

// 加载数据

const loadDataList = async (params) => {
  const finalParams = {
    user_name: currentUserName,
    parentFolderId: '0',
    ...(fileNameFuzzy.value ? { fileNameFuzzy: fileNameFuzzy.value } : {})
  };

  try {
    const res = await loadFileList(finalParams);
    
    if (res.data) {
      const { files = [], folders = [] } = res.data;

      // 映射文件列表
      const fileList = files.map(file => ({
        ID: file.ID,
        fileId: file.ID,
        fileName: file.FileName,
        filesize: file.SizeStr,
        lastUpdateTime: formatTime(file.UploadTime),
        fileType: getFileType(file.Postfix),
        isFolder: false,
        showOp: false
      }));

      // 映射文件夹列表
      const folderList = folders.map(folder => ({
        ID: folder.ID,
        fileId: folder.ID,
        fileName: folder.Fame || '未知文件夹',
        filesize: '-',
        lastUpdateTime: formatTime(folder.CreatedAt),
        fileType: '文件夹',
        isFolder: true,
        showOp: false
      }));

      // 合并并赋值
      tableData.value = {
        list: [...folderList, ...fileList],
        totalCount: folderList.length + fileList.length
      };
    }

    return tableData.value;
  } catch (err) {
    console.error('加载数据失败:', err);
    return { list: [], totalCount: 0 };
  }
};

// 刷新列表

const refresh = () => {
  dataTabelRef.value?.load();
};

// 行选中事件

const rowSelected = (rows) => {
  console.log('选中行:', rows);
};


// 上传文件

const addFile = async (fileObj) => {
  const file = fileObj.file;
  const formData = new FormData();
  
  formData.append('user_name', currentUserName);
  formData.append('file', file);
  formData.append('parentFolderId', '0');

  try {
    await apiUploadFile(formData, (progressEvent) => {
      const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
      console.log(`上传进度: ${percent}%`);
    });

    ElMessage.success(`${file.name} 上传成功`);
    refresh();
  } catch (err) {
    ElMessage.error(`${file.name} 上传失败：${err.response?.data?.error || '服务器错误'}`);
  }
};


// 显示操作按钮

const showOp = (row) => {
  tableData.value.list.forEach(item => {
    if (item !== row) item.showOp = false;
  });
  row.showOp = true;
};

// 隐藏操作按钮

const cancelShowOp = (row) => {
  row.showOp = false;
};

// 分享文件

const onShare = async (row) => {
  try {
    const action = await ElMessageBox({
      title: '分享文件',
      message: `文件名：${row.fileName}`,
      showCancelButton: true,
      confirmButtonText: '公开分享',
      cancelButtonText: '私密分享（带提取码）'
    });

    const params = {
      user_name: currentUserName,
      id: row.fileId,
      url: SHARE_BASE_URL,
      hasPassword: action === 'cancel'
    };

    const response = await createShare(params);
    const data = response.data;

    const shareLink = data.url || `${SHARE_BASE_URL}/share.html?f=${data.f}`;
    const extractCode = data.code || '无';

    const copyText = extractCode !== '无'
      ? `分享链接：${shareLink}\n提取码：${extractCode}`
      : `分享链接：${shareLink}`;

    await ElMessageBox({
      title: '分享已创建',
      message: `链接：${shareLink}\n${extractCode !== '无' ? `提取码：${extractCode}` : ''}`,
      confirmButtonText: '复制链接'
    });

    await navigator.clipboard.writeText(copyText);
    ElMessage.success('已复制到剪贴板');
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      ElMessage.error('分享失败');
    }
  }
};

// 下载文件

const onDownload = async (row) => {
  if (row.isFolder) {
    ElMessage.warning('文件夹暂不支持下载');
    return;
  }

  try {
    const res = await apiDownloadFile({
      user_name: currentUserName,
      fId: row.fileId
    });

    if (res.data.downloadUrl) {
      const link = document.createElement('a');
      link.href = res.data.downloadUrl;
      link.download = row.fileName;
      link.click();
      ElMessage.success(`正在下载: ${row.fileName}`);
    }
  } catch (err) {
    ElMessage.error('下载失败');
  }
};

// 删除文件/文件夹

const onDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除 "${row.fileName}" 吗？`, '警告', {
      type: 'warning'
    });

    if (row.isFolder) {
      await deleteFolder(row.fileId);
    } else {
      await deleteFile({
        user_name: currentUserName,
        fId: row.fileId,
        folderId: '0'
      });
    }

    ElMessage.success(`${row.fileName} 删除成功`);
    refresh();
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

// 更多操作

const onMore = (row) => {
  ElMessage.info('更多操作');
};

// 提供原始文件列表给子组件
const allFiles = computed(() => tableData.value.list);
provide('allFiles', allFiles);

// 批量删除

const batchDelete = async () => {
  const selectedRows = dataTabelRef.value?.getSelectedRows() || [];
  
  if (selectedRows.length === 0) {
    ElMessage.warning('请选择要删除的文件或文件夹');
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定删除 ${selectedRows.length} 个项目吗？`,
      '警告',
      { type: 'warning' }
    );

    const results = await batchDeleteItems(selectedRows, currentUserName, '0');
    
    const failed = results.filter(r => r.status === 'rejected').length;
    if (failed > 0) {
      ElMessage.warning(`部分删除失败（${failed} 项）`);
    } else {
      ElMessage.success('删除成功');
    }
    
    refresh();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败');
    }
  }
};

// 新建文件夹

const createNewFolder = async () => {
  try {
    const { value: folderName } = await ElMessageBox.prompt(
      '请输入新文件夹的名称',
      '新建文件夹',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '文件夹名称不能为空'
      }
    );

    await apiCreateFolder({
      fileFolderName: folderName,
      userName: currentUserName,
      parentFolderId: '0'
    });

    ElMessage.success('文件夹创建成功');
    refresh();
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('创建文件夹失败');
    }
  }
};
</script>

<style scoped>
.iconstyle {
  margin-right: 3px;
}

.file-name-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.file-icon {
  width: 20px;
  height: 20px;
}

.file-name-text {
  color: #333;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-actions {
  display: flex;
  gap: 12px;
  margin-left: auto;
  font-size: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 2px;
  color: #409eff;
  cursor: pointer;
}

.action-btn:hover {
  color: #66b1ff;
  text-decoration: underline;
}

.action-btn i {
  font-size: 14px;
}
</style>