
export default function getIconSettings(objCategory) {
    let settings = {
        scale: 1,
        shiftX: 0,
        shiftY: 0
    };

    switch (objCategory) {
        // movable object categories:
        case "table":
            settings.scale = 0.025;
            settings.shiftX = 6;
            settings.shiftY = 4;
            break;
        case "cupboard":
            settings.scale = 0.02;
            settings.shiftX = 5;
            settings.shiftY = 5;
            break;
        case "printer":
            settings.scale = 0.03;
            settings.shiftX = 5.5;
            settings.shiftY = 5.5;
            break;
        case "scaner":
            settings.scale = 0.02;
            settings.shiftX = 5;
            settings.shiftY = 5;
            break;
        case "shredder":
            settings.scale = 0.02;
            settings.shiftX = 5;
            settings.shiftY = 5;
            break;
        // static object categories:
        case "column":
            settings.scale = 0.010;
            settings.shiftX = 2.5;
            settings.shiftY = 2.5;
            break;
        case "meeting_room":
            settings.scale = 0.02;
            settings.shiftX = 5;
            settings.shiftY = 5;
            break;
        case "public_place":
            settings.scale = 0.15;
            settings.shiftX = 5.5;
            settings.shiftY = 5.5;
            break;
        case "service_room":
            settings.scale = 0.2;
            settings.shiftX = 5.5;
            settings.shiftY = 5.5;
            break;  
        default:
            break;
    }

    return settings;
}
