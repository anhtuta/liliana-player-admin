import axiosClient from '../../service/axiosClient';

const getSongs = (params) => {
  return axiosClient.get('/api/song', { params });
};

const createSong = (data) => {
  return axiosClient.post('/api/song', data);
};

const updateSong = (data) => {
  return axiosClient.put('/api/song/id/' + data.id, data);
};

const deleteSong = (id) => {
  return axiosClient.delete('/api/song/id/' + id);
};

const SongService = {
  getSongs,
  createSong,
  updateSong,
  deleteSong
};

export default SongService;
