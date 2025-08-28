import { defineStore } from 'pinia';
import axios from 'axios'; 

export const useFilesStore = defineStore('files', {
  state: () => ({
    allFiles: [],        // 所有文件
    isLoading: false,
  }),
  getters: {
    // 按类型过滤的 getter
    images: (state) => state.allFiles.filter(file => file.fileType === '图片'),
    documents: (state) => state.allFiles.filter(file => 
      ['Word文档', 'PDF文件', 'Excel表格', 'PPT演示文稿', '文本文档'].includes(file.fileType)
    ),
    videos: (state) => state.allFiles.filter(file => 
      ['mp4视频文件', 'avi视频文件', 'mkv视频文件', 'mov视频文件'].includes(file.fileType)
    ),
    audios: (state) => state.allFiles.filter(file => 
      ['mp3音频文件', 'wav音频文件'].includes(file.fileType)
    ),
    others: (state) => state.allFiles.filter(file => 
      !['图片', '文件夹', 'Word文档', 'PDF文件', 'Excel表格', 'PPT演示文稿', 'mp4视频文件', 'mp3音频文件']
        .some(type => file.fileType === type)
    )
  },
  actions: {
    
    async loadAllFiles() {
      if (this.allFiles.length > 0) return; // 避免重复加载
      this.isLoading = true;
      try {
        const res = await axios.get('/cloud/files', {
          params: { user_name: localStorage.getItem('username') || '123' }
        });

        const { files, folders } = res.data;

        const fileList = files.map(file => ({
          ID: file.ID,
          fileId: file.ID,
          fileName: file.FileName,
          filesize: file.SizeStr,
          lastUpdateTime: this.formatTime(file.UploadTime),
          fileType: this.getFileType(file.Postfix),
          isFolder: false,
          showOp: false
        }));

        const folderList = folders.map(folder => ({
          ID: folder.ID,
          fileId: folder.ID,
          fileName: folder.FolderName || folder.FileName,
          filesize: '-',
          lastUpdateTime: this.formatTime(folder.CreatedAt),
          fileType: '文件夹',
          isFolder: true,
          showOp: false
        }));

        this.allFiles = [...folderList, ...fileList];
      } catch (err) {
        console.error('加载文件失败', err);
      } finally {
        this.isLoading = false;
      }
    },
    formatTime(timeStr) {
      return timeStr?.slice(0, 16) || '';
    },
    getFileType(postfix) {
      const ext = (postfix || '').toLowerCase();
      const imageTypes = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
      if (imageTypes.includes(ext)) return '图片';
      const typeMap = {
        '.doc': 'Word文档', '.docx': 'Word文档',
        '.pdf': 'PDF文件',
        '.xls': 'Excel表格', '.xlsx': 'Excel表格',
        '.ppt': 'PPT演示文稿', '.pptx': 'PPT演示文稿',
        '.txt': '文本文档',
        '.mp3': 'mp3音频文件', '.wav': 'wav音频文件',
        '.mp4': 'mp4视频文件', '.avi': 'avi视频文件',
        '.mkv': 'mkv视频文件', '.mov': 'mov视频文件',
        '.zip': 'zip压缩文件', '.rar': 'rar压缩文件'
      };
      return typeMap[ext] || `${ext.slice(1).toUpperCase()}文件`;
    }
  }
});