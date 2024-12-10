import { React } from "react";
import { useNavigate } from "react-router-dom";

import { HandCoins, Wheat, Sprout, Microwave } from "lucide-react";

import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";

const questions = [
    {
        question: "What is AgriCTRL+?",
        answer:
            "AgriCTRL+ is a digital solution designed for the National Food Authority (NFA) to chain, trace, review, and locate rice grains throughout the supply chain. It modernizes operations by enabling real-time tracking, improving transparency, and supporting efficient rice management.",
        icon: <HandCoins className="text-primary size-5 md:size-8" />,
    },
    {
        question: "Why does the NFA need AgriCTRL+?",
        answer: 
            "The NFA currently lacks a comprehensive tracking system for its rice production and distribution. AgriCTRL+ addresses this gap by providing tools for real-time monitoring, traceability, and data-driven decision-making, ensuring operational efficiency and accountability.",
        icon: <Sprout className="text-primary size-5 md:size-8" />,
    },
    {
        question: "How does AgriCTRL+ improve transparency and accountability?",
        answer:
            "By digitally recording and verifying each stage of the rice supply chain, AgriCTRL+ eliminates manual errors and reduces the risk of misrepresentation or manipulation of information, fostering transparency and accountability.",
        icon: <Microwave className="text-primary size-5 md:size-8" />,
    },
    {
        question: "What specific challenges does AgriCTRL+ address?",
        answer:
            "AgriCTRL+ addresses challenges such as lack of real-time monitoring of rice stocks, inefficient manual data collection and storage, challenges in tracking rice from procurement to distribution, and environmental unpredictability and farmers' selling preferences.",
        icon: <Microwave className="text-primary size-5 md:size-8" />,
    },
    {
        question: "How does AgriCTRL+ align with the NFA’s ISSP?",
        answer:
            "AgriCTRL+ supports the NFA’s Information Systems Strategic Plan by modernizing operations, enhancing transparency, and improving accountability, aligning perfectly with the agency’s digital transformation goals.",
        icon: <Microwave className="text-primary size-5 md:size-8" />,
    },
    {
        question: "What are the key features of AgriCTRL+?",
        answer:
            "AgriCTRL+ offers four core functionalities: Chaining tracks batches of palay and rice through every stage, from procurement to distribution. Tracing ensures detailed traceability at each step, while Reviewing provides real-time visibility of rice stocks. Lastly, Locating enhances the ability to pinpoint and verify stock locations efficiently.",
        icon: <Microwave className="text-primary size-5 md:size-8" />,
    },
    {
        question: "Does AgriCTRL+ support sustainable development goals (SDGs)?",
        answer:
            "Yes, it aligns with SDG 2 (Zero Hunger), SDG 9 (Industry, Innovation, and Infrastructure), and SDG 12 (Responsible Consumption and Production) by improving food security, promoting technological innovation, and reducing losses in the supply chain.",
        icon: <Microwave className="text-primary size-5 md:size-8" />,
    },
    {
        question: "How does AgriCTRL+ support decision-making?",
        answer:
            "The system provides actionable insights from real-time data, helping the NFA optimize its operations and make informed decisions to meet demand efficiently.",
        icon: <Microwave className="text-primary size-5 md:size-8" />,
    },
    {
        question: "Is AgriCTRL+ ready for implementation?",
        answer:
            "Yes, AgriCTRL+ has been developed with NFA’s needs in mind, validated through interviews and research, and is designed for seamless integration with NFA operations.",
        icon: <Microwave className="text-primary size-5 md:size-8" />,
    },
    {
        question: "Who benefits from AgriCTRL+?",
        answer:
            "AgriCTRL+ benefits multiple stakeholders. The NFA gains improved efficiency and accountability, while farmers enjoy greater trust and transparency in the supply chain. Ultimately, the nation benefits from enhanced food security and better resource management.",
        icon: <Microwave className="text-primary size-5 md:size-8" />,
    },
];

const Faqs = () => {
    const navigate = useNavigate();
    const handleGetStarted = async () => {
        navigate("/login");
    };

    return (
        <section
            id="ourMissionSection"
            className="bg-[#1f1f1f] text-white relative h-fit w-screen flex flex-col lg:flex-row gap-12 
            px-4 sm:px-12 lg:px-24 
            pt-6 sm:pt-12 lg:pt-24 
            pb-6 sm:pb-12 lg:pb-24"
        >
            <section className="w-full h-full lg:w-2/5 flex flex-col gap-2 md:gap-6">
                <div className="title font-semibold text-primary flex items-center justify-center md:justify-start gap-2 md:gap-4">
                    <Wheat className="size-5 md:size-8" />
                    <p className="text-sm md:text-base">Frequently Asked Questions</p>
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold text-center md:text-left">
                    Have questions in mind? Let us answer it
                </h1>
            </section>

            {/* Right Side */}
            <section className="w-full lg:w-3/5 flex flex-col">
                <div className="w-full flex flex-col gap-6">
                    <Accordion 
                        className="flex flex-col gap-2"
                    >
                        {questions.map((question, index) => (
                            <AccordionTab 
                                header={question.question}
                                pt={{
                                    headerAction: {
                                        className: "text-sm md:text-base bg-tag-grey/10 text-white font-semibold hover:text-tag-grey transition duration-300",
                                    },
                                    content: {
                                        className: "bg-transparent text-white",
                                    },
                                }}
                            >
                                <p className="m-0 text-sm md:text-base">
                                    {question.answer}
                                </p>
                            </AccordionTab>
                        ))}
                    </Accordion>
                </div>
            </section>
        </section>
    );
};

export default Faqs;
