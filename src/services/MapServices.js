import api from './api';

export default {
  fetchObjectsData () {
    return api().get('separatedData/objects');
  },
  fetchMapDescriptionData () {
    return api().get('separatedData/mapDescription');
  },
  fetchUsersData () {
    return api().get('separatedData/users');
  }
};
