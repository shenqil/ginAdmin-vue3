import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://some-domain.com/api/',
    timeout: 1000,
    headers: { 'X-Custom-Header': 'foobar' }
});

let refreshTimeout;
let lastAccessTime;

export const BASE_URL = '/api'

export enum contentType {
    from = 'application/x-www-form-urlencoded',
    json = 'application/json'
}

export enum headerKeys {
    ContentType = 'Content-Type',
    Authorization = 'Authorization'
}

export enum methods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
    HEAD = 'HEAD',
    OPTIONS = 'OPTIONS',
}