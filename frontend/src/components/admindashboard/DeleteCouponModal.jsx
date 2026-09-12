const DeleteCouponModal = ({
  open,
  onClose,
  onDelete,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-md rounded-2xl bg-white p-6">

        <h2 className="text-xl font-bold">
          Delete Coupon
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Are you sure you want to delete this coupon?
        </p>

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            className="rounded-lg bg-red-600 px-4 py-2 text-white"
          >
            Delete
          </button>

        </div>

      </div>
    </div>
  );
};

export default DeleteCouponModal;