# DefaultApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**loginUser**](#loginuser) | **POST** /login | User login|
|[**logoutUser**](#logoutuser) | **POST** /logout | User logout|

# **loginUser**
> LoginUser200Response loginUser(loginUserRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    LoginUserRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let loginUserRequest: LoginUserRequest; //

const { status, data } = await apiInstance.loginUser(
    loginUserRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginUserRequest** | **LoginUserRequest**|  | |


### Return type

**LoginUser200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Login successful |  -  |
|**400** | Validation error |  -  |
|**401** | Invalid credentials |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **logoutUser**
> LogoutUser200Response logoutUser(logoutUserRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    LogoutUserRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let logoutUserRequest: LogoutUserRequest; //

const { status, data } = await apiInstance.logoutUser(
    logoutUserRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **logoutUserRequest** | **LogoutUserRequest**|  | |


### Return type

**LogoutUser200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successfully logged out |  -  |
|**400** | Missing token or bad request |  -  |
|**500** | Logout failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

