import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  
  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-4xl font-bold mb-4">Oops!</h1>
        <h2 className="text-2xl mb-4">
          {error.status} - {error.statusText}
        </h2>
        <p className="text-gray-600">
          {error.data?.message || 'Something went wrong'}
        </p>
      </div>
    );
  }

  // Handle non-route errors
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">Unexpected Error</h1>
      <p className="text-gray-600">
        {error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred'}
      </p>
    </div>
  );
};

export default ErrorPage;
