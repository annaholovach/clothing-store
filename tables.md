### 1. Users 

##### Table users with contains information about users

| Key | Column Name | Data Type | Description                        | 
| --- | ----------- | --------- | ---------------------------------- |
| PK  | id          | int       | Primary key for Users Record       |
|     | email       | varchar   | User`s email                       |
|     | password    | varchar   | User`s password                    |
|     | role        | enum      | User`s role                        |

### 2. Cloth

##### Table cloth with contains information about clothing

| Key | Column Name | Data Type | Description                        | 
| --- | ----------- | --------- | ---------------------------------- |
| PK  | id          | int       | Primary key for Clothing Record    |
|     | title       | varchar   | Title of the product               |
|     | size        | varchar   | Avalible size                      |
|     | price       | int       | Price of item                      |
|     | description | varchar   | Description of item                |
|     | image       | varchar   | Image with item                    |

### 3. Orders

##### Table orders with contains information about orders

| Key | Column Name | Data Type | Description                        | 
| --- | ----------- | --------- | ---------------------------------- |
| PK  | id          | int       | Primary key for Order Record       |
| FK  | userId      | int       | User`s id                          |
|     | items       | jsonb     | List of clothing in order          |
|     | totalPrice  | decimal   | Total price of the order           |
|     | createdAt   | timestamp | Date when the order was created    |

### 4. Cloth_order

##### Intermediate table for connection tables cloth and orders

| Key | Column Name | Data Type | Description                        | 
| --- | ----------- | --------- | ---------------------------------- |
| PK  | id          | int       | Primary key for Cloth_order Record |
| FK  | clothId     | int       | Cloth record id                    |
| FK  | orderId     | int       | Order record id                    |
|     | amout       | int       | Amount of items in order           |

* User can have multiple orders associated with them (one-to-many) at Orders(userId)
* Item of cloth can be in multiple orders and in one order can be multiple items of clothing (many-to-many) at Cloth_order (clothId, orderId)
