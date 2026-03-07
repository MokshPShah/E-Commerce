import Link from "next/link"
import ProductCard from "../ProductCard"

const trendingProducts = [
    { image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgrY4AzwEkttLrQbjDA1bio69g7t9UoHjuozoJY6QYy-ODZU9a9iUhDrUH5A1mUND4sWbojuDD1o5NhFupl3r8oo2XVxuWsx3RonfTwTBHoCBDG1KIkbCe3EL-ShkyyCxqfHnOY2YqURuQmwXNk9h_LfJKpIy4CxUhjcopjcPuB0ja5WkHO9tOSAnEfqrOVqUW11pnvPQIxLqz78-c9dTs92s_pbfuDcyhXGTyhY_uBWT0w-d9JKJj-fyxOaoxBRvJpUTCOtMYgs0', ratings: 4.9, productName: 'Gold Standard Whey', productDesc: 'Double Rich Chocolate - 5lbs', price: '64.99', badge: 'BEST SELLER', badgeColor: 'bg-red-600' },
    { image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNRGes_pbravpdnJzrPm8svun-z_LpFJAC65-ROdvQMkbOHofVXg4jvl6OLGg0s4mDjFtflsmQYCqGuYiUeA7L2kE1HMtrC4UaLVyxs9wrAtXchK1eoipVZltV5YVFcKl3Y17Pj070U6L5Vrn6Pn0NTZhSNE3dB8YCVnqvxs24b-bHAfok6JAdhRIyzj1_Rw_Tl5E5ajND4bgGj77eMR8s-THoeq6CW5ZS4eOXiY5btKLSoiJkhLy20bvJErlXwMHc0KryV8JaIKk', ratings: 4.7, productName: 'C4 Original Pre-Workout', productDesc: 'Icy Blue Razz - 30 Servings', price: '29.99' },
    { image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATyJJQXLRW66ht8lwd40jGO14saHA8zgxpkrFowC5Yz60Nl_X0Zps6fHIdglOv8JHi7G4N8pbYEyUW75K7V6U3z3HHHPBndao-CfbZoFjfpFE_iMVphQFGzAIKHbeAiowaZnqgFHZN7arwo3DGc2zXyMCauUy-8AHz1N2BZcGmm531rKirKQBmcMPxYBXtucGLbeDOS_35irDIinV61jYoHj5J5E0fdrpzliBLeu8BSe-s4iT0imD-pCS_5ETm6cZGEmvxuEnWwsc', ratings: 4.8, productName: 'Mega Men Multivitamin', productDesc: 'Daily Health - 90 Count', price: '19.99', badge: 'VEGAN', badgeColor: 'bg-green-500' },
    { image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEcShysSPns9c-4N2HbuDq8Mpdzizo5q-g-0s6ZIDsaohLU6m8EfvlwJm7t36FKOXcQ_kFNbW8G4TiwOH6sNe8ptbpv6Sr5JpPKxAVDHSSmBXLwxjUYP_dEnBe-HqoyBOAHfUHegpDTFypwU2_kqeLFnu-DlImZ8hAJrpO3emke9SyXNyP3zR1a57-Uha9S9XSPcruU5CsX1ZLep5ZEy1LeHigk5ohbQndOvK-k29eYNlmHYUIooUvayb7z_tzbownQ-cYBljk9j4', ratings: 5.0, productName: 'Pure Creatine Mono', productDesc: 'Unflavored - 500g', price: '34.99' }
]

export default function Trending() {
    return (
        <>
            <div className="base-section pt-0">
                <div>
                    <h2 className="section-head">
                        Trending Now
                    </h2>
                    <p className="text-slate-600 font-medium my-2">Best-selling products loved by our community</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6 justify-between items-center">
                    {
                        trendingProducts.map((item, index) => (
                            <ProductCard
                                key={index}
                                image={item.image}
                                ratings={item.ratings}
                                productName={item.productName}
                                productDesc={item.productDesc}
                                price={item.price}
                                badge={item.badge}
                                badgeColor={item.badgeColor}
                            />
                        ))
                    }

                </div>
                <div className="w-full flex justify-center mt-12 md:mt-16">
                    <Link
                        href={'/shop'}
                        className="btn-primary bg-transparent border-2 border-[#ec1313] text-[#ec1313] hover:bg-[#ec1313] hover:text-white shadow-none hover:shadow-lg hover:shadow-red-500/20 px-10 transition-all duration-300"
                    >
                        View All Products
                    </Link>
                </div>
            </div>
        </>
    )
}