"""Chinese tutor agent class with task tracking capabilities."""

from typing import Dict, Optional
from livekit.agents import Agent
from livekit.plugins import openai, silero
from openai.types.beta.realtime.session import InputAudioTranscription, TurnDetection
from topic_handler import create_instructions
from task_tools import TaskTools
from config import (
    STT_MODEL, STT_LANGUAGE, LLM_MODEL, TTS_MODEL,
    VAD_THRESHOLD, VAD_SILENCE_DURATION, VAD_PREFIX_PADDING,
    VAD_MIN_SPEECH_DURATION, VAD_MIN_SILENCE_DURATION,
    VAD_ACTIVATION_THRESHOLD, VAD_SAMPLE_RATE
)


class ChineseTutor(Agent):
    """Chinese language tutor agent with task tracking capabilities."""
    
    def __init__(self, topic_data: Optional[Dict] = None) -> None:
        instructions = create_instructions(topic_data)
        super().__init__(
            instructions=instructions,
            llm=openai.realtime.RealtimeModel(
                voice=TTS_MODEL,
                model="gpt-4o-mini-realtime-preview",
                input_audio_transcription=InputAudioTranscription(
                    model=STT_MODEL,
                    language=STT_LANGUAGE,
                ),
                turn_detection=TurnDetection(
                    type="server_vad",
                    threshold=VAD_THRESHOLD,
                    silence_duration_ms=VAD_SILENCE_DURATION,
                    prefix_padding_ms=VAD_PREFIX_PADDING,
                    create_response=True,
                    interrupt_response=True
                ),
            ),
            vad=silero.VAD.load(
                min_speech_duration=VAD_MIN_SPEECH_DURATION,
                min_silence_duration=VAD_MIN_SILENCE_DURATION,
                activation_threshold=VAD_ACTIVATION_THRESHOLD,
                sample_rate=VAD_SAMPLE_RATE
            ),
            tools=[
                TaskTools.check_conversation_task,
                TaskTools.get_task_progress
            ]
        )
        
        self.topic_data = topic_data
        self.topic_name = topic_data['topic_name'] if topic_data else "General Chinese"

 