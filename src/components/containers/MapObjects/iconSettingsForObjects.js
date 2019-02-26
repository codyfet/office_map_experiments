function setupIconSizeAccordingToObjectSizes(settings, object) {
  const minSizeObjectValue = object.width < object.height ? object.width : object.height;
  const minSizeValue = 15;
  let scaleIncrease = 1;
  
  if (['table', 'cupboard', 'printer', 'scaner', 'shredder'].includes(object.category)) {
    scaleIncrease = minSizeObjectValue / minSizeValue;
  }

  if (['meeting_room', 'public_place', 'service_room', 'construction'].includes(object.category)) {
    scaleIncrease = minSizeObjectValue / 2 / minSizeValue;
  }

  return {
    scale: settings.scale * scaleIncrease,
    shiftX: settings.shiftX * scaleIncrease,
    shiftY: settings.shiftY * scaleIncrease
  };
}

export default function getIconSettings(object) {
  const settings = {
    scale: 1,
    shiftX: 0,
    shiftY: 0,
  };

  switch (object.category) {
    // movable object categories:
    case 'table':
      settings.scale = 0.025;
      settings.shiftX = 6;
      settings.shiftY = 4;
      break;
    case 'cupboard':
      settings.scale = 0.02;
      settings.shiftX = 5;
      settings.shiftY = 5;
      break;
    case 'printer':
      settings.scale = 0.03;
      settings.shiftX = 5.5;
      settings.shiftY = 5.5;
      break;
    case 'scaner':
      settings.scale = 0.02;
      settings.shiftX = 5;
      settings.shiftY = 5;
      break;
    case 'shredder':
      settings.scale = 0.02;
      settings.shiftX = 5;
      settings.shiftY = 5;
      break;
    // static object categories:
    case 'meeting_room':
      settings.scale = 0.02;
      settings.shiftX = 5;
      settings.shiftY = 5;
      break;
    case 'public_place':
      settings.scale = 0.028;
      settings.shiftX = 5.5;
      settings.shiftY = 5.5;
      break;
    case 'service_room':
      settings.scale = 0.2;
      settings.shiftX = 5.5;
      settings.shiftY = 5.5;
      break;
    case 'construction':
      settings.scale = 0;
      settings.shiftX = 0;
      settings.shiftY = 0;
      break;
    default:
      break;
  }

  return setupIconSizeAccordingToObjectSizes(settings, object);
}
