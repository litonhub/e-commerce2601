import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";


const ProductPagination = ({
  pagination = {},
  page,
  setPage,
}) => {


  const {
    totalPages,
    currentPage,
    hasPrevPage,
    hasNextPage,
  } = pagination;


  if (!totalPages || totalPages <= 1) {
    return null;
  }


  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">


      <p className="text-sm text-gray-500">
        Page {currentPage || page} of {totalPages}
      </p>


      <div className="flex items-center gap-3">


        <button
          disabled={!hasPrevPage}
          onClick={() =>
            setPage((prev) => prev - 1)
          }
          className="
            flex items-center gap-2 
            px-4 py-2 
            rounded-lg 
            border border-gray-200 
            disabled:opacity-40 
            disabled:cursor-not-allowed 
            hover:bg-gray-50 
            transition
          "
        >

          <ChevronLeft size={18} />

          Previous

        </button>



        <button
          disabled={!hasNextPage}
          onClick={() =>
            setPage((prev) => prev + 1)
          }
          className="
            flex items-center gap-2 
            px-4 py-2 
            rounded-lg 
            border border-gray-200 
            disabled:opacity-40 
            disabled:cursor-not-allowed 
            hover:bg-gray-50 
            transition
          "
        >

          Next

          <ChevronRight size={18} />

        </button>


      </div>


    </div>
  );
};


export default ProductPagination;