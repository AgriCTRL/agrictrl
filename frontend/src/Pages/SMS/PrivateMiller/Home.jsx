import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Carousel } from "primereact/carousel";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";

import {
  ArrowRightLeft,
  CheckCircle2,
  ChevronRight,
  Factory,
  Fan,
  Loader2,
  Undo2,
  User,
  WheatOff,
} from "lucide-react";

import { useAuth } from "../../Authentication/Login/AuthContext";
import PrivateMillerLayout from "@/Layouts/Miller/PrivateMillerLayout";
import EmptyRecord from "@/Components/EmptyRecord";
import { Tag } from "primereact/tag";
import { Accordion, AccordionTab } from "primereact/accordion";

function Home({ isRightSidebarOpen }) {
  const { user } = useAuth();
  const [userFullName] = useState(`${user.firstName} ${user.lastName}`);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [millingBatches, setMillingBatches] = useState([
    {
      id: 1,
      startDateTime: "2024-11-01T10:30:00Z",
      status: "In Progress",
    },
    {
      id: 2,
      startDateTime: "2024-11-10T14:00:00Z",
      status: "Completed",
    },
    {
      id: 3,
      startDateTime: "2024-11-15T08:45:00Z",
      status: "Pending",
    },
    {
      id: 4,
      startDateTime: "2024-11-18T13:20:00Z",
      status: "In Progress",
    },
  ]);

  const viewAllTransactions = () => {
    navigate("/miller/transactions");
  };

  const fetchMillingBatches = async () => {
    try {
      const millerRes = await fetch(`${apiUrl}/millers/user/${user.id}`);
      const miller = await millerRes.json();
      const millingBatchesRes = await fetch(
        `${apiUrl}/millingbatches?millerId=${miller.id}&status=In%20Progress`
      );
      const millingBatchesData = await millingBatchesRes.json();
      setMillingBatches(millingBatchesData);
    } catch (error) {
      console.error("Error fetching milling batches:", error);
    }
  };

  useEffect(() => {
    fetchMillingBatches();
  }, []);

  const [carouselItems] = useState([
    {
      title: "Traceability Power",
      description:
        "Discover where is the source of the rice you consume, the processes it took before the palay become a bigas.",
      image: "palay.png",
    },
    {
      title: "Decentralized Records",
      description:
        "Utilizing ICP Blockchain Backend and Frontend Services, we can securely save and collect data.",
      image: "palay.png",
    },
    {
      title: "Supply Chain Management",
      description:
        "Manage the entire supply chain of rice through simple to understand user interfaces.",
      image: "palay.png",
    },
  ]);

  const formatDate = (date) => {
    const formattedDate = new Date(date).toISOString().split("T")[0];

    return new Date(formattedDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const Orders = millingBatches.map((batch) => ({
    icon: <Fan size={18} />,
    title: `Order #${batch.id}`,
    date: formatDate(batch.startDateTime),
    value: batch.status,
  }));

  // LEFT SIDEBAR
  const millingStatsSummary = [
    { icon: <Loader2 size={18} />, title: "Milling Requests", value: 0 },
    { icon: <Factory size={18} />, title: "In Milling", value: 0 },
    { icon: <CheckCircle2 size={18} />, title: "To Return", value: 0 },
  ];

  const leftSidebar = () => {
    return (
      <div className={`flex flex-col items-center`}>
        {/* Gradient background */}
        <div className="relative w-full bg-gradient-to-r from-secondary to-primary h-16 rounded-t-lg flex items-center justify-center">
          {/* Avatar */}
          <Avatar
            size="xlarge"
            image={user.avatar ?? null}
            icon={<User size={24} />}
            shape="circle"
            className="cursor-pointer border-2 border-white text-primary bg-tag-grey absolute bottom-0 translate-y-1/2 shadow-lg"
          />
        </div>
        <div className="w-full rounded-b-md bg-white flex flex-col gap-2 pt-12 px-4 pb-4">
          {/* Name and Position */}
          <div className="flex flex-col items-center pb-2">
            <h1 className="text-lg font-medium text-black">
              {user.firstName && user.lastName ? userFullName : "username"}
            </h1>
            <p className="text-sm text-gray-400">
              {user.userType.toLowerCase()}
            </p>
          </div>

          <Divider className="my-0" />

          {/* Stat Items */}
          {/* <div className="flex flex-col w-full">
            {personalStats.map((stat, index) => (
              <div className="flex items-center hover:bg-background rounded-md pr-5">
                <Button
                  text
                  className="cursor-default pr-0 ring-0 w-full bg-transparent text-black flex justify-between"
                >
                  <div className="flex gap-4 items-center">
                    {stat.icon}
                    <p>{stat.title}</p>
                  </div>
                </Button>
                <Badge value={stat.value} className="ml-auto bg-primary" />
              </div>
            ))}
          </div> */}
        </div>
      </div>
    );
  };

  // RIGHT SIDE
  const [rightSidebarItems, setRightSidebarItems] = useState([]);

  const rightSidebar = () => {
    return (
      <div className="p-4 bg-white rounded-lg flex flex-col gap-4">
        <div className="header flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-black">
            What's on the field
          </h2>
          <Divider className="my-0" />
        </div>
        <div className="flex flex-col gap-2">
          {rightSidebarItems.length > 0 ? (
            <Accordion
              expandIcon="false"
              collapseIcon="false"
              className="right-sidebar-accordion"
            >
              {rightSidebarItems.map((item, index) => {
                return (
                  <AccordionTab
                    key={index}
                    header={
                      <span className="flex items-center gap-4 w-full">
                        <ArrowRightLeft size={18} />
                        <div className="flex flex-col gap-2">
                          <span className="font-medium">{item.batchId}</span>
                          <small className="font-light">
                            {item.date_updated}
                          </small>
                        </div>
                        <Tag
                          value={item.status.toUpperCase()}
                          className="bg-light-grey font-semibold ml-auto"
                          rounded
                        ></Tag>
                      </span>
                    }
                    className="bg-none"
                  ></AccordionTab>
                );
              })}
            </Accordion>
          ) : (
            <div className="w-full flex flex-col justify-center items-center gap-4 p-4">
              <WheatOff size={32} className="text-primary" />
              <p className="text-black text-lg font-semibold">
                No data to show.
              </p>
              <p className="text-gray-600 text-center">
                It looks like there are no milling transactions recorded yet.
                Start managing your transactions to view them here.
              </p>

              {/* Button */}
              <Button
                outlined
                className="w-full max-w-md ring-0 text-primary border-primary hover:bg-primary hover:text-white flex justify-center"
                onClick={() => navigate("/miller/transactions")}
              >
                Go to Milling Transactions
              </Button>
            </div>
          )}
          {rightSidebarItems.length > 0 && (
            <Button
              text
              className="ring-0 transition-all gap-4 hover:gap-6 hover:bg-transparent text-primary flex justify-end"
              onClick={() => navigate("/miller/transactions")}
            >
              <p className="text-md font-medium">View All</p>
              <ChevronRight size={18} />
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <PrivateMillerLayout
      activePage="Home"
      user={user}
      leftSidebar={leftSidebar()}
      isLeftSidebarOpen={true}
      isRightSidebarOpen={true}
      rightSidebar={rightSidebar()}
    >
      <div className={`flex flex-row bg-[#F1F5F9] h-full`}>
        {/* Main Content */}
        <div className={`flex flex-col w-full h-full gap-4`}>
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col text-black">
              <h1 className="text-xl">Welcome Back,</h1>
              <h1 className="text-2xl sm:text-4xl font-semibold">
                {user.first_name ?? "User"}!
              </h1>
            </div>
            <Button
              text
              className="ring-0 transition-all gap-4 hover:gap-6 hover:bg-transparent text-primary flex justify-between"
              onClick={() => navigate("/miller/transactions")}
            >
              <p className="text-md font-medium">View your transactions</p>
              <ChevronRight size={18} />
            </Button>
          </div>

          {/* Carousel for Image Section */}
          <Carousel
            value={carouselItems}
            numVisible={1}
            numScroll={1}
            className="custom-carousel"
            itemTemplate={(item) => (
              <div className="relative rounded-lg overflow-hidden mb-2 md:h-70 sm:h-64">
                <div className="h-full">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bg-gradient-to-r from-[#2A2A2A] to-transparent inset-0 flex flex-col gap-4 p-10">
                  <div className="text-green-400 flex items-center gap-4">
                    <Fan />
                    <p>What We Offer</p>
                  </div>
                  <h1 className="text-white text-heading font-bold mb-2">
                    {item.title}
                  </h1>
                  <p className="text-white mb-4">{item.description}</p>
                </div>
              </div>
            )}
            showIndicators={true}
            showNavigators={false}
            autoplayInterval={7000}
            pt={{
              root: {},
              indicators: {
                className:
                  "absolute w-100 bottom-0 flex justify-content-center",
              },
            }}
          />

          <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-xl font-medium">Milling Orders</h1>
              <Button
                text
                className="ring-0 transition-all gap-4 hover:gap-6 hover:bg-transparent text-primary flex justify-between"
                onClick={() => navigate("/miller/transactions")}
              >
                <p className="text-md font-medium">View All</p>
                <ChevronRight size={18} />
              </Button>
            </div>

            {/* Carousel for Orders */}
            {Orders.length === 0 && (
              // <div className="flex flex-row justify-center items-center mt-10">
              //     <h1 className="text-lg font-medium">No Milling Orders Found</h1>
              // </div>
              <EmptyRecord label="No Milling Orders Found" />
            )}
            {Orders.length > 0 && (
              <Carousel
                value={Orders}
                numVisible={3}
                numScroll={1}
                className="custom-carousel miller-transactions-carousel relative"
                itemTemplate={(stat) => (
                  <div className="flex overflow-hidden h-full">
                    <div className="flex flex-col h-full w-full p-4 gap-2 rounded-md bg-white">
                      <div className="w-fit p-4 rounded-lg bg-background text-primary">
                        {stat?.icon}
                      </div>

                      <div className="flex flex-col text-black">
                        <h1 className="font-semibold">{stat?.title}</h1>
                        <h1 className="text-sm font-light">
                          as of {stat?.date}
                        </h1>
                      </div>

                      <Tag
                        value={stat?.value}
                        className="bg-tag-grey text-black w-1/2"
                      ></Tag>
                    </div>
                  </div>
                )}
                showIndicators={false}
                showNavigators={true}
              />
            )}
          </div>
        </div>
      </div>
    </PrivateMillerLayout>
  );
}

export default Home;
