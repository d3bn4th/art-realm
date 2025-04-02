# Art Realm API Documentation

This document provides information about the available APIs in the Art Realm application.

## API Overview

Art Realm APIs provide access to artwork data, artist information, cart management, and checkout functionality. The APIs follow RESTful principles and use JSON for data exchange.

## Base URL

For local development:
```
http://localhost:3000/api
```

For production:
```
https://art-realm-production.vercel.app/api
```

## Authentication

Some API endpoints require authentication. Provide authentication token in the HTTP headers:

```
Authorization: Bearer {token}
```

## API Endpoints

### Artwork API

#### Get All Artworks

```
GET /api/artworks
```

Query Parameters:
- `page` (optional): Page number for pagination. Default: 1
- `limit` (optional): Number of artworks per page. Default: 20
- `category` (optional): Filter by category
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `sort` (optional): Sort field (e.g., 'price', 'date'). Default: 'date'
- `order` (optional): Sort order ('asc', 'desc'). Default: 'desc'

Response:
```json
{
  "artworks": [
    {
      "id": "art123",
      "title": "Sunset by the Beach",
      "description": "A beautiful sunset painting",
      "price": 299.99,
      "category": "Painting",
      "imageUrl": "/images/artworks/sunset.jpg",
      "artistId": "artist456",
      "dimensions": "24x36 inches",
      "medium": "Oil on canvas",
      "createdAt": "2023-01-15T10:30:00Z"
    },
    // More artworks...
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 98
  }
}
```

#### Get Artwork by ID

```
GET /api/artworks/{id}
```

Response:
```json
{
  "id": "art123",
  "title": "Sunset by the Beach",
  "description": "A beautiful sunset painting",
  "price": 299.99,
  "category": "Painting",
  "imageUrl": "/images/artworks/sunset.jpg",
  "artistId": "artist456",
  "artistName": "Jane Doe",
  "dimensions": "24x36 inches",
  "medium": "Oil on canvas",
  "createdAt": "2023-01-15T10:30:00Z",
  "relatedArtworks": [
    // Related artworks objects
  ]
}
```

#### Create Artwork (Authenticated - Artists only)

```
POST /api/artworks
```

Request Body:
```json
{
  "title": "New Artwork",
  "description": "Description of the artwork",
  "price": 499.99,
  "category": "Sculpture",
  "imageUrl": "/images/artworks/new-artwork.jpg",
  "dimensions": "12x8x6 inches",
  "medium": "Bronze"
}
```

Response:
```json
{
  "id": "art789",
  "title": "New Artwork",
  "description": "Description of the artwork",
  "price": 499.99,
  "category": "Sculpture",
  "imageUrl": "/images/artworks/new-artwork.jpg",
  "artistId": "artist456",
  "dimensions": "12x8x6 inches",
  "medium": "Bronze",
  "createdAt": "2024-03-16T09:45:00Z"
}
```

#### Update Artwork (Authenticated - Artist owner only)

```
PUT /api/artworks/{id}
```

Request Body: Same as Create Artwork

#### Delete Artwork (Authenticated - Artist owner only)

```
DELETE /api/artworks/{id}
```

### Artist API

#### Get All Artists

```
GET /api/artists
```

Query Parameters:
- `page` (optional): Page number for pagination
- `limit` (optional): Number of artists per page

#### Get Artist by ID

```
GET /api/artists/{id}
```

#### Get Artist's Artworks

```
GET /api/artists/{id}/artworks
```

### Cart API

#### Get Cart (Authenticated)

```
GET /api/cart
```

#### Add to Cart (Authenticated)

```
POST /api/cart
```

Request Body:
```json
{
  "artworkId": "art123",
  "quantity": 1
}
```

#### Update Cart Item (Authenticated)

```
PUT /api/cart/{itemId}
```

Request Body:
```json
{
  "quantity": 2
}
```

#### Remove from Cart (Authenticated)

```
DELETE /api/cart/{itemId}
```

### Checkout API

#### Create Checkout Session (Authenticated)

```
POST /api/checkout
```

Request Body:
```json
{
  "items": [
    {
      "artworkId": "art123",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "address": "123 Art St",
    "city": "Artville",
    "state": "AR",
    "zipCode": "12345",
    "country": "USA"
  }
}
```

## Error Handling

API errors return appropriate HTTP status codes with JSON responses:

```json
{
  "error": true,
  "message": "Descriptive error message",
  "code": "ERROR_CODE"
}
```

Common error status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API requests are limited to 100 requests per minute per IP address. Exceeding this limit will result in a 429 (Too Many Requests) response.

## Data Models

### Artwork

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| title | string | Artwork title |
| description | string | Detailed description |
| price | number | Artwork price |
| category | string | Artwork category |
| imageUrl | string | Image path |
| artistId | string | Artist identifier |
| dimensions | string | Physical dimensions |
| medium | string | Art medium used |
| createdAt | date | Creation timestamp |

### Artist

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| name | string | Artist's full name |
| bio | string | Artist biography |
| profileImage | string | Profile image path |
| location | string | Artist's location |
| joinedDate | date | Date joined platform | 