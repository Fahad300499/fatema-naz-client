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
            date: new Date().toISOString().split('T')[0],
            dipoName: "Meghna Parbatipur",
            tripNo: "",
            rows: fixedLorryNumbers.map((lorry) => ({
                lorryNo: lorry,
                driverName: "",
                product: "MS",
                totalAmount: 0,
                payment1: 0,
                fine: 0,
                security: 0,
                dieselPabe: 0,    // ১. ডিজেল পাবে (Liter)
                dieselKhoroch: 0, // ২. ডিজেল খরচ (Liter)
                dieselRate: 0     // ৪. ডিজেল মূল্য (Rate)
            }))
        }
    });

    const { fields } = useFieldArray({ control, name: "rows" });
    const watchRows = watch("rows");

    // ক্যালকুলেশন ফাংশন
    const calculateRowData = (index) => {
        const row = watchRows[index];
        const total = Number(row?.totalAmount) || 0;
        const p1 = Number(row?.payment1) || 0;
        const sc = Number(row?.security) || 0;
        const fine = Number(row?.fine) || 0;
        
        // ২য় পেমেন্ট (পাওনা)
        const payment2 = total - (p1 + sc + fine);

        // ডিজেল ক্যালকুলেশন
        const dPabe = Number(row?.dieselPabe) || 0;
        const dKhoroch = Number(row?.dieselKhoroch) || 0;
        const dRate = Number(row?.dieselRate) || 0;

        const dieselBaki = dPabe - dKhoroch; // ৩. ডিজেল বাকি থাকে
        const dieselBabodPabe = dieselBaki * dRate; // ৫. ডিজেল বাবদ পাবে (টাকায়)
        
        // ড্রাইভার মোট পাবে = ২য় পেমেন্ট + ডিজেল বাবদ পাবে
        const driverTotalReceive = payment2 + dieselBabodPabe;

        return { payment2, dieselBaki, dieselBabodPabe, driverTotalReceive };
    };

    const getColumnTotal = (columnName) => {
        return watchRows.reduce((acc, row) => acc + (Number(row[columnName]) || 0), 0);
    };

    const onSubmit = async (data) => {
    const finalRows = data.rows.map((row, index) => {
        const calcs = calculateRowData(index);
        return {
            ...row,
            payment2: calcs.payment2,
            dieselBaki: calcs.dieselBaki,
            dieselBabodPabe: calcs.dieselBabodPabe,
            driverTotalReceive: calcs.driverTotalReceive
        };
    });

    const finalSubmission = {
        ...data,
        rows: finalRows,
        createdAt: new Date() 
    };

    try {
        // এখানে https:// যোগ করা হয়েছে
        const response = await fetch('https://fatema-naz-server-2.onrender.com/save-trips', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalSubmission),
        });

        // রেসপন্স চেক করা
        if (!response.ok) {
            throw new Error(`সার্ভার এরর: ${response.status}`);
        }

        const result = await response.json();
        if (result.insertedId) {
            alert("✅ সফলভাবে সেভ হয়েছে!");
        } else {
            alert("⚠️ ডাটা সেভ হয়নি, আবার চেষ্টা করুন।");
        }
    } catch (error) {
        console.error("Error posting data:", error);
        alert("❌ সার্ভার কানেক্ট করা যাচ্ছে না! (ইন্টারনেট বা URL চেক করুন)");
    }
};

    return (
        <div className="p-2 md:p-4 bg-base-200 min-h-screen">
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-[100%] mx-auto bg-white p-4 rounded-xl shadow-xl">
                <h1 className='text-center font-bold text-2xl underline mb-6 text-primary'>Per Trip Costing Amount & Diesel Details</h1>

                {/* টপ ইনপুট */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                        <input type="text" {...register("tripNo")} className="input input-bordered w-full" placeholder="Ex: Jan-02" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="table table-compact w-full border text-center text-xs">
                        <thead className="bg-gray-100">
                            <tr>
                                <th>গাড়ী নং</th>
                                <th>মোট ভাড়া</th>
                                <th>১ম পেমেন্ট</th>
                                <th>জরিমানা</th>
                                <th>জামানত</th>
                                <th className="bg-yellow-100">২য় পেমেন্ট</th>
                                <th className="bg-blue-50">ডিজেল পাবে (L)</th>
                                <th className="bg-blue-50">ডিজেল খরচ (L)</th>
                                <th className="bg-green-50">ডিজেল বাকি (L)</th>
                                <th className="bg-blue-50">ডিজেল মূল্য (Rate)</th>
                                <th className="bg-green-50">ডিজেল বাবদ পাবে (৳)</th>
                                <th className="bg-orange-100 font-bold text-md">ড্রাইভার মোট পাবে</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map((field, index) => {
                                const { payment2, dieselBaki, dieselBabodPabe, driverTotalReceive } = calculateRowData(index);
                                return (
                                    <tr key={field.id} className="hover">
                                        <td className="font-bold text-red-600">{watchRows[index].lorryNo}</td>
                                        <td><input type="number" {...register(`rows.${index}.totalAmount`)} className="input input-bordered input-xs w-16" /></td>
                                        <td><input type="number" {...register(`rows.${index}.payment1`)} className="input input-bordered input-xs w-16" /></td>
                                        <td><input type="number" {...register(`rows.${index}.fine`)} className="input input-bordered input-xs w-12 text-error" /></td>
                                        <td><input type="number" {...register(`rows.${index}.security`)} className="input input-bordered input-xs w-16" /></td>
                                        <td className="font-bold text-blue-700 bg-yellow-50">{payment2}</td>
                                        
                                        {/* ডিজেল ইনপুটস */}
                                        <td className="bg-blue-50"><input type="number" {...register(`rows.${index}.dieselPabe`)} className="input input-bordered input-xs w-14" /></td>
                                        <td className="bg-blue-50"><input type="number" {...register(`rows.${index}.dieselKhoroch`)} className="input input-bordered input-xs w-14" /></td>
                                        <td className="font-bold bg-green-50">{dieselBaki}</td>
                                        <td className="bg-blue-50"><input type="number" {...register(`rows.${index}.dieselRate`)} className="input input-bordered input-xs w-14" /></td>
                                        <td className="font-bold bg-green-50">{dieselBabodPabe}</td>
                                        
                                        {/* ড্রাইভার মোট পাবে */}
                                        <td className="font-bold text-lg text-primary bg-orange-50">
                                            {driverTotalReceive}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 flex gap-4 justify-center">
                    <button type="submit" className="btn btn-primary px-12">Save Record</button>
                    <Link to="/" className="btn btn-outline px-12">Go To Home</Link>
                </div>
            </form>
        </div>
    );
};

export default PerTripCost;