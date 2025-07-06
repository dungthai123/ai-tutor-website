import sqlite3
from typing import Optional
from dataclasses import dataclass
from contextlib import contextmanager

@dataclass
class Student:
    name: str
    email: str
    level: str  # beginner, intermediate, advanced
    goals: str
    lessons_completed: int = 0

class DatabaseDriver:
    def __init__(self, db_path: str = "english_tutor_db.sqlite"):
        self.db_path = db_path
        self._init_db()

    @contextmanager
    def _get_connection(self):
        conn = sqlite3.connect(self.db_path)
        try:
            yield conn
        finally:
            conn.close()

    def _init_db(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            # Create students table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS students (
                    name TEXT PRIMARY KEY,
                    email TEXT,
                    level TEXT NOT NULL,
                    goals TEXT NOT NULL,
                    lessons_completed INTEGER DEFAULT 0
                )
            """)
            conn.commit()

    def create_student(self, name: str, email: str, level: str, goals: str) -> Student:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO students (name, email, level, goals, lessons_completed) VALUES (?, ?, ?, ?, ?)",
                (name, email, level, goals, 0)
            )
            conn.commit()
            return Student(name=name, email=email, level=level, goals=goals, lessons_completed=0)

    def get_student_by_name(self, name: str) -> Optional[Student]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM students WHERE name = ?", (name,))
            row = cursor.fetchone()
            if not row:
                return None
            
            return Student(
                name=row[0],
                email=row[1],
                level=row[2],
                goals=row[3],
                lessons_completed=row[4]
            )

    def update_lessons_completed(self, name: str, lessons_completed: int) -> bool:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "UPDATE students SET lessons_completed = ? WHERE name = ?",
                (lessons_completed, name)
            )
            conn.commit()
            return cursor.rowcount > 0
