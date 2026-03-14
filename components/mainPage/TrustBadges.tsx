import { FaShieldAlt, FaShippingFast, FaHeadset } from "react-icons/fa";

const features = [
    {
        id: 1,
        icon: FaShieldAlt,
        title: "Quality Assurance",
        description: "We use strictly tested ingredients with absolute transparency on purity and performance standards."
    },
    {
        id: 2,
        icon: FaShippingFast,
        title: "Fast Shipping",
        description: "Receive your order at lightning speed. Free express shipping on all orders over $50."
    },
    {
        id: 3,
        icon: FaHeadset,
        title: "24/7 Support",
        description: "Our team of certified nutrition experts is available around the clock to help you reach your goals."
    }
];

export default function TrustBadges() {
    return (
        <section className="base-section my-20">
            {/* The 3-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 max-w-6xl mx-auto">
                
                {features.map((feature) => (
                    <div 
                        key={feature.id} 
                        className="bg-white rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 hover:-translate-y-1 transition-transform duration-300"
                    >
                        {/* Icon Wrapper (Soft Red Circle) */}
                        <div className="bg-red-50 text-[#ec1313] w-16 h-16 rounded-full flex items-center justify-center mb-6">
                            <feature.icon size={32} />
                        </div>
                        
                        {/* Title & Description */}
                        <h3 className="font-extrabold text-slate-900 text-lg mb-3">
                            {feature.title}
                        </h3>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                ))}

            </div>
        </section>
    );
}