import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import {
  Save,
  Ticket,
  BadgeDollarSign,
  CalendarDays,
  AlignLeft,
  CheckSquare,
  Ban,
  Settings2,
  X,
} from "lucide-react";

import useCreateCoupon from "../../hooks/useCreateCoupon";
import useCategories from "../../hooks/useCategories";
import useProducts from "../../hooks/useProducts";
import useDebounce from "../../hooks/useDebounce";

const CouponForm = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateCoupon();
  const { data: categories = [] } = useCategories();

  // ===================== FORM STATE =====================
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    discountType: "",
    discountValue: "",
    minimumOrderAmount: "",
    maximumDiscount: "",
    usageLimit: "",
    usagePerUser: 1,
    startDate: "",
    expireDate: "",
    applicableCategories: [],
    applicableProducts: [],
    excludedProducts: [],
    isActive: true,
  });

  // ===================== APPLICABLE PRODUCTS LOGIC =====================
  const dropdownRef = useRef(null);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  const debouncedSearch = useDebounce(productSearch, 400);
  const { data: products = [], isLoading } = useProducts(debouncedSearch);

  // ===================== EXCLUDED PRODUCTS LOGIC =====================
  const excludedDropdownRef = useRef(null);
  const [showExcludedDropdown, setShowExcludedDropdown] = useState(false);
  const [excludedSearch, setExcludedSearch] = useState("");
  const [selectedExcluded, setSelectedExcluded] = useState([]);

  const debouncedExcludedSearch = useDebounce(excludedSearch, 400);
  const { data: excludedProductsList = [], isLoading: isExcludedLoading } = useProducts(debouncedExcludedSearch);

  // ===================== CLICK OUTSIDE HANDLER =====================
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProductDropdown(false);
      }
      if (excludedDropdownRef.current && !excludedDropdownRef.current.contains(e.target)) {
        setShowExcludedDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ===================== HANDLERS =====================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleMultipleSelect = (e) => {
    const values = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({ ...prev, [e.target.name]: values }));
  };

  // Applicable Product Select/Remove
  const handleProductSelect = (product) => {
    if (selectedProducts.find((item) => item._id === product._id)) return;
    setSelectedProducts((prev) => [...prev, product]);
    setFormData((prev) => ({
      ...prev,
      applicableProducts: [...prev.applicableProducts, product._id],
    }));
  };

  const removeProduct = (id) => {
    setSelectedProducts((prev) => prev.filter((item) => item._id !== id));
    setFormData((prev) => ({
      ...prev,
      applicableProducts: prev.applicableProducts.filter((item) => item !== id),
    }));
  };

  // Excluded Product Select/Remove
  const handleExcludedSelect = (product) => {
    if (selectedExcluded.find((item) => item._id === product._id)) return;
    setSelectedExcluded((prev) => [...prev, product]);
    setFormData((prev) => ({
      ...prev,
      excludedProducts: [...prev.excludedProducts, product._id],
    }));
  };

  const removeExcludedProduct = (id) => {
    setSelectedExcluded((prev) => prev.filter((item) => item._id !== id));
    setFormData((prev) => ({
      ...prev,
      excludedProducts: prev.excludedProducts.filter((item) => item !== id),
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Same product cannot be applicable & excluded
  if (
    formData.applicableProducts.some((id) =>
      formData.excludedProducts.includes(id)
    )
  ) {
    return toast.error(
      "Same product cannot be both applicable and excluded."
    );
  }

  // Expire date validation
  if (
    formData.startDate &&
    formData.expireDate &&
    new Date(formData.expireDate) <= new Date(formData.startDate)
  ) {
    return toast.error(
      "Expire date must be after start date."
    );
  }

  // Percentage validation
  if (
    formData.discountType === "percentage" &&
    Number(formData.discountValue) > 100
  ) {
    return toast.error(
      "Percentage can't exceed 100%"
    );
  }

  const payload = {
    ...formData,

    discountValue: formData.discountValue
      ? Number(formData.discountValue)
      : undefined,

    minimumOrderAmount: formData.minimumOrderAmount
      ? Number(formData.minimumOrderAmount)
      : 0,

    maximumDiscount: formData.maximumDiscount
      ? Number(formData.maximumDiscount)
      : 0,

    usageLimit: formData.usageLimit
      ? Number(formData.usageLimit)
      : 0,

    usagePerUser: formData.usagePerUser
      ? Number(formData.usagePerUser)
      : 1,

    startDate: formData.startDate
      ? new Date(formData.startDate)
      : undefined,

    expireDate: formData.expireDate
      ? new Date(formData.expireDate)
      : undefined,
  };

  try {
    await mutateAsync(payload);

    toast.success("Coupon created successfully");

    navigate("/admin-dashboard/coupons");

  } catch (err) {
    toast.error(
      err?.response?.data?.message ||
      "Failed to create coupon"
    );

    console.log(err);
  }
};

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-6 pb-10 font-pop">
      
      {/* Header Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Coupon</h1>
        <p className="mt-1 text-sm text-gray-500">
          Set up discount codes, usage limits, and product applicability.
        </p>
      </div>

      {/* 1. Coupon Information */}
      <div className="rounded-2xl border border-brdr bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-center gap-2 border-b border-brdr pb-4">
          <Ticket className="text-primary" size={22} />
          <h2 className="text-xl font-semibold text-gray-800">Coupon Information</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Coupon Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. WELCOME10"
              className="w-full rounded-xl border border-brdr px-4 py-3 text-sm uppercase outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Coupon Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Welcome Offer"
              className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Discount Type</label>
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              className="w-full cursor-pointer rounded-xl border border-brdr bg-white px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Select Type</option>
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Discount Value</label>
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              placeholder="10"
              className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* 2. Pricing & Usage */}
      <div className="rounded-2xl border border-brdr bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-center gap-2 border-b border-brdr pb-4">
          <BadgeDollarSign className="text-primary" size={22} />
          <h2 className="text-xl font-semibold text-gray-800">Pricing & Usage Limits</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Minimum Order Amount</label>
            <input
              type="number"
              name="minimumOrderAmount"
              value={formData.minimumOrderAmount}
              onChange={handleChange}
              placeholder="500"
              className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Maximum Discount</label>
            <input
              type="number"
              name="maximumDiscount"
              value={formData.maximumDiscount}
              onChange={handleChange}
              placeholder="1000"
              className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Total Usage Limit</label>
            <input
              type="number"
              name="usageLimit"
              value={formData.usageLimit}
              onChange={handleChange}
              placeholder="100"
              className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Usage Per User</label>
            <input
              type="number"
              name="usagePerUser"
              value={formData.usagePerUser}
              onChange={handleChange}
              placeholder="1"
              className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* 3. Validity */}
      <div className="rounded-2xl border border-brdr bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-center gap-2 border-b border-brdr pb-4">
          <CalendarDays className="text-primary" size={22} />
          <h2 className="text-xl font-semibold text-gray-800">Validity Period</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full cursor-pointer rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Expire Date</label>
            <input
              type="datetime-local"
              name="expireDate"
              value={formData.expireDate}
              onChange={handleChange}
              className="w-full cursor-pointer rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* 4. Description */}
      <div className="rounded-2xl border border-brdr bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-center gap-2 border-b border-brdr pb-4">
          <AlignLeft className="text-primary" size={22} />
          <h2 className="text-xl font-semibold text-gray-800">Description</h2>
        </div>
        <textarea
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Write a short description about this coupon..."
          className="w-full resize-none rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* 5. Applicability */}
      <div className="rounded-2xl border border-brdr bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-center gap-2 border-b border-brdr pb-4">
          <CheckSquare className="text-primary" size={22} />
          <h2 className="text-xl font-semibold text-gray-800">Coupon Applicability</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          
          {/* Categories */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Applicable Categories</label>
            <select
              multiple
              name="applicableCategories"
              value={formData.applicableCategories}
              onChange={handleMultipleSelect}
              className="h-44 w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary custom-scrollbar"
            >
              {categories.map((category) => (
                <option key={category._id} value={category.slug} className="p-1.5 hover:bg-primary/10">
                  {category.name}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs font-medium text-gray-500">
              Hold <kbd className="rounded bg-gray-100 px-1">Ctrl</kbd> or <kbd className="rounded bg-gray-100 px-1">Cmd</kbd> to select multiple. Leave empty to apply to all.
            </p>
          </div>

          {/* Applicable Products */}
          <div ref={dropdownRef} className="relative">
            <label className="mb-2 block text-sm font-medium text-gray-700">Applicable Products</label>
            
            {/* Selected Product Badges */}
            {selectedProducts.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {selectedProducts.map((product) => (
                  <div key={product._id} className="flex items-center gap-2 rounded-full border border-primary bg-primary/5 px-3 py-1.5 transition-all">
                    <img src={product.thumbnail?.url} className="h-5 w-5 rounded-full object-cover" alt="" />
                    <span className="text-sm font-medium text-primary">{product.title}</span>
                    <button type="button" onClick={() => removeProduct(product._id)} className="text-primary hover:text-red-500">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              type="text"
              value={productSearch}
              onFocus={() => setShowProductDropdown(true)}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Search to add products..."
              className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
            />

            {showProductDropdown && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-brdr bg-white shadow-xl custom-scrollbar">
                {isLoading ? (
                  <div className="p-4 text-center text-sm text-gray-500">Searching products...</div>
                ) : products.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">No products found.</div>
                ) : (
                  products.map((product) => (
                    <button
                      key={product._id}
                      type="button"
                      onClick={() => {
                        handleProductSelect(product);
                        setProductSearch("");
                        setShowProductDropdown(false);
                      }}
                      className="flex w-full items-center gap-3 border-b border-gray-100 p-3 transition hover:bg-gray-50 last:border-none"
                    >
                      <img src={product.thumbnail?.url} className="h-10 w-10 rounded-lg object-cover border" alt="" />
                      <div className="flex-1 text-left">
                        <h4 className="text-sm font-medium text-gray-800">{product.title}</h4>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                      <div className="text-sm font-semibold text-primary">৳{product.price}</div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. Excluded Products */}
      <div className="rounded-2xl border border-brdr bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-center gap-2 border-b border-brdr pb-4">
          <Ban className="text-red-500" size={22} />
          <h2 className="text-xl font-semibold text-gray-800">Excluded Products</h2>
        </div>

        <div ref={excludedDropdownRef} className="relative max-w-2xl">
          {/* Selected Excluded Badges */}
          {selectedExcluded.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {selectedExcluded.map((product) => (
                <div key={product._id} className="flex items-center gap-2 rounded-full border border-red-500 bg-red-50 px-3 py-1.5 transition-all">
                  <img src={product.thumbnail?.url} className="h-5 w-5 rounded-full object-cover" alt="" />
                  <span className="text-sm font-medium text-red-600">{product.title}</span>
                  <button type="button" onClick={() => removeExcludedProduct(product._id)} className="text-red-500 hover:text-red-700">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            type="text"
            value={excludedSearch}
            onFocus={() => setShowExcludedDropdown(true)}
            onChange={(e) => setExcludedSearch(e.target.value)}
            placeholder="Search to exclude products..."
            className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />

          {showExcludedDropdown && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-brdr bg-white shadow-xl custom-scrollbar">
              {isExcludedLoading ? (
                <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
              ) : excludedProductsList.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">No products found.</div>
              ) : (
                excludedProductsList.map((product) => (
                  <button
                    key={product._id}
                    type="button"
                    onClick={() => {
                      handleExcludedSelect(product);
                      setExcludedSearch("");
                      setShowExcludedDropdown(false);
                    }}
                    className="flex w-full items-center gap-3 border-b border-gray-100 p-3 transition hover:bg-red-50 last:border-none"
                  >
                    <img src={product.thumbnail?.url} className="h-10 w-10 rounded-lg object-cover border" alt="" />
                    <div className="flex-1 text-left">
                      <h4 className="text-sm font-medium text-gray-800">{product.title}</h4>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* 7. Settings / Status */}
      <div className="rounded-2xl border border-brdr bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <Settings2 className="mt-1 text-primary" size={24} />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Coupon Status</h2>
              <p className="mt-1 text-sm text-gray-500">Enable or disable this coupon instantly.</p>
            </div>
          </div>

          {/* Premium CSS-only Toggle Switch */}
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleCheckbox}
              className="peer sr-only"
            />
            <div className="h-7 w-14 rounded-full bg-gray-200 transition-colors after:absolute after:left-[4px] after:top-[4px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-7"></div>
            <span className="ml-3 text-sm font-semibold text-gray-700">{formData.isActive ? "Active" : "Inactive"}</span>
          </label>
        </div>
      </div>

      {/* 8. Form Actions */}
      <div className="sticky bottom-4 z-10 flex flex-col-reverse items-center justify-end gap-4 rounded-2xl border border-brdr bg-white/90 p-4 px-6 shadow-sm backdrop-blur-md sm:flex-row">
        <button
          type="button"
          onClick={() => navigate("/admin-dashboard/coupons")}
          className="w-full rounded-xl px-6 py-3 font-semibold text-gray-600 transition hover:bg-gray-100 active:scale-[0.98] sm:w-auto"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-white shadow-md transition-all hover:bg-primary/90 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <Save size={18} />
          {isPending ? "Creating..." : "Create Coupon"}
        </button>
      </div>
      
    </form>
  );
};

export default CouponForm;