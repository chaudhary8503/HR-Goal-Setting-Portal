"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, TrendingUp, Calendar, Target, Heart, Download, FileJson, AlertCircle } from "lucide-react"
import { exportToPdf, exportToJson } from "@/lib/export"
import type { SmartGoalResultsProps, OutputGoalProps } from "@/types/index" // Assuming you have a types file for OKRData and SmartGoalResultsProps
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { saveUserGoal, SendEdit } from "@/lib/api"
import toast from "react-hot-toast"

const SmartGoalResults: React.FC<SmartGoalResultsProps> = ({ okrData, aiResult, isFallback = false }) => {
  const [selectedGoalIndex, setSelectedGoalIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalAction, setModalAction] = useState<"save" | "edit" | null>(null)
  const [userComments, setUserComments] = useState("")
  const [localGoals, setLocalGoals] = useState<OutputGoalProps[]>([])
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Initialize local state with props
  useEffect(() => {
    if (aiResult?.goals) {
      setLocalGoals([...aiResult.goals])
    }
  }, [aiResult])

  const handleExportToPdf = () => {
    exportToPdf("smart-goal-results")
  }
  const handleExportToJson = () => {
    exportToJson(okrData, aiResult)
  }

  const handleEditSelectedGoal = async (index: number, goal: OutputGoalProps, userComments: string) => {
    try {
      setLoading(true)
      setError(null)

      console.log("Index of user selected goal:", index)

      // call the API to send the selected goal
      const response = await SendEdit(goal, userComments)

      if (response.success) {
        toast.success("Goal edited successfully")

        // Create a defensive copy of the current goals
        const updatedGoals = [...localGoals]

        // Update the specific goal with all properties from the response
        updatedGoals[index] = {
          title: response.result.goal?.title || updatedGoals[index].title,
          description: response.result.goal?.description || updatedGoals[index].description,
          kpi: response.result.goal?.kpi || updatedGoals[index].kpi,
          companyTopBetAlignment:
            response.result.goal?.companyTopBetAlignment || updatedGoals[index].companyTopBetAlignment,
          framework3E: response.result.goal?.framework3E || updatedGoals[index].framework3E,
          coreValue: response.result.goal?.coreValue || updatedGoals[index].coreValue,
        }

        // Update state with the new array
        setLocalGoals(updatedGoals)
        setSuccessMessage("Goal successfully edited!")
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        console.error("Error editing goal:", response.error)
        setError(response.error || "An error occurred while editing the goal. Please try again.")
      }
      setLoading(false)
    } catch (err: any) {
      console.error("Error selecting goal:", err)
      setError("An error occurred while selecting the goal. Please try again.")
      setLoading(false)
    }
  }

  // This function will save the goal in the database for the user and also edit AIResults to only display the saved goal on the frontend
  const handleSaveGoal = async (goal: OutputGoalProps) => {
    try {
      setLoading(true)

      const response = await saveUserGoal(goal)
      if (response.success) {
        toast.success("Goal Saved Successfully")

        // Replace all other goals and show only the saved one
        const updatedGoals: OutputGoalProps[] = [
          {
            title: goal.title,
            description: goal.description,
            kpi: goal.kpi,
            companyTopBetAlignment: goal.companyTopBetAlignment,
            framework3E: goal.framework3E,
            coreValue: goal.coreValue,
          },
        ]

        setLocalGoals(updatedGoals) // Show only the saved goal
        setSelectedGoalIndex(0) // Update selection to the new single goal

        setSuccessMessage("Goal successfully saved!")
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        console.error("Error saving goal:", response.error)
        setError(response.error || "An error occurred while saving the goal. Please try again.")
      }

      setIsModalOpen(false)
      setLoading(false)
    } catch (err: any) {
      console.error("Error processing action:", err)
      setError(
        `An error occurred while ${modalAction === "save" ? "saving" : "submitting"} the goal. Please try again.`,
      )
      setLoading(false)
    }
  }

  const handleCancelAction = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6" id="smart-goal-results">
      {/* Export buttons */}
      <div className="flex justify-end gap-3">
        <Button
          onClick={handleExportToPdf}
          className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white flex items-center gap-2 shadow-lg"
        >
          <Download size={16} />
          Export as PDF
        </Button>
        <Button
          onClick={handleExportToJson}
          className="bg-slate-700 hover:bg-slate-800 text-white flex items-center gap-2 shadow-lg"
        >
          <FileJson size={16} />
          Export as JSON
        </Button>
      </div>
      {/* OKR Summary */}
      <Card className="shadow-xl border-slate-200">
        <CardHeader className="bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 border-b border-slate-200">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <Target className="text-teal-600" size={24} />
            OKR Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-slate-700 mb-1">Department</h3>
                <p className="text-slate-900 font-medium">{okrData.department}</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-700 mb-1">Job Title</h3>
                <p className="text-slate-900 font-medium">{okrData.jobTitle}</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-700 mb-1">Manager's Goal</h3>
                <p className="text-slate-600">{okrData.managersGoal}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-slate-700 mb-1">Goal Description</h3>
                <p className="text-slate-600">{okrData.goalDescription}</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-700 mb-1">Key Result</h3>
                <p className="text-slate-600">{okrData.keyResult}</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-700 mb-1">Due Date</h3>
                <p className="text-slate-600 flex items-center gap-2">
                  <Calendar size={16} className="text-teal-600" />
                  {new Date(okrData.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>{" "}
      {/* AI Generated Results */}
      {aiResult && (
        <Card className="shadow-xl border-slate-200">
          <CardHeader className="bg-gradient-to-r from-slate-900 via-teal-900 to-cyan-900 text-white">
            {" "}
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <CheckCircle size={24} />
              AI Generated SMART Goals
            </CardTitle>
            <p className="text-teal-200 text-sm mt-2">Specific • Measurable • Achievable • Relevant • Time-bound</p>
            {isFallback && (
              <div className="bg-yellow-600 text-white text-sm p-2 mt-3 rounded">
                Note: Using locally generated goals due to API server unavailability
              </div>
            )}
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {" "}
              {typeof aiResult === "string" ? (
                <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
                  <p className="text-slate-800 whitespace-pre-line">{aiResult}</p>
                </div>
              ) : Array.isArray(localGoals) && localGoals.length > 0 ? (
                <>
                  {localGoals.map((goal, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-6 cursor-pointer transition-all duration-200 ${
                        index === selectedGoalIndex
                          ? "border-teal-500 bg-gradient-to-r from-teal-50 to-cyan-50 shadow-md"
                          : "border-slate-200 bg-slate-50 hover:border-teal-300"
                      }`}
                      onClick={() => setSelectedGoalIndex(index)}
                    >
                      {" "}
                      {/* ⬇️ Add checkbox to select goal */}
                      <div className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          checked={selectedGoalIndex === index}
                          onChange={() => setSelectedGoalIndex(index === selectedGoalIndex ? null : index)}
                          className="mr-2 h-4 w-4 text-teal-600 focus:ring-teal-500 rounded"
                        />
                        <span className="font-semibold text-slate-700">Select Goal #{index + 1}</span>
                      </div>
                      {/* <div key={index} className="border border-slate-200 rounded-lg p-6 bg-slate-50"> */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-bold text-slate-800 text-lg mb-2">Goal #{index + 1}</h3>
                            <p className="text-slate-900 font-semibold">{goal.title}</p>
                          </div>
                          {goal.description && (
                            <div>
                              <h4 className="font-semibold text-slate-700 mb-1">Description</h4>
                              <p className="text-slate-600 text-sm">{goal.description}</p>
                            </div>
                          )}
                          {goal.kpi && (
                            <div>
                              <h4 className="font-semibold text-slate-700 mb-1">KPI</h4>
                              <div className="flex items-center gap-2 text-teal-700 font-medium">
                                <TrendingUp size={16} />
                                {goal.kpi}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="space-y-4">
                          {goal.companyTopBetAlignment && (
                            <div>
                              <h4 className="font-semibold text-slate-700 mb-1">Company Top Bets Alignment</h4>
                              <p className="text-slate-600 text-sm bg-teal-50 p-2 rounded border-l-4 border-teal-400">
                                {goal.companyTopBetAlignment}
                              </p>
                            </div>
                          )}

                          {goal.framework3E && (
                            <div>
                              <h4 className="font-semibold text-slate-700 mb-1">3E Framework Alignment</h4>
                              <p className="text-slate-600 text-sm bg-cyan-50 p-2 rounded border-l-4 border-cyan-400">
                                {goal.framework3E}
                              </p>
                            </div>
                          )}

                          {goal.coreValue && (
                            <div>
                              <h4 className="font-semibold text-slate-700 mb-1 flex items-center gap-2">
                                <Heart size={16} className="text-red-500" />
                                Core Values Alignment
                              </h4>
                              <p className="text-slate-600 text-sm bg-red-50 p-2 rounded border-l-4 border-red-400">
                                {goal.coreValue}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    // </div>
                  ))}
                  {/* {//array ends heere} */}{" "}
                  <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    {/* Success message */}
                    {successMessage && (
                      <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md">
                        <div className="flex items-center">
                          <CheckCircle size={16} className="mr-2" />
                          {successMessage}
                        </div>
                      </div>
                    )}

                    {/* Error message */}
                    {error && (
                      <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
                        <div className="flex items-center">
                          <AlertCircle size={16} className="mr-2" />
                          {error}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-3 justify-end">
                      <Button
                        className={`flex items-center gap-2 shadow-lg ${
                          selectedGoalIndex !== null
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                        disabled={selectedGoalIndex === null}
                        onClick={() => {
                          if (selectedGoalIndex !== null) {
                            setModalAction("save")
                            setIsModalOpen(true)
                          }
                        }}
                      >
                        <CheckCircle size={16} />
                        Save and Submit Goal
                      </Button>

                      <Button
                        className={`flex items-center gap-2 shadow-lg ${
                          selectedGoalIndex !== null
                            ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                        disabled={selectedGoalIndex === null}
                        onClick={() =>
                          // open a modal so user can enter what they have to correct
                          selectedGoalIndex !== null &&
                          (() => {
                            setModalAction("edit")
                            setIsModalOpen(true)
                          })()
                        }
                      >
                        <Calendar size={16} />
                        Edit Goal
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-red-600 font-medium">No SMART goals found in response.</div>
              )}{" "}
            </div>
          </CardContent>
        </Card>
      )}
      {modalAction === "edit" && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="text-amber-500" size={20} />
                Edit Goal Confirmation
              </DialogTitle>
              <DialogDescription>
                You're about to edit the following goal. Please provide details on what you'd like to change so we can
                assist you better.
              </DialogDescription>
            </DialogHeader>{" "}
            {selectedGoalIndex !== null && localGoals && localGoals.length > 0 && (
              <div className="max-h-52 overflow-y-auto p-4 my-2 bg-slate-50 border border-slate-200 rounded-md">
                <h4 className="font-semibold text-slate-800 mb-1">Goal Title:</h4>
                <p className="text-slate-700 font-medium">{localGoals[selectedGoalIndex].title}</p>

                {localGoals[selectedGoalIndex].description && (
                  <>
                    <h5 className="mt-3 font-semibold text-slate-700">Description:</h5>
                    <p className="text-slate-600 text-sm whitespace-pre-line">
                      {localGoals[selectedGoalIndex].description}
                    </p>
                  </>
                )}
              </div>
            )}
            {/* Text area for user comments */}
            <div className="mt-4">
              <label htmlFor="userComments" className="block font-medium text-sm text-slate-700 mb-1">
                What would you like to change?
              </label>
              <textarea
                id="userComments"
                className="w-full min-h-[100px] resize-y rounded-md border border-slate-300 bg-white p-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Add detailed comments or instructions for the AI..."
                value={userComments}
                onChange={(e) => setUserComments(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1">
                Please be as specific as possible — the more detail you provide, the better the suggestions will be.
              </p>
            </div>
            <DialogFooter className="gap-2 sm:gap-0 mt-4">
              <Button variant="outline" onClick={handleCancelAction} disabled={loading}>
                Cancel
              </Button>

              <Button
                onClick={() => {
                  setIsModalOpen(false)

                  if (selectedGoalIndex !== null) {
                    const goal = localGoals[selectedGoalIndex]

                    handleEditSelectedGoal(selectedGoalIndex, goal, userComments || "")
                  }
                }}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                disabled={loading}
              >
                Submit Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {/* Confirmation Modal to Save */}
      {modalAction === "save" && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="text-amber-500" size={20} />
                Confirm
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to save this goal? This will store it in your personal workspace.
              </DialogDescription>
            </DialogHeader>

            {selectedGoalIndex !== null && localGoals && localGoals.length > 0 && (
              <div className="max-h-52 overflow-y-auto p-4 my-2 bg-slate-50 border border-slate-200 rounded-md">
                <h4 className="font-semibold text-slate-800">Selected Goal:</h4>
                <p className="text-slate-700 whitespace-pre-line">{localGoals[selectedGoalIndex].title}</p>
                {localGoals[selectedGoalIndex].description && (
                  <div className="mt-2">
                    <h5 className="font-semibold text-slate-700">Description:</h5>
                    <p className="text-slate-600 text-sm">{localGoals[selectedGoalIndex].description}</p>
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={handleCancelAction} disabled={loading}>
                Cancel
              </Button>

              <Button
                onClick={handleSaveGoal.bind(null, localGoals[selectedGoalIndex])}
                className={
                  modalAction === "save"
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                }
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-b-transparent rounded-full mr-2"></div>
                    Processing...
                  </>
                ) : modalAction === "save" ? (
                  "Save Goal"
                ) : (
                  "Submit Goal"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default SmartGoalResults
