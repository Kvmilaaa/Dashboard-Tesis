from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.types import JSON


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    nombre_completo: Mapped[str | None] = mapped_column(String(255), nullable=True)
    correo: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Study(Base):
    __tablename__ = "studies"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    titulo: Mapped[str] = mapped_column(String(255))
    fecha_inicio: Mapped[date | None] = mapped_column(Date, nullable=True)
    fecha_fin: Mapped[date | None] = mapped_column(Date, nullable=True)
    empresa: Mapped[str | None] = mapped_column(String(255), nullable=True)
    muestra: Mapped[int | None] = mapped_column(Integer, nullable=True)
    tecnica: Mapped[str | None] = mapped_column(String(100), nullable=True)
    estado: Mapped[str] = mapped_column(String(100), default="Creacion de Estudio")
    cuotas_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    link_cuestionario: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    preguntas: Mapped[list["QuestionnaireItem"]] = relationship(
        back_populates="study",
        cascade="all, delete-orphan",
    )


class QuestionnaireItem(Base):
    __tablename__ = "questionnaire_items"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    estudio_id: Mapped[int] = mapped_column(ForeignKey("studies.id", ondelete="CASCADE"), index=True)
    pregunta_texto: Mapped[str] = mapped_column(Text)
    columna_csv: Mapped[str | None] = mapped_column(String(255), nullable=True)
    tipo_pregunta: Mapped[str | None] = mapped_column(String(100), nullable=True)

    study: Mapped[Study] = relationship(back_populates="preguntas")
