"""Task handler for managing conversation tasks."""

import logging
import json
from .base import BaseRPCHandler

logger = logging.getLogger("chinese_tutor")


class TaskHandler(BaseRPCHandler):
    """Handler for task-related RPC operations."""
    
    def get_method_name(self) -> str:
        """Get the RPC method name this handler responds to."""
        return "client.tasks"
    
    async def handle(self, rpc_data):
        """Handle task-related RPC calls.
        
        Args:
            rpc_data: RPC data containing task request
            
        Returns:
            str: Response message
        """
        try:
            logger.info(f"Received task RPC call: {rpc_data}")
            
            # Parse the payload
            payload_data = self.parse_rpc_payload(rpc_data)
            action = payload_data.get('action')
            
            if action == "get_tasks":
                # Return current task status
                tasks = self.userdata.get_tasks_status()
                return json.dumps({
                    "action": "task_status",
                    "tasks": tasks
                })
            
            elif action == "reset_tasks":
                # Reset all tasks to incomplete
                self.userdata.reset_tasks()
                
                tasks = self.userdata.get_tasks_status()
                return json.dumps({
                    "action": "task_status", 
                    "tasks": tasks
                })
            
            else:
                logger.warning(f"Unknown task action: {action}")
                return json.dumps({
                    "error": f"Unknown action: {action}"
                })
                
        except Exception as e:
            logger.error(f"Error handling task RPC: {e}")
            return json.dumps({
                "error": f"Failed to handle task request: {str(e)}"
            }) 