// src/store/useFileStore.ts

// import { defineStore } from 'pinia';
// import {
//   fetchFileList,
//   deleteFile,
//   deleteFolder,
//   batchDeleteItems,
//   createFolder,
//   uploadFile
// } from '@/apis/Allfile';

// import { ref } from 'vue';
// import { ElMessage } from 'element-plus';

// // 🔹 文件类型定义
// export interface FileItem {
//   ID: string;
//   fileId: string;
//   fileName: string;
//   filesize: string;
//   lastUpdateTime: string;
//   fileType: string;
//   isFolder: boolean;
//   showOp?: boolean;
// }

// export const useFileStore = defineStore('file', () => {
//   // 🗂️ 状态
//   const currentUserName = ref(localStorage.getItem('username') || '123');
//   const currentFolderId = ref('0'); // 当前所在文件夹 ID
//   const tableData = ref<{ list: FileItem[]; totalCount: number }>({
//     list: [],
//     totalCount: 0
//   });

//   const loading = ref(false);

//   // 🔁 加载文件列表
//   const loadFileList = async (fuzzy?: string) => {
//     if (!currentUserName.value) {
//       ElMessage.error('用户未登录');
//       return;
//     }

//     loading.value = true;
//     try {
//       const res = await fetchFileList({
//         user_name: currentUserName.value,
//         parentFolderId: currentFolderId.value,
//         ...(fuzzy && { fileNameFuzzy: fuzzy })
//       });

//       const { files = [], folders = [] } = res.data || {};

//       const fileList = files.map((file: any) => ({
//         ID: file.ID,
//         fileId: file.ID,
//         fileName: file.FileName,
//         filesize: file.SizeStr || '-',
//         lastUpdateTime: new Date(file.UploadTime).toLocaleString(),
//         fileType: getFileType(file.Postfix),
//         isFolder: false,
//         showOp: false
//       }));

//       const folderList = folders.map((folder: any) => ({
//         ID: folder.ID,
//         fileId: folder.ID,
//         fileName: folder.FileFolderName || '未知文件夹',
//         filesize: '-',
//         lastUpdateTime: new Date(folder.CreatedAt).toLocaleString(),
//         fileType: '文件夹',
//         isFolder: true,
//         showOp: false
//       }));

//       tableData.value = {
//         list: [...folderList, ...fileList],
//         totalCount: fileList.length + folderList.length
//       };
//     } catch (err: any) {
//       ElMessage.error(err.response?.data?.message || '加载失败');
//     } finally {
//       loading.value = false;
//     }
//   };

//   // 🗑️ 删除单个
//   const removeItem = async (item: FileItem) => {
//     try {
//       if (item.isFolder) {
//         await deleteFolder(item.fileId);
//       } else {
//         await deleteFile({
//           user_name: currentUserName.value!,
//           fId: item.fileId,
//           folderId: currentFolderId.value
//         });
//       }
//       ElMessage.success(`"${item.fileName}" 已删除`);
//       await loadFileList(); // 刷新
//     } catch (err: any) {
//       ElMessage.error(err.response?.data?.message || '删除失败');
//     }
//   };

//   // 🗑️ 批量删除
//   const batchRemove = async (items: FileItem[]) => {
//     if (items.length === 0) return;

//     try {
//       const results = await batchDeleteItems(
//         items,
//         currentUserName.value!,
//         currentFolderId.value
//       );

//       const failed = results.filter(r => r.status === 'rejected').length;
//       if (failed > 0) {
//         ElMessage.warning(`部分删除失败（${failed} 项）`);
//       } else {
//         ElMessage.success('全部删除成功');
//       }
//       await loadFileList();
//     } catch (err) {
//       ElMessage.error('批量删除失败');
//     }
//   };

//   // ➕ 新建文件夹
//   const createNewFolder = async (name: string) => {
//     if (!name.trim()) return;

//     try {
//       await createFolder({
//         fileFolderName: name,
//         user_name: currentUserName.value!,
//         parentFolderId: currentFolderId.value
//       });
//       ElMessage.success('文件夹创建成功');
//       await loadFileList();
//     } catch (err: any) {
//       ElMessage.error(err.response?.data?.error || '创建失败');
//     }
//   };

//   // ⬆️ 上传文件
//   const upload = async (file: File, onProgress?: (percent: number) => void) => {
//     const formData = new FormData();
//     formData.append('user_name', currentUserName.value!);
//     formData.append('file', file);
//     formData.append('parentFolderId', currentFolderId.value);

//     try {
//       await uploadFile(formData, (e) => {
//         const percent = Math.round((e.loaded * 100) / e.total);
//         onProgress?.(percent);
//       });
//       ElMessage.success('上传成功');
//       await loadFileList();
//     } catch (err: any) {
//       ElMessage.error(err.response?.data?.message || '上传失败');
//     }
//   };

//   // 🔁 切换文件夹（可扩展）
//   const enterFolder = (folderId: string) => {
//     currentFolderId.value = folderId;
//     loadFileList();
//   };

//   // 🔚 返回上一级（可扩展）
//   const goBack = () => {
//     // 这里可结合路径栈实现，当前简化为返回根目录
//     currentFolderId.value = '0';
//     loadFileList();
//   };

//   // 🔍 工具函数
//   const getFileType = (postfix: string) => {
//     const map: Record<string, string> = {
//       doc: 'Word文档',
//       docx: 'Word文档',
//       xls: 'Excel表格',
//       xlsx: 'Excel表格',
//       ppt: 'PPT',
//       pptx: 'PPT',
//       jpg: '图片',
//       jpeg: '图片',
//       png: '图片',
//       pdf: 'PDF',
//       txt: '文本',
//       mp4: '视频',
//       zip: '压缩包',
//       rar: '压缩包'
//     };
//     return map[postfix.toLowerCase()] || '文件';
//   };

//   return {
//     // 🔹 state
//     currentUserName,
//     currentFolderId,
//     tableData,
//     loading,

//     // 🔹 actions
//     loadFileList,
//     removeItem,
//     batchRemove,
//     createNewFolder,
//     upload,
//     enterFolder,
//     goBack
//   };
// });