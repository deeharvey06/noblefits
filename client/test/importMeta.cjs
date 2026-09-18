// Jest runs outside Vite: provide test environment values and disable HMR.
module.exports = ({ types: t }) => ({
  visitor: {
    MetaProperty(path) {
      if (
        path.node.meta.name !== "import" ||
        path.node.property.name !== "meta"
      )
        return;
      const env = {
        ...Object.fromEntries(
          Object.entries(process.env).filter(([key]) =>
            key.startsWith("VITE_"),
          ),
        ),
        MODE: "test",
        DEV: true,
        PROD: false,
        SSR: false,
        BASE_URL: "/",
      };
      path.replaceWith(
        t.objectExpression([
          t.objectProperty(t.identifier("env"), t.valueToNode(env)),
        ]),
      );
    },
  },
});
