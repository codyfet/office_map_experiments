import api from './api';

export default {
  fetchObjectsData () {
    return api().get('separatedData/objects');
  }
};
