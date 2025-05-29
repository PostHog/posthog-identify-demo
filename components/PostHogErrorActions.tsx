"use client"
import { toast } from "sonner";
import { Button } from "./ui/button";

export function PostHogErrorActions() {
  const handleErrorButtonClick = () => {
    toast.success("Frontend error captured")
    throw new Error("Frontend error");
  }

  const handleAPIButtonClick = async () => {
    await fetch("/api/test-error");
    toast.success("Backend error captured")
  }

  return (
    <div className="flex flex-row gap-2 w-full">
        <Button onClick={handleErrorButtonClick}>
            Test Frontend Error
        </Button>
        <Button onClick={handleAPIButtonClick}>
            Test Backend Error
        </Button>
    </div>
  );
}
