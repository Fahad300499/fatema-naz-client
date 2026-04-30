import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router'; 

const PerTripCostDiba = () => {
    const navigate = useNavigate(); 

    const { register, control, handleSubmit, watch, reset } = useForm({
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            dipoName: "Meghna Parbatipur",
            tripNo: "",
            rows: Array.from({ length: 12 }).map(() => ({
                lorryNo: "", 
                driverName: "", 
                product: "MS",
                totalAmount: 0,
                toll: 0,
                payment1: 0,
                fine: 0,
                extraFine: 0,
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
        const toll = Number(row?.toll) || 0;
        const p1 = Number(row?.payment1) || 0;
        const fine = Number(row?.fine) || 0;
        const extraFine = Number(row?.extraFine) || 0;
        const sc = Number(row?.security) || 0;
        const dPabe = Number(row?.dieselPabe) || 0;
        const dKhoroch = Number(row?.dieselKhoroch) || 0;
        const dRate = Number(row?.dieselRate) || 0;

        const exactSalary = total - toll;
        const payment2 = total - (p1 + fine + extraFine + sc);
        const dieselBaki = dPabe - dKhoroch;
        const dieselBabodPabe = dieselBaki * dRate;
        const dieselAndMainSalary = exactSalary + dieselBabodPabe;
        const driverTotalReceive = payment2 + dieselBabodPabe;

        return { exactSalary, payment2, dieselBaki, dieselBabodPabe, dieselAndMainSalary, driverTotalReceive };
    };

    const onSubmit = async (data) => {
        // ১. ডাটা আছে এমন রো গুলো ফিল্টার করা
        const filledRows = data.rows.filter(row => row.lorryNo.trim() !== "" || row.driverName.trim() !== "");

        if (filledRows.length === 0) {
            alert("⚠️ কোনো গাড়ির তথ্য ইনপুট দেওয়া হয়নি!");
            return;
        }

        // ২. ডুপ্লিকেট এন্ট্রি চেক করা (Lorry No এবং Driver Name এর জন্য)
        const lorryNumbers = filledRows.map(r => r.lorryNo.trim().toLowerCase());
        const driverNames = filledRows.map(r => r.driverName.trim().toLowerCase());

        const hasDuplicateLorry = lorryNumbers.some((val, i) => lorryNumbers.indexOf(val) !== i);
        const hasDuplicateDriver = driverNames.some((val, i) => driverNames.indexOf(val) !== i);

        if (hasDuplicateLorry) {
            alert("❌ ভুল: একই লরি নম্বর (Lorry No) একাধিক রো-তে ব্যবহার করা হয়েছে!");
            return;
        }

        if (hasDuplicateDriver) {
            alert("❌ ভুল: একই ড্রাইভারের নাম একাধিক রো-তে ব্যবহার করা হয়েছে!");
            return;
        }

        // ৩. ক্যালকুলেটেড ডাটা ম্যাপ করা
        const processedRows = filledRows.map((row, index) => {
            // ইনডেক্স খুঁজে বের করা কারণ ফিল্টার করার পর ইনডেক্স বদলে যেতে পারে
            const originalIndex = data.rows.findIndex(r => r === row);
            const calcs = calculateRowData(originalIndex);
            return {
                ...row,
                exactSalary: calcs.exactSalary,
                payment2: calcs.payment2,
                dieselBaki: calcs.dieselBaki,
                dieselBabodPabe: calcs.dieselBabodPabe,
                dieselAndMainSalary: calcs.dieselAndMainSalary,
                driverTotalReceive: calcs.driverTotalReceive
            };
        });

        const finalSubmission = {
            ...data,
            rows: processedRows,
            createdAt: new Date() 
        };

        try {
            const response = await fetch('https://api.ashrafulenterprise.com/trips/save-trips-diba', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalSubmission),
            });

            if (response.ok) {
                alert(`✅ সফলভাবে ${processedRows.length} টি ডাটা সেভ হয়েছে!`);
                reset(); 
            } else {
                alert("❌ ডাটা সেভ করা সম্ভব হয়নি!");
            }
        } catch (error) {
            alert("❌ সার্ভার কানেক্ট করা যাচ্ছে না!");
        }
    };

    return (
        <div className="p-2 md:p-4 bg-base-200 min-h-screen">
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-[100%] mx-auto bg-white p-4 rounded-xl shadow-xl border border-slate-100">
                <h1 className='text-center font-bold text-2xl underline mb-6 text-primary uppercase tracking-wider'>
                    Trip Costing & Diesel Ledger (Diba)
                </h1>
                
                {/* Top Inputs */}
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
                    <table className="table table-compact w-full text-center text-[10px]">
                        <thead className="bg-slate-800 text-white">
                            <tr>
                                <th className="py-3">SL</th>
                                <th>Lory No</th>
                                <th>Driver</th>
                                <th>Total Pay</th>
                                <th className="bg-red-700">Toll</th>
                                <th className="bg-green-800">Exact Salary</th>
                                <th>1st Pay</th>
                                <th>Fine</th>
                                <th>Ex. Fine</th>
                                <th>Surety</th>
                                <th className="bg-yellow-600">2nd Pay</th>
                                <th className="bg-blue-700">Diesel (L)</th>
                                <th className="bg-blue-700">Cost (L)</th>
                                <th className="bg-green-700">Due (L)</th>
                                <th className="bg-blue-700">Rate</th>
                                <th className="bg-green-700">Diesel ৳</th>
                                <th className="bg-purple-700">Diesel+Salary</th>
                                <th className="bg-orange-600 font-bold">Trip Driver Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map((field, index) => {
                                const { exactSalary, payment2, dieselBaki, dieselBabodPabe, dieselAndMainSalary, driverTotalReceive } = calculateRowData(index);
                                return (
                                    <tr key={field.id} className="hover border-b">
                                        <td className="text-slate-400">{index + 1}</td>
                                        <td><input type="text" {...register(`rows.${index}.lorryNo`)} className="input input-bordered input-xs w-20 font-bold text-red-600" /></td>
                                        <td><input type="text" {...register(`rows.${index}.driverName`)} className="input input-bordered input-xs w-20" /></td>
                                        <td><input type="number" {...register(`rows.${index}.totalAmount`)} className="input input-bordered input-xs w-16" /></td>
                                        <td className="bg-red-50"><input type="number" {...register(`rows.${index}.toll`)} className="input input-bordered input-xs w-12" /></td>
                                        <td className="font-bold bg-green-50 text-green-700">{exactSalary}</td>
                                        <td><input type="number" {...register(`rows.${index}.payment1`)} className="input input-bordered input-xs w-14" /></td>
                                        <td><input type="number" {...register(`rows.${index}.fine`)} className="input input-bordered input-xs w-10 text-error" /></td>
                                        <td><input type="number" {...register(`rows.${index}.extraFine`)} className="input input-bordered input-xs w-10 text-error" /></td>
                                        <td><input type="number" {...register(`rows.${index}.security`)} className="input input-bordered input-xs w-14" /></td>
                                        <td className="font-bold text-blue-700 bg-yellow-50">{payment2}</td>
                                        <td className="bg-blue-50"><input type="number" {...register(`rows.${index}.dieselPabe`)} className="input input-bordered input-xs w-12" /></td>
                                        <td className="bg-blue-50"><input type="number" {...register(`rows.${index}.dieselKhoroch`)} className="input input-bordered input-xs w-12" /></td>
                                        <td className="font-bold bg-green-50">{dieselBaki}</td>
                                        <td className="bg-blue-50"><input type="number" {...register(`rows.${index}.dieselRate`)} className="input input-bordered input-xs w-12" /></td>
                                        <td className="font-bold bg-green-50">{dieselBabodPabe}</td>
                                        <td className="font-bold bg-purple-50 text-purple-700">{dieselAndMainSalary}</td>
                                        <td className="font-bold text-md text-primary bg-orange-50">{driverTotalReceive}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 flex flex-wrap gap-3 justify-center">
                    <button type="button" onClick={() => navigate(-1)} className="btn btn-outline btn-sm px-6">❮ Back</button>
                    <button type="submit" className="btn btn-primary btn-sm px-10 shadow-lg">Save Record</button>
                    <button type="button" onClick={() => reset()} className="btn btn-ghost btn-sm border-slate-300">Clear Form</button>
                </div>
            </form>
        </div>
    );
};

export default PerTripCostDiba;