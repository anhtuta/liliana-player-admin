import axiosClient from '../../service/axiosClient';

const searchLyricFile = (params) => {
  return axiosClient.get('/api/lyric/search', { params });
};

const LyricService = {
  searchLyricFile
};

export default LyricService;
