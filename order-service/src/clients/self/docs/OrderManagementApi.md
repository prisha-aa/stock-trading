# OrderManagementApi

All URIs are relative to *http://localhost:3001/orders*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**cancelOrder**](#cancelorder) | **DELETE** /orders/{orderId} | Cancel an order|
|[**getOrderDetails**](#getorderdetails) | **GET** /orders/{orderId} | Get details of a specific order|
|[**getUserOrders**](#getuserorders) | **GET** /orders | Get all orders for a user|
|[**placeOrder**](#placeorder) | **POST** /orders | Place a buy or sell order|
|[**updateOrder**](#updateorder) | **PUT** /orders/{orderId} | Update an existing order|

# **cancelOrder**
> CancelOrder200Response cancelOrder()


### Example

```typescript
import {
    OrderManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderManagementApi(configuration);

let orderId: string; // (default to undefined)

const { status, data } = await apiInstance.cancelOrder(
    orderId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **orderId** | [**string**] |  | defaults to undefined|


### Return type

**CancelOrder200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Order cancelled successfully |  -  |
|**401** | Unauthorized |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getOrderDetails**
> OrderResponse getOrderDetails()


### Example

```typescript
import {
    OrderManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderManagementApi(configuration);

let orderId: string; // (default to undefined)

const { status, data } = await apiInstance.getOrderDetails(
    orderId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **orderId** | [**string**] |  | defaults to undefined|


### Return type

**OrderResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Order details retrieved successfully |  -  |
|**401** | Unauthorized |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUserOrders**
> Array<OrderResponse> getUserOrders()


### Example

```typescript
import {
    OrderManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderManagementApi(configuration);

const { status, data } = await apiInstance.getUserOrders();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<OrderResponse>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of user orders retrieved successfully |  -  |
|**401** | Unauthorized |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **placeOrder**
> OrderResponse placeOrder(placeOrderRequest)


### Example

```typescript
import {
    OrderManagementApi,
    Configuration,
    PlaceOrderRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderManagementApi(configuration);

let placeOrderRequest: PlaceOrderRequest; //

const { status, data } = await apiInstance.placeOrder(
    placeOrderRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **placeOrderRequest** | **PlaceOrderRequest**|  | |


### Return type

**OrderResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Order placed successfully |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateOrder**
> OrderResponse updateOrder(updateOrderRequest)


### Example

```typescript
import {
    OrderManagementApi,
    Configuration,
    UpdateOrderRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderManagementApi(configuration);

let orderId: string; // (default to undefined)
let updateOrderRequest: UpdateOrderRequest; //

const { status, data } = await apiInstance.updateOrder(
    orderId,
    updateOrderRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateOrderRequest** | **UpdateOrderRequest**|  | |
| **orderId** | [**string**] |  | defaults to undefined|


### Return type

**OrderResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Order updated successfully |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

