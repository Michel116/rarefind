"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
      <AlertTriangle className="w-16 h-16 text-destructive mb-6" />
      <h1 className="text-3xl font-bold text-destructive mb-2">
        Ой! Что-то пошло не так.
      </h1>
      <p className="text-lg text-muted-foreground mb-6 max-w-md">
        Произошла непредвиденная ошибка. Пожалуйста, попробуйте еще раз. Если проблема не исчезнет, обратитесь в поддержку.
      </p>
      {error?.message && (
         <pre className="mb-6 p-4 bg-muted rounded-md text-sm text-left overflow-auto max-w-full">
          <code>Ошибка: {error.message}</code>
          {error.digest && <code className="block mt-2">Дайджест: {error.digest}</code>}
        </pre>
      )}
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        size="lg"
        aria-label="Попробовать снова"
      >
        Попробовать снова
      </Button>
    </div>
  );
}
