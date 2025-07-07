"""Handler registry for managing RPC handlers."""

import logging
from typing import Dict, List
from livekit.agents import JobContext
from livekit.agents.voice import AgentSession
from models import UserData
from .base import BaseRPCHandler
from .task_handler import TaskHandler

logger = logging.getLogger("chinese_tutor")


class HandlerRegistry:
    """Registry for managing and registering RPC handlers."""
    
    def __init__(self, userdata: UserData, session: AgentSession[UserData], ctx: JobContext):
        self.userdata = userdata
        self.session = session
        self.ctx = ctx
        self.handlers: Dict[str, BaseRPCHandler] = {}
        
        # Initialize all handlers
        self._initialize_handlers()
    
    def _initialize_handlers(self):
        """Initialize all available handlers."""
        # Create handler instances
        task_handler = TaskHandler(self.userdata, self.session, self.ctx)
        
        # Register handlers with their method names
        self._register_handler(task_handler)
        
        logger.info(f"Initialized {len(self.handlers)} handlers")
    
    def _register_handler(self, handler: BaseRPCHandler):
        """Register a single handler.
        
        Args:
            handler: Handler instance to register
        """
        method_name = handler.get_method_name()
        self.handlers[method_name] = handler
        logger.debug(f"Registered handler for method: {method_name}")
    
    def register_all_handlers(self):
        """Register all handlers with the LiveKit room."""
        logger.info("Registering all RPC methods with LiveKit room")
        
        for method_name, handler in self.handlers.items():
            self.ctx.room.local_participant.register_rpc_method(
                method_name,
                handler.handle
            )
            logger.debug(f"Registered RPC method: {method_name}")
        
        logger.info(f"Successfully registered {len(self.handlers)} RPC methods")
    
    def get_handler(self, method_name: str) -> BaseRPCHandler:
        """Get a handler by method name.
        
        Args:
            method_name: Name of the RPC method
            
        Returns:
            BaseRPCHandler: Handler instance or None if not found
        """
        return self.handlers.get(method_name)
    
    def get_all_handlers(self) -> Dict[str, BaseRPCHandler]:
        """Get all registered handlers.
        
        Returns:
            Dict[str, BaseRPCHandler]: Dictionary of method names to handlers
        """
        return self.handlers.copy()
    
    def get_handler_info(self) -> List[Dict[str, str]]:
        """Get information about all registered handlers.
        
        Returns:
            List[Dict[str, str]]: List of handler information
        """
        info = []
        for method_name, handler in self.handlers.items():
            info.append({
                'method_name': method_name,
                'handler_class': handler.__class__.__name__,
                'handler_doc': handler.__doc__ or 'No description available'
            })
        return info 