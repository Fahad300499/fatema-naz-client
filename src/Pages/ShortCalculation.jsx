import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router';

const ShortCalculation = () => {
    const navigate = useNavigate();

    const { register, control, handleSubmit, watch, reset } = useForm({
        defaultValues: {
            sheetTitle: "Fatema Naz Short Calculation",
            rows: Array.from({ length: 10 }).map(() => ({
                deliverDate: "",
                place: "",
                product: "HOBC",
                lorryNo: "", // এখানে লরি সংখ্যা ইনপুট হবে
                allowance: 0,
                receivingDate: "",
                shortQty: 0,
                rate: 0
            }))
        }
    });

    const { fields } = useFieldArray({ control, name: "rows" });
    const watchRows = watch("rows");

    // আপডেট করা ক্যালকুলেশন লজিক
    const calculateRowData = (index) => {
        const row = watchRows[index];
        
        const lorryCount = Number(row?.lorryNo) || 0;
        const allowance = Number(row?.allowance) || 0;
        const shortQty = Number(row?.shortQty) || 0;
        const rate = Number(row?.rate) || 0;

        // ১. ১ম টোটাল = Lorry No * Allowance
        const totalAllowance = lorryCount * allowance; 

        // ২. Difference = ১ম টোটাল - Short Qty
        const difference = totalAllowance - shortQty; 

        // ৩. শেষের টোটাল = Difference * Rate
        const finalTotal = difference * rate;

        return { totalAllowance, difference, finalTotal };
    };

    const onSubmit = async (data) => {
        const filledRows = data.rows.filter(row => row.deliverDate !== "" || row.lorryNo !== "");

        if (filledRows.length === 0) {
            alert("⚠️ কোনো ডাটা ইনপুট দেওয়া হয়নি!");
            return;
        }

        const processedRows = filledRows.map((row, index) => {
            const calcs = calculateRowData(index);
            return {
                ...row,
                totalAllowance: calcs.totalAllowance,
                difference: calcs.difference,
                finalTotal: calcs.finalTotal
            };
        });


        
        const finalSubmission = { 
            sheetTitle: data.sheetTitle,
            rows: processedRows, 
            createdAt: new Date(),
            type: "short-calculation" 
        };

        try {
            const response = await fetch('https://api.ashrafulenterprise.com/save-short-calculations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalSubmission),
            });

            if (response.ok) {
                alert(`✅ সফলভাবে ${processedRows.length} টি রেকর্ড সেভ হয়েছে!`);
                reset();
            } else {
                alert("❌ সেভ করতে সমস্যা হয়েছে!");
            }
        } catch (error) {
            alert("❌ সার্ভার কানেক্ট করা যাচ্ছে না!");
        }
    };

    return (
        <div className="p-2 md:p-4 bg-slate-100 min-h-screen">
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-full mx-auto bg-white p-6 rounded-xl shadow-2xl border border-slate-200">
                <input 
                    {...register("sheetTitle")} 
                    className="text-center font-bold text-2xl underline mb-8 w-full border-none focus:outline-none text-slate-800 uppercase"
                />
                
                <div className="overflow-x-auto rounded-lg border border-slate-300">
                    <table className="table table-compact w-full text-center text-[11px]">
                        <thead className="bg-slate-800 text-white">
                            <tr>
                                <th className="py-4">SL</th>
                                <th>Deliver Date</th>
                                <th>Place</th>
                                <th>Prdct</th>
                                <th>Lry</th>
                                <th>Alwnce</th>
                                <th className="bg-red-600 text-white">Total</th>
                                <th>Receiving Date</th>
                                <th className="bg-blue-600 text-white">Short</th>
                                <th className="bg-orange-600 text-white">Difference</th>
                                <th>Rate</th>
                                <th className="bg-green-700 text-white">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map((field, index) => {
                                const { totalAllowance, difference, finalTotal } = calculateRowData(index);
                                return (
                                    <tr key={field.id} className="hover border-b border-slate-200">
                                        <td>{index + 1}</td>
                                        <td><input type="date" {...register(`rows.${index}.deliverDate`)} className="input input-bordered input-xs w-28" /></td>
                                        <td><input type="text" {...register(`rows.${index}.place`)} className="input input-bordered input-xs w-20" /></td>
                                        <td>
                                            <select {...register(`rows.${index}.product`)} className="select select-bordered select-xs">
                                                <option value="HOBC">HOBC</option>
                                                <option value="MS">MS</option>
                                                <option value="DSL">HSD</option>
                                                <option value="DSL">DIESEL</option>
                                            </select>
                                        </td>
                                        <td><input type="number" {...register(`rows.${index}.lorryNo`)} className="input input-bordered input-xs w-12 font-bold" /></td>
                                        <td><input type="number" {...register(`rows.${index}.allowance`)} className="input input-bordered input-xs w-14" /></td>
                                        <td className="font-bold text-red-600 bg-red-50">{totalAllowance}</td>
                                        <td><input type="date" {...register(`rows.${index}.receivingDate`)} className="input input-bordered input-xs w-28" /></td>
                                        <td><input type="number" {...register(`rows.${index}.shortQty`)} className="input input-bordered input-xs w-16" /></td>
                                        <td className="font-bold text-blue-700 bg-orange-50">{difference}</td>
                                        <td><input type="number" {...register(`rows.${index}.rate`)} className="input input-bordered input-xs w-14" /></td>
                                        <td className="font-bold bg-green-50 text-green-800">{finalTotal.toLocaleString()}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 flex gap-4 justify-center">
                    <button type="button" onClick={() => navigate(-1)} className="btn btn-outline btn-sm px-8">❮ Back</button>
                    <button type="submit" className="btn btn-primary btn-sm px-12 shadow-lg">Save Record</button>
                    <button type="button" onClick={() => reset()} className="btn btn-ghost btn-sm border-slate-300">Reset</button>
                </div>
            </form>
        </div>
    );
};

export default ShortCalculation;