import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Room } from "livekit-client";

export interface Task {
  id: string;
  title: string;
  description: string;
  is_completed: boolean;
}

interface TaskListProps {
  room?: Room;
  className?: string;
}

export function TaskList({ room, className }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Introduce yourself",
      description: "Share your name and country",
      is_completed: false
    },
    {
      id: "2", 
      title: "Talk about hobbies",
      description: "Discuss your favorite activities and interests",
      is_completed: false
    },
    {
      id: "3",
      title: "Talk about your job", 
      description: "Share information about your work or studies",
      is_completed: false
    }
  ]);

  // Debug state
  const [debugInfo, setDebugInfo] = useState<string>("");

  // Try to get room from props or window object (like working reference)
  const liveKitRoom = room || (typeof window !== 'undefined' && (window as unknown as { liveKitRoom?: Room }).liveKitRoom) || null;

  useEffect(() => {
    const updateDebugInfo = () => {
      const info = [
        `Room from props: ${room ? 'YES' : 'NO'}`,
        `Room from window: ${(typeof window !== 'undefined' && (window as unknown as { liveKitRoom?: Room }).liveKitRoom) ? 'YES' : 'NO'}`,
        `Final room: ${liveKitRoom ? 'YES' : 'NO'}`,
        `Room state: ${liveKitRoom?.state || 'N/A'}`,
        `Connected: ${liveKitRoom?.state === 'connected' || false}`,
        `Local participant: ${liveKitRoom?.localParticipant ? 'YES' : 'NO'}`,
        `Remote participants: ${liveKitRoom?.remoteParticipants?.size || 0}`
      ].join(' | ');
      setDebugInfo(info);
      console.log("🔍 TaskList Debug Info:", info);
    };

    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [room, liveKitRoom]);

  useEffect(() => {
    if (!liveKitRoom) {
      console.log("❌ TaskList: No room available for task updates");
      return;
    }

    console.log("✅ TaskList: Room available, setting up RPC handler");
    console.log("🔍 TaskList: Room details:", {
      state: liveKitRoom.state,
      connected: liveKitRoom.state === 'connected',
      localParticipant: liveKitRoom.localParticipant?.identity,
      remoteParticipantsCount: liveKitRoom.remoteParticipants?.size
    });

    // Register RPC method to receive task updates
    const handleTaskUpdate = async (data: { payload?: string }): Promise<string> => {
      try {
        console.log("📨 TaskList: Received task update RPC data:", data);
        
        if (!data || !data.payload) {
          console.error("❌ TaskList: Invalid RPC data received:", data);
          return "Error: Invalid RPC data format";
        }
        
        const payload = JSON.parse(data.payload);
        console.log("📋 TaskList: Parsed payload:", payload);
        
        if (payload.action === "update_tasks") {
          console.log("🔄 TaskList: Updating tasks:", payload.tasks);
          setTasks(payload.tasks);
          console.log("✅ TaskList: Tasks updated successfully");
        } else {
          console.log("⚠️ TaskList: Unknown action:", payload.action);
        }
        
        return "Success";
      } catch (error) {
        console.error("❌ TaskList: Error processing task update:", error);
        return "Error: " + (error instanceof Error ? error.message : String(error));
      }
    };

    try {
      liveKitRoom.localParticipant.registerRpcMethod(
        "client.tasks",
        handleTaskUpdate
      );
      console.log("✅ TaskList: Registered client.tasks RPC method successfully");
    } catch (error) {
      console.error("❌ TaskList: Error registering RPC method:", error);
    }

    return () => {
      try {
        liveKitRoom.localParticipant.unregisterRpcMethod("client.tasks");
        console.log("🧹 TaskList: Unregistered client.tasks RPC method");
      } catch (error) {
        console.error("❌ TaskList: Error unregistering RPC method:", error);
      }
    };
  }, [liveKitRoom]);

  const completedCount = tasks.filter(task => task.is_completed).length;
  const totalCount = tasks.length;

  // Manual test function for debugging
  const handleManualTest = () => {
    console.log("🧪 Manual test: Simulating task completion");
    setTasks(prevTasks => 
      prevTasks.map((task, index) => 
        index === 0 ? { ...task, is_completed: true } : task
      )
    );
  };

  return (
    <div className={`w-full max-w-md mx-auto bg-white text-black p-6 rounded-lg shadow-lg ${className || ''}`}>
      <h3 className="text-xl font-semibold mb-4 text-center">
        对话任务 Conversation Tasks
      </h3>
      
      {/* Debug Information */}
      <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
        <div className="font-semibold mb-1">Debug Info:</div>
        <div className="break-all">{debugInfo}</div>
        <button 
          onClick={handleManualTest}
          className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
        >
          Test Task Update
        </button>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>进度 Progress</span>
          <span>{completedCount}/{totalCount}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-green-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / totalCount) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-3 rounded-lg border-2 transition-all duration-300 ${
              task.is_completed 
                ? 'bg-green-50 border-green-300' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                task.is_completed 
                  ? 'bg-green-500 border-green-500' 
                  : 'border-gray-300'
              }`}>
                {task.is_completed && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                )}
              </div>
              
              <div className="flex-1">
                <h4 className={`font-medium ${
                  task.is_completed ? 'text-green-800' : 'text-gray-800'
                }`}>
                  {task.title}
                </h4>
                <p className={`text-sm ${
                  task.is_completed ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {task.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {completedCount === totalCount && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-3 bg-green-100 border-2 border-green-300 rounded-lg text-center"
        >
          <div className="text-green-800 font-semibold">
            🎉 恭喜！Congratulations!
          </div>
          <div className="text-green-600 text-sm">
            您已完成所有对话任务！You&apos;ve completed all conversation tasks!
          </div>
        </motion.div>
      )}
    </div>
  );
} 