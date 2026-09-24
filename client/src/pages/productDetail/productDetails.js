export const normalizeSpecifications = (specifications) => {
  if (!specifications) return [];
  if (Array.isArray(specifications)) {
    return specifications
      .map((item) =>
        typeof item === "string"
          ? { label: "Detail", value: item }
          : { label: item?.label, value: item?.value },
      )
      .filter((item) => item.label && item.value);
  }

  if (typeof specifications === "object") {
    return Object.entries(specifications).map(([label, value]) => ({
      label,
      value,
    }));
  }

  return [];
};
