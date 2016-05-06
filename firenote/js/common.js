function is_nw(){
    try{
        return (typeof require('nw.gui') !== "undefined");
    } catch (e){
        return false;
    }
}