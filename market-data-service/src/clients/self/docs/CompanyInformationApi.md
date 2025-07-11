# CompanyInformationApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getCompanyProfile**](#getcompanyprofile) | **GET** /companies/{symbol}/profile | Get company profile and financial statements|

# **getCompanyProfile**
> GetCompanyProfile200Response getCompanyProfile()


### Example

```typescript
import {
    CompanyInformationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CompanyInformationApi(configuration);

let symbol: string; //Stock symbol (e.g., AAPL). (default to undefined)

const { status, data } = await apiInstance.getCompanyProfile(
    symbol
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **symbol** | [**string**] | Stock symbol (e.g., AAPL). | defaults to undefined|


### Return type

**GetCompanyProfile200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful retrieval of company profile. |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

