import axios from "axios"
import paths from "../../../consts/route-paths"

export abstract class DataLoader {
    
    static async getLayers() {
        const method = "get"
        const url = `${paths.serverUrl}/layers`

        const response = await axios[method](url)
        const resp = [...response.data]
        resp.forEach((l:any) => l.geojson = JSON.parse(l.geojson))

        return resp

    }

    static async getMapInfo() {
        const method = "get"
        const url = `${paths.serverUrl}/mapInfo`

        const response = await axios[method](url)
        return response.data

    }
}