"""Base RPC handler for the Chinese tutor agent."""

import logging
import json
from abc import ABC, abstractmethod
from livekit.agents import JobContext
from livekit.agents.voice import AgentSession
from models import UserData

logger = logging.getLogger("chinese_tutor")


class BaseRPCHandler(ABC):
    """Base class for RPC handlers with common functionality."""
    
    def __init__(self, userdata: UserData, session: AgentSession[UserData], ctx: JobContext):
        self.userdata = userdata
        self.session = session
        self.ctx = ctx
    
    def parse_rpc_payload(self, rpc_data) -> dict:
        """Parse JSON payload from RPC data.
        
        Args:
            rpc_data: RPC data containing JSON payload
            
        Returns:
            dict: Parsed payload data
            
        Raises:
            json.JSONDecodeError: If payload is invalid JSON
        """
        payload_str = rpc_data.payload
        logger.info(f"Extracted payload string: {payload_str}")
        
        payload_data = json.loads(payload_str)
        logger.info(f"Parsed payload data: {payload_data}")
        
        return payload_data
    
    def get_first_participant(self):
        """Get the first remote participant from the room.
        
        Returns:
            Participant or None: First remote participant if available
        """
        participants = self.ctx.room.remote_participants
        if not participants:
            logger.warning("No remote participants found")
            return None
            
        participant = next(iter(participants.values()), None)
        if not participant:
            logger.warning("Could not get first participant")
            return None
            
        return participant
    
    async def send_rpc_to_client(self, method: str, payload: dict):
        """Send RPC message to client.
        
        Args:
            method: RPC method name
            payload: Data to send
        """
        participant = self.get_first_participant()
        if not participant:
            logger.error("Cannot send RPC: no participants available")
            return
        
        json_payload = json.dumps(payload)
        logger.info(f"Sending RPC payload to {method}: {json_payload}")
        
        await self.ctx.room.local_participant.perform_rpc(
            destination_identity=participant.identity,
            method=method,
            payload=json_payload
        )
    
    @abstractmethod
    async def handle(self, rpc_data):
        """Handle the RPC request. Must be implemented by subclasses."""
        pass
    
    @abstractmethod
    def get_method_name(self) -> str:
        """Get the RPC method name this handler responds to."""
        pass 