"""Data models for the Chinese tutor agent."""

import json
import uuid
from typing import List, Dict, Optional, Any
from dataclasses import dataclass, asdict
from livekit.agents import JobContext


@dataclass
class Task:
    """Represents a conversation task for the student."""
    id: str
    title: str
    description: str
    is_completed: bool = False

    def to_dict(self) -> Dict[str, Any]:
        """Convert task to dictionary."""
        return asdict(self)


class UserData:
    """User data container for managing student progress and tasks."""
    
    def __init__(self, ctx: Optional[JobContext] = None):
        self.ctx = ctx
        self.tasks: List[Task] = []
        self._init_default_tasks()
    
    def _init_default_tasks(self):
        """Initialize default conversation tasks."""
        self.tasks = [
            Task(
                id="1",
                title="Introduce yourself",
                description="Share your name and country",
                is_completed=False
            ),
            Task(
                id="2", 
                title="Talk about hobbies",
                description="Discuss your favorite activities and interests",
                is_completed=False
            ),
            Task(
                id="3",
                title="Talk about your job", 
                description="Share information about your work or studies",
                is_completed=False
            )
        ]
    
    def get_tasks_status(self) -> List[Dict[str, Any]]:
        """Get current task status as list of dictionaries."""
        return [task.to_dict() for task in self.tasks]
    
    def complete_task(self, task_id: str) -> Optional[Task]:
        """Mark a task as completed."""
        for task in self.tasks:
            if task.id == task_id and not task.is_completed:
                task.is_completed = True
                return task
        return None
    
    def complete_task_by_title(self, title: str) -> Optional[Task]:
        """Mark a task as completed by title."""
        for task in self.tasks:
            if title in task.title and not task.is_completed:
                task.is_completed = True
                return task
        return None
    
    def reset_tasks(self):
        """Reset all tasks to incomplete."""
        for task in self.tasks:
            task.is_completed = False
    
    def get_completed_count(self) -> int:
        """Get number of completed tasks."""
        return sum(1 for task in self.tasks if task.is_completed)
    
    def get_total_count(self) -> int:
        """Get total number of tasks."""
        return len(self.tasks)
    
    def is_all_completed(self) -> bool:
        """Check if all tasks are completed."""
        return self.get_completed_count() == self.get_total_count() 