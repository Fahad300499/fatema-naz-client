import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Link } from 'react-router';

const PerTripCost = () => {
    const fixedLorryNumbers = [
        "41-0545", "41-0546", "41-0752", "41-0754", "41-0763", 
        "41-0764", "41-0298", "41-0299", "41-0639", "44-0640", 
        "44-0783"
    ];

    const { register, control, handleSubmit, watch } = useForm({
        defaultValues: {
            date: "2026-01-05",
            dipoName: "Meghna Parbatipur",
            tripNo: "Jan-02",
            rows: fixedLorryNumbers.map((lorry) => ({
                lorryNo: lorry,
                driverName: "",
                product: "MS",
                payment1: 0,
                fine: 0,
                totalAmount: 0,
                security: 0,
                payment2: 0
            }))
        }
    });

    const { fields } = useFieldArray({ control, name: "rows" });
    const watchRows = watch("rows"); // পুরো টেবিলের ডাটা ওয়াচ করা হচ্ছে গ্র্যান্ড টোটালের জন্য

    // একটি নির্দিষ্ট রো-এর জন্য ২য় পেমেন্ট বের করা
    const calculateDuePayment = (index) => {
        const row = watchRows[index];
        const total = Number(row?.totalAmount) || 0;
        const p1 = Number(row?.payment1) || 0;
        const sc = Number(row?.security) || 0;
        const fine = Number(row?.fine) || 0;
        return total - (p1 + sc + fine);
    };

    // কলাম ভিত্তিক সর্বমোট (Grand Total) ক্যালকুলেশন
    const getColumnTotal = (columnName) => {
        return watchRows.reduce((acc, row) => acc + (Number(row[columnName]) || 0), 0);
    };

    // ২য় পেমেন্টের সর্বমোট আলাদাভাবে বের করা
    const getGrandDueTotal = () => {
        return watchRows.reduce((acc, _, index) => acc + calculateDuePayment(index), 0);
    };

    const onSubmit = async (data) => {
    // ২য় পেমেন্টসহ ফাইনাল ডাটা ক্যালকুলেট করা
    const finalRows = data.rows.map((row, index) => ({
        ...row,
        payment2: calculateDuePayment(index)
    }));

    const finalSubmission = {
        ...data,
        rows: finalRows,
        grandTotalAmount: getColumnTotal("totalAmount"),
        grandDueTotal: getGrandDueTotal(),
        createdAt: new Date() 
    };

    try {
        const response = await fetch('http://localhost:3000/save-trips', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(finalSubmission),
        });

        const result = await response.json();
        
        if (result.insertedId) {
            alert("সফলভাবে ডাটাবেজে সেভ হয়েছে!");
        } else {
            alert("সেভ করা সম্ভব হয়নি।");
        }
    } catch (error) {
        console.error("Error posting data:", error);
        alert("সার্ভার কানেক্ট করা যাচ্ছে না!");
    }
};

    return (
        <div className="p-4 md:p-8 bg-base-200 min-h-screen">
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-xl">
                <h1 className='text-center font-bold text-3xl underline mb-10 text-primary'>Per Trip Costing Amount</h1>

                {/* টপ ইনপুট */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="form-control">
                        <label className="label font-bold">Date:</label>
                        <input type="date" {...register("date")} className="input input-bordered w-full" />
                    </div>
                    <div className="form-control">
                        <label className="label font-bold">Dipo Name:</label>
                        <input type="text" {...register("dipoName")} className="input input-bordered w-full" />
                    </div>
                    <div className="form-control">
                        <label className="label font-bold">Trip No:</label>
                        <input type="text" {...register("tripNo")} className="input input-bordered w-full" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="table table-compact w-full border text-center">
                        <thead className="bg-gray-100">
                            <tr>
                                <th>S.N</th>
                                <th>গাড়ী নং</th>
                                <th>ড্রাইভার</th>
                                <th>প্রোডাক্ট</th>
                                <th>Total (মোট ভাড়া)</th>
                                <th>১ম পেমেন্ট</th>
                                <th>জরিমানা/Short</th>
                                <th>জামানত (Cash)</th>
                                <th className="bg-yellow-100 text-blue-700 font-bold border-l">২য় পেমেন্ট (পাওনা)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map((field, index) => (
                                <tr key={field.id} className="hover">
                                    <td>{index + 1}</td>
                                    <td>
                                        <input type="text" readOnly {...register(`rows.${index}.lorryNo`)} className="w-20 font-bold text-red-600 bg-transparent outline-none" />
                                    </td>
                                    <td><input type="text" {...register(`rows.${index}.driverName`)} className="input input-bordered input-xs w-24" /></td>
                                    <td><input type="text" {...register(`rows.${index}.product`)} className="input input-bordered input-xs w-16" /></td>
                                    <td><input type="number" {...register(`rows.${index}.totalAmount`)} className="input input-bordered input-xs w-20 font-bold bg-green-50" /></td>
                                    <td><input type="number" {...register(`rows.${index}.payment1`)} className="input input-bordered input-xs w-20" /></td>
                                    <td><input type="number" {...register(`rows.${index}.fine`)} className="input input-bordered input-xs w-16 text-error" /></td>
                                    <td><input type="number" {...register(`rows.${index}.security`)} className="input input-bordered input-xs w-20" /></td>
                                    <td className="font-bold text-primary bg-yellow-50 border-l">
                                        {calculateDuePayment(index)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {/* গ্র্যান্ড টোটাল ফুটার */}
                        <tfoot className="bg-gray-800 text-white font-bold text-md">
                            <tr>
                                <td colSpan="4" className="text-right text-lg">Grand Total =</td>
                                <td>{getColumnTotal("totalAmount")}</td>
                                <td>{getColumnTotal("payment1")}</td>
                                <td className="text-red-300">{getColumnTotal("fine")}</td>
                                <td>{getColumnTotal("security")}</td>
                                <td className="bg-yellow-400 text-black text-lg border-l">
                                    {getGrandDueTotal()}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="mt-8 flex gap-4 justify-center">
                    <button type="submit" className="btn btn-primary px-12">Save Record</button>
                    <Link to="/" className="btn btn-primary px-12">Go To Home</Link>
                </div>
            </form>
        </div>
    );
};

export default PerTripCost;