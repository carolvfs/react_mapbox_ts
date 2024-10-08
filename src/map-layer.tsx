

class MapLayer {

    protected _domain : any 
    protected _id : any 
    protected _geoDataId : string 
    protected _thematicId : string
    protected _label: string
    protected _group: string
    protected _visible: boolean
    protected _data: any

    constructor(mapObj:any) {
        this._domain = [0, 50]
        this._geoDataId = mapObj.geoDataId 
        this._id = mapObj.id 
        this._group = mapObj.group
        this._label = mapObj.label
        this._thematicId = mapObj.thematicId
        this._visible = false
        this._data = null
    }

    get domain() {
        return this._domain
    }

    get geoDataId() {
        return this._geoDataId
    }

    get group() {
        return this._group
    }

    get id() {
        return this._id
    }

    get label() {
        return this._label
    }

    get thematicId() {
        return this._thematicId
    }

    get visible() {
        return this._visible
    }

    set data(data:any) {
        this._data = data
    }

    set visible(visible:boolean) {
        this._visible = visible
    }


}

export default MapLayer