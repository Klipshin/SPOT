import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function VerificationModal() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const closeModal = () => setIsOpen(false);

    const handleAction = () => {
        router.push("/");
        closeModal();
    };

    useEffect(() => {
        setIsOpen(true);
    }, []);

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
                        onClick={closeModal}
                    />
                    <div className="relative bg-gradient-to-br from-[#E79543] via-[#CCCE9E] to-[#0E3C32] rounded-4xl shadow-xl py-8 px-15 w-full max-w-xl mx-4 z-10">
                        <div className="flex flex-col items-center justify-center gap-7">
                            <div className="w-full py-3 px-5 rounded-full flex items-center justify-between bg-gradient-to-r from-[#E57A44] to-[#251351]">
                                <img 
                                    src="/bell.png"
                                    className="w-10 h-auto"
                                />
                                <h2 className="text-2xl text-white font-poppins-bold">Verification Pending</h2>
                                <img 
                                    src="/bell.png"
                                    className="w-10 h-auto"
                                />
                            </div>

                            <div className="border-4 border-[#31220F] rounded-2xl py-5 px-8 bg-white flex-col justify-start items-center text-center">
                                <h5 className="font-poppins-semibold">{"Thank you for submitting your details."}</h5>
                                <p>Your expert verification is under review and will be processed within <span className="text-red-800 font-poppins-bold">1 - 3 days.</span></p>
                                <br />
                                <p>
                                    If <span className="text-green-500 font-poppins-bold-italic">approved</span>{", you'll see an "}
                                    <span className="text-[#968030] font-poppins-bold inline-flex items-center">
                                        Expert Badge
                                        <img src="/expert-badge.png" alt="Expert Badge" className="w-5 h-5 ml-1" />
                                    </span>
                                    {" on your profile the next time you log in."}
                                </p>
                                <br />
                                <p>
                                    If <span className="text-red-800 font-poppins-bold-italic">not qualified</span>{", we’ll notify you so you can still enjoy SPOT as a regular user."}
                                </p>
                            </div>

                            <button 
                                onClick={handleAction}
                                className="w-50 p-2 rounded-full cursor-pointer hover:border-b-6
                                    bg-gradient-to-r from-[#CCCE9E] to-[#57BF9F] text-[#0E3C32] font-poppins-bold text-xl"
                            >
                                Got it!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
