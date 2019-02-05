
export default function createMapObject(type, id, coords, userId) {
    var newObject = {
        category: type,
        id: id,
        coordinates: coords,
        userId: '',
        correctLocation: true
    };

    switch (type) {
        case 'table':
            newObject.width = 15;
            newObject.height = 30;
            newObject.userId = userId;
            break;
        case "cupboard":
            newObject.width = 10;
            newObject.height = 20;
            break;
        case "printer":
            newObject.width = 15;
            newObject.height = 15;
            break;

        case "scaner":
            newObject.width = 15;
            newObject.height = 15;
            break;
        
        case "shredder":
            newObject.width = 15;
            newObject.height = 15;
            break;

        case "meeting_room":
            
            break;
        
        case "public_place":
            
            break;

        default:
            break; 

    }

    return newObject;

}