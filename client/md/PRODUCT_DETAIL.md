# Noble Fits — Phase 8 Product Detail Page

## Purpose

Phase 8 turns each existing catalog item into a dedicated conversion surface without inventing commerce data the application does not own.

## Product route

Products now use the stable existing collection + product ID shape:

`/shop/:collectionId/:productId`

Examples:

- `/shop/sneakers/13`
- `/shop/jackets/18`
- `/shop/mens/31`

The route is entirely client-side and uses the already-loaded Firestore collection data. No API, schema, or backend route was added.

## Current catalog capabilities

The real catalog currently supplies:

- product ID
- product name
- one product image
- price
- collection membership

The PDP therefore always renders those fields and the existing cart action.

## Optional fields supported only when real data exists

The PDP is prepared to render the following fields when the product object genuinely provides them:

- `images` for a multi-image gallery + thumbnails
- `compareAtPrice` for real sale pricing
- `rating` / `reviewCount`
- `badge` / `badgeVariant`
- `available`, `inStock`, or `availability`
- `description`
- `specifications`
- `shippingInfo`
- `returnsInfo`
- `trustInfo`

No placeholders or synthetic values are generated for these fields.

## Deliberately omitted

The current Noble Fits catalog does not support these capabilities, so Phase 8 does not fabricate them:

- sizes
- colors
- variants
- product options
- reviews
- stock quantities
- sale prices / discounts
- shipping promises
- returns guarantees
- product specifications
- descriptions
- Buy Now

`Buy Now` is intentionally omitted because the current commerce architecture supports Add to Cart → Cart/Checkout, not a distinct direct-purchase flow.

## Conversion hierarchy

The PDP prioritizes:

1. product image
2. collection context
3. product title
4. price
5. optional real commerce states
6. quantity
7. Add to Bag
8. feedback + path to the bag
9. same-collection related products

On tablet/mobile the primary purchase action becomes a fixed sticky bar with the current price and selected quantity.

## Product gallery

The current dataset has one image per product, so the gallery renders one large product image with no fake duplicate thumbnails.

If a real `images` array is introduced later, the gallery automatically exposes thumbnail selection.

## Related products

Related products are not algorithmic recommendations. They are simply up to four other real products from the same collection, preserving a truthful merchandising relationship without claiming personalization or popularity.

## Trust information

The only universal trust statement shown is factual to the existing implementation: card entry at checkout is handled through Stripe.

Shipping/returns promises are not shown because the application does not currently provide those policies as product data.

## Preserved boundaries

Phase 8 does not change:

- Express
- `/payment`
- Stripe server charge behavior
- Firebase schema
- authentication
- product schema
- pricing logic
- cart calculations
- checkout calculations
- inventory logic
- shipping/tax logic
