String.prototype["format"] = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
};

class SerializationHelper {
    static toInstance<T>(obj: T, json: string): T {
        var jsonObj = JSON.parse(json);

        if (typeof obj["fromJSON"] === "function") {
            obj["fromJSON"](jsonObj);
        }
        else {
            for (var propName in jsonObj) {
                obj[propName] = jsonObj[propName]
            }
        }

        return obj;
    }
    static serialize(obj): string {
        return JSON.stringify(obj);
    }
}

function is_nw() {
    try {
        return (typeof require('nw.gui') !== "undefined");
    } catch (e) {
        return false;
    }
}