import httpInstance from '@/utils/httpInstance';

// API 路径枚举
const API = {
  LOAD_FILE_LIST: '/cloud/files',
  DELETE_FILE: '/cloud/deleteFile',
  DELETE_FOLDER: '/cloud/deleteFolder',
  UPLOAD_FILE: '/cloud/uploadFile',
  DOWNLOAD_FILE: '/cloud/downloadFile',
  CREATE_SHARE: '/cloud/getQrCode',
  CREATE_FOLDER: '/cloud/addFolder'
};

// 加载文件列表

export const loadFileList = (params) => {
  return httpInstance.get(API.LOAD_FILE_LIST, { params });
};

// 删除文件

export const deleteFile = (params) => {
  return httpInstance.get(API.DELETE_FILE, { params });
};

// 删除文件夹

export const deleteFolder = (folderId) => {
  return httpInstance.get(API.DELETE_FOLDER, { params: { folderId } });
};

// 上传文件

export const uploadFile = (formData, onProgress) => {
  return httpInstance.post(API.UPLOAD_FILE, formData, {
    onUploadProgress: onProgress,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// 下载文件

export const downloadFile = (params) => {
  return httpInstance.get(API.DOWNLOAD_FILE, { params });
};

// 创建分享链接

export const createShare = (params) => {
  return httpInstance.post(API.CREATE_SHARE, null, { params });
};

// 创建文件夹

export const createFolder = (data) => {
  const formData = new FormData();
  formData.append('fileFolderName', data.fileFolderName);
  
  const queryParams = new URLSearchParams();
  queryParams.append('user_name', data.userName);
  queryParams.append('parentFolderId', data.parentFolderId);
  
  const url = `${API.CREATE_FOLDER}?${queryParams.toString()}`;
  return httpInstance.post(url, formData);
};

// 批量删除项目

export const batchDeleteItems = async (items, userName, parentFolderId) => {
  const deletePromises = items.map(item => {
    if (item.isFolder) {
      return deleteFolder(item.fileId);
    } else {
      return deleteFile({
        user_name: userName,
        fId: item.fileId,
        folderId: parentFolderId
      });
    }
  });
  
  return Promise.allSettled(deletePromises);
};