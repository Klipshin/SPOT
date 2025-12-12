"use client";

import React from "react";
import { AiChatLoggedIn } from "@/src/app/AI_chat/AI_chat";
import ProtectedRoute from "@/src/components/ProtectedRoute";

export default function AiChatPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <AiChatLoggedIn />
      </div>
    </ProtectedRoute>
  );
}
