"use client"; // Error boundaries must be Client Components

export default function Error() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-4 text-center">
      <h1 className="text-base md:text-2xl mt-4">An error occurred on the server.</h1>
    </div>
  );
}
