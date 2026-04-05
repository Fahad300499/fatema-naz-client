
import { createBrowserRouter } from "react-router";
import MainLayouts from "../Layouts/MainLayouts";
import Home from "../Components/Home/Home";
import PerTripCost from "../Pages/PerTripCost";
import TripHistory from "../Pages/TripHistory";
import FatemaNazDetails from "../Pages/FatemaNazDetails";
import TotalLory from "../Pages/TotalLory";
import Chalan from "../Pages/Chalan";
import ChalanReport from "../Pages/ChalanReport";
import LoryWork from "../Pages/LoryWork";
import PrivateRoute from "./PrivateRoute";
import Login from "../Pages/Login/Login";
import LoryWorkHistory from "../Pages/LoryWorkHistory";
import ImamHossenDetails from "../Pages/ImamHossenDetails";
import SahenaDetails from "../Pages/SahenaDetails";
import PerTripCostImam from "../Pages/PerTripCostImam";
import TripHistoryImam from "../Pages/TripHistoryImam";
import PerTripCostSahena from "../Pages/PerTripCostSahena";
import TripHistorySahena from "../Pages/TripHistorySahena";
import TotalLoryImam from "../Pages/TotalLoryImam";
import TotalLorySahena from "../Pages/TotalLorySahena";
import ChalanSahena from "../Pages/ChalanSahena";
import ChalanImam from "../Pages/ChalanImam";
import ChalanReportImam from "../Pages/ChalanReportImam";
import ChalanReportSahena from "../Pages/ChalanReportSahena";
import LoryWorkImam from "../Pages/LoryWorkImam";

import LoryWorkSahena from "../Pages/LoryWorkSahena";
import LoryWorkHistoryImam from "../Pages/LoryWorkHistoryImam";
import LoryWorkHistorySahena from "../Pages/LoryWorkHistorySahena";
import AdminSecurity from "../Pages/AdminSecurity";
import UpdateLory from "../Pages/UpdateLory";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayouts></MainLayouts>,
    children: [
        {
            path: "/",
            element: <Home></Home>
        },
        {
          path:"/login",
          element: <Login></Login>
        },
        {
          path:"/per-trip-cost",
          element: <PerTripCost></PerTripCost>
        },
        {
          path:"/per-trip-cost-imam",
          element: <PerTripCostImam></PerTripCostImam>
        },
        {
          path:"/per-trip-cost-sahena",
          element: <PerTripCostSahena></PerTripCostSahena>
        },
        {
          path:"/trip-history",
          element:<TripHistory></TripHistory>
        },
        {
          path:"/trip-history-imam",
          element:<TripHistoryImam></TripHistoryImam>
        },
        {
          path:"/trip-history-sahena",
          element:<TripHistorySahena></TripHistorySahena>
        },
        {
          path:"/fatema-naz-details",
          element: <PrivateRoute><FatemaNazDetails></FatemaNazDetails></PrivateRoute>
        },
        {
          path:"/imam-hossain-details",
          element: <PrivateRoute><ImamHossenDetails></ImamHossenDetails></PrivateRoute>
        },
        {
          path:"/sahena-details",
          element: <PrivateRoute><SahenaDetails></SahenaDetails></PrivateRoute>
        },
        {
          path:"/fatema-total-lory",
          element: <TotalLory></TotalLory>
        },
        {
          path:"/imam-total-lory",
          element:<TotalLoryImam></TotalLoryImam>
        },
        {
          path:"/sahena-total-lory",
          element:<TotalLorySahena></TotalLorySahena>
        },
        {
          path:"/dip-chalan",
          element: <Chalan></Chalan>
        },
        {
          path:"/dip-chalan-imam",
          element:<ChalanImam></ChalanImam>
        },
        {
          path:"/dip-chalan-sahena",
          element: <ChalanSahena></ChalanSahena>
        },
        {
          path: "/chalan-report",
          element: <ChalanReport></ChalanReport>
        },
         {
          path: "/chalan-report-imam",
          element: <ChalanReportImam></ChalanReportImam>
        },
         {
          path: "/chalan-report-sahena",
          element: <ChalanReportSahena></ChalanReportSahena>
        },
        {
          path:"/lory-work",
          element: <LoryWork></LoryWork>
        },
        {
          path:"/lory-work-imam",
          element: <LoryWorkImam></LoryWorkImam>
        },
        {
          path:"/lory-work-sahena",
          element: <LoryWorkSahena></LoryWorkSahena>
        },
        {
          path:"/lory-work-history",
          element: <LoryWorkHistory></LoryWorkHistory>
        },
        {
          path:"/lory-work-history-imam",
          element: <LoryWorkHistoryImam></LoryWorkHistoryImam>
        },
        {
          path:"/lory-work-history-sahena",
          element: <LoryWorkHistorySahena></LoryWorkHistorySahena>
        },
        {
          path:"/security-password",
          element: <AdminSecurity></AdminSecurity>
        },
        {
          path:"/edit-lory/:id",
          element: <UpdateLory></UpdateLory>
        },
    ]
  },
]);



