import React from "react";
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
import PerTripCostDiba from "../Pages/PerTripCostDiba";
import TripHistoryDiba from "../Pages/TripHistoryDiba";
import DibaDetails from "../Pages/DibaDetails";
import TotalLoryDiba from "../Pages/TotalLoryDiba";
import ChalanDiba from "../Pages/ChalanDiba";
import ChalanReportDiba from "../Pages/ChalanReportDiba";
import LoryWorkDiba from "../Pages/LoryWorkDiba";
import LoryWorkHistoryDiba from "../Pages/LoryWorkHistoryDiba";
import ChangeRole from "../Pages/ChangeRole";
import FineReport from "../Pages/FineReport";
import SecurityReport from "../Pages/SecurityReport";
import ExtraFineReport from "../Pages/ExtraFineReport";
import DieselReport from "../Pages/DieselReport";
import FineReportImam from "../Pages/FineReportImam";
import SecurityReportImam from "../Pages/SecurityReportImam";
import ExtraFineReportImam from "../Pages/ExtraFineReportImam";
import DieselReportImam from "../Pages/DieselReportImam";
import FineReportDiba from "../Pages/FineReportDiba";
import SecurityReportDiba from "../Pages/SecurityReportDiba";
import ExtraFineReportDiba from "../Pages/ExtraFineReportDiba";
import DieselReportDiba from "../Pages/DieselReportDiba";
import FineReportSahena from "../Pages/FineReportSahena";
import SecurityReportSahena from "../Pages/SecurityReportSahena";
import ExtraFineReportSahena from "../Pages/ExtraFineReportSahena";
import DieselReportSahena from "../Pages/DieselReportSahena";
import NetSalaryReport from "../Pages/NetSalaryReport";
import GrossSalaryReport from "../Pages/GrossSalaryReport";
import GrossSalaryReportDiba from "../Pages/GrossSalaryReportDiba";
import NetSalaryReportDiba from "../Pages/NetsalaryReportDiba";
import GrossSalaryReportImam from "../Pages/GrossSalaryReportImam";
import NetSalaryReportImam from "../Pages/NetSalaryReportImam";
import GrossSalaryReportSahena from "../Pages/GrossSalaryReportSahena";
import NetSalaryReportSahena from "../Pages/NetSalaryReportSahena";
import ShortCalculation from "../Pages/ShortCalculation";
import ShortHistory from "../Pages/ShortHistory";
import ShortCalculationImam from "../Pages/ShortCalculationImam";
import ShortHistoryImam from "../Pages/ShortHistoryImam";
import ShortCalculationSahena from "../Pages/ShortCalculationSahena";
import ShortHistorySahena from "../Pages/ShortHistorySahena";
import ShortCalculationDiba from "../Pages/ShortCalculationDiba";
import ShortHistoryDiba from "../Pages/ShortHistoryDiba";


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
          path:"/per-trip-cost-diba",
          element: <PerTripCostDiba></PerTripCostDiba>
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
          path:"/trip-history-diba",
          element:<TripHistoryDiba></TripHistoryDiba>
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
          path:"/diba-details",
          element: <PrivateRoute><DibaDetails></DibaDetails></PrivateRoute>
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
          path:"/diba-total-lory",
          element:<TotalLoryDiba></TotalLoryDiba>
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
          path:"/dip-chalan-diba",
          element: <ChalanDiba></ChalanDiba>
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
          path: "/chalan-report-diba",
          element: <ChalanReportDiba></ChalanReportDiba>
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
          path:"/lory-work-diba",
          element: <LoryWorkDiba></LoryWorkDiba>
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
          path:"/lory-work-history-diba",
          element: <LoryWorkHistoryDiba></LoryWorkHistoryDiba>
        },




         {
          path:"/short-calculation",
          element: <ShortCalculation></ShortCalculation>
        },
        {
          path:"/short-history",
          element: <ShortHistory></ShortHistory>
        },





         {
          path:"/short-calculation-imam",
          element: <ShortCalculationImam></ShortCalculationImam>
        },
        {
          path:"/short-history-imam",
          element: <ShortHistoryImam></ShortHistoryImam>
        },





        {
          path:"/short-calculation-sahena",
          element: <ShortCalculationSahena></ShortCalculationSahena>
        },
        {
          path:"/short-history-sahena",
          element: <ShortHistorySahena></ShortHistorySahena>
        },





        {
          path:"/short-calculation-diba",
          element: <ShortCalculationDiba></ShortCalculationDiba>
        },
        {
          path:"/short-history-diba",
          element: <ShortHistoryDiba></ShortHistoryDiba>
        },







     
        {
          path:"/security-password",
          element: <AdminSecurity></AdminSecurity>
        },
         {
          path:"/change-role",
          element: <ChangeRole></ChangeRole>
        },
        {
          path:"/edit-lory/:id",
          element: <UpdateLory></UpdateLory>
        },




        
        {
          path: "/gross-sallery",
          element: <GrossSalaryReport></GrossSalaryReport>
        },
        {
          path: "/net-sallery",
          element: <NetSalaryReport></NetSalaryReport>
        },
        {
          path: "/fine-report",
          element: <FineReport></FineReport>
        },
        {
          path: "/security-report",
          element: <SecurityReport></SecurityReport>
        },
        {
          path: "/extra-fine-report",
          element: <ExtraFineReport></ExtraFineReport>
        },
        {
          path:  "/diesel-report",
          element: <DieselReport></DieselReport>
        },




        {
          path: "/gross-sallery-imam",
          element: <GrossSalaryReportImam></GrossSalaryReportImam>
        },
        {
          path: "/net-sallery-imam",
          element: <NetSalaryReportImam></NetSalaryReportImam>
        },
         {
          path: "/fine-report-imam",
          element: <FineReportImam></FineReportImam>
        },
        {
          path: "/security-report-imam",
          element: <SecurityReportImam></SecurityReportImam>
        },
        {
          path: "/extra-fine-report-imam",
          element: <ExtraFineReportImam></ExtraFineReportImam>
        },
        {
          path:  "/diesel-report-imam",
          element: <DieselReportImam></DieselReportImam>
        },
        




        {
          path: "/gross-sallery-diba",
          element: <GrossSalaryReportDiba></GrossSalaryReportDiba>
        },
        {
          path: "/net-sallery-diba",
          element: <NetSalaryReportDiba></NetSalaryReportDiba>
        },
        {
          path: "/fine-report-diba",
          element: <FineReportDiba></FineReportDiba>
        },
        {
          path: "/security-report-diba",
          element: <SecurityReportDiba></SecurityReportDiba>
        },
        {
          path: "/extra-fine-report-diba",
          element: <ExtraFineReportDiba></ExtraFineReportDiba>
        },
        {
          path:  "/diesel-report-diba",
          element: <DieselReportDiba></DieselReportDiba>
        },
        





         {
          path: "/gross-sallery-sahena",
          element: <GrossSalaryReportSahena></GrossSalaryReportSahena>
        },
        {
          path: "/net-sallery-sahena",
          element: <NetSalaryReportSahena></NetSalaryReportSahena>
        },
        {
          path: "/fine-report-sahena",
          element: <FineReportSahena></FineReportSahena>
        },
        {
          path: "/security-report-sahena",
          element: <SecurityReportSahena></SecurityReportSahena>
        },
        {
          path: "/extra-fine-report-sahena",
          element: <ExtraFineReportSahena></ExtraFineReportSahena>
        },
        {
          path:  "/diesel-report-sahena",
          element:<DieselReportSahena></DieselReportSahena>
        },
        
    ]
  },
]);



