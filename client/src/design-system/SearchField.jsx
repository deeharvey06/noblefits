import IconButton from "./IconButton";

const SearchField = ({
  id = "site-search",
  label = "Search",
  value,
  onChange,
  onSubmit,
  placeholder = "Search products",
  loading = false,
  disabled = false,
  error = false,
  className = "",
  ...props
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSubmit) onSubmit(event);
  };

  return (
    <form
      className={`ds-search ${error ? "ds-search--error" : ""} ${className}`.trim()}
      role="search"
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <span className="ds-search__icon" aria-hidden="true">
        ⌕
      </span>
      <input
        id={id}
        className="ds-search__input"
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={error}
        {...props}
      />
      <IconButton
        type="submit"
        label="Submit search"
        size="sm"
        loading={loading}
        disabled={disabled}
      >
        <span aria-hidden="true">→</span>
      </IconButton>
    </form>
  );
};

export default SearchField;
