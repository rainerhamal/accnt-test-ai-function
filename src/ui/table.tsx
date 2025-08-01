import { fetchFilteredTransactions, fetchFilteredPayees, fetchFilteredCategories } from "@/lib/data";


export default async function TransactionsTable ( {
    //   query,
    //   currentPage,
}: {
        //   query: string;
        //   currentPage: number;
    } )
{
    const transactions = await fetchFilteredTransactions();
    // console.log( 'Fetched transactions:', transactions );

    const payees = await fetchFilteredPayees();
    // console.log( 'Fetched transactions:', transactions );

    const categories = await fetchFilteredCategories();
    // console.log( 'Fetched transactions:', transactions );


    return (
        <div className="flex gap-4">
            {/* LEFT SIDE Table */}
            <div className="overflow-y-auto h-[670px] rounded-lg shadow">
                <div className="min-w-full inline-block align-middle">
                    <div className="overflow-hidden ring-1 ring-neutral-800 rounded-lg">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead className="bg-neutral-800">
                                <tr>
                                    <th className="border border-neutral-700 px-4 py-2 text-left text-sm font-semibold text-white">ID</th>
                                    <th className="border border-neutral-700 px-4 py-2 text-left text-sm font-semibold text-white">Date</th>
                                    <th className="border border-neutral-700 px-4 py-2 text-left text-sm font-semibold text-white">Payee</th>
                                    <th className="border border-neutral-700 px-4 py-2 text-left text-sm font-semibold text-white">Description</th>
                                    <th className="border border-neutral-700 px-4 py-2 text-right text-sm font-semibold text-white">Spent</th>
                                    <th className="border border-neutral-700 px-4 py-2 text-right text-sm font-semibold text-white">Received</th>
                                    <th className="border border-neutral-700 px-4 py-2 text-left text-sm font-semibold text-white">Category</th>
                                </tr>
                            </thead>
                            <tbody className="bg-neutral-900">
                                { transactions?.map( ( transaction ) => (
                                    <tr key={ transaction.id }>
                                        <td className="border border-neutral-700 px-4 py-2 text-sm text-white">{ transaction.id }</td>
                                        <td className="border border-neutral-700 px-4 py-2 text-sm text-white">{ new Date( transaction.date ).toLocaleDateString() }</td>
                                        <td className="border border-neutral-700 px-4 py-2 text-sm text-white">{ transaction.payee_name }</td>
                                        <td className="border border-neutral-700 px-4 py-2 text-sm text-white">{ transaction.description }</td>
                                        <td className="border border-neutral-700 px-4 py-2 text-sm text-right text-white">{ transaction.spent }</td>
                                        <td className="border border-neutral-700 px-4 py-2 text-sm text-right text-white">{ transaction.received }</td>
                                        <td className="border border-neutral-700 px-4 py-2 text-sm text-white">{ transaction.category_name }</td>
                                    </tr>
                                ) ) }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE TABLES */}
            <div className="w-1/2 flex flex-col gap-6 h-[670px]">
                {/* second table */}
                <div className="overflow-y-auto ring-1 ring-neutral-800 rounded-lg h-[330px]">
                    <table className="min-w-full border-separate border-spacing-0">
                        <thead className="bg-neutral-800">
                            <tr>
                                <th className="border border-neutral-700 px-4 py-2 text-left text-sm font-semibold text-white">ID</th>
                                <th className="border border-neutral-700 px-4 py-2 text-left text-sm font-semibold text-white">Payee</th>
                                <th className="border border-neutral-700 px-4 py-2 text-left text-sm font-semibold text-white">Email</th>
                            </tr>
                        </thead>
                        <tbody className="bg-neutral-900">
                            { payees?.map( ( payee ) => (
                                <tr key={ payee.id }>
                                    <td className="border border-neutral-700 px-4 py-2 text-sm text-white">{ payee.id }</td>
                                    <td className="border border-neutral-700 px-4 py-2 text-sm text-white">{ payee.name }</td>
                                    <td className="border border-neutral-700 px-4 py-2 text-sm text-white">{ payee.email }</td>
                                </tr>
                            ) ) }
                        </tbody>
                    </table>
                </div>
                {/* third table */}
                <div className="overflow-y-auto ring-1 ring-neutral-800 rounded-lg h-[330px]">
                    <table className="min-w-full border-separate border-spacing-0">
                        <thead className="bg-neutral-800">
                            <tr>
                                <th className="border border-neutral-700 px-4 py-2 text-left text-sm font-semibold text-white">ID</th>
                                <th className="border border-neutral-700 px-4 py-2 text-left text-sm font-semibold text-white">Category</th>
                                <th className="border border-neutral-700 px-4 py-2 text-left text-sm font-semibold text-white">Type</th>
                            </tr>
                        </thead>
                        <tbody className="bg-neutral-900">
                            { categories?.map( ( category ) => (
                                <tr key={ category.id }>
                                    <td className="border border-neutral-700 px-4 py-2 text-sm text-white">{ category.id }</td>
                                    <td className="border border-neutral-700 px-4 py-2 text-sm text-right text-white">{ category.name }</td>
                                    <td className="border border-neutral-700 px-4 py-2 text-sm text-white">{ category.type }</td>
                                </tr>
                            ) ) }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
    )
}


            