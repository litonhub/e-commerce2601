import { Outlet } from "react-router";
import AdminSidebar from "../../components/admindashboard/AdminSidebar";
import AdminTopbar from "../admindashboard/AdminTopbar";


const DashboardLayout = () => {
    return (
            <div className="flex min-h-screen">

            <AdminSidebar />

            <div className="flex-1 flex flex-col">

                <AdminTopbar />

                <div className="p-6">
                    <Outlet />
                </div>

            </div>

        </div>
    );
};

export default DashboardLayout;