import axiosClient from '../../service/axiosClient';

const getSongs = (params) => {
  return axiosClient.get('/api/song', { params });
};

const createSong = (data) => {
  return axiosClient.post('/api/song', data);
};

// Note: in Lumen, PUT method cannot read FormData
// Ref: https://stackoverflow.com/q/50691938/7688028
const updateSong = (id, data) => {
  return axiosClient.post('/api/song/id/' + id, data);
};

const deleteSong = (id) => {
  return axiosClient.delete('/api/song/id/' + id);
};

const getAllTypes = (params) => {
  return axiosClient.get('/api/song/type/all', { params });
};

const uploadLyric = (data) => {
  return axiosClient.post('/api/lyric/upload', data);
};

const SongService = {
  getSongs,
  createSong,
  updateSong,
  deleteSong,
  getAllTypes,
  uploadLyric
};

export default SongService;
