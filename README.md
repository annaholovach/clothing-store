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
    + [Roles](#r)
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

Request: POST users/role - add role

```
{
  "value": "ADMIN",
  "userId": 1
}
```

    Response: 

    HTTP/1.1 200 OK
    Content-Type: application/json

    HTTP/1.1 400 Bad Request
    Content-Type: application/json

    {
        "error": "no user with such id"
    }

###### Endpoint users/role 

Request: PUT users/role - change role

```
{
  "value": "USER",
  "userId": 1
}
```

    Response: 

    HTTP/1.1 200 OK
    Content-Type: application/json

    HTTP/1.1 400 Bad Request
    Content-Type: application/json

    {
        "error": "no user with such id"
    }

##### <a id="r">Roles</a>

###### Endpoint roles

Request: POST roles - create role

```
{
  "value": "ADMIN",
  "description": "administrator"
}
```

    Response: 

    HTTP/1.1 201 Created
    Content-Type: application/json

    {
        "id": 1,
        "value": "ADMIN",
        "description": "administrator"
    }

###### Endpoint roles/:value

Request: GET roles/:value - get role by value

    Response: 

    HTTP/1.1 200 OK
    Content-Type: application/json

    {
        "id": 1,
        "value": "ADMIN",
        "description": "admin"
    }

    HTTP/1.1 404 Not Found
    Content-Type: application/json

    {
        "error": "role does not exist"
    }

## <a id="i">Install</a>

`git clone git@github.com:annaholovach/clothing-store.git`

## Go to project folder

`cd clothing-store`

## Install dependencies

`npm install`