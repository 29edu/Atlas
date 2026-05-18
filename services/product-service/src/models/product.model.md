# product.model.js

## What is it?

    Defines the shape of a Product document in MongoDB.
    Every item listed in the Atlas store is one Product document.

## Fields

    productName
        - Required, string
        - Min 3, Max 20 characters
        - The name shown to users in the product listing

    price
        - Required, number, min 0 (cannot be negative)
        - Stored in paise (smallest currency unit), not rupees
        - Why paise? Avoids floating point issues.
          499.99 rupees stored as 49999 paise is always exact.
          0.1 + 0.2 in JavaScript = 0.30000000000000004 (floating point bug)

    image
        - Required, string
        - Stores the image URL or file path
        - Actual image files are stored separately (e.g. S3, local disk)
        - This field just points to where the image lives

    description
        - Required, min 100 characters, max 500 characters
        - Long enough to actually describe the product properly
        - 100 character minimum prevents placeholder text like "good product"

    category
        - String, no enum constraint yet
        - Groups products: "Electronics", "Clothing", etc.
        - No enum here means any string is accepted (easy to extend)

    stock
        - Number, tracks how many units are available
        - Goes down when orders are placed (inventory management)

## timestamps: true
    MongoDB auto-adds createdAt and updatedAt.
    Useful for sorting products by "newest first".
