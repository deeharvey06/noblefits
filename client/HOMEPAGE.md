# Noble Fits Homepage — Phase 5

## Purpose

The homepage is designed around product discovery and merchandising using only capabilities and data that already exist in Noble Fits.

## Homepage architecture

1. **Editorial hero** — establishes the Noble Fits point of view and provides direct entry to the catalog, Women, and Men using existing collection imagery.
2. **Category discovery** — exposes all five existing collections with product-led image tiles: Hats, Jackets, Sneakers, Women, and Men.
3. **The Noble Edit** — surfaces four real products from four different current Firestore collections. This is an editorial selection, not a popularity or recency claim.
4. **Collection focus** — gives Jackets a larger editorial moment using the existing jacket collection image and only product types visibly supported by the catalog.
5. **Catalog close** — provides one clear path to browse the complete Shop after the merchandising story.

## Supported vs intentionally omitted content

| Homepage idea | Decision | Reason |
| --- | --- | --- |
| Hero / campaign | Included | Existing collection imagery supports an editorial campaign-style entry point. |
| Featured products | Included as an editorial edit | Real catalog items are available. No popularity claim is made. |
| Featured categories | Included | Five real categories already exist. |
| Collections | Included | Existing routes and directory data support direct collection navigation. |
| New arrivals | Omitted | The product model has no arrival/published timestamp. |
| Best sellers | Omitted | No sales-ranking or order-volume data exists on the frontend. |
| Promotions | Omitted | No supported promotion/coupon campaign data is present. |
| Recommendations | Omitted | No recommendation capability or customer-affinity data exists. |
| Editorial content | Included | Category/catalog facts support restrained collection storytelling. |
| Trust messaging | Omitted | No shipping, returns, guarantee, or service policy data was provided. |
| Social proof | Omitted | No review, rating, testimonial, or customer-count data exists. |

## UX decisions

- Product imagery remains the dominant source of color and visual interest.
- Primary commerce actions are always visible; no homepage purchase action depends on hover.
- Category imagery uses semantic `<img>` elements inside accessible buttons rather than CSS-only backgrounds.
- Firestore catalog loading is progressive: category discovery remains usable even if the featured-product request fails.
- A Firestore failure does not auto-retry indefinitely; the user controls retry through an explicit action.
- Mobile keeps two product columns but removes the design-system button minimum width inside that grid to prevent horizontal overflow.
- The homepage uses no fabricated discounts, inventory states, reviews, shipping promises, urgency, bestseller labels, or new-arrival labels.

## Data and business logic

No data model, API contract, Firebase collection structure, Redux cart calculation, pricing logic, authentication logic, or Stripe/payment logic was changed in Phase 5.
