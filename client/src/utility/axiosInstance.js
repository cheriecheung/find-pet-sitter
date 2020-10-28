import axios from 'axios';
import { getAccessToken } from './accessToken';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export default (history = null) => {

    const baseURL = process.env.REACT_APP_API_DOMAIN;

    let headers = {}
    let accessToken = getAccessToken();

    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`
    }

    const axiosInstance = axios.create({
        baseURL,
        withCredentials: true,
        // credentials: 'include',
        headers
    })

    // no headers needed
    console.log({ headers })

    axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            return new Promise((resolve, reject) => {
                const originalReq = error.config;

                // with specific message
                if (error.response.status === 401 && error.config && !error.config._isRetryRequest) {
                    originalReq._retry = true;

                    let refreshTokenRes = fetch(`/refresh_token`, {
                        method: 'POST',
                        mode: 'cors',
                        cache: 'no-cache',
                        credentials: 'same-origin'
                    }).then((res) => {
                        console.log({ res: JSON.stringify(res) })
                        // res.json() 

                        return axios(originalReq);
                    }).catch(err => {
                        console.log({ err: err.response })
                    })

                    resolve(refreshTokenRes)
                }

                console.log('unsuccessful')

                if (history) {
                    history.push('/login');
                } else {
                    window.location = '/login'
                }

                return Promise.reject(error)
            });
        }
    )


    // axiosInstance.interceptors.response.use(
    //     (response) =>
    //         new Promise((resolve, reject) => {
    //             resolve(response);
    //         }),
    //     (error) => {
    //         if (!error.response) {
    //             return new Promise((resolve, reject) => {
    //                 reject(error);
    //             })
    //         }

    //         console.log({ errorResponse: error.response })

    //         if (error.response.status === 403) {

    //             if (history) {
    //                 history.push('/login');
    //             } else {
    //                 window.location = '/login'
    //             }
    //         } else {
    //             return new Promise((resolve, reject) => {
    //                 reject(error);
    //             })
    //         }
    //     }
    // )

    return axiosInstance;
}
