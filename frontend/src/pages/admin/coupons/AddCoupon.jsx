import CouponForm from '../../../components/admindashboard/CouponForm'

const AddCoupon = () => {
  return (
    <section className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Add Coupon
        </h1>

        <p className="mt-1 text-gray-500">
          Create a new discount coupon.
        </p>
      </div>

      <CouponForm />

    </section>
  );
};

export default AddCoupon;