export const Loading = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="w-2 h-2 bg-gray-900 dark:bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-gray-900 dark:bg-white  rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-gray-900 dark:bg-white rounded-full animate-bounce"></div>
    </div>
  );
};
