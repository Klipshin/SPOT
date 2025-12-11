"use client";

import { useEffect, useState } from "react";
import { useUser } from "./useUser";
import { Expert } from "@/src/utils/supabase/models";
import { expertService } from "../services";

export default function useExperts(userId: string){
    const { user } = useUser();
    const [experts, setExperts] = useState<Expert[]>([]);
    const [ expert, setExpert ] = useState<Expert | null>(null);
    const [ expertLoading, setExpertLoading ] = useState(false);
    const [ expertError, setExpertError ] = useState<string | null>(null);

    const [uploadingIdDocu, setuploadingIdDocu] = useState(false);
    const [uploadingEmploymentProof, setUploadingEmploymentProof] = useState(false);
    const [uploadingDiplomaDocu, setUploadingDiplomaDocu] = useState(false);

    useEffect(() => {
        if (user && userId) {
            loadExpert(userId);
        }
    }, [user, userId] )

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
        id_docu: File;
        employment_proof: File;
        diploma_docu: File;
        academic_profile?: string;
    }) {
        if (!userId) throw new Error("User does not exist.");

        try {
            let idDocuPath = "";
            let employmentProofPath = "";
            let diplomaDocuPath = "";

            if (expertData.id_docu && expertData.id_docu instanceof File) {
                setuploadingIdDocu(true);
                idDocuPath = await expertService.uploadFile(
                    expertData.id_docu,
                    userId
                );
                setuploadingIdDocu(false);
            }

            if (expertData.employment_proof && expertData.employment_proof instanceof File) {
                setUploadingEmploymentProof(true);
                employmentProofPath = await expertService.uploadFile(
                    expertData.employment_proof,
                    userId
                );
                setUploadingEmploymentProof(false);
            }

            if (expertData.diploma_docu && expertData.diploma_docu instanceof File) {
                setUploadingDiplomaDocu(true);
                diplomaDocuPath = await expertService.uploadFile(
                    expertData.diploma_docu,
                    userId
                );
                setUploadingDiplomaDocu(false);
            }

            const newExpert = await expertService.createExpert(
                {
                    user_id: userId,
                    occupation: expertData.occupation,
                    id_docu: idDocuPath,
                    employment_proof: employmentProofPath,
                    diploma_docu: diplomaDocuPath,
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
        } finally {
            setuploadingIdDocu(false);
            setUploadingDiplomaDocu(false);
            setUploadingEmploymentProof(false);
        }
    }

    function getIdDocuUrl(expert: Expert | null): string | null {
        if (!expert?.id_docu) return null;
        return expertService.getFileUrl(expert.id_docu);
    }

    function getDiplomaDocuUrl(expert: Expert | null): string | null {
        if (!expert?.diploma_docu) return null;
        return expertService.getFileUrl(expert.diploma_docu);
    }

    function getEmploymentProofUrl(expert: Expert | null): string | null {
        if (!expert?.employment_proof) return null;
        return expertService.getFileUrl(expert.employment_proof);
    }

    return { 
        expert, 
        experts, 
        expertError, 
        expertLoading, 
        createExpert,
        uploadingIdDocu,
        uploadingEmploymentProof,
        uploadingDiplomaDocu,
        getIdDocuUrl,
        getDiplomaDocuUrl,
        getEmploymentProofUrl
     }
}