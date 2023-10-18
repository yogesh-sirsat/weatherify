function LoadingSkeleton() {
  return (
    <li className="relative flex flex-col p-4 m-3 gap-2 bg-base-100 rounded-2xl">
      <div className="animate-pulse">
        <div className="flex flex-row gap-2">
          <div className="rounded-sm bg-gray-300 w-36 h-28"></div>
          <div className="relative flex flex-col p-2 w-full">
            <div className="bg-gray-300 rounded h-5 w-3/4 mb-2"></div>
            <div className="bg-gray-300 rounded h-3 w-1/2"></div>
          </div>
        </div>
        <progress className="progress bg-gray-300"></progress>
      </div>
    </li>
  );
}

export default LoadingSkeleton;
