import APIServiceTauri from "./APIServiceTauri";
import { isTauri } from '@tauri-apps/api/core';
import Logger from "../util/Logger";
class Services {


    getAPI() {
        Logger.log(0, "Services.getAPI()", isTauri());
        if (isTauri) {
            return new APIServiceTauri();
        } else {
            // Return a different API service for non-Tauri environments
        }
    }
}

export default new Services()
