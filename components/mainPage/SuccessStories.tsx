import Image from "next/image"
import { FaStar } from "react-icons/fa"

const testimonials = [
    {
        id: 1,
        name: "Marcus T.",
        title: "Professional Athlete",
        quote: "Strenoxa literally changed my life. The recovery stack allowed me to train harder than ever before. Dropped 15lbs and gained lean muscle in 12 weeks.",
        rating: 5,
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5YqBXlOmcnlpLUmYFL0982YUtv1BOxCP9W3gj1L55C1raH7gBUGuNfzCUbRc_6_lecl19upUL-WyjF0x4qh2APa1M_BaLJ7zhT7Fm3gEktBJSEIA_4pGbQ5neaDd20VsbledXaoh9LiUZjZSGAcc_wZSgby8Dqv1s9JO4TULG6LP8HTEwj5QA51FlpqWjUE39Qu4aq43-b6AQym6FK-KrDzfW_q594Q0LBAocnW11DCMRHdLoSJQdqLb_c1bPWE2Y60vDTNLeIYg",
    },
    {
        id: 2,
        name: "Sarah K.",
        title: "Fitness Enthusiast",
        quote: "Finally found a pre-workout that doesn't give me the jitters. My focus during sessions is unmatched. Best investment in my fitness journey.",
        rating: 4,
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPVX_Jgktoo7KSkyXlVCRZVLeeXMSv8vPLhtcYYpcmCnJEuMxLkxRMU4O_FQr-XRm4SKqYA8fvEwsSavDDUKEy0nXL8IkKxFF3kt2mZbouGuJdOLwXyDqitiJm_m4GYDkFPt-2zrQciWehRF8F9wykbdTyc5opEyH5vtHF1VSRkTFJK0b5CtV0e-YaiO6qXrIZJeELPG29lRiC5FpS3Rg5nTz5cRct1lFOnoUySKAJT5IXq3YxvEot96u9epewmxwDG_Wxk3wibTY",
    }
]

export default function SuccessStories() {
    return (
        <>
            <div className="base-section">
                <div className="bg-slate-200/70 rounded-3xl flex flex-col items-center justify-between p-8 md:p-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-wider">
                            Success Stories
                        </h2>
                        <p className="text-gray-500 font-medium mt-2 text-sm md:text-base">
                            Real results from our dedicated community
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                        {testimonials.map((item) => (
                            <div key={item.id} className="bg-slate-50 shadow-sm rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 justify-between border border-slate-200 hover:shadow-md transition-shadow">
                                <div className="w-28 h-28 sm:w-34 sm:h-34 shrink-0 relative overflow-hidden rounded-xl">
                                    <Image
                                        src={item.img}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex flex-col text-center sm:text-left flex-1">
                                    <div className="flex justify-center sm:justify-start gap-1 text-[#ec1313] mb-3">
                                        {[...Array(item.rating)].map((_, i) => (
                                            <FaStar key={`filled-${i}`} size={14} />
                                        ))}
                                        {[...Array(5 - item.rating)].map((_, i) => (
                                            <FaStar key={`filled-${i}`} size={14} className="text-gray-400" />
                                        ))}
                                    </div>

                                    <p className="text-slate-700 font-medium italic mb-4 text-sm md:text-base leading-relaxed">
                                        "{item.quote}"
                                    </p>

                                    <div>
                                        <span className="font-extrabold text-slate-900 block">
                                            — {item.name}
                                        </span>
                                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                                            {item.title}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}