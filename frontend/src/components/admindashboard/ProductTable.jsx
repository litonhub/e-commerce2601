import ProductRow from "./ProductRow";

const ProductTable = ({
  products = [],
  selectedProducts = [],
  setSelectedProducts,
  onEdit,
  onDelete,
}) => {
  const isAllSelected =
    products.length > 0 && selectedProducts.length === products.length;

  const isSomeSelected =
    selectedProducts.length > 0 && selectedProducts.length < products.length;

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(products.map((item) => item._id));
    } else {
      setSelectedProducts([]);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200 shadow-sm">
        <thead>
          <tr className="sticky top-0 z-10 border-b-2 bg-gray-50 border-brdrtwo font-pop text-logoc">
            {/* Select All */}
            <th className="w-14 px-4 py-4">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(el) => {
                  if (el) {
                    el.indeterminate = isSomeSelected;
                  }
                }}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="h-4 w-4 rounded cursor-pointer"
              />
            </th>
            <th className="px-4 py-4 text-left">Image</th>
            <th className="px-4 py-4 text-left">Product</th>
            <th className="px-4 py-4 text-left">Category</th>
            <th className="px-4 py-4 text-left">Price</th>
            <th className="px-4 py-4 text-left">Stock</th>
            <th className="px-4 py-4 text-left">Status</th>
            <th className="px-4 py-4 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <ProductRow
                key={product._id}
                product={product}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-10 text-gray-500">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;