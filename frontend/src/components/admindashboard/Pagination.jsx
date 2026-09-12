import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  perPage = 10,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const start =
    (currentPage - 1) * perPage + 1;

  const end = Math.min(
    currentPage * perPage,
    totalItems
  );

  const pages = [];

  let firstPage = Math.max(
    currentPage - 2,
    1
  );

  let lastPage = Math.min(
    firstPage + 4,
    totalPages
  );

  if (lastPage - firstPage < 4) {
    firstPage = Math.max(
      lastPage - 4,
      1
    );
  }

  for (
    let i = firstPage;
    i <= lastPage;
    i++
  ) {
    pages.push(i);
  }

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">

      {/* Left */}
      <p className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold text-gray-900">
          {start}
        </span>{" "}
        to{" "}
        <span className="font-semibold text-gray-900">
          {end}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-900">
          {totalItems}
        </span>{" "}
        entries
      </p>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Previous */}

        <button
          disabled={currentPage === 1}
          onClick={() =>
            onPageChange(currentPage - 1)
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 transition hover:border-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page Numbers */}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() =>
              onPageChange(page)
            }
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition ${
              page === currentPage
                ? "bg-primary text-white"
                : "border border-gray-300 hover:border-primary hover:bg-primary hover:text-white"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next */}

        <button
          disabled={
            currentPage === totalPages
          }
          onClick={() =>
            onPageChange(currentPage + 1)
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 transition hover:border-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>

      </div>
    </div>
  );
};

export default Pagination;