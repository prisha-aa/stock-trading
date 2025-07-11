# PortfolioManagementApi

All URIs are relative to *http://localhost:3002/portfolio*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getUserPortfolio**](#getuserportfolio) | **GET** /portfolio | Retrieve user\&#39;s current portfolio|
|[**getUserPortfolioSummary**](#getuserportfoliosummary) | **GET** /portfolio-summary | Retrieve combined portfolio transactions and performance summary|

# **getUserPortfolio**
> GetUserPortfolio200Response getUserPortfolio()


### Example

```typescript
import {
    PortfolioManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PortfolioManagementApi(configuration);

const { status, data } = await apiInstance.getUserPortfolio();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**GetUserPortfolio200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Portfolio retrieved successfully |  -  |
|**401** | Unauthorized |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUserPortfolioSummary**
> GetUserPortfolioSummary200Response getUserPortfolioSummary()


### Example

```typescript
import {
    PortfolioManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PortfolioManagementApi(configuration);

const { status, data } = await apiInstance.getUserPortfolioSummary();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**GetUserPortfolioSummary200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Portfolio summary retrieved successfully |  -  |
|**401** | Unauthorized |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

