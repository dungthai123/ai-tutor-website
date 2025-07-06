"""Chinese tutor agent class with student tracking capabilities."""

from typing import Dict, Optional
from livekit.agents import Agent, function_tool, RunContext
from db_driver import DatabaseDriver
from topic_handler import create_instructions

# Initialize database driver
DB = DatabaseDriver()


class ChineseTutor(Agent):
    """Chinese language tutor agent with student tracking capabilities."""
    
    def __init__(self, topic_data: Optional[Dict] = None) -> None:
        instructions = create_instructions(topic_data)
        super().__init__(instructions=instructions)
        
        self.topic_data = topic_data
        self.topic_name = topic_data['topic_name'] if topic_data else "General Chinese"
        self._student_details = self._init_student_details()

    def _init_student_details(self) -> Dict[str, any]:
        """Initialize empty student details."""
        return {
            "name": "",
            "email": "",
            "level": "", 
            "goals": "",
            "lessons_completed": 0
        }

    def get_student_str(self) -> str:
        """Get formatted string of student details."""
        return "\n".join(f"{key}: {value}" for key, value in self._student_details.items())

    def has_student(self) -> bool:
        """Check if student details are available."""
        return bool(self._student_details["name"])

    @function_tool()
    async def lookup_student(self, context: RunContext, name: str) -> str:
        """Look up a student by their name (optional - only use if student mentions they want to save progress).
        
        Args:
            name: The name of the student to look up
        """
        result = DB.get_student_by_name(name)
        if result is None:
            return "Student profile not found. We can create one if you'd like to track your progress!"

        self._student_details = {
            "name": result.name,
            "email": result.email,
            "level": result.level,
            "goals": result.goals,
            "lessons_completed": result.lessons_completed
        }

        return f"Welcome back! Here are your details:\n{self.get_student_str()}" 