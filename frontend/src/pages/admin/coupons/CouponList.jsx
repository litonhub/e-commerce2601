import { useState } from "react";

import CouponHeader from "../../../components/admindashboard/CouponHeader";
import CouponFilters from "../../../components/admindashboard/CouponFilters";
import CouponTable from "../../../components/admindashboard/CouponTable";
import Pagination from "../../../components/admindashboard/Pagination";
import DeleteCouponModal from "../../../components/admindashboard/DeleteCouponModal";

const CouponList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
  q: "",
  status: "",
  discountType: "",
  deleted: "false",
});

  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);

  const [selectedCoupon, setSelectedCoupon] =
    useState(null);

  const handleDeleteClick = (coupon) => {
    setSelectedCoupon(coupon);
    setDeleteModalOpen(true);
  };

  const handleRestore = (coupon) => {
    console.log("Restore:", coupon);
  };

  const handleDelete = () => {
    console.log(selectedCoupon);

    setDeleteModalOpen(false);
  };

  return (
    <section className="space-y-6">

      <CouponHeader />

      <CouponFilters
  filters={filters}
  setFilters={setFilters}
/>

      <CouponTable
  filters={filters}
  onDelete={handleDeleteClick}
  onRestore={handleRestore}
/>

      <Pagination
        currentPage={currentPage}
        totalPages={12}
        totalItems={116}
        perPage={10}
        onPageChange={setCurrentPage}
      />

      <DeleteCouponModal
        open={deleteModalOpen}
        coupon={selectedCoupon}
        onClose={() =>
          setDeleteModalOpen(false)
        }
        onDelete={handleDelete}
      />

    </section>
  );
};

export default CouponList;