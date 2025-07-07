"""Task checking tools for the Chinese tutor agent."""

import logging
import json
from typing import List
from livekit.agents.llm import function_tool
from livekit.agents.voice import RunContext
from models import UserData

logger = logging.getLogger("chinese_tutor")


class TaskTools:
    """Container for task-related function tools."""
    
    @staticmethod
    @function_tool
    async def check_conversation_task(context: RunContext[UserData], task_type: str):
        """Check off a conversation task when the student completes it.

        Args:
            task_type: The type of task completed. Must be one of:
                - "introduction" - Student shared their name and basic information
                - "hobbies" - Student talked about their hobbies and interests  
                - "job" - Student discussed their job or studies
        """
        logger.info(f"🎯 TASK TOOL CALLED: check_conversation_task with task_type='{task_type}'")
        userdata = context.userdata
        
        # Map task types to task titles (match working reference exactly)
        task_mapping = {
            "introduction": "Introduce yourself",
            "hobbies": "Talk about hobbies", 
            "job": "Talk about your job"  # Changed from "work_study" to "job"
        }
        
        if task_type not in task_mapping:
            error_msg = f"Invalid task type: {task_type}. Must be one of: introduction, hobbies, job"
            logger.error(f"❌ {error_msg}")
            return error_msg
        
        task_title = task_mapping[task_type]
        logger.info(f"📋 Looking for task with title: '{task_title}'")
        
        # Find and complete the task
        task_completed = userdata.complete_task_by_title(task_title)
        
        if not task_completed:
            error_msg = f"Task '{task_title}' not found or already completed."
            logger.warning(f"⚠️ {error_msg}")
            return error_msg
        
        logger.info(f"✅ Task '{task_title}' marked as completed!")
        
        # Send task update to frontend
        if not userdata.ctx or not userdata.ctx.room:
            error_msg = f"Marked task as completed, but couldn't access the room to send update."
            logger.error(f"❌ {error_msg}")
            return error_msg
        
        room = userdata.ctx.room
        participants = room.remote_participants
        if not participants:
            error_msg = f"Marked task as completed, but no participants found to send update to."
            logger.error(f"❌ {error_msg}")
            return error_msg
        
        participant = next(iter(participants.values()), None)
        if not participant:
            error_msg = f"Marked task as completed, but couldn't get the first participant."
            logger.error(f"❌ {error_msg}")
            return error_msg
        
        # Send updated task list to frontend
        payload = {
            "action": "update_tasks",
            "tasks": userdata.get_tasks_status()
        }
        
        json_payload = json.dumps(payload)
        logger.info(f"📤 Sending task update payload to participant '{participant.identity}': {json_payload}")
        
        try:
            await room.local_participant.perform_rpc(
                destination_identity=participant.identity,
                method="client.tasks",
                payload=json_payload
            )
            logger.info(f"✅ RPC message sent successfully!")
        except Exception as e:
            logger.error(f"❌ Failed to send RPC message: {e}")
            return f"Task completed but failed to send update to frontend: {e}"
        
        # Return success message in Chinese and English
        task_chinese = task_title.split(" (")[0]  # Extract Chinese part
        success_msg = f"太好了！我已经标记'{task_chinese}'为完成。Great job! I've marked '{task_title}' as completed."
        logger.info(f"🎉 {success_msg}")
        return success_msg
    
    @staticmethod
    @function_tool
    async def get_task_progress(context: RunContext[UserData]) -> str:
        """Get the current task progress for the student.
        
        Returns:
            str: Progress summary with completed and remaining tasks
        """
        userdata = context.userdata
        
        completed_count = userdata.get_completed_count()
        total_count = userdata.get_total_count()
        
        # Build progress message
        progress_msg = f"进度 Progress: {completed_count}/{total_count} 任务完成 tasks completed\n\n"
        
        for task in userdata.tasks:
            status = "✅" if task.is_completed else "⏳"
            progress_msg += f"{status} {task.title}\n"
        
        if userdata.is_all_completed():
            progress_msg += "\n🎉 恭喜！所有任务都完成了！Congratulations! All tasks completed!"
        
        return progress_msg 