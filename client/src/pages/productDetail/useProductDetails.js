import { useMemo, useState } from "react";
import { useCatalog } from "@/hooks/useCatalog";
import { useCartActions } from "@/hooks/useCartActions";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import {
  findProductByRoute,
  getProductImages,
  getRelatedProducts,
  normalizeCollectionDisplayTitle,
} from "@/utils/productRoutes";
import { normalizeSpecifications } from "@/pages/productDetail/productDetails";

export const useProductDetails = (collectionId, productId) => {
  const { collections, isFetching, errorMessage, retry } = useCatalog();
  const { addToCart } = useCartActions();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addedMessage, setAddedMessage] = useState("");

  const { collection, product } = useMemo(
    () => findProductByRoute(collections, collectionId, productId),
    [collectionId, collections, productId],
  );

  const images = useMemo(() => getProductImages(product), [product]);
  const relatedProducts = useMemo(
    () => getRelatedProducts(collection, productId, 4),
    [collection, productId],
  );

  useDocumentTitle(product ? `${product.name} | Noble Fits` : null);
  const collectionTitle = normalizeCollectionDisplayTitle(collection?.title);
  const isUnavailable =
    product?.available === false || product?.inStock === false;
  const availabilityLabel =
    product?.availability ||
    (typeof product?.inStock === "boolean"
      ? product?.inStock
        ? "In stock"
        : "Unavailable"
      : null);
  const specifications = normalizeSpecifications(product?.specifications);

  const addQuantityToCart = () => {
    if (!product || isUnavailable) return;
    addToCart(product, quantity);
    setAddedMessage(
      `${quantity} ${quantity === 1 ? "item" : "items"} added to your bag.`,
    );
  };

  return {
    collections,
    isFetching,
    errorMessage,
    retry,
    product,
    collection,
    quantity,
    setQuantity,
    activeImageIndex,
    setActiveImageIndex,
    addedMessage,
    setAddedMessage,
    images,
    relatedProducts,
    collectionTitle,
    isUnavailable,
    availabilityLabel,
    specifications,
    addQuantityToCart,
  };
};
