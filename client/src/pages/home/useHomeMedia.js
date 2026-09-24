import { useSelector } from "react-redux";
import { useCatalog } from "@/hooks/useCatalog";
import { selectDirectorySections } from "@/redux/directory/directorySelector";
import { getLocalCatalog } from "@/redux/shop/catalogFallback";
import { buildHomepageMedia } from "@/pages/home/homeMedia";

const LOCAL_CATALOG = getLocalCatalog();

export const useHomeMedia = () => {
  const { collections } = useCatalog();
  const sections = useSelector(selectDirectorySections);
  return buildHomepageMedia(
    collections || LOCAL_CATALOG,
    sections.map(({ imageUrl }) => imageUrl),
  );
};
