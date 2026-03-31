# 🎬 Atlas Movies – Smart Movie Search App

Discover your next favorite film with a powerful and intelligent movie search experience built using MongoDB Atlas Search.

---

## Features

**Autocomplete Search**

* Suggests movie names as you type
* Uses edgeGram tokenization for fast results

**Fuzzy Search**

* Handles typos (e.g., `Incption` → `Inception`)
* Uses Levenshtein Distance for smart matching

**Advanced Filtering**

* Filter by **Year**
* Filter by **Minimum Rating (0–10)**

**Dynamic Results UI**

* Displays movie posters, ratings, genres, and descriptions
* Clean card-based layout

**Fast & Scalable**

* Powered by MongoDB Atlas Search indexing
* Optimized for real-time search experience

---

## How It Works

1. User enters a movie name in the search bar
2. MongoDB Atlas Search processes the query using:

   * Autocomplete (edgeGram)
   * Fuzzy matching (edit distance)
3. Matching results are fetched instantly
4. UI dynamically renders movie cards

---

## Tech Stack

* Frontend: HTML, CSS, JavaScript
* Backend: Node.js / Express
* Database: MongoDB Atlas
* Search Engine: Atlas Search

---

## Sample Query (MongoDB Atlas Search)

```json
{
  "$search": {
    "index": "default",
    "compound": {
      "should": [
        {
          "autocomplete": {
            "query": "inception",
            "path": "title",
            "fuzzy": {
              "maxEdits": 2
            }
          }
        }
      ]
    }
  }
}
```

---

## UI Preview


![alt text](<WhatsApp Image 2026-03-31 at 1.47.20 PM.jpeg>)

![alt text](<Screenshot 2026-03-31 134646.png>)

![alt text](<Screenshot 2026-03-31 134653.png>)

### Search Interface

* Smart search bar with autocomplete
* Filters for year and rating

### Results Display

* Movie posters with rating ⭐
* Genres and descriptions
* Clean responsive layout

---

## Example Use Case

Input: `Incption`
Output: `Inception (2010)`

This shows how fuzzy search corrects user mistakes automatically.


---

## Author


Team: *Movie Mavericks* 🎯

---


## ⭐ Conclusion

This project demonstrates how MongoDB Atlas Search can be used to build a **fast, intelligent, and user-friendly movie search system** with real-time suggestions and typo tolerance.

---
