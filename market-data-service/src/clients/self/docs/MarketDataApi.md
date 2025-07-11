# MarketDataApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getHistoricalData**](#gethistoricaldata) | **GET** /market-data/history/{symbol} | Get historical stock data for a symbol|
|[**getMarketQuotes**](#getmarketquotes) | **GET** /market-data/quotes | Get real-time stock prices and quotes|

# **getHistoricalData**
> GetHistoricalData200Response getHistoricalData()


### Example

```typescript
import {
    MarketDataApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MarketDataApi(configuration);

let symbol: string; //Stock symbol (e.g., AAPL). (default to undefined)
let range: '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '5y' | 'max'; //Time range for historical data. (optional) (default to undefined)
let interval: '1m' | '2m' | '5m' | '15m' | '30m' | '60m' | '90m' | '1h' | '1d' | '5d' | '1wk' | '1mo' | '3mo'; //Data interval. (optional) (default to undefined)

const { status, data } = await apiInstance.getHistoricalData(
    symbol,
    range,
    interval
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **symbol** | [**string**] | Stock symbol (e.g., AAPL). | defaults to undefined|
| **range** | [**&#39;1d&#39; | &#39;5d&#39; | &#39;1mo&#39; | &#39;3mo&#39; | &#39;6mo&#39; | &#39;1y&#39; | &#39;5y&#39; | &#39;max&#39;**]**Array<&#39;1d&#39; &#124; &#39;5d&#39; &#124; &#39;1mo&#39; &#124; &#39;3mo&#39; &#124; &#39;6mo&#39; &#124; &#39;1y&#39; &#124; &#39;5y&#39; &#124; &#39;max&#39;>** | Time range for historical data. | (optional) defaults to undefined|
| **interval** | [**&#39;1m&#39; | &#39;2m&#39; | &#39;5m&#39; | &#39;15m&#39; | &#39;30m&#39; | &#39;60m&#39; | &#39;90m&#39; | &#39;1h&#39; | &#39;1d&#39; | &#39;5d&#39; | &#39;1wk&#39; | &#39;1mo&#39; | &#39;3mo&#39;**]**Array<&#39;1m&#39; &#124; &#39;2m&#39; &#124; &#39;5m&#39; &#124; &#39;15m&#39; &#124; &#39;30m&#39; &#124; &#39;60m&#39; &#124; &#39;90m&#39; &#124; &#39;1h&#39; &#124; &#39;1d&#39; &#124; &#39;5d&#39; &#124; &#39;1wk&#39; &#124; &#39;1mo&#39; &#124; &#39;3mo&#39;>** | Data interval. | (optional) defaults to undefined|


### Return type

**GetHistoricalData200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful retrieval of historical data. |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMarketQuotes**
> Array<GetMarketQuotes200ResponseInner> getMarketQuotes()


### Example

```typescript
import {
    MarketDataApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MarketDataApi(configuration);

let symbols: Array<string>; //Comma-separated list of stock symbols (e.g., AAPL,GOOGL). (optional) (default to undefined)

const { status, data } = await apiInstance.getMarketQuotes(
    symbols
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **symbols** | **Array&lt;string&gt;** | Comma-separated list of stock symbols (e.g., AAPL,GOOGL). | (optional) defaults to undefined|


### Return type

**Array<GetMarketQuotes200ResponseInner>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful retrieval of real-time quotes. |  -  |
|**400** | Bad Request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

