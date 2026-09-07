import { RiArrowLeftLine } from "@remixicon/react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/base/buttons/button";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background-full p-6 text-center">
      <p className="text-caption-1-semibold text-text-tertiary">404</p>
      <h1 className="text-title-2-medium text-text-primary">Page not found</h1>
      <p className="max-w-sm text-body-regular text-text-secondary">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Button variant="secondary" leadingIcon={RiArrowLeftLine} onClick={() => navigate("/")}>
        Back home
      </Button>
    </div>
  );
}
