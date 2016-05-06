class SerializationHelper {
    static toInstance(obj, json) {
        var jsonObj = JSON.parse(json);
        if (typeof obj["fromJSON"] === "function") {
            obj["fromJSON"](jsonObj);
        }
        else {
            for (var propName in jsonObj) {
                obj[propName] = jsonObj[propName];
            }
        }
        return obj;
    }
    static serialize(obj) {
        return JSON.stringify(obj);
    }
}
function is_nw() {
    try {
        return (typeof require('nw.gui') !== "undefined");
    }
    catch (e) {
        return false;
    }
}
//# sourceMappingURL=common.js.map