import React from "react";
import {
  LuSearch,
  LuRefreshCw,
  LuPlus,
  LuPackagePlus,
  LuTrash2,
  LuArrowUpDown,
  LuFilter,
} from "react-icons/lu";

const ProductHeader = ({
  totalProducts = 0,
  search = "",
  onSearchChange,
  sort = "latest",
  onSortChange,
  onRefresh,
  onAddProduct,
  onBulkProduct,
  onRecycleBin,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm font-pop">
      {/* Top */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all products from one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-semibold">
            Total : {totalProducts}
          </div>

          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
          >
            <LuRefreshCw size={18} />
            Refresh
          </button>

          <button
            onClick={onRecycleBin}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition"
          >
            <LuTrash2 size={18} />
            Recycle Bin
          </button>

          <button
            onClick={onBulkProduct}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition"
          >
            <LuPackagePlus size={18} />
            Bulk Products
          </button>

          <button
            onClick={onAddProduct}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:opacity-90 text-white transition"
          >
            <LuPlus size={18} />
            Add Product
          </button>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="mt-6 flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <LuSearch
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            type="text"
            placeholder="Search products..."
            className="w-full h-12 rounded-xl border border-gray-200 pl-12 pr-4 outline-none focus:border-primary transition"
          />
        </div>

        {/* Sort */}
        <div className="relative w-full lg:w-60">
          <LuArrowUpDown
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <select
            value={sort}
            onChange={(e) => onSortChange?.(e.target.value)}
            className="w-full h-12 rounded-xl border border-gray-200 pl-12 pr-4 outline-none focus:border-primary appearance-none bg-white"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="price_asc">Price : Low → High</option>
            <option value="price_desc">Price : High → Low</option>
          </select>
        </div>

        {/* Filter */}
        <button className="h-12 px-5 rounded-xl border border-gray-200 hover:bg-gray-50 transition flex items-center justify-center gap-2">
          <LuFilter size={18} />
          Filters
        </button>
      </div>
    </div>
  );
};

export default ProductHeader;