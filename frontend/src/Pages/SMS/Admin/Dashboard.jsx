import React, { useState, useEffect, useRef  } from "react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import CardComponent from "@/Components/CardComponent";
import { Button } from "primereact/button";
import { FileDown } from "lucide-react";

import pdfDashboardExport from "../../../Components/Pdf/pdfDashboardExport";

import Stats from "@/Components/Admin/Dashboard/Stats";
import UserDemographic from "@/Components/Admin/Dashboard/UserDemographic";
import NfaFacilities from "@/Components/Admin/Dashboard/NfaFacilities";
import MillingStatusChart from "@/Components/Admin/Dashboard/MillingStatusChart";
import ProcessingStatusChart from "@/Components/Admin/Dashboard/ProcessingStatusChart";
import WetDryInventoryChart from "@/Components/Admin/Dashboard/WetDryInventoryChart";
import InventoryAnalytics from "@/Components/Admin/Dashboard/InventoryAnalytics";
import MonthlyBatchCountAnalytics from "@/Components/Admin/Dashboard/MonthlyBatchCountAnalytics";
import WarehouseInventoryTrend from "../../../Components/Admin/Dashboard/WarehouseInventoryTrend";
import RiceInventoryLevels from "../../../Components/Admin/Dashboard/RiceInventoryLevel";
import MillerEfficiencyComparison from "../../../Components/Admin/Dashboard/MillerEfficiencyComparison";
import RiceOrdersAnalytics from "../../../Components/Admin/Dashboard/RiceOrdersAnalytics";

function Dashboard() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // State for Statistics
  const [partnerFarmersCount, setPartnerFarmersCount] = useState(0);
  const [totalPalaysCount, setTotalPalaysCount] = useState(0);
  const [totalRiceCount, setTotalRiceCount] = useState(0);
  const [riceSoldCount, setRiceSoldCount] = useState(0);

  // State for Palay Inventory
  const [palayBatches, setPalayBatches] = useState([]);

  // State for Supplier Category
  const [supplierCategories, setSupplierCategories] = useState({
    individual: 0,
    coop: 0,
  });

  // State for NFA Facilities
  const [warehousesCount, setWarehousesCount] = useState(0);
  const [dryersCount, setDryersCount] = useState(0);
  const [millersCount, setMillersCount] = useState(0);

  const [interpretations, setInterpretations] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Partner Farmers Count (unique by Fname and Lname)
        const partnerFarmersRes = await fetch(
          `${apiUrl}/palaySuppliers/count`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const partnerFarmersData = await partnerFarmersRes.json();
        setPartnerFarmersCount(partnerFarmersData);

        // Fetch Total Palays Count
        const totalPalaysRes = await fetch(`${apiUrl}/palaybatches/count`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const totalPalaysData = await totalPalaysRes.json();
        setTotalPalaysCount(totalPalaysData);

        // Fetch Total Rice Count
        const totalRiceRes = await fetch(`${apiUrl}/ricebatches/count`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const totalRiceData = await totalRiceRes.json();
        setTotalRiceCount(totalRiceData);

        // Fetch Rice Sold Count
        const riceSoldRes = await fetch(`${apiUrl}/riceorders/count`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const riceSoldData = await riceSoldRes.json();
        setRiceSoldCount(riceSoldData);

        // Fetch Palay Inventory (Wet/Dry)
        const palayInventoryRes = await fetch(`${apiUrl}/palaybatches`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const palayInventoryData = await palayInventoryRes.json();
        setPalayBatches(palayInventoryData);

        // Fetch Supplier Categories
        const suppliersRes = await fetch(`${apiUrl}/palaysuppliers`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const suppliersData = await suppliersRes.json();
        const individualCount = suppliersData.filter(
          (supplier) => supplier.category === "individual"
        ).length;
        const coopCount = suppliersData.filter(
          (supplier) => supplier.category === "coop"
        ).length;
        setSupplierCategories({ individual: individualCount, coop: coopCount });

        // Fetch NFA Facilities Counts
        const warehousesRes = await fetch(`${apiUrl}/warehouses/count`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const warehousesData = await warehousesRes.json();
        setWarehousesCount(warehousesData);

        const millersRes = await fetch(`${apiUrl}/millers/count`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const millersData = await millersRes.json();
        setMillersCount(millersData);

        const dryersRes = await fetch(`${apiUrl}/dryers/count`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const dryersData = await dryersRes.json();
        setDryersCount(dryersData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const handleExport = () => {
    const exportData = {
      partnerFarmersCount,
      totalPalaysCount,
      totalRiceCount,
      riceSoldCount,
      supplierCategories,
      warehousesCount,
      dryersCount,
      millersCount,
      palayBatches,
    };

    pdfDashboardExport(exportData, interpretations);
  };

  return (
    <div className="relative">
      <AdminLayout activePage="Dashboard">
        <div className="flex flex-col gap-4">
          <Stats
            partnerFarmersCount={partnerFarmersCount}
            totalPalaysCount={totalPalaysCount}
            totalRiceCount={totalRiceCount}
            riceSoldCount={riceSoldCount}
          />

          <div className="grid grid-rows-3 grid-cols-3 gap-4">
            {/* <PalayInventory palayBatches={palayBatches} /> */}

            <UserDemographic supplierCategories={supplierCategories} setInterpretations={setInterpretations}/>

            <CardComponent className="bg-white transition hover:shadow-lg row-span-1">
              <ProcessingStatusChart palayBatches={palayBatches} setInterpretations={setInterpretations}/>
            </CardComponent>

            <CardComponent className="bg-white transition hover:shadow-lg">
              <InventoryAnalytics setInterpretations={setInterpretations}/>
            </CardComponent>

            {/* <CardComponent className="bg-white transition hover:shadow-lg">
              <WetDryInventoryChart palayBatches={palayBatches} />
            </CardComponent> */}

            <CardComponent className="bg-white transition hover:shadow-lg">
              <MillingStatusChart palayBatches={palayBatches} setInterpretations={setInterpretations}/>
            </CardComponent>

            <CardComponent className="bg-white transition hover:shadow-lg col-span-2">
              <NfaFacilities
                warehousesCount={warehousesCount}
                dryersCount={dryersCount}
                millersCount={millersCount}
                setInterpretations={setInterpretations}
              />
            </CardComponent>

            <CardComponent className="bg-white transition hover:shadow-lg">
              <MonthlyBatchCountAnalytics apiUrl={apiUrl} setInterpretations={setInterpretations}/>
            </CardComponent>

            <CardComponent className="bg-white transition hover:shadow-lg">
              <RiceInventoryLevels apiUrl={apiUrl} setInterpretations={setInterpretations}/>
            </CardComponent>

            <CardComponent className="bg-white transition hover:shadow-lg">
              <MillerEfficiencyComparison apiUrl={apiUrl} setInterpretations={setInterpretations}/>
            </CardComponent>

            <CardComponent className="bg-white transition hover:shadow-lg col-span-2">
              <RiceOrdersAnalytics apiUrl={apiUrl} setInterpretations={setInterpretations}/>
            </CardComponent>  

            <CardComponent className="bg-white transition hover:shadow-lg">
              <WarehouseInventoryTrend apiUrl={apiUrl} setInterpretations={setInterpretations}/>
            </CardComponent>

            
            
          </div>
        </div>
      </AdminLayout>
      <div className="fixed right-14 bottom-20 z-50">
        <Button
          onClick={handleExport}
          className="rounded-lg shadow-2xl hover:shadow-2xl transition-shadow duration-200 bg-primary flex items-center gap-2 px-4 py-4"
        >
          <FileDown className="w-5 h-5" />
          <span>Export PDF</span>
        </Button>
      </div>
    </div>
  );
}

export default Dashboard;
