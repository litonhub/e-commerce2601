import { useState } from "react";
import { toast } from "react-toastify";
import { 
    User, 
    Store, 
    Lock, 
    Bell, 
    Save, 
    ShieldCheck,
    Mail
} from "lucide-react";

import Container from "../../components/layouts/Container";

const tabs = [
    { id: "general", label: "General Profile", icon: User },
    { id: "store", label: "Store Settings", icon: Store },
    { id: "security", label: "Security & Passwords", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
];

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState("general");
    const [loading, setLoading] = useState(false);

    // ফিউচার-প্রুফ ডামি স্টেট (API এর সাথে কানেক্ট করার জন্য প্রস্তুত)
    const [settings, setSettings] = useState({
        adminName: "Super Admin",
        email: "admin@yourstore.com",
        phone: "+880 1234 567890",
        storeName: "Premium Fashion",
        currency: "BDT (৳)",
        taxRate: "15",
        address: "Dhaka, Bangladesh",
        emailAlerts: true,
        orderNotifications: true,
    });

    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: "",
    });

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleToggle = (field) => {
        setSettings({ ...settings, [field]: !settings[field] });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate API Call
            await new Promise((resolve) => setTimeout(resolve, 1200));
            toast.success("Settings updated successfully!");
        } catch (error) {
            toast.error("Failed to update settings.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <div className="mx-auto max-w-5xl space-y-6 font-pop">
                
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
                    <p className="text-sm text-gray-500">
                        Manage your store preferences, security, and personal profile from one place.
                    </p>
                </div>

                {/* Main Settings Card */}
                <div className="overflow-hidden rounded-2xl border border-brdr bg-white shadow-sm">
                    
                    {/* Tabs Navigation (Premium Look) */}
                    <div className="flex flex-wrap border-b border-brdr bg-gray-50/50">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative flex flex-1 items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-300 md:flex-none md:min-w-[200px] ${
                                        isActive
                                            ? "bg-white text-primary"
                                            : "text-gray-500 hover:bg-gray-100 hover:text-primary"
                                    }`}
                                >
                                    <Icon 
                                        size={18} 
                                        className={isActive ? "text-primary" : "text-gray-400"} 
                                    />
                                    <span>{tab.label}</span>

                                    {/* Active Tab Indicator */}
                                    {isActive && (
                                        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary shadow-[0_-2px_10px_rgba(var(--primary),0.5)]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Content Area */}
                    <div className="p-6 md:p-8">
                        <form onSubmit={handleSave} className="space-y-8">
                            
                            {/* ===================== GENERAL TAB ===================== */}
                            {activeTab === "general" && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h3 className="text-lg font-semibold text-gray-800 border-b border-brdr pb-2">Personal Information</h3>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Full Name</label>
                                            <input
                                                type="text"
                                                name="adminName"
                                                value={settings.adminName}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                                                    <Mail size={16} />
                                                </div>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={settings.email}
                                                    onChange={handleChange}
                                                    className="w-full rounded-xl border border-brdr pl-11 pr-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number</label>
                                            <input
                                                type="text"
                                                name="phone"
                                                value={settings.phone}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ===================== STORE TAB ===================== */}
                            {activeTab === "store" && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h3 className="text-lg font-semibold text-gray-800 border-b border-brdr pb-2">Store Configuration</h3>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Store Name</label>
                                            <input
                                                type="text"
                                                name="storeName"
                                                value={settings.storeName}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Default Currency</label>
                                            <select
                                                name="currency"
                                                value={settings.currency}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                                            >
                                                <option value="BDT (৳)">BDT (৳)</option>
                                                <option value="USD ($)">USD ($)</option>
                                                <option value="EUR (€)">EUR (€)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Tax Rate (%)</label>
                                            <input
                                                type="number"
                                                name="taxRate"
                                                value={settings.taxRate}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Store Address</label>
                                            <textarea
                                                rows="3"
                                                name="address"
                                                value={settings.address}
                                                onChange={handleChange}
                                                className="w-full resize-none rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ===================== SECURITY TAB ===================== */}
                            {activeTab === "security" && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex items-center justify-between border-b border-brdr pb-2">
                                        <h3 className="text-lg font-semibold text-gray-800">Update Password</h3>
                                        <ShieldCheck size={20} className="text-green-500" />
                                    </div>
                                    <div className="max-w-md space-y-5">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Current Password</label>
                                            <input
                                                type="password"
                                                name="current"
                                                value={passwords.current}
                                                onChange={handlePasswordChange}
                                                placeholder="••••••••"
                                                className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">New Password</label>
                                            <input
                                                type="password"
                                                name="new"
                                                value={passwords.new}
                                                onChange={handlePasswordChange}
                                                placeholder="••••••••"
                                                className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Confirm New Password</label>
                                            <input
                                                type="password"
                                                name="confirm"
                                                value={passwords.confirm}
                                                onChange={handlePasswordChange}
                                                placeholder="••••••••"
                                                className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ===================== NOTIFICATIONS TAB ===================== */}
                            {activeTab === "notifications" && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h3 className="text-lg font-semibold text-gray-800 border-b border-brdr pb-2">Alert Preferences</h3>
                                    
                                    <div className="max-w-2xl space-y-4">
                                        {/* Toggle 1 */}
                                        <div className="flex items-center justify-between rounded-xl border border-brdr bg-gray-50/50 p-4 transition hover:bg-gray-50">
                                            <div>
                                                <h4 className="font-medium text-gray-900">Email Alerts</h4>
                                                <p className="text-sm text-gray-500">Receive daily summary reports via email.</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleToggle("emailAlerts")}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.emailAlerts ? 'bg-primary' : 'bg-gray-300'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.emailAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>

                                        {/* Toggle 2 */}
                                        <div className="flex items-center justify-between rounded-xl border border-brdr bg-gray-50/50 p-4 transition hover:bg-gray-50">
                                            <div>
                                                <h4 className="font-medium text-gray-900">Order Notifications</h4>
                                                <p className="text-sm text-gray-500">Get notified instantly when a new order is placed.</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleToggle("orderNotifications")}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.orderNotifications ? 'bg-primary' : 'bg-gray-300'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.orderNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Save Button (Common for all tabs) */}
                            <div className="mt-8 flex justify-end border-t border-brdr pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Save size={18} />
                                    {loading ? "Saving Changes..." : "Save Changes"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default AdminSettings;