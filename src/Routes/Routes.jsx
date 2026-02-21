
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
          path:"/trip-history",
          element:<TripHistory></TripHistory>
        },
        {
          path:"/fatema-naz-details",
          element: <PrivateRoute><FatemaNazDetails></FatemaNazDetails></PrivateRoute>
        },
        {
          path:"/fatema-total-lory",
          element: <TotalLory></TotalLory>
        },
        {
          path:"/dip-chalan",
          element: <Chalan></Chalan>
        },
        {
          path: "/chalan-report",
          element: <ChalanReport></ChalanReport>
        },
        {
          path:"/lory-work",
          element: <LoryWork></LoryWork>
        },
        {
          path:"/lory-work-history",
          element: <LoryWorkHistory></LoryWorkHistory>
        }
    ]
  },
]);



