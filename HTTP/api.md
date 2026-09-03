### 1) Movie List Api

- URL: GET /movies

- Query Params :
````
{
  "city" : "pune",
  "page" : 1,
  "limit" : 10
  "
}
````

- Request Data : -

- Response : 
````
    [
      {
        "id" : "movie1"
        "name": "Hanuman Ansh",
        "genre": ["Devotional" , "Drama"],
        "duration" : "150min"
        "rating": 9.7,
        "language": "Hindi",
        "pagination" : {
          "curr_page": 1,
          "limit": 10,
        }
        "links" : [
          {"rel" : "first" , "href" : "/movies?city=pune&page=1&limit=10" , "method" : "GET"},
          {"rel" : "next" , "href" : "/movies?city=pune&page=2&limit=20" , "method" : "GET"},

        ]
        
        ...
      },
      ...
    ]
````

- Status Code : 200 "OK"

### 2) Get Specific Movie Api

- URL: GET /movies/{movie_id}

- Query Params : 

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

- URL: GET /movies/{movie_id}/cinemas

- Query Params :
````
{
    "date" : "02-09-2026"
    "city" : "pune"
} 
````

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
[
  {
    "date": "2026-09-02",
    "price_min": 150,
    "price_max": 400,
    "preferred_time": "evening",
    "formats": ["IMAX-3D"],
    "sort_by": "popularity"
  }
]
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
    "show_id" : "show1",
    "seats": ["B9" , "B10"],
  ]
  }
````

- Response :
````
  {
    "booking_id" : "1957"
    "total_amount": 499,
    "message": "Your booking..",
     "links": [
    { "rel": "payment", "href": "/bookings/b125/payments", "method": "POST" },
    { "rel": "update_seats", "href": "/bookings/b125/seats", "method": "PATCH" }
    ...
  },
````

- Status Code : 201 "created"


### 6) Get Seat Status of Particular Show

- URL: GET /shows/{show_id}/seats

- Query Params : -

- Request Data :

- Response :
````
  {
    "show_time" : "9:15",
    seats : [{
      "seat_id" : "B9"
      "staus": "available",
      "price": 420,
      ...
    }]
  },
````

- Status Code : 200 "OK"

### 7) Payment Api

- URL: POST bookings/{booking_id}/payments

- Header :
  Authorization : Bearer "jwt_token"

- Query Params : -

- Request Data :
````
   {
     "booking_id" : "b125",
     "payment_method" : "upi",
     "payment_amount" : 499,
     "payment_status" : "Success"
   }
````
- Response :
````
  
   {
    "payment_id" : "pay1904",
    "seat_id" : ["B9" , "B10"],
    "amount": 420,
    "links" : [   
    { "rel": "ticket", "href": "/tickets/b125", "method": "GET" },  
    ...
    }, 
  
````
- Status Code : 200 "OK"

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
  [
    {
    "rating" : 9,
    "text": "Worth to ...",
    }
  ],
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
- Status Code : 201 "Created"


### 11) Get Cast Of Movie Api

- URL: GET /movie/{movie_id}/cast

- Query Params : -

- Request Data : -

- Response :
````
  [
   {
    "name" : "Vihaan Shedge",
    "role": "Actor",
    ...
   }, 
  ...
  ],
  ````

- Status Code : 200 "OK"


### 12) User Login Api

- URL: POST /auth/login

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
- Status Code : 200 "OK"


### 13) Update booking

- URL: PATCH /bookings/{booking_id}

- Query Params : -

- Request Data :

- Response :
 ````
  {
  "seats" : ["B10" , "B15"]
  "booking_id" : "1957"
  "show_id": "show1",
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
[
  {
  "category" : "veg"
  "items": "Cheese Popcorn",
  "price": 440,
  ...
  },
]
````

- Status code : 200 "OK"

### 15) Add Snacks to Booking Api

- URL: PUT /bookings/{booking_id}

- Query Params : -

- Request Data :
  ````
  [
   {
    "category" : "veg"
    "items": "Cheese Popcorn",
    "price": 440,
    ...
   }
  ]
  ````

- Response :
````
  {
  "booking_id" : "1957"
  "show_id": "show1",
  "timing": "9:15",
  "snacks" : [
      {
         "snack_id" : "snack1"
      },
      ...
  ]
  ...
  },
 ````
- Status Code : 200 "OK"

### 16) Delete Review API

- URL: DELETE /movies/{movie_id}/reviews/{review_id}

- Query Params : -

- Request Data :

- Response :

- Status Code : 200 "OK"

### 17) Get Current Offer API

- URL: GET /offers

- Query Params : 
````
   {
     "city" : "pune",
     "date" : "2026-09-03"
   }
````

- Request Data :

- Response :
````
[
    {
      "description" : "50% Off",
      ...
    }
]
````

- Status Code : 200 "OK"

### 18) Cancel Booking API

- URL: DELETE /bookings/{booking_id}

- Query Params : -

- Request Data : - 

- Response : 
````
{
 "message" : "Cancel Booking Successfully"
 "booking_id" : "booking125"
}
````

- Status Code : 200 "OK"







  




  
  



