import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const SubmitButton = ({
  loading,
  label,
  className,
}: {
  loading: boolean;
  label: string;
  className?: string;
}) => {
  return (
    <Button disabled={loading} type="submit" className={className}>
      {loading && <Loader2 className="size-4 animate-spin" />}
      {label}
    </Button>
  );
};

export default SubmitButton;
