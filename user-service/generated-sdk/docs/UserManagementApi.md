# UserManagementApi

All URIs are relative to *http://localhost:3000/users*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getUserProfile**](#getuserprofile) | **GET** /profile | Get user profile|
|[**loginUser**](#loginuser) | **POST** /login | User login|
|[**logoutUser**](#logoutuser) | **POST** /logout | User logout|
|[**registerUser**](#registeruser) | **POST** /register | Register a new user|
|[**requestPasswordReset**](#requestpasswordreset) | **POST** /password/reset-request | Request password reset|
|[**resetPassword**](#resetpassword) | **POST** /password/reset | Reset password|
|[**updateUserProfile**](#updateuserprofile) | **PUT** /profile | Update user profile|

# **getUserProfile**
> GetUserProfile200Response getUserProfile()


### Example

```typescript
import {
    UserManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserManagementApi(configuration);

const { status, data } = await apiInstance.getUserProfile();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**GetUserProfile200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | User profile retrieved successfully. |  -  |
|**401** | Unauthorized |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **loginUser**
> LoginUser200Response loginUser(loginUserRequest)


### Example

```typescript
import {
    UserManagementApi,
    Configuration,
    LoginUserRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UserManagementApi(configuration);

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
|**200** | User logged in successfully. |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **logoutUser**
> LogoutUser200Response logoutUser(logoutUserRequest)


### Example

```typescript
import {
    UserManagementApi,
    Configuration,
    LogoutUserRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UserManagementApi(configuration);

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
|**200** | User logged out successfully. |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **registerUser**
> RegisterUser201Response registerUser(registerUserRequest)


### Example

```typescript
import {
    UserManagementApi,
    Configuration,
    RegisterUserRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UserManagementApi(configuration);

let registerUserRequest: RegisterUserRequest; //

const { status, data } = await apiInstance.registerUser(
    registerUserRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **registerUserRequest** | **RegisterUserRequest**|  | |


### Return type

**RegisterUser201Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | User registered successfully. |  -  |
|**400** | Bad Request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **requestPasswordReset**
> RequestPasswordReset200Response requestPasswordReset(requestPasswordResetRequest)


### Example

```typescript
import {
    UserManagementApi,
    Configuration,
    RequestPasswordResetRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UserManagementApi(configuration);

let requestPasswordResetRequest: RequestPasswordResetRequest; //

const { status, data } = await apiInstance.requestPasswordReset(
    requestPasswordResetRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestPasswordResetRequest** | **RequestPasswordResetRequest**|  | |


### Return type

**RequestPasswordReset200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Password reset email sent successfully. |  -  |
|**400** | Bad Request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **resetPassword**
> ResetPassword200Response resetPassword(resetPasswordRequest)


### Example

```typescript
import {
    UserManagementApi,
    Configuration,
    ResetPasswordRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UserManagementApi(configuration);

let resetPasswordRequest: ResetPasswordRequest; //

const { status, data } = await apiInstance.resetPassword(
    resetPasswordRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **resetPasswordRequest** | **ResetPasswordRequest**|  | |


### Return type

**ResetPassword200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Password reset successfully. |  -  |
|**400** | Bad Request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateUserProfile**
> UpdateUserProfile200Response updateUserProfile(updateUserProfileRequest)


### Example

```typescript
import {
    UserManagementApi,
    Configuration,
    UpdateUserProfileRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UserManagementApi(configuration);

let updateUserProfileRequest: UpdateUserProfileRequest; //

const { status, data } = await apiInstance.updateUserProfile(
    updateUserProfileRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateUserProfileRequest** | **UpdateUserProfileRequest**|  | |


### Return type

**UpdateUserProfile200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | User profile updated successfully. |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

