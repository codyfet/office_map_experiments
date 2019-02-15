
import {  
    DEFAULT_COLOR,
    EMPTY_TABLE_COLOR,
    WARNING_COLOR,
    SELECTED_COLOR,
  
    TABLE_COLOR,
    CUPBOARD_COLOR,
    PRINTER_COLOR,
    SCANER_COLOR,
    SHREDDER_COLOR,
  
    PUBLIC_PLACE_COLOR,
    MEETING_ROOM_COLOR,
    SERVICE_ROOM_COLOR,
    CONSTRUCTION_COLOR
        
} from '../../../res/constantsObjectsColors';

export default function createMapObject(type, id, coords, userId) {
    var newObject = {
        category: type,
        id: id,
        coordinates: coords,
        movable: true,
        correctLocation: true,
        color: TABLE_COLOR
    };

    switch (type) {
        case "table":
            newObject.width = 40;
            newObject.height = 70;
            newObject.userId = userId;
            newObject.color = TABLE_COLOR;
            break;
        case "cupboard":
            newObject.width = 30;
            newObject.height = 50;
            newObject.color = CUPBOARD_COLOR;
            break;
        case "printer":
            newObject.width = 40;
            newObject.height = 40;
            newObject.color = PRINTER_COLOR;
            break;

        case "scaner":
            newObject.width = 40;
            newObject.height = 40;
            newObject.color = SCANER_COLOR;
            break;
        
        case "shredder":
            newObject.width = 40;
            newObject.height = 30;
            newObject.color = SHREDDER_COLOR;
            break;
        
        case "public_place":
            newObject.width = 100;
            newObject.height = 100;
            newObject.color = PUBLIC_PLACE_COLOR;
            break;
        
        case "meeting_room":
            newObject.width = 100;
            newObject.height = 100;
            newObject.color =  MEETING_ROOM_COLOR;
            break;
        
        case "service_room":
            newObject.width = 50;
            newObject.height = 50;
            newObject.color =  SERVICE_ROOM_COLOR;
            break;
        
        case "construction":
            newObject.width = 45;
            newObject.height = 45;
            newObject.color = CONSTRUCTION_COLOR;
            break;

        default:
            break; 

    }

    return newObject;

}