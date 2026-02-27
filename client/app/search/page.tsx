export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const query = params.q || "";

    return (
        <div className="min-h-dvh pt-32 px-4 md:px-9 pb-20 bg-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900" style={{ fontFamily: "'Bpmf Iansui', sans-serif" }}>Search Result</h1>

            {query ? <p className="text-xl text-gray-600 mb-10">
                Showing products for: <span className="font-bold text-[#ec1313]"> &quot;{query}&quot; </span>
            </p> : (
                <p className="text-xl text-gray-600 mb-10">
                    Browse our full catalog below, or use the search bar to find something specific.
                </p>
            )}
            <div className="py-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col justify-center bg-gray-50 px-3">
                <p className="text-gray-500 text-lg font-medium">The Strenoxa Product Grid will go here!</p>
                {query && (
                    <p className="text-gray-400 mt-2">
                        (Imagine a grid of {query} supplements popping up right here)
                    </p>
                )}
            </div>
        </div>
    )
}