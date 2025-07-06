import sqlite3
import os
import json
from typing import Optional, List, Dict, Any
from dataclasses import dataclass, asdict
from contextlib import contextmanager
from datetime import datetime
import uuid

@dataclass
class ConversationSession:
    session_id: str
    user_name: str
    topic: str
    start_time: str
    end_time: Optional[str] = None
    message_count: int = 0
    duration_seconds: Optional[int] = None
    metadata: Optional[str] = None

@dataclass
class ConversationMessage:
    message_id: str
    session_id: str
    speaker: str  # 'user' or 'agent'
    content: str
    timestamp: str
    audio_file_path: Optional[str] = None
    transcription_confidence: Optional[float] = None
    metadata: Optional[str] = None

@dataclass
class UserHistoryStats:
    user_name: str
    total_sessions: int
    total_messages: int
    total_duration_minutes: int
    favorite_topics: List[Dict[str, Any]]
    recent_activity: List[Dict[str, Any]]
    learning_progress: Dict[str, Any]

class UserHistoryDatabaseDriver:
    def __init__(self, db_path: str = "english_tutor_db.sqlite", audio_dir: str = "conversation_audio"):
        self.db_path = db_path
        self.audio_dir = audio_dir
        self._ensure_audio_directory()
        self._init_db()

    def _ensure_audio_directory(self):
        """Ensure audio directory exists"""
        if not os.path.exists(self.audio_dir):
            os.makedirs(self.audio_dir)

    @contextmanager
    def _get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row  # Enable dict-like access
        try:
            yield conn
        finally:
            conn.close()

    def _init_db(self):
        """Initialize database tables for conversation history"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            # Create conversation_sessions table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS conversation_sessions (
                    session_id TEXT PRIMARY KEY,
                    user_name TEXT NOT NULL,
                    topic TEXT NOT NULL,
                    start_time TEXT NOT NULL,
                    end_time TEXT,
                    message_count INTEGER DEFAULT 0,
                    duration_seconds INTEGER,
                    metadata TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Create conversation_messages table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS conversation_messages (
                    message_id TEXT PRIMARY KEY,
                    session_id TEXT NOT NULL,
                    speaker TEXT NOT NULL CHECK (speaker IN ('user', 'agent')),
                    content TEXT NOT NULL,
                    timestamp TEXT NOT NULL,
                    audio_file_path TEXT,
                    transcription_confidence REAL,
                    metadata TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (session_id) REFERENCES conversation_sessions (session_id)
                )
            """)
            
            # Create indexes for better performance
            cursor.execute("""
                CREATE INDEX IF NOT EXISTS idx_sessions_user_name 
                ON conversation_sessions (user_name)
            """)
            cursor.execute("""
                CREATE INDEX IF NOT EXISTS idx_sessions_topic 
                ON conversation_sessions (topic)
            """)
            cursor.execute("""
                CREATE INDEX IF NOT EXISTS idx_messages_session_id 
                ON conversation_messages (session_id)
            """)
            cursor.execute("""
                CREATE INDEX IF NOT EXISTS idx_messages_timestamp 
                ON conversation_messages (timestamp)
            """)
            
            conn.commit()

    # ===== SESSION MANAGEMENT =====
    def create_session(self, user_name: str, topic: str, metadata: Optional[Dict] = None) -> ConversationSession:
        """Create a new conversation session"""
        session_id = str(uuid.uuid4())
        start_time = datetime.now().isoformat()
        metadata_json = json.dumps(metadata) if metadata else None
        
        session = ConversationSession(
            session_id=session_id,
            user_name=user_name,
            topic=topic,
            start_time=start_time,
            metadata=metadata_json
        )
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO conversation_sessions 
                (session_id, user_name, topic, start_time, metadata)
                VALUES (?, ?, ?, ?, ?)
            """, (session_id, user_name, topic, start_time, metadata_json))
            conn.commit()
        
        return session

    def end_session(self, session_id: str) -> bool:
        """End a conversation session and calculate statistics"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            # Get session start time and message count
            cursor.execute("""
                SELECT start_time, 
                       (SELECT COUNT(*) FROM conversation_messages WHERE session_id = ?) as message_count
                FROM conversation_sessions 
                WHERE session_id = ?
            """, (session_id, session_id))
            
            row = cursor.fetchone()
            if not row:
                return False
            
            start_time = datetime.fromisoformat(row['start_time'])
            end_time = datetime.now()
            duration_seconds = int((end_time - start_time).total_seconds())
            message_count = row['message_count']
            
            # Update session
            cursor.execute("""
                UPDATE conversation_sessions 
                SET end_time = ?, duration_seconds = ?, message_count = ?
                WHERE session_id = ?
            """, (end_time.isoformat(), duration_seconds, message_count, session_id))
            
            conn.commit()
            return cursor.rowcount > 0

    def get_session(self, session_id: str) -> Optional[ConversationSession]:
        """Get a specific session by ID"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM conversation_sessions WHERE session_id = ?", (session_id,))
            row = cursor.fetchone()
            
            if not row:
                return None
            
            return ConversationSession(
                session_id=row['session_id'],
                user_name=row['user_name'],
                topic=row['topic'],
                start_time=row['start_time'],
                end_time=row['end_time'],
                message_count=row['message_count'],
                duration_seconds=row['duration_seconds'],
                metadata=row['metadata']
            )

    # ===== MESSAGE MANAGEMENT =====
    def add_message(self, session_id: str, speaker: str, content: str, 
                   audio_file_path: Optional[str] = None, 
                   transcription_confidence: Optional[float] = None,
                   metadata: Optional[Dict] = None) -> ConversationMessage:
        """Add a message to a conversation session"""
        message_id = str(uuid.uuid4())
        timestamp = datetime.now().isoformat()
        metadata_json = json.dumps(metadata) if metadata else None
        
        message = ConversationMessage(
            message_id=message_id,
            session_id=session_id,
            speaker=speaker,
            content=content,
            timestamp=timestamp,
            audio_file_path=audio_file_path,
            transcription_confidence=transcription_confidence,
            metadata=metadata_json
        )
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO conversation_messages 
                (message_id, session_id, speaker, content, timestamp, audio_file_path, transcription_confidence, metadata)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (message_id, session_id, speaker, content, timestamp, audio_file_path, transcription_confidence, metadata_json))
            conn.commit()
        
        return message

    def get_session_messages(self, session_id: str, limit: Optional[int] = None) -> List[ConversationMessage]:
        """Get all messages for a session"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            query = """
                SELECT * FROM conversation_messages 
                WHERE session_id = ? 
                ORDER BY timestamp ASC
            """
            if limit:
                query += f" LIMIT {limit}"
            
            cursor.execute(query, (session_id,))
            rows = cursor.fetchall()
            
            return [ConversationMessage(
                message_id=row['message_id'],
                session_id=row['session_id'],
                speaker=row['speaker'],
                content=row['content'],
                timestamp=row['timestamp'],
                audio_file_path=row['audio_file_path'],
                transcription_confidence=row['transcription_confidence'],
                metadata=row['metadata']
            ) for row in rows]

    # ===== USER HISTORY QUERIES =====
    def get_user_sessions(self, user_name: str, limit: int = 50) -> List[ConversationSession]:
        """Get all sessions for a user"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT * FROM conversation_sessions 
                WHERE user_name = ? 
                ORDER BY start_time DESC 
                LIMIT ?
            """, (user_name, limit))
            
            rows = cursor.fetchall()
            return [ConversationSession(
                session_id=row['session_id'],
                user_name=row['user_name'],
                topic=row['topic'],
                start_time=row['start_time'],
                end_time=row['end_time'],
                message_count=row['message_count'],
                duration_seconds=row['duration_seconds'],
                metadata=row['metadata']
            ) for row in rows]

    def get_user_recent_messages(self, user_name: str, limit: int = 100) -> List[ConversationMessage]:
        """Get recent messages for a user across all sessions"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT m.* FROM conversation_messages m
                JOIN conversation_sessions s ON m.session_id = s.session_id
                WHERE s.user_name = ?
                ORDER BY m.timestamp DESC
                LIMIT ?
            """, (user_name, limit))
            
            rows = cursor.fetchall()
            return [ConversationMessage(
                message_id=row['message_id'],
                session_id=row['session_id'],
                speaker=row['speaker'],
                content=row['content'],
                timestamp=row['timestamp'],
                audio_file_path=row['audio_file_path'],
                transcription_confidence=row['transcription_confidence'],
                metadata=row['metadata']
            ) for row in rows]

    def get_user_stats(self, user_name: str) -> UserHistoryStats:
        """Get comprehensive statistics for a user"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            # Basic stats
            cursor.execute("""
                SELECT 
                    COUNT(*) as total_sessions,
                    SUM(message_count) as total_messages,
                    SUM(COALESCE(duration_seconds, 0)) as total_duration_seconds
                FROM conversation_sessions 
                WHERE user_name = ?
            """, (user_name,))
            basic_stats = cursor.fetchone()
            
            # Topic preferences
            cursor.execute("""
                SELECT topic, COUNT(*) as session_count, SUM(message_count) as total_messages
                FROM conversation_sessions 
                WHERE user_name = ?
                GROUP BY topic
                ORDER BY session_count DESC
                LIMIT 5
            """, (user_name,))
            favorite_topics = [
                {"topic": row['topic'], "sessions": row['session_count'], "messages": row['total_messages']}
                for row in cursor.fetchall()
            ]
            
            # Recent activity (last 10 sessions)
            cursor.execute("""
                SELECT session_id, topic, start_time, message_count, duration_seconds
                FROM conversation_sessions 
                WHERE user_name = ?
                ORDER BY start_time DESC
                LIMIT 10
            """, (user_name,))
            recent_activity = [
                {
                    "session_id": row['session_id'],
                    "topic": row['topic'],
                    "start_time": row['start_time'],
                    "message_count": row['message_count'],
                    "duration_seconds": row['duration_seconds']
                }
                for row in cursor.fetchall()
            ]
            
            return UserHistoryStats(
                user_name=user_name,
                total_sessions=basic_stats['total_sessions'] or 0,
                total_messages=basic_stats['total_messages'] or 0,
                total_duration_minutes=int((basic_stats['total_duration_seconds'] or 0) / 60),
                favorite_topics=favorite_topics,
                recent_activity=recent_activity,
                learning_progress={
                    "sessions_this_week": self._get_sessions_this_week(user_name),
                    "average_session_length": self._get_average_session_length(user_name),
                    "most_active_topic": favorite_topics[0]["topic"] if favorite_topics else None
                }
            )

    def _get_sessions_this_week(self, user_name: str) -> int:
        """Get number of sessions this week"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT COUNT(*) as count
                FROM conversation_sessions 
                WHERE user_name = ? 
                AND start_time >= date('now', '-7 days')
            """, (user_name,))
            return cursor.fetchone()['count']

    def _get_average_session_length(self, user_name: str) -> float:
        """Get average session length in minutes"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT AVG(COALESCE(duration_seconds, 0)) as avg_duration
                FROM conversation_sessions 
                WHERE user_name = ? AND duration_seconds IS NOT NULL
            """, (user_name,))
            result = cursor.fetchone()['avg_duration']
            return round(result / 60, 1) if result else 0.0

    # ===== SEARCH AND FILTER =====
    def search_messages(self, user_name: str, query: str, limit: int = 50) -> List[ConversationMessage]:
        """Search messages by content"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT m.* FROM conversation_messages m
                JOIN conversation_sessions s ON m.session_id = s.session_id
                WHERE s.user_name = ? AND m.content LIKE ?
                ORDER BY m.timestamp DESC
                LIMIT ?
            """, (user_name, f'%{query}%', limit))
            
            rows = cursor.fetchall()
            return [ConversationMessage(
                message_id=row['message_id'],
                session_id=row['session_id'],
                speaker=row['speaker'],
                content=row['content'],
                timestamp=row['timestamp'],
                audio_file_path=row['audio_file_path'],
                transcription_confidence=row['transcription_confidence'],
                metadata=row['metadata']
            ) for row in rows]

    def get_sessions_by_topic(self, user_name: str, topic: str, limit: int = 20) -> List[ConversationSession]:
        """Get sessions filtered by topic"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT * FROM conversation_sessions 
                WHERE user_name = ? AND topic = ?
                ORDER BY start_time DESC 
                LIMIT ?
            """, (user_name, topic, limit))
            
            rows = cursor.fetchall()
            return [ConversationSession(
                session_id=row['session_id'],
                user_name=row['user_name'],
                topic=row['topic'],
                start_time=row['start_time'],
                end_time=row['end_time'],
                message_count=row['message_count'],
                duration_seconds=row['duration_seconds'],
                metadata=row['metadata']
            ) for row in rows]

    # ===== AUDIO FILE MANAGEMENT =====
    def save_audio_file(self, session_id: str, message_id: str, audio_data: bytes, file_extension: str = "wav") -> str:
        """Save audio file and return the file path"""
        filename = f"{session_id}_{message_id}.{file_extension}"
        file_path = os.path.join(self.audio_dir, filename)
        
        with open(file_path, 'wb') as f:
            f.write(audio_data)
        
        return file_path

    def get_audio_file_path(self, session_id: str, message_id: str) -> Optional[str]:
        """Get audio file path if it exists"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT audio_file_path FROM conversation_messages 
                WHERE session_id = ? AND message_id = ?
            """, (session_id, message_id))
            
            row = cursor.fetchone()
            return row['audio_file_path'] if row else None

    # ===== EXPORT FUNCTIONALITY =====
    def export_user_data(self, user_name: str) -> Dict[str, Any]:
        """Export all user data for backup or analysis"""
        sessions = self.get_user_sessions(user_name, limit=1000)
        all_messages = []
        
        for session in sessions:
            messages = self.get_session_messages(session.session_id)
            all_messages.extend([asdict(msg) for msg in messages])
        
        stats = self.get_user_stats(user_name)
        
        return {
            "user_name": user_name,
            "export_timestamp": datetime.now().isoformat(),
            "stats": asdict(stats),
            "sessions": [asdict(session) for session in sessions],
            "messages": all_messages
        }
