import Button from "@/design-system/Button";

import "./customButton.scss";

// Compatibility adapter for existing page code. New components should import
// Button directly from the design system.
const CustomButton = ({
  children,
  isGoogleSignIn,
  inverted,
  className = "",
  ...otherProps
}) => (
  <Button
    variant={inverted ? "secondary" : "primary"}
    className={`${isGoogleSignIn ? "google-sign-in" : ""} custom-button ${className}`.trim()}
    {...otherProps}
  >
    {children}
  </Button>
);

export default CustomButton;
