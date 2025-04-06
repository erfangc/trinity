/* tslint:disable */
/* eslint-disable */
/**
 * OpenAPI definition
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from './configuration';
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from './common';
import type { RequestArgs } from './base';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, BaseAPI, RequiredError, operationServerMap } from './base';

/**
 * 
 * @export
 * @interface Church
 */
export interface Church {
    /**
     * 
     * @type {number}
     * @memberof Church
     */
    'id'?: number;
    /**
     * 
     * @type {string}
     * @memberof Church
     */
    'createdAt': string;
    /**
     * 
     * @type {string}
     * @memberof Church
     */
    'name'?: string;
    /**
     * 
     * @type {string}
     * @memberof Church
     */
    'googlePlaceId'?: string;
    /**
     * 
     * @type {number}
     * @memberof Church
     */
    'latitude'?: number;
    /**
     * 
     * @type {number}
     * @memberof Church
     */
    'longitude'?: number;
}
/**
 * 
 * @export
 * @interface CreatePrayerIntentionRequest
 */
export interface CreatePrayerIntentionRequest {
    /**
     * 
     * @type {string}
     * @memberof CreatePrayerIntentionRequest
     */
    'intentText': string;
}
/**
 * 
 * @export
 * @interface PrayerIntention
 */
export interface PrayerIntention {
    /**
     * 
     * @type {number}
     * @memberof PrayerIntention
     */
    'id'?: number;
    /**
     * 
     * @type {string}
     * @memberof PrayerIntention
     */
    'createdAt': string;
    /**
     * 
     * @type {string}
     * @memberof PrayerIntention
     */
    'creatorId'?: string;
    /**
     * 
     * @type {string}
     * @memberof PrayerIntention
     */
    'intentionText'?: string;
    /**
     * 
     * @type {string}
     * @memberof PrayerIntention
     */
    'answererId'?: string;
    /**
     * 
     * @type {boolean}
     * @memberof PrayerIntention
     */
    'isRead': boolean;
    /**
     * 
     * @type {string}
     * @memberof PrayerIntention
     */
    'answeredAt'?: string;
}
/**
 * 
 * @export
 * @interface PrayerIntentionDenormalized
 */
export interface PrayerIntentionDenormalized {
    /**
     * 
     * @type {number}
     * @memberof PrayerIntentionDenormalized
     */
    'id'?: number;
    /**
     * 
     * @type {string}
     * @memberof PrayerIntentionDenormalized
     */
    'createdAt': string;
    /**
     * 
     * @type {string}
     * @memberof PrayerIntentionDenormalized
     */
    'creatorId'?: string;
    /**
     * 
     * @type {UserSummary}
     * @memberof PrayerIntentionDenormalized
     */
    'creator'?: UserSummary;
    /**
     * 
     * @type {string}
     * @memberof PrayerIntentionDenormalized
     */
    'intentionText'?: string;
    /**
     * 
     * @type {string}
     * @memberof PrayerIntentionDenormalized
     */
    'answererId'?: string;
    /**
     * 
     * @type {UserSummary}
     * @memberof PrayerIntentionDenormalized
     */
    'answerer'?: UserSummary;
    /**
     * 
     * @type {boolean}
     * @memberof PrayerIntentionDenormalized
     */
    'isRead': boolean;
    /**
     * 
     * @type {string}
     * @memberof PrayerIntentionDenormalized
     */
    'answeredAt'?: string;
}
/**
 * 
 * @export
 * @interface UserSummary
 */
export interface UserSummary {
    /**
     * 
     * @type {string}
     * @memberof UserSummary
     */
    'id': string;
    /**
     * 
     * @type {string}
     * @memberof UserSummary
     */
    'firstName': string;
    /**
     * 
     * @type {string}
     * @memberof UserSummary
     */
    'lastName'?: string;
    /**
     * 
     * @type {Church}
     * @memberof UserSummary
     */
    'church'?: Church;
}

/**
 * TrinityPrayerControllerApi - axios parameter creator
 * @export
 */
export const TrinityPrayerControllerApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {number} prayerIntentionId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        answerPrayer: async (prayerIntentionId: number, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'prayerIntentionId' is not null or undefined
            assertParamExists('answerPrayer', 'prayerIntentionId', prayerIntentionId)
            const localVarPath = `/api/v1/prayer-intentions/{prayerIntentionId}/answer`
                .replace(`{${"prayerIntentionId"}}`, encodeURIComponent(String(prayerIntentionId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {CreatePrayerIntentionRequest} createPrayerIntentionRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createPrayerIntention: async (createPrayerIntentionRequest: CreatePrayerIntentionRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'createPrayerIntentionRequest' is not null or undefined
            assertParamExists('createPrayerIntention', 'createPrayerIntentionRequest', createPrayerIntentionRequest)
            const localVarPath = `/api/v1/prayer-intentions`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(createPrayerIntentionRequest, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getChurches: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/v1/churches`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getMyPrayerIntentions: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/v1/my-prayer-intentions`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {number} prayerIntentionId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPrayerIntention: async (prayerIntentionId: number, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'prayerIntentionId' is not null or undefined
            assertParamExists('getPrayerIntention', 'prayerIntentionId', prayerIntentionId)
            const localVarPath = `/api/v1/prayer-intentions/{prayerIntentionId}`
                .replace(`{${"prayerIntentionId"}}`, encodeURIComponent(String(prayerIntentionId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPrayerIntentions: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/v1/prayer-intentions`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} expoPushToken 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        saveExpoToken: async (expoPushToken: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'expoPushToken' is not null or undefined
            assertParamExists('saveExpoToken', 'expoPushToken', expoPushToken)
            const localVarPath = `/api/v1/expo-push-tokens`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (expoPushToken !== undefined) {
                localVarQueryParameter['expoPushToken'] = expoPushToken;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * TrinityPrayerControllerApi - functional programming interface
 * @export
 */
export const TrinityPrayerControllerApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = TrinityPrayerControllerApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {number} prayerIntentionId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async answerPrayer(prayerIntentionId: number, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.answerPrayer(prayerIntentionId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['TrinityPrayerControllerApi.answerPrayer']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {CreatePrayerIntentionRequest} createPrayerIntentionRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createPrayerIntention(createPrayerIntentionRequest: CreatePrayerIntentionRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<PrayerIntention>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.createPrayerIntention(createPrayerIntentionRequest, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['TrinityPrayerControllerApi.createPrayerIntention']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getChurches(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<Church>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getChurches(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['TrinityPrayerControllerApi.getChurches']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getMyPrayerIntentions(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<PrayerIntentionDenormalized>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getMyPrayerIntentions(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['TrinityPrayerControllerApi.getMyPrayerIntentions']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {number} prayerIntentionId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getPrayerIntention(prayerIntentionId: number, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<PrayerIntentionDenormalized>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getPrayerIntention(prayerIntentionId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['TrinityPrayerControllerApi.getPrayerIntention']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getPrayerIntentions(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<PrayerIntentionDenormalized>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getPrayerIntentions(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['TrinityPrayerControllerApi.getPrayerIntentions']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {string} expoPushToken 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async saveExpoToken(expoPushToken: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.saveExpoToken(expoPushToken, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['TrinityPrayerControllerApi.saveExpoToken']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * TrinityPrayerControllerApi - factory interface
 * @export
 */
export const TrinityPrayerControllerApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = TrinityPrayerControllerApiFp(configuration)
    return {
        /**
         * 
         * @param {number} prayerIntentionId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        answerPrayer(prayerIntentionId: number, options?: RawAxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.answerPrayer(prayerIntentionId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {CreatePrayerIntentionRequest} createPrayerIntentionRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createPrayerIntention(createPrayerIntentionRequest: CreatePrayerIntentionRequest, options?: RawAxiosRequestConfig): AxiosPromise<PrayerIntention> {
            return localVarFp.createPrayerIntention(createPrayerIntentionRequest, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getChurches(options?: RawAxiosRequestConfig): AxiosPromise<Array<Church>> {
            return localVarFp.getChurches(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getMyPrayerIntentions(options?: RawAxiosRequestConfig): AxiosPromise<Array<PrayerIntentionDenormalized>> {
            return localVarFp.getMyPrayerIntentions(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {number} prayerIntentionId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPrayerIntention(prayerIntentionId: number, options?: RawAxiosRequestConfig): AxiosPromise<PrayerIntentionDenormalized> {
            return localVarFp.getPrayerIntention(prayerIntentionId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPrayerIntentions(options?: RawAxiosRequestConfig): AxiosPromise<Array<PrayerIntentionDenormalized>> {
            return localVarFp.getPrayerIntentions(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} expoPushToken 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        saveExpoToken(expoPushToken: string, options?: RawAxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.saveExpoToken(expoPushToken, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * TrinityPrayerControllerApi - object-oriented interface
 * @export
 * @class TrinityPrayerControllerApi
 * @extends {BaseAPI}
 */
export class TrinityPrayerControllerApi extends BaseAPI {
    /**
     * 
     * @param {number} prayerIntentionId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TrinityPrayerControllerApi
     */
    public answerPrayer(prayerIntentionId: number, options?: RawAxiosRequestConfig) {
        return TrinityPrayerControllerApiFp(this.configuration).answerPrayer(prayerIntentionId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {CreatePrayerIntentionRequest} createPrayerIntentionRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TrinityPrayerControllerApi
     */
    public createPrayerIntention(createPrayerIntentionRequest: CreatePrayerIntentionRequest, options?: RawAxiosRequestConfig) {
        return TrinityPrayerControllerApiFp(this.configuration).createPrayerIntention(createPrayerIntentionRequest, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TrinityPrayerControllerApi
     */
    public getChurches(options?: RawAxiosRequestConfig) {
        return TrinityPrayerControllerApiFp(this.configuration).getChurches(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TrinityPrayerControllerApi
     */
    public getMyPrayerIntentions(options?: RawAxiosRequestConfig) {
        return TrinityPrayerControllerApiFp(this.configuration).getMyPrayerIntentions(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {number} prayerIntentionId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TrinityPrayerControllerApi
     */
    public getPrayerIntention(prayerIntentionId: number, options?: RawAxiosRequestConfig) {
        return TrinityPrayerControllerApiFp(this.configuration).getPrayerIntention(prayerIntentionId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TrinityPrayerControllerApi
     */
    public getPrayerIntentions(options?: RawAxiosRequestConfig) {
        return TrinityPrayerControllerApiFp(this.configuration).getPrayerIntentions(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {string} expoPushToken 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TrinityPrayerControllerApi
     */
    public saveExpoToken(expoPushToken: string, options?: RawAxiosRequestConfig) {
        return TrinityPrayerControllerApiFp(this.configuration).saveExpoToken(expoPushToken, options).then((request) => request(this.axios, this.basePath));
    }
}



