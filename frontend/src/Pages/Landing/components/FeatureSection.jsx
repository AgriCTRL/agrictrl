import { React } from 'react';
import { Carousel } from 'primereact/carousel';
import { Bean, Link, ShoppingBasket, ShieldPlus, HandCoins, Wheat, Search } from 'lucide-react';

const features = [
    {
        title: 'AgriCTRL+TnT',
        subtitle: '(Track ‘n Trace App)',
        description: 'Increasing consumer confidence for the bigas that they purchase. Ensuring transparency and traceability in the rice supply chain. Consumers can make informed choices about the rice they bought, knowing its origin and quality.',
        icon: <Bean className="text-primary h-12 w-12" />,
    },
    {
        title: 'AgriCTRL+SMS',
        subtitle: '(Supply Chain Management Software)',
        description: 'Building resilient infrastructure, promoting inclusive and sustainable industrialization, and fostering innovation. The platform provides a modern and efficient way to manage agricultural data and the rice supply chain, contributing to the digital transformation of the agricultural sector.',
        icon: <Link className="text-primary h-12 w-12" />,
    },
    {
        title: 'AgriCTRL+ eCommerce',
        subtitle: '',
        description: 'Ensuring that farmers receive fair compensation for their produce. By improving market access and providing better pricing for their harvest.',
        icon: <ShoppingBasket className="text-primary h-12 w-12" />,
    },
    {
        title: 'AgriCTRL+ MIC ',
        subtitle: '(Micro Insurance for Crops)',
        description: 'Protecting our farmers na nasa laylayan. By offering them affordable, accessible and mabilis na Smart Contract-based insurance for their crops.',
        icon: <ShieldPlus className="text-primary h-12 w-12" />,
    },
    {
        title: 'AgriCTRL+ Finance',
        description: 'Offering capital to our local farmer, in the form of NFT crowdfunding.',
        icon: <HandCoins className="text-primary h-12 w-12" />,
    },
];

const FeatureSection = () => {
    const itemTemplate = (feature) => (
        <div className="p-12 flex flex-col h-full w-full font-poppins items-center bg-white shadow-lg rounded-lg">
            {feature.icon}
            <h3 className="text-4xl font-semibold mt-4 mb-2 text-primary">{feature.title}</h3>
            <h3 className="text-xl font-semibold mt-4 mb-2 text-primary">{feature.subtitle}</h3>
            <p className="text-lg text-justify">{feature.description}</p>
        </div>
    );

    return (
        <section id="featureSection" className="relative h-screen pt-5 z-0">
            <div className="container mx-auto">
                <div className="grid grid-cols-2 grid-rows-1 gap-8 justify-center">
                    {/* Left side: Search Buttons */}
                    <div className="relative">
                        <div className="grid grid-cols-3 justify-items-center ">
                            <div 
                                className="absolute inset-0 z-10 pointer-events-none" 
                                style={{ 
                                height: '250px',
                                background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)'
                                }}
                            >
                            </div>
                            <div className="h-36 w-32 ml-10 my-2 shadow-lg border rounded-lg flex flex-col items-center justify-center">
                                <Search className="h-10 w-10 mx-6 my-2 text-primary"/>
                                <p className="text-primary font-bold">Farmer</p>
                            </div>
                            <div className="h-36 w-32 shadow-lg border rounded-lg flex flex-col items-center justify-center translate-y-20">
                                <Search className="h-10 w-10 mx-6 my-2 text-primary"/>
                                <p className="text-primary font-bold">Palay</p>
                            </div>
                            <div className="h-36 w-32 mr-10 shadow-lg border rounded-lg flex flex-col items-center justify-center">
                                <Search className="h-10 w-10 mx-6 my-2 text-primary"/>
                                <p className="text-primary font-bold">Price</p>
                            </div>
                            <div className="h-36 w-32 ml-10 shadow-lg border rounded-lg flex flex-col items-center justify-center">
                                <Search className="h-10 w-10 mx-6 my-2 text-primary"/>
                                <p className="text-primary font-bold">Delivery</p>
                                <p className="text-primary font-bold">Bigas</p>
                            </div>
                            <div className="h-36 w-32 border shadow-lg rounded-lg flex flex-col items-center justify-center translate-y-20">
                                <Search className="h-10 w-10 mx-6 my-2 text-primary"/>
                                <p className="text-primary font-bold">Track</p>
                                <p className="text-primary font-bold">Trace</p>
                            </div>
                            <div className="h-36 w-32 mr-10 my-5 shadow-lg border rounded-lg flex flex-col items-center justify-center">
                                <Search className="h-10 w-10 mx-6 my-2 text-primary"/>
                                <p className="text-primary font-bold">Kanin</p>
                            </div>
                            <div className="h-36 w-32 ml-10 shadow-lg border rounded-lg flex flex-col items-center justify-center">
                                <Search className="h-10 w-10 mx-6 my-2 text-primary"/>
                                <p className="text-primary font-bold">Miller</p>
                            </div>
                            <div className="h-36 w-32 border shadow-lg rounded-lg flex flex-col items-center justify-center translate-y-20">
                                <Search className="h-10 w-10 mx-6 my-2 text-primary"/>
                                <p className="text-primary font-bold">Dryer</p>
                            </div>
                            <div className="h-36 w-32 mr-10 shadow-lg border rounded-lg flex flex-col items-center justify-center">
                                <Search className="h-10 w-10 mx-6 my-2 text-primary"/>
                                <p className="text-primary font-bold">Transparent</p>
                            </div>
                            <div 
                                className="absolute inset-0 z-10 pointer-events-none translate-y-80" 
                                style={{ 
                                height: '59%',
                                background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)'
                                }}
                            >
                            </div>
                        </div>
                    </div>

                    {/* Right side: Features Section */}
                    <div>
                        <div className="flex flex-row py-5">
                            <Wheat className="text-primary h-10 w-10 mr-2"/>
                            <h2 className="text-4xl  text-primary font-bold">Features of AgriCTRL+</h2>
                        </div>

                        <div className="flex flex-col pb-5">
                            <Carousel 
                                value={features} 
                                itemTemplate={itemTemplate} 
                                numVisible={1} 
                                circular 
                                autoplayInterval={4000}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;