"""Session management functionality for the Chinese tutor agent."""

from livekit.agents import AgentSession
from livekit.plugins import openai, silero
from openai.types.beta.realtime.session import InputAudioTranscription, TurnDetection

from config import (
    STT_MODEL, STT_LANGUAGE, LLM_MODEL, TTS_MODEL,
    VAD_THRESHOLD, VAD_SILENCE_DURATION, VAD_PREFIX_PADDING,
    VAD_MIN_SPEECH_DURATION, VAD_MIN_SILENCE_DURATION,
    VAD_ACTIVATION_THRESHOLD, VAD_SAMPLE_RATE
)


def create_agent_session() -> AgentSession:
    """Create and configure the agent session with realtime model."""
    return AgentSession(
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
        )
    ) 