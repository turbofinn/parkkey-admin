import axios from "axios";


class ApiService {
    constructor() {
        if (!ApiService.instance) { ApiService.instance = this }
        return ApiService.instance
    }

    getBaseUrl = () => { return process.env.REACT_APP_IS_IN_PROD === "true" ? process.env.REACT_APP_BASE_URL_PROD : process.env.REACT_APP_BASE_URL_DEV; }

    defaultAuthConfig = () => {
        const accessToken = LocalStorageService.getToken();
        return { headers: { 'auth-token': accessToken } }
    }


    fetchParkingList = (request, endpoint) => {
        let url = this.getBaseUrl() + endpoint;
        const config = { ...this.defaultAuthConfig() }
        return axios.post(url, request)
    }

}

const apiService = new ApiService();
export default apiService;




