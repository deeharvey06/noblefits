import { useState } from "react";

import IconButton from "@/design-system/IconButton";

export const Breadcrumbs = ({ items, className = "" }) => (
  <nav className={`ds-breadcrumbs ${className}`.trim()} aria-label="Breadcrumb">
    <ol className="ds-breadcrumbs__list">
      {items.map((item, index) => {
        const isCurrent = index === items.length - 1;
        return (
          <li className="ds-breadcrumbs__item" key={`${item.label}-${index}`}>
            {isCurrent ? (
              <span aria-current="page">{item.label}</span>
            ) : (
              <a href={item.href} onClick={item.onClick}>
                {item.label}
              </a>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

export const Pagination = ({
  page,
  pageCount,
  onPageChange,
  disabled = false,
  className = "",
}) => {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
  const goTo = (nextPage) => {
    if (!disabled && nextPage >= 1 && nextPage <= pageCount) {
      onPageChange(nextPage);
    }
  };

  return (
    <nav
      className={`ds-pagination ${className}`.trim()}
      aria-label="Pagination"
    >
      <IconButton
        label="Previous page"
        onClick={() => goTo(page - 1)}
        disabled={disabled || page <= 1}
      >
        <span aria-hidden="true">←</span>
      </IconButton>
      <div className="ds-pagination__pages">
        {pages.map((pageNumber) => (
          <button
            type="button"
            key={pageNumber}
            className="ds-pagination__page"
            aria-current={pageNumber === page ? "page" : undefined}
            onClick={() => goTo(pageNumber)}
            disabled={disabled}
          >
            {pageNumber}
          </button>
        ))}
      </div>
      <IconButton
        label="Next page"
        onClick={() => goTo(page + 1)}
        disabled={disabled || page >= pageCount}
      >
        <span aria-hidden="true">→</span>
      </IconButton>
    </nav>
  );
};

export const Tabs = ({
  items,
  activeId,
  onChange,
  idPrefix = "ds-tabs",
  className = "",
}) => {
  if (!items.length) return null;

  const activeItem = items.find((item) => item.id === activeId) || items[0];

  const handleKeyDown = (event) => {
    const enabledItems = items.filter((item) => !item.disabled);
    if (!enabledItems.length) return;

    const currentIndex = enabledItems.findIndex(
      (item) => item.id === activeItem.id,
    );

    let nextIndex = currentIndex;
    if (event.key === "ArrowRight")
      nextIndex = (currentIndex + 1) % enabledItems.length;
    if (event.key === "ArrowLeft") {
      nextIndex =
        (currentIndex - 1 + enabledItems.length) % enabledItems.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = enabledItems.length - 1;

    if (nextIndex !== currentIndex) {
      event.preventDefault();
      const nextItem = enabledItems[nextIndex];
      if (onChange) onChange(nextItem.id);
      const nextTab = document.getElementById(`${idPrefix}-tab-${nextItem.id}`);
      if (nextTab) nextTab.focus();
    }
  };

  return (
    <div className={`ds-tabs ${className}`.trim()}>
      <div className="ds-tabs__list" role="tablist" onKeyDown={handleKeyDown}>
        {items.map((item) => {
          const selected = item.id === activeItem.id;
          return (
            <button
              type="button"
              key={item.id}
              id={`${idPrefix}-tab-${item.id}`}
              className="ds-tabs__tab"
              role="tab"
              aria-selected={selected}
              aria-controls={`${idPrefix}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              disabled={item.disabled}
              onClick={() => onChange && onChange(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {activeItem && (
        <div
          id={`${idPrefix}-panel-${activeItem.id}`}
          className="ds-tabs__panel"
          role="tabpanel"
          aria-labelledby={`${idPrefix}-tab-${activeItem.id}`}
        >
          {activeItem.panel}
        </div>
      )}
    </div>
  );
};

export const Accordion = ({
  items,
  allowMultiple = false,
  defaultOpenIds = [],
  idPrefix = "ds-accordion",
  className = "",
}) => {
  const [openIds, setOpenIds] = useState(defaultOpenIds);

  const toggleItem = (id) => {
    setOpenIds((current) => {
      const isOpen = current.includes(id);
      if (isOpen) return current.filter((openId) => openId !== id);
      return allowMultiple ? [...current, id] : [id];
    });
  };

  return (
    <div className={`ds-accordion ${className}`.trim()}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <section className="ds-accordion__item" key={item.id}>
            <h3 className="ds-accordion__heading">
              <button
                type="button"
                id={`${idPrefix}-trigger-${item.id}`}
                className="ds-accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={`${idPrefix}-panel-${item.id}`}
                onClick={() => toggleItem(item.id)}
                disabled={item.disabled}
              >
                <span>{item.label}</span>
                <span className="ds-accordion__indicator" aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={`${idPrefix}-panel-${item.id}`}
              className="ds-accordion__panel"
              role="region"
              aria-labelledby={`${idPrefix}-trigger-${item.id}`}
              hidden={!isOpen}
            >
              {item.content}
            </div>
          </section>
        );
      })}
    </div>
  );
};
