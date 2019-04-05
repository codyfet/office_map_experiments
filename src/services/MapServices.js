import api from './api';

export default {
  sendMapData (mapDataFile) {
    return api().post('newMapData', mapDataFile);
  },
  fetchObjectsData () {
    return api().get('separatedData/objects');
  },
  fetchMapDescriptionData () {
    return api().get('separatedData/mapDescription');
  },
  fetchUsersData () {
    return api().get('separatedData/users');
  },
  fetchProjectsData () {
    return api().get('separatedData/projects');
  }
};
