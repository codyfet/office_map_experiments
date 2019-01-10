import {
  CREATE_FURNITURE,

} from '../res/constants';

export const createFurniture = (newFurn) => ({
  type: CREATE_FURNITURE,
  payload: newFurn
});
