from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import random
from pathlib import Path

app = FastAPI()

BASE = Path(__file__).parent

# Static-Files (index.html, app.js, images)
app.mount("/static", StaticFiles(directory=BASE / "static"), name="static")

LEVEL_TO_CHOICES = {"easy": 3, "normal": 4, "hard": 5}

QUESTIONS = {
    "Geografie": [
        {
            "id": "geo_001",
            "question": "Was ist die Hauptstadt von Deutschland?",
            "image": "/static/images/Berlin.png",
            "correct": "Berlin",
            "wrong": ["München", "Hamburg", "Köln", "Frankfurt", "Stuttgart"],
        },
        {
            "id": "geo_002",
            "question": "Was ist die Hauptstadt von Albanien?",
            "image": "/static/images/Tirana.png",
            "correct": "Tirana",
            "wrong": ["Elbasan", "Vlora", "Saranda", "Velipoja", "Kukes"],
        },
        {
            "id": "geo_003",
            "question": "Wie viele Einwohner hat Deutschland?",
            "image": "/static/images/Deutschland.png",
            "correct": "83 Millionen",
            "wrong": ["85 Millionen", "90 Millionen", "80 Millionen", "75 Millionen", "81 Millionen"],
        },
        {
            "id": "geo_004",
            "question": "Was ist die Hauptstadt von Frankreich?",
            "image": "/static/images/Paris.png",
            "correct": "Paris",
            "wrong": ["Marseille", "Lyon", "Toulouse", "Nizza", "Nantes"],
        },
    ],
    "Wissen": [
        {
            "id": "wis_001",
            "question": "Woraus besteht Wasser?",
            "image": "/static/images/Wasser.png",
            "correct": "H2O",
            "wrong": ["CO2", "O2", "NaCl", "H2", "CH4"],
        }
    ],
}


def flatten_questions(category: str):
    if category == "Alle":
        out = []
        for cat, items in QUESTIONS.items():
            for q in items:
                out.append({**q, "category": cat})
        return out
    return [{**q, "category": category} for q in QUESTIONS.get(category, [])]


def build_options(q, level: str):
    n = LEVEL_TO_CHOICES.get(level, 3)
    wrong = random.sample(q["wrong"], k=max(0, n - 1))
    opts = wrong + [q["correct"]]
    random.shuffle(opts)
    return {
        "id": q["id"],
        "category": q["category"],
        "question": q["question"],
        "image": q.get("image"),
        "options": opts,
        "correctIndex": opts.index(q["correct"]),
    }


@app.get("/api/categories")
def categories():
    return {"categories": sorted(QUESTIONS.keys())}


@app.get("/api/questions")
def get_questions(level: str = "easy", category: str = "Alle"):
    qs = flatten_questions(category)
    return {"questions": [build_options(q, level) for q in qs]}


@app.get("/")
def home():
    return FileResponse(BASE / "static" / "index.html")
