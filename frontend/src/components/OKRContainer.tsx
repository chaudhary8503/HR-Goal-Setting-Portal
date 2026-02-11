"use client"

import type React from "react"
import { useState } from "react"
import OKRForm from "./OKRForm"
import LoadingSpinner from "./ui/LoadingSpinner"
import { generateSmartGoal, retry } from "@/lib/api"
import type { OKRData, OKRContainerProps, AIResultProps } from "@/types/index"

// ['title', 'description', 'kpi', 'companyTopBetAlignment', 'framework3E', 'coreValue']

const OKRContainer: React.FC<OKRContainerProps> = ({ onSubmit, user }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AIResultProps | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const maxRetries = 3

  const handleFormSubmit = async (data: OKRData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await retry(() => generateSmartGoal(data))

      if (response.success) {
        setResult(response.result)
        setRetryCount(0)
        onSubmit(data, response.result, response.isFallback)
      } else {
        setError(response.error || "Failed to generate SMART goal")
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Error:", err)
    } finally {
      setLoading(false)
    }
  }

  // const handleRetry = async () => {
  //   if (retryCount >= maxRetries) {
  //     setError('Maximum retry attempts reached. Please try again later.');
  //     return;
  //   }

  //   setRetryCount(prevCount => prevCount + 1);
  //   setError(null);
  //   setLoading(true);

  //   try {
  //     const response = await generateSmartGoal(data: OKRData);

  //     if (response.success) {
  //       setResult(response.result);
  //       onSubmit(result, response.result, response.isFallback);
  //       setRetryCount(0);
  //     } else {
  //       setError(`Retry failed (${retryCount + 1}/${maxRetries}): ${response.error || 'Unknown error'}`);
  //     }
  //   } catch (err: any) {
  //     setError(`Retry failed (${retryCount + 1}/${maxRetries}): An unexpected error occurred`);
  //     console.error('Error during retry:', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  return (
    <div className="space-y-6">
      <OKRForm onSubmit={handleFormSubmit} isLoading={loading} user={user} />

      {loading && (
        <div className="mt-6 p-6 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg flex flex-col items-center justify-center shadow-sm">
          <LoadingSpinner size="large" text="Generating your SMART goals..." />
          <p className="text-teal-700 mt-3 font-medium">This may take a few moments...</p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 shadow-sm">
          <div className="flex flex-col gap-3">
            <p className="font-medium">{error}</p>
            <button
              onClick={() => <OKRForm onSubmit={handleFormSubmit} isLoading={loading} user={user} />}
              className="self-start px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 font-medium shadow-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default OKRContainer
