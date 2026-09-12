import React, { useEffect, useState } from "react";
import { FiChevronDown, FiEye, FiEyeOff } from 'react-icons/fi';
import Container from '../../components/layouts/Container';
import Sidebar from '../../components/common/DashboardSidebar';
import PageBanner from '../../components/common/PageBanner';
import { logout as logoutRequest, updateAvatar, changePassword as changePasswordRequest, updateProfile } from "../../services/authService";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router";
import AvatarCropModal from "../../components/common/AvatarCropModal";
import getCroppedImg from "../../utils/cropImage";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDefaultAddress, createAddress, updateAddress } from "../../services/addressService";
import { countries } from "../../data/countries";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, setUser, getMe } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCropImage(URL.createObjectURL(file));
    setShowCropModal(true);
  };

  const handleCropDone = async (croppedAreaPixels) => {
    try {
      const blob = await getCroppedImg(cropImage, croppedAreaPixels);
      const croppedFile = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      setAvatar(croppedFile);
      setPreview(URL.createObjectURL(blob));
      setShowCropModal(false);
    } catch (err) {
      toast.error(t('settings.crop_failed', "Crop failed"));
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatar) {
      toast.error(t('settings.select_image', "Please select an image first"));
      return;
    }
    try {
      setUploading(true);
      const res = await updateAvatar(avatar);
      toast.success(res.data.message);
      await getMe();
      setAvatar(null);
      setCropImage(null);
      setPreview(null);
    } catch (err) {
      toast.error(err.response?.data?.message || t('settings.upload_failed', "Upload failed"));
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("guestCart");
    localStorage.removeItem("guestWishlist");
    setUser(null);

    queryClient.setQueryData(["cart"], { items: [], totalItems: 0, subtotal: 0, total: 0 });
    queryClient.setQueryData(["wishlist"], { data: { items: [], totalItems: 0 } });

    try {
      await logoutRequest();
    } catch (err) {
      console.warn("Logout warning:", err);
    }

    toast.success(t('settings.logout_success', "Logout successful."));
    navigate("/login", { replace: true });
  };

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const [billing, setBilling] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    street: "",
    zipCode: "",
    label: "Home",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        email: user.email || "",
      });
      setPreview(user.avatar || null);
    }
  }, [user]);

  const { data: addressData, isLoading: addressLoading } = useQuery({
    queryKey: ["default-address"],
    queryFn: getDefaultAddress,
  });

  useEffect(() => {
    const actualAddress = addressData?.data || addressData;

    if (actualAddress && actualAddress._id) {
      setBilling({
        firstName: actualAddress.firstName || "",
        lastName: actualAddress.lastName || "",
        companyName: actualAddress.companyName || "",
        email: actualAddress.email || "",
        phone: actualAddress.phone || "",
        country: actualAddress.country?.name || "",
        state: actualAddress.state?.name || "",
        city: actualAddress.city || "",
        street: actualAddress.street || "",
        zipCode: actualAddress.zipCode || "",
        label: actualAddress.label || "Home",
      });
    }
  }, [addressData]);

  const saveAddressMutation = useMutation({
    mutationFn: async (data) => {
      const actualAddress = addressData?.data || addressData;

      if (actualAddress && actualAddress._id) {
        return updateAddress({ id: actualAddress._id, address: data });
      }
      return createAddress({ ...data, isDefault: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["default-address"] });
      toast.success(t('settings.address_saved', "Billing address saved successfully."));
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || t('settings.address_failed', "Failed to save address."));
    },
  });

  const handleSaveAddress = () => {
    if (!billing.firstName) return toast.error(t('settings.err_first_name', "First name is required."));
    if (!billing.lastName) return toast.error(t('settings.err_last_name', "Last name is required."));
    if (!billing.email) return toast.error(t('settings.err_email', "Email is required."));
    if (!billing.phone) return toast.error(t('settings.err_phone', "Phone number is required."));
    if (!billing.country) return toast.error(t('settings.err_country', "Please select a country."));
    if (!billing.state) return toast.error(t('settings.err_state', "Please select a state."));
    if (!billing.city) return toast.error(t('settings.err_city', "City is required."));
    if (!billing.street) return toast.error(t('settings.err_street', "Street address is required."));

    const selectedCountryObj = countries.find(c => c.name === billing.country);

    saveAddressMutation.mutate({
      firstName: billing.firstName,
      lastName: billing.lastName,
      companyName: billing.companyName,
      email: billing.email,
      phone: billing.phone,
      country: {
        code: selectedCountryObj?.code || "UN",
        name: billing.country
      },
      state: {
        code: "",
        name: billing.state
      },
      city: billing.city,
      street: billing.street,
      zipCode: billing.zipCode,
      label: billing.label,
    });
  };

  const selectedCountry = countries.find(
    (country) => country.name === billing.country
  );

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword.trim() || !passwordData.newPassword.trim() || !passwordData.confirmPassword.trim()) {
      toast.error(t('settings.err_all_fields', "All fields are required."));
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(t('settings.err_password_match', "Passwords do not match."));
      return;
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error(t('settings.err_same_password', "New password must be different from current password."));
      return;
    }

    setLoading(true);
    try {
      const response = await changePasswordRequest(passwordData);
      toast.success(response.data.message);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });

      setTimeout(async () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("guestCart");
        localStorage.removeItem("guestWishlist");
        setUser(null);

        queryClient.setQueryData(["cart"], { items: [], totalItems: 0, subtotal: 0, total: 0 });
        queryClient.setQueryData(["wishlist"], { data: { items: [], totalItems: 0 } });

        try { await logoutRequest(); } catch (_) { }

        navigate("/login", { replace: true });
      }, 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || t('settings.err_change_failed', "Failed to change password."));
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!profileData.firstName.trim()) {
      toast.error(t('settings.err_first_name', "First name is required."));
      return;
    }
    setLoading(true);
    try {
      const res = await updateProfile(profileData);
      toast.success(res.data.message);
      await getMe();
    } catch (err) {
      toast.error(err.response?.data?.message || t('settings.err_profile_failed', "Failed to update profile."));
    } finally {
      setLoading(false);
    }
  };

  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location]);

  const labelClass = "block text-sm font-medium text-gray-700 mb-2";
  const inputClass = "w-full border border-gray-200 rounded-md px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary transition-colors bg-white";

  return (
    <>
      <PageBanner items={[
        t('settings.account', "Account"),
        t('settings.title', "Settings")
      ]} />

      <Container>
        <div className="flex flex-col md:flex-row gap-6 pt-8 pb-12 lg:pb-20 min-h-screen text-gray-800 font-pop">

          <Sidebar activeMenu="Settings" handleLogout={handleLogout} />

          <div className="flex-1 flex flex-col gap-6 w-full">

            {/* Card 1: Account Settings */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">{t('settings.account_settings', 'Account Settings')}</h3>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex flex-col-reverse md:flex-row gap-10">
                  <div className="flex-1 space-y-5">
                    <div>
                      <label className={labelClass}>{t('settings.first_name', 'First name')}</label>
                      <input
                        type="text"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleProfileChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>{t('settings.last_name', 'Last Name')}</label>
                      <input
                        type="text"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleProfileChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>{t('settings.email', 'Email')}</label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        readOnly
                        className={`${inputClass} bg-gray-100 cursor-not-allowed`}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>{t('settings.phone', 'Phone Number')}</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className={inputClass}
                      />
                    </div>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleProfileUpdate}
                        disabled={loading}
                        className={`px-8 py-2.5 rounded-full font-medium text-white transition-all cursor-pointer ${loading
                          ? "bg-green-300 cursor-not-allowed"
                          : "bg-primary hover:bg-green-700"
                          }`}
                      >
                        {loading ? t('settings.saving', "Saving...") : t('settings.save_changes', "Save Changes")}
                      </button>
                    </div>
                  </div>

                  <div className="w-full md:w-64 flex flex-col items-center pt-2">
                    <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border-4 border-white shadow-sm">
                      <img
                        src={preview || user?.avatar || "https://i.pravatar.cc/300"}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      id="avatar"
                    />
                    <label
                      htmlFor="avatar"
                      className="cursor-pointer border-2 border-primary text-primary text-sm px-4 py-1 rounded-full font-normal hover:bg-primary hover:text-white transition mb-3"
                    >
                      {t('settings.choose_image', 'Choose Image')}
                    </label>
                    <button
                      onClick={handleAvatarUpload}
                      disabled={uploading}
                      className={`px-6 py-2 rounded-full font-medium text-white transition cursor-pointer ${uploading
                        ? "bg-gray-400"
                        : "bg-primary hover:bg-green-700"
                        }`}
                    >
                      {uploading ? t('settings.uploading', "Uploading...") : t('settings.upload_avatar', "Upload Avatar")}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Billing Address */}
            <div id="billing-address" className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">{t('settings.billing_address', 'Billing Address')}</h3>
              </div>
              <div className="p-6 md:p-8 space-y-5">
                {addressLoading ? (
                  <div className="py-10 text-center text-gray-500">{t('settings.loading_address', 'Loading Address...')}</div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className={labelClass}>{t('settings.first_name', 'First name')}</label>
                        <input
                          type="text"
                          value={billing.firstName}
                          onChange={(e) => setBilling({ ...billing, firstName: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>{t('settings.last_name', 'Last name')}</label>
                        <input
                          type="text"
                          value={billing.lastName}
                          onChange={(e) => setBilling({ ...billing, lastName: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>{t('settings.company_name', 'Company Name')} <span className="text-gray-400 font-normal">({t('settings.optional', 'optional')})</span></label>
                        <input
                          type="text"
                          value={billing.companyName}
                          onChange={(e) => setBilling({ ...billing, companyName: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>{t('settings.street_address', 'Street Address')}</label>
                      <input
                        type="text"
                        value={billing.street}
                        onChange={(e) => setBilling({ ...billing, street: e.target.value })}
                        className={inputClass}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                      <div>
                        <label className={labelClass}>{t('settings.country', 'Country')}</label>
                        <div className="relative">
                          <select
                            value={billing.country}
                            onChange={(e) => setBilling({ ...billing, country: e.target.value, state: "" })}
                            className={`${inputClass} appearance-none cursor-pointer`}
                          >
                            <option value="">{t('settings.select_country', 'Select Country')}</option>
                            {countries.map((country) => (
                              <option key={country.code} value={country.name}>
                                {country.name}
                              </option>
                            ))}
                          </select>
                          <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>{t('settings.states', 'States')}</label>
                        <div className="relative">
                          <select
                            value={billing.state}
                            onChange={(e) => setBilling({ ...billing, state: e.target.value })}
                            className={`${inputClass} appearance-none cursor-pointer`}
                          >
                            <option value="">{t('settings.select_state', 'Select State')}</option>
                            {selectedCountry?.states?.map((state) => (
                              <option key={state} value={state}>
                                {state}
                              </option>
                            ))}
                          </select>
                          <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>{t('settings.city', 'City')}</label>
                        <input
                          type="text"
                          value={billing.city}
                          onChange={(e) => setBilling({ ...billing, city: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>{t('settings.zip_code', 'Zip Code')}</label>
                        <input
                          type="text"
                          value={billing.zipCode}
                          onChange={(e) => setBilling({ ...billing, zipCode: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-[14px] mb-1.5">{t('settings.label', 'Label')}</label>
                      <select
                        value={billing.label}
                        onChange={(e) => setBilling({ ...billing, label: e.target.value })}
                        className="w-full h-[48px] px-4 border border-gray-200 rounded-md outline-none bg-white cursor-pointer"
                      >
                        <option value="Home">{t('settings.home', 'Home')}</option>
                        <option value="Office">{t('settings.office', 'Office')}</option>
                        <option value="Other">{t('settings.other', 'Other')}</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>{t('settings.email', 'Email')}</label>
                        <input
                          type="email"
                          value={billing.email}
                          onChange={(e) => setBilling({ ...billing, email: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>{t('settings.phone', 'Phone')}</label>
                        <input
                          type="tel"
                          value={billing.phone}
                          onChange={(e) => setBilling({ ...billing, phone: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleSaveAddress}
                        disabled={saveAddressMutation.isPending}
                        className="bg-primary hover:bg-opacity-90 text-white px-8 py-2.5 rounded-full font-medium transition-all disabled:opacity-60 cursor-pointer"
                      >
                        {saveAddressMutation.isPending ? t('settings.saving', "Saving...") : t('settings.save_changes', "Save Changes")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Card 3: Change Password */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">{t('settings.change_password', 'Change Password')}</h3>
              </div>
              <div className="p-6 md:p-8 space-y-5">
                <div>
                  <label className={labelClass}>{t('settings.current_password', 'Current Password')}</label>
                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder={t('settings.enter_current', 'Enter current password')}
                      className={`${inputClass} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition cursor-pointer"
                    >
                      {showCurrent ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>{t('settings.new_password', 'New Password')}</label>
                    <div className="relative">
                      <input
                        type={showNew ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder={t('settings.enter_new', 'Enter new password')}
                        className={`${inputClass} pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition cursor-pointer"
                      >
                        {showNew ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>{t('settings.confirm_password', 'Confirm Password')}</label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder={t('settings.confirm_new', 'Confirm new password')}
                        className={`${inputClass} pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition cursor-pointer"
                      >
                        {showConfirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={loading}
                    className={`px-8 py-2.5 rounded-full font-medium text-white transition-all cursor-pointer ${loading
                      ? "bg-green-300 cursor-not-allowed"
                      : "bg-primary hover:bg-green-700"
                      }`}
                  >
                    {loading ? t('settings.changing', "Changing...") : t('settings.change_password', "Change Password")}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {showCropModal && (
          <AvatarCropModal
            image={cropImage}
            onCancel={() => setShowCropModal(false)}
            onCropDone={handleCropDone}
          />
        )}

      </Container>
    </>
  );
};

export default Settings;