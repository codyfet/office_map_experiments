import { CHANGE_BOARD_STATE } from '../res/constants';

function autoAdjustStage(mapWidth, mapHeight, boardSizes) {
  // padding:
  const padding = 20;

  // получаем границы окна :
  const { boardWidth, boardHeight } = boardSizes;
  
  // настраиваем масштаб:
  // считаем используя отступ с 2-х сторон (поэтому * 2)
  const scaleX = boardWidth / (mapWidth + padding * 2);
  const scaleY = boardHeight / (mapHeight + padding * 2);
  
  // если реальная карта меньше размера AdvancedBoard (div-элемента) (т.е. scaleX/scaleY > 1),
  // то выберем наибольший масштаб:
  let newScale;
  if (scaleX < 1 || scaleY < 1) {
    newScale = scaleX > scaleY ? scaleY : scaleX;
  } else {
    newScale = scaleX > scaleY ? scaleX : scaleY;
  }

  return {
    shift: [padding * newScale, padding * newScale],
    scale: newScale,
  };
}

// в соответствии со вторым этажом:
// const initialState = { shift: [4, 4], scale: 0.244 };
const boardSizes = {
  boardWidth: window.innerWidth / 1.7,
  boardHeight: window.innerHeight - 50
};
const initialState = autoAdjustStage(3650, 1670, boardSizes);

export default function boardState(state = initialState, action) {
  switch (action.type) {
    case CHANGE_BOARD_STATE: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}
