"use client";

type LoadingProps = {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  text?: string;
};

export const Loading = (props: LoadingProps) => {
  const { size = "md", fullScreen = false, text } = props;

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50"
    : "flex items-center justify-center gap-2 p-4";

  return (
    <div className={containerClasses}>
      <div className="flex items-end gap-2">
        <div
          className={`${sizeClasses[size]} bg-gray-900 dark:bg-white rounded-full bounce-high-1`}
        />
        <div
          className={`${sizeClasses[size]} bg-gray-900 dark:bg-white rounded-full bounce-high-2`}
        />
        <div
          className={`${sizeClasses[size]} bg-gray-900 dark:bg-white rounded-full bounce-high-3`}
        />
      </div>
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse ml-3">
          {text}
        </p>
      )}
    </div>
  );
};
