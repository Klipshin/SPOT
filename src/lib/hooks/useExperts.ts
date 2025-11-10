"use client";

import { useEffect, useState } from "react";
import { useUser } from "./useUser";
import { Expert } from "@/src/utils/supabase/models";
import { expertService } from "../services";

export default function useExperts(){
    const { user } = useUser();
    const [experts, setExperts] = useState<Expert[]>([]);
    const [ expert, setExpert ] = useState<Expert | null>(null);
    const [ expertLoading, setExpertLoading ] = useState(false);
    const [ expertError, setExpertError ] = useState<string | null>(null);

    useEffect(() => {
        if (user){
            loadExpert(user.id);
        }
    }, [user] )

    async function loadExpert(userId: string) {
        if (!user) return;

        try {
            setExpertLoading(true);
            setExpertError(null);
            const data = await expertService.getExpert(userId);
            setExpert(data);
        } catch (err) {
            setExpertError (err instanceof Error ? err.message : "Failed to load expert.");
        } finally {
            setExpertLoading(false);
        }
    }

    async function createExpert (expertData: {
        occupation: string;
        id_docu: string;
        employment_proof: string;
        diploma_docu: string;
        academic_profile?: string;
    }) {
        if (!user) throw new Error("User does not exist.");

        try {
            const newExpert = await expertService.createExpert(
                {
                    user_id: user.id,
                    occupation: expertData.occupation,
                    id_docu: expertData.id_docu,
                    employment_proof: expertData.employment_proof,
                    diploma_docu: expertData.diploma_docu,
					academic_profile: expertData.academic_profile && expertData.academic_profile.trim()
						? expertData.academic_profile.trim()
						: null,
                }
            );
            setExperts((prev) => [newExpert, ...prev]);
            setExpert(newExpert);
            return newExpert;
        } catch (err) {
            setExpertError (err instanceof Error ? err.message : "Failed to create expert.");
            throw err;
        }
    }
    return { expert, experts, expertError, expertLoading, createExpert }
}