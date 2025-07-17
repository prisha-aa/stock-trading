# FundServiceApi

All URIs are relative to *http://localhost:3002/funds*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createTransaction**](#createtransaction) | **POST** /funds/transactions | Create a deposit or withdrawal transaction|
|[**getFundsOverview**](#getfundsoverview) | **GET** /funds/overview | Retrieve balance and recent transactions for the authenticated user|

# **createTransaction**
> CreateTransaction201Response createTransaction(createTransactionRequest)


### Example

```typescript
import {
    FundServiceApi,
    Configuration,
    CreateTransactionRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new FundServiceApi(configuration);

let createTransactionRequest: CreateTransactionRequest; //

const { status, data } = await apiInstance.createTransaction(
    createTransactionRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createTransactionRequest** | **CreateTransactionRequest**|  | |


### Return type

**CreateTransaction201Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Transaction created successfully |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getFundsOverview**
> GetFundsOverview200Response getFundsOverview()


### Example

```typescript
import {
    FundServiceApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FundServiceApi(configuration);

const { status, data } = await apiInstance.getFundsOverview();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**GetFundsOverview200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Funds overview retrieved successfully |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

