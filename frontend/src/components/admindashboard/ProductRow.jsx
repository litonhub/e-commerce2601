import {
  Pencil,
  Trash2,
} from "lucide-react";


const ProductRow = ({
  product,
  selectedProducts = [],
  setSelectedProducts,
  onEdit,
  onDelete,
}) => {


  const isSelected = selectedProducts.includes(
    product._id
  );


  const handleSelect = (checked) => {

    if (checked) {

      setSelectedProducts((prev) => [
        ...prev,
        product._id,
      ]);

    } else {

      setSelectedProducts((prev) =>
        prev.filter(
          (id) => id !== product._id
        )
      );

    }

  };


  return (
    <tr className="border-b border-brdrtwo hover:bg-gray-50 transition">


      {/* Checkbox */}
      <td className="px-4 py-4">

        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) =>
            handleSelect(e.target.checked)
          }
          className="h-4 w-4 rounded cursor-pointer"
        />

      </td>



      {/* Image */}
      <td className="px-4 py-4">

        <img
          src={
            product.thumbnail?.url ||
            "https://placehold.co/100x100?text=No+Image"
          }
          alt={typeof product.title === 'object' ? product.title?.en : product.title}
          loading="lazy"
          className="
            w-16 h-16 
            rounded-lg 
            object-cover 
            border
          "
        />

      </td>




      {/* Product */}
      <td className="px-4 py-4">

        <h3 className="font-semibold text-gray-900">
          {/* --- Updated for Multi-language --- */}
          {typeof product.title === 'object' ? product.title?.en : product.title}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          {product.brand || "No Brand"}
        </p>

      </td>




      {/* Category */}
      <td className="px-4 py-4 capitalize">
        {product.category || "-"}
      </td>




      {/* Price */}
      <td className="px-4 py-4 font-semibold">

        $
        {Number(product.price || 0)
          .toFixed(2)}

      </td>




      {/* Stock */}
      <td className="px-4 py-4">

        <span
          className={`font-semibold ${
            product.stock <= 5
              ? "text-red-500"
              : "text-green-600"
          }`}
        >
          {product.stock ?? 0}
        </span>

      </td>




      {/* Status */}
      <td className="px-4 py-4">

        <span
          className={`
            inline-flex items-center 
            rounded-full 
            px-3 py-1 
            text-xs 
            font-semibold
            ${
              product.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          `}
        >

          {product.isActive
            ? "Active"
            : "Inactive"}

        </span>

      </td>





      {/* Action */}
      <td className="px-4 py-4">

        <div className="flex justify-center gap-2">


          <button
            onClick={() =>
              onEdit(product)
            }
            className="
              h-10 w-10 
              rounded-lg 
              bg-blue-500 
              hover:bg-blue-600 
              text-white 
              flex items-center 
              justify-center 
              transition
            "
          >

            <Pencil size={18}/>

          </button>



          <button
            onClick={() =>
              onDelete(product)
            }
            className="
              h-10 w-10 
              rounded-lg 
              bg-red-500 
              hover:bg-red-600 
              text-white 
              flex items-center 
              justify-center 
              transition
            "
          >

            <Trash2 size={18}/>

          </button>


        </div>

      </td>


    </tr>
  );
};


export default ProductRow;