const CouponStatusBadge = ({
  isActive,
  isDeleted,
  expireDate,
}) => {
  if (isDeleted) {
    return (
      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
        Deleted
      </span>
    );
  }

  if (new Date(expireDate) < new Date()) {
    return (
      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
        Expired
      </span>
    );
  }

  if (isActive) {
    return (
      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        Active
      </span>
    );
  }

  return (
    <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700">
      Inactive
    </span>
  );
};

export default CouponStatusBadge;