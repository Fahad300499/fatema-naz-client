import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Link, useNavigate } from 'react-router'; 

const PerTripCostSahena = () => {
    const navigate = useNavigate(); 

    // ফর্মের ডিফল্ট ভ্যালু হিসেবে ১২টি খালি রো সেট করা
    const { register, control, handleSubmit, watch, reset } = useForm({
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            dipoName: "Meghna Parbatipur",
            tripNo: "",
            rows: Array.from({ length: 12 }).map(() => ({
                lorryNo: "", // এখন এটি খালি থাকবে যাতে ম্যানুয়াল দেওয়া যায়
                driverName: "", 
                product: "MS",
                totalAmount: 0,
                payment1: 0,
                fine: 0,
                security: 0,
                dieselPabe: 0,
                dieselKhoroch: 0,
                dieselRate: 0
            }))
        }
    });

    const { fields } = useFieldArray({ control, name: "rows" });
    const watchRows = watch("rows");

    const calculateRowData = (index) => {
        const row = watchRows[index];
        const total = Number(row?.totalAmount) || 0;
        const p1 = Number(row?.payment1) || 0;
        const sc = Number(row?.security) || 0;
        const fine = Number(row?.fine) || 0;
        
        const payment2 = total - (p1 + sc + fine);

        const dPabe = Number(row?.dieselPabe) || 0;
        const dKhoroch = Number(row?.dieselKhoroch) || 0;
        const dRate = Number(row?.dieselRate) || 0;

        const dieselBaki = dPabe - dKhoroch;
        const dieselBabodPabe = dieselBaki * dRate;
        const driverTotalReceive = payment2 + dieselBabodPabe;

        return { payment2, dieselBaki, dieselBabodPabe, driverTotalReceive };
    };

    const onSubmit = async (data) => {
        // শুধুমাত্র সেই রো গুলো ফিল্টার করা হবে যেগুলোতে লরি নং অথবা ড্রাইভারের নাম আছে
        const filledRows = data.rows
            .filter(row => row.lorryNo.trim() !== "" || row.driverName.trim() !== "")
            .map((row, index) => {
                const calcs = calculateRowData(index);
                return {
                    ...row,
                    payment2: calcs.payment2,
                    dieselBaki: calcs.dieselBaki,
                    dieselBabodPabe: calcs.dieselBabodPabe,
                    driverTotalReceive: calcs.driverTotalReceive
                };
            });

        if (filledRows.length === 0) {
            alert("⚠️ কোনো গাড়ির তথ্য (Lorry No) ইনপুট দেওয়া হয়নি!");
            return;
        }

        const finalSubmission = {
            ...data,
            rows: filledRows,
            createdAt: new Date() 
        };

        try {
            const response = await fetch('https://api.ashrafulenterprise.com/save-trips-sahena', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalSubmission),
            });

            if (!response.ok) throw new Error(`সার্ভার এরর: ${response.status}`);

            const result = await response.json();
            if (result.insertedId) {
                alert(`✅ সফলভাবে ${filledRows.length} টি গাড়ির ডাটা সেভ হয়েছে!`);
                reset(); 
            }
        } catch (error) {
            console.error("Error posting data:", error);
            alert("❌ সার্ভার কানেক্ট করা যাচ্ছে না!");
        }
    };

    return (
        <div className="p-2 md:p-4 bg-base-200 min-h-screen">
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-[100%] mx-auto bg-white p-4 rounded-xl shadow-xl border border-slate-100">
                <h1 className='text-center font-bold text-2xl underline mb-6 text-primary uppercase tracking-wider'>
                    Trip Costing & Diesel Ledger
                </h1>
                
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

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="table table-compact w-full text-center text-xs">
                        <thead className="bg-slate-800 text-white">
                            <tr>
                                <th className="py-3">SL</th>
                                <th>Lory No</th>
                                <th>Driver Name</th>
                                <th>Total Payment</th>
                                <th>First Payment</th>
                                <th>Fine</th>
                                <th>Surety</th>
                                <th className="bg-yellow-600">Second Payment</th>
                                <th className="bg-blue-700">Diesel (L)</th>
                                <th className="bg-blue-700">Cost (L)</th>
                                <th className="bg-green-700"> Due (L)</th>
                                <th className="bg-blue-700">Rate</th>
                                <th className="bg-green-700">Diesel Rate (৳)</th>
                                <th className="bg-orange-600 font-bold text-md">Driver Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map((field, index) => {
                                const { payment2, dieselBaki, dieselBabodPabe, driverTotalReceive } = calculateRowData(index);
                                return (
                                    <tr key={field.id} className="hover border-b">
                                        <td className="text-slate-400">{index + 1}</td>
                                        <td>
                                            <input 
                                                type="text" 
                                                {...register(`rows.${index}.lorryNo`)} 
                                                placeholder="41-XXXX"
                                                className="input input-bordered input-xs w-20 md:w-24 font-bold text-red-600" 
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                type="text" 
                                                {...register(`rows.${index}.driverName`)} 
                                                placeholder="নাম"
                                                className="input input-bordered input-xs w-20 md:w-24 focus:input-primary" 
                                            />
                                        </td>
                                        <td><input type="number" {...register(`rows.${index}.totalAmount`)} className="input input-bordered input-xs w-16" /></td>
                                        <td><input type="number" {...register(`rows.${index}.payment1`)} className="input input-bordered input-xs w-16" /></td>
                                        <td><input type="number" {...register(`rows.${index}.fine`)} className="input input-bordered input-xs w-12 text-error" /></td>
                                        <td><input type="number" {...register(`rows.${index}.security`)} className="input input-bordered input-xs w-16" /></td>
                                        <td className="font-bold text-blue-700 bg-yellow-50">{payment2}</td>
                                        <td className="bg-blue-50"><input type="number" {...register(`rows.${index}.dieselPabe`)} className="input input-bordered input-xs w-14" /></td>
                                        <td className="bg-blue-50"><input type="number" {...register(`rows.${index}.dieselKhoroch`)} className="input input-bordered input-xs w-14" /></td>
                                        <td className="font-bold bg-green-50">{dieselBaki}</td>
                                        <td className="bg-blue-50"><input type="number" {...register(`rows.${index}.dieselRate`)} className="input input-bordered input-xs w-14" /></td>
                                        <td className="font-bold bg-green-50">{dieselBabodPabe}</td>
                                        <td className="font-bold text-lg text-primary bg-orange-50">{driverTotalReceive}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* বাটন সেকশন */}
                <div className="mt-8 flex flex-wrap gap-3 justify-center items-center">
                    <button type="button" onClick={() => navigate(-1)} className="btn btn-outline btn-sm md:btn-md px-6 hover:bg-slate-800">❮ Back</button>
                    <button type="submit" className="btn btn-primary btn-sm md:btn-md px-10 shadow-lg">Save Record</button>
                    <button type="button" onClick={() => reset()} className="btn btn-ghost btn-sm md:btn-md border-slate-300">Clear Form</button>
                    <Link to="/" className="btn btn-outline btn-sm md:btn-md px-6">Home</Link>
                </div>
            </form>
        </div>
    );
};

export default PerTripCostSahena;