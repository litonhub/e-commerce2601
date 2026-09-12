import { useState } from "react";
import {
    PackagePlus,
    FileSpreadsheet,
    FileText,
    Image as ImageIcon,
} from "lucide-react";

import Container from "../../components/layouts/Container";

import ManualBulkForm from "../../components/admindashboard/bulk/ManualBulkForm";
import CsvImport from "../../components/admindashboard/bulk/CsvImport";
import ExcelImport from "../../components/admindashboard/bulk/ExcelImport";
import BulkImageUpload from "../../components/admindashboard/bulk/BulkImageUpload";

const tabs = [
    {
        id: "manual",
        label: "Manual",
        icon: PackagePlus,
    },
    {
        id: "csv",
        label: "CSV Import",
        icon: FileText,
    },
    {
        id: "excel",
        label: "Excel Import",
        icon: FileSpreadsheet,
    },
    {
        id: "images",
        label: "Bulk Images",
        icon: ImageIcon,
    },
];

const BulkAddProducts = () => {
    const [activeTab, setActiveTab] = useState("manual");

    return (
        <Container>
            {/* Horizontal সাইজ কমানো হয়েছে (max-w-5xl) এবং font-pop যুক্ত করা হয়েছে */}
            <div className="mx-auto max-w-5xl space-y-6 font-pop">
                
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Bulk Add Products
                    </h1>
                    <p className="text-sm text-gray-500">
                        Add products manually, import using CSV/Excel, or upload bulk product images.
                    </p>
                </div>

                {/* Card */}
                <div className="overflow-hidden rounded-2xl border border-brdr bg-white shadow-sm">
                    
                    {/* Tabs (Premium UI with smooth transitions) */}
                    <div className="flex flex-wrap border-b border-brdr bg-gray-50/50">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative flex flex-1 items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-300 md:flex-none md:min-w-[180px] ${
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

                    {/* Content */}
                    <div className="p-6 md:p-8">
                        {activeTab === "manual" && <ManualBulkForm />}
                        
                        {activeTab === "csv" && <CsvImport />}
                        
                        {activeTab === "excel" && <ExcelImport />}
                        
                        {activeTab === "images" && <BulkImageUpload />}
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default BulkAddProducts;