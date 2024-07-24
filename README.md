# Mula HTTP Client

## Create an instance

```javascript
import mula from 'mula'

const http = mula.create({
  baseURL: 'https://some-domain.com/api'
})
```

## Do a request

**GET**

```javascript
http.get()

http.get('data.some.key')
```

**POST**

```javascript
http.post(payload)
```

**PUT**

```javascript
http.put(payload)
```

**PATCH**

```javascript
http.path(id).patch(payload)

http.patch(payload, id)
```

**DELETE**

```javascript
http.path(id).delete()

http.delete(id)
```

## Cancellable Requests

```javascript
http.cancellable('someUniqKey').get()
```

## Query parameters

```javascript
http.query({ limit: 10, offset: 4 }).get()
```

## API Reference

| Method        | Description                                                                             |
| ------------- | --------------------------------------------------------------------------------------- |
| `create`      | Create a `mula` instance with defaults configs                                          |
| `path`        | Sets a custom path for a given resource. I'll be appended to the baseURL default config |
| `cancellable` | Makes a cancellable request                                                             |
| `query`       | Sets query parameters passing an object                                                 |
| `get`         | Performs a GET request                                                                  |
| `post`        | Performs a POST request                                                                 |
| `put`         | Performs a PUT request                                                                  |
| `patch`       | Performs a PATCH request                                                                |
| `delete`      | Performs a DELETE request                                                               |
