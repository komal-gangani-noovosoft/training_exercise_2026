### 1) Movie List Api

- URL: GET /movies

- Query Params : -

- Request Data : -

- Response : 
````
    {
      {
        "id" : "movie1"
        "name": "Hanuman Ansh",
        "genre": ["Devotional" , "Drama"],
        "rating": 9.7,
        "language": "Hindi",
        ...
      },
      ...
    }
````

- Status Code : 200 "OK"

### 2) Get Specific Movie Api

- URL: GET /movies/{id}

- Query Params : {"id" : "id"}

- Request Data : -

- Response : 
````
  {
    "id" : "movie1"
    "name": "Hanuman Ansh",
    "genre": ["Devotional" , "Drama"],
    "rating": 9.7,
    "language": "Hindi",
    "cast" : ["" , ...]
    ...
  },
````
- Status Code : 200 "OK"
  
### 3) Get cinemas to show a movie

- URL: GET /movies/{id}/cinemas

- Query Params : {"id" : id , "date" : "02-09-2026"} 

- Request Data : -

- Response :
````
  {
    "id" : "cinema1"
    "name": "INOX Megaplex",
    "city": "Mumbai",
    ...
  },
````
- Status Code : 200 "OK"


### 4) Get List of shows api

- URL: GET /movies/{id}/shows

- Query Params :
````
  {
    "date": "2026-09-02",
    "price_min": 150,
    "price_max": 400,
    "preferred_time": "evening",
    "formats": ["IMAX-3D"],
    "sort_by": "popularity"
  }
````

- Request Data : -


- Response :
````
  {
    "id" : "movie1"
    "name": "Hanuman Ansh",
    "genre": ["Devotional" , "Drama"],
    "rating": 9.7,
    "language": "Hindi",
    "cast" : ["" , ...]
    ...
  },
````
- Status Code : 200 "OK"


### 5) Booking Show Api

- URL: POST /bookings

- Header:
  Authorization : Bearer "jwt_token"

- Query Params : -

- Request Data :
````
  {
    "show_id": "show1",
    "seats": ["B9" , "B10"],
  }
````

- Response :
````
  {
    "booking_id" : "1957"
    "total_amount": 499,
    "message": "Your booking..",
    ...
  },
````

- Status Code : 201 "created"
                401 "unauthorized"


  
### 6) Get Seat Status of Particular Show

- URL: GET /shows/{id}

- Query Params : -

- Request Data :

- Response :
````
  {
    "show_time" : "9:15",
    seats : {
      "seat_id" : "B9"
      "staus": "available",
      "price": 420,
      ...
    }
  },
````

- Status Code : 200 "OK"
              : 404 "Not Found"


### 7) Payment Api

- URL: GET /payments

- Header :
  Authorization : Bearer "jwt_token"


- Query Params : -

- Request Data :
````
   {
     "booking_id" : "1957",
     "payment_method" : "upi",
     "payment_amount" : 499,
     "payment_status" : "Success"
   }
````
- Response :
````
  {
   {
    "seat_id" : "B9"
    "staus": "available",
    "price": 420,
    ...
    }, 
    ...
  },
````
- Status Code : 200 "OK"
              : 401 "Unauthorized"

### 8) Get Ticket Api

- URL: GET /tickets/{booking_id}

- Query Params : -

- Request Data : -

- Response :
````
  {
  "show_id" : "show1"
  "seats": ["B9" , "B10"],
  "show_time": "9:15",
   ...
  },
````

- Status Code : 200 "OK"
              

### 9) Get Reviews of movie

- URL: GET /movies/{movie_id}/reviews

- Query Params : -

- Request Data : -

- Response :
````
  {
    {
    "rating" : 9,
    "text": "Worth to ...",
    }
  },
````

- Status Code : 200 "OK"


### 10) Give Review

- URL: POST /movies/{movie_id}/reviews

- Query Params : -

- Request Data : 
````
  {
  "user_id" : "user1",
  "rating" : 9.5,
  "text" : "This movie is..."
  }
````
- Response :
 ````
  {
    "review_id" : "review19",
    "movie_id" : "movie1",
    "rating" : 9,
    "text": "Worth to ...",
  },
  ````
- Status Code : 200 "OK"


### 11) Get Cast Of Movie Api

- URL: GET /movie/{movie_id}/cast

- Query Params : -

- Request Data : -

- Response :
````
  {
   {
    "name" : "Vihaan Shedge",
    "role": "Actor",
    ...
   }, 
  ...
  },
  ````

- Status Code : 200 "OK"


### 12) User Login Api

- URL: POST /auth/user_details

- Query Params : -

- Request Data : 
````
  {
    "email" : "abc@gmail.com",
    "mobile_no" : "9876543210"
  }
````
- Response :
````
  {
  "token" : "jwt_token",
  "user_id" : "user2",
  "email": "abc@gmail.com",
  ...
  },
````


### 13) Get Booking Details

- URL: GET /bookings/{booking_id}

- Query Params : -

- Request Data :

- Response :
 ````
  {
  "booking_id" : "1957"
  "show_id": "show1",
  "timing": "9:15",
  ...
  },
  ````
- Status Code : 200 "OK"


### 14) Get Snacks Api

- URL: GET /cinemas/{cinema_id}/snacks

- Query Params : -

- Request Data :

- Response :
  ````
  {
  "category" : "veg"
  "items": "Cheese Popcorn",
  "price": 440,
  ...
  },
  ````

- Status code : 200 "OK"

### 15) Add Snacks to Booking Api

- URL: PUT /bookings/{booking_id}

- Query Params : -

- Request Data :
  ````
  {
   {
    "category" : "veg"
    "items": "Cheese Popcorn",
    "price": 440,
    ...
   }
  }
  ````

- Response :
  ````
  {
  "booking_id" : "1957"
  "show_id": "show1",
  "timing": "9:15",
  ...
  },
  ````
- Status Code : 200 "OK"

  




  
  



