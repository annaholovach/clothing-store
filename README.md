# Online Clothing Store

## Description

An online clothing store where customers can browse and find specific clothing in their size. 
The system will provide customers with complete information and a list of clothing available according to the search criteria.

### Content: 

* [Technical requirements](#tr)
* [Implementation details](#id)
* [Endpoints:](#e) 
    + [Auth](#a)
    + [Clothing](#c)
    + [Users](#u)
    + [Orders](#or)
* [Install and run app](#i)


## <a id="tr">Technical requirements</a>

* Programming Language - TypeScript
* Framework - nest.js
* Database - postgres

### <a id="id">Implementation details</a>

#### Base URL

http://localhost:5000

## <a id="e">Endpoints:</a>

##### <a id="a">Auth</a>

###### Endpoint auth/registration

Request: POST auth/registration - registration

```
{
  "email": "email",
  "password": "password"
}
```

    Response: 

    HTTP/1.1 201 Created
    Content-Type: application/json

    {
        "access_token": "token",
    }

    HTTP/1.1 400 Bad Request
    Content-Type: application/json

    {
        "error": "user with such email already exist"
    }

###### Endpoint auth/login

Request: POST auth/login - login

```
{
  "email": "email",
  "password": "password"
}
```

    Response: 

    HTTP/1.1 200 Ok
    Content-Type: application/json

    {
        "access_token": "token",
    }

    HTTP/1.1 400 Bad Request
    Content-Type: application/json

    {
        "error": "no user with such email"
    }

##### <a id="c">Clothing</a>

###### Endpoint clothing

Request: GET clothing - get all avalible clothing

    Response: 

    HTTP/1.1 200 OK
    Content-Type: application/json

    [
        {
            "id": 1,
            "title": "Dress",
            "size": "M",
            "price": 100.0,
            "description": "Short dress with floral print"
        }
    ]

###### Endpoint clothing/:id

Request: GET clothing/:id - get clothing by id

    Response: 

    HTTP/1.1 200 OK
    Content-Type: application/json

    {
        "id": 1,
        "title": "Dress",
        "size": "M",
        "price": 100.0,
        "description": "Short dress with floral print"
    }

    HTTP/1.1 404 Not Found
    Content-Type: application/json

    {
        "error": "not foud clothing with such id"
    }

###### Endpoint clothing/search

Request: GET clothing/search - find clothing by size 

```
{
    "size": "s",
}
```

    Response: 

    HTTP/1.1 200 OK
    Content-Type: application/json

    [
        {
            "id": 2,
            "title": "Dress",
            "size": "S",
            "price": 100.0,
            "description": "White dress"
        },

        {
            "id": 3,
            "title": "Tshirt",
            "size": "S",
            "price": 20.0,
            "description": "Black t-shirt"
        }
    ]

    HTTP/1.1 404 Not Found
    Content-Type: application/json

    {
        "error": "not found clothing such size"
    }

###### Endpoint clothing

Request: POST clothing - create new items in store, this endpoint avalible only for admins

```
{
    "title": "Dress",
    "size": "M",
    "price": 100.0,
    "description": "Short dress with floral print"
}
```

    Response: 

    HTTP/1.1 201 Created
    Content-Type: application/json

    {
        "title": "Dress",
        "size": "M",
        "price": 100.0,
        "description": "Short dress with floral print"
    }

    HTTP/1.1 403 Forbidden
    Content-Type: application/json

    {
        "error": "forbidden"
    }

##### <a id="u">Users</a>

###### Endpoint users/role 

Request: PUT users/role - change role

```
{
  "role": "USER",
  "userId": 1
}
```

    Response: 

    HTTP/1.1 200 OK
    Content-Type: application/json

    HTTP/1.1 400 Bad Request
    Content-Type: application/json

    {
        "error": "invalid role value"
    }

    HTTP/1.1 404 Not Found
    Content-Type: application/json

    {
        "error": "user not found"
    }

##### <a id="or">Orders</a>

###### Endpoint orders

Request: POST orders - create an order

```
{
    "userId": 1,
    "items": [clothId1, clothId2]
    "totalPrice": 100
}
```

    Response: 

    HTTP/1.1 201 Created
    Content-Type: application/json

    {
        "id": 1
        "userId": 1,
        "items": [clothId1, clothId2]
        "totalPrice": 100
    }

    HTTP/1.1 400 Bad Request
    Content-Type: application/json

    {
        "error": "bad request"
    }

###### Endpoint orders

Request: Get orders - get all existing orders, endpoint avalible only for administrators


    Response: 

    HTTP/1.1 200 OK
    Content-Type: application/json

    [
        {
            "id": 1
            "userId": 1,
            "items": [clothId1, clothId2]
            "totalPrice": 100
            "createdAt": 2023-10-25
        }
    ]

    HTTP/1.1 403 Forbidden
    Content-Type: application/json

    {
        "error": "forbidden"
    }

###### Endpoint orders/:id

Request: Get orders/:id - get order by id, endpoint avalible only for administrators


    Response: 

    HTTP/1.1 200 OK
    Content-Type: application/json

    {
        "id": 1
        "userId": 1,
        "items": [clothId1, clothId2]
        "totalPrice": 100
        "createdAt": 2023-10-25
    }


    HTTP/1.1 403 Forbidden
    Content-Type: application/json

    {
        "error": "forbidden"
    }


## <a id="i">Install</a>

`git clone git@github.com:annaholovach/clothing-store.git`

## Go to project folder

`cd clothing-store`

## Install dependencies

`npm install`