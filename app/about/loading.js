import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 dark:bg-gray-900">
      <div className="text-center">
        {/* Spinning loader icon */}
        <div className="flex justify-center mb-4">
          <Loader2 className="h-12 w-12 text-amber-600 dark:text-amber-500 animate-spin" />
        </div>

        {/* Loading text */}
        <h2 className="text-2xl font-medium text-gray-800 dark:text-white mb-4">
          Loading...
        </h2>

        {/* Pulsing dots */}
        <div className="flex space-x-2 justify-center">
          <div className="w-3 h-3 bg-amber-600 dark:bg-amber-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-amber-600 dark:bg-amber-500 rounded-full animate-bounce delay-75"></div>
          <div className="w-3 h-3 bg-amber-600 dark:bg-amber-500 rounded-full animate-bounce delay-150"></div>
        </div>
      </div>
    </div>
  );
}
