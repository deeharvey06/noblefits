const ProductInformation = ({ product, specifications }) => {
  if (
    !specifications.length &&
    !product.shippingInfo &&
    !product.returnsInfo &&
    !product.trustInfo
  )
    return null;
  return (
    <section
      className="product-information"
      aria-labelledby="product-information-title"
    >
      <div className="product-information__heading">
        <span className="product-detail-eyebrow">Product information</span>
        <h2 id="product-information-title">Details that matter.</h2>
      </div>

      <div className="product-information__grid">
        {specifications.length > 0 && (
          <div className="product-information__block">
            <h3>Specifications</h3>
            <dl className="product-specifications">
              {specifications.map(({ label, value }) => (
                <div key={`${label}-${value}`}>
                  <dt>{label}</dt>
                  <dd>{String(value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        {product.shippingInfo && (
          <div className="product-information__block">
            <h3>Shipping</h3>
            <p>{product.shippingInfo}</p>
          </div>
        )}
        {product.returnsInfo && (
          <div className="product-information__block">
            <h3>Returns</h3>
            <p>{product.returnsInfo}</p>
          </div>
        )}
        {product.trustInfo && (
          <div className="product-information__block">
            <h3>Purchase information</h3>
            <p>{product.trustInfo}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductInformation;
