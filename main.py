from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import random
from pathlib import Path

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

BASE = Path(__file__).parent

LEVEL_TO_CHOICES = {"easy": 3, "normal": 4, "hard": 5}

QUESTIONS = {
    "Geografie": [
        {
            "id": "geo_001",
            "question": "Was ist die Hauptstadt von Deutschland?",
            "image": "/static/images/berlin.png",
            "correct": "Berlin",
            "wrong": ["München", "Hamburg", "Köln", "Frankfurt", "Stuttgart"]
        },
        {     
             "id": "geo_002",
             "question": "Was ist die Hauptstadt von Albanien?",
             "correct": "Tirana",
             "wrong": ["Elbasan", "Vlora", "Saranda", "Velipoja", "Kukes"]
        },
        {
             "id": "geo_003",
             "question": "Wie viele Einwohner hat Deutschland?",
             "correct": "83 Millionen",
             "wrong": ["85 Millionen", "90 Millionen", "80 Millionen", "75 Millionen", "81 Millionen"]
        },
        {
            "id": "geo_004",
            "question": "Was ist die Hauptstadt von Frankreich?",
            "correct": "Paris",
            "wrong": ["Marseille", "Lyon", "Touluse", "Nizza", "Nantes"]

        }
        
        
    ],
    "Wissen": [
        {
            "id": "wis_001",
            "question": "Woraus besteht Wasser?",
            "correct": "H2O",
            "wrong": ["CO2", "O2", "NaCl", "H2", "CH4"]
        }
    ]
}

def flatten_questions(category):
    if category == "Alle":
        out = []
        for cat, items in QUESTIONS.items():
            for q in items:
                out.append({**q, "category": cat})
        return out
    return [{**q, "category": category} for q in QUESTIONS.get(category, [])]

def build_options(q, level):
    n = LEVEL_TO_CHOICES[level]
    wrong = random.sample(q["wrong"], k=n - 1)
    opts = wrong + [q["correct"]]
    random.shuffle(opts)
    return {
        "id": q["id"],
        "category": q["category"],
        "question": q["question"],
        "image": q.get("image"),
        "options": opts,
        "correctIndex": opts.index(q["correct"])
    }

@app.get("/api/categories")
def categories():
    return {"categories": sorted(QUESTIONS.keys())}

@app.get("/api/questions")
def get_questions(level="easy", category="Alle"):
    qs = flatten_questions(category)
    return {"questions": [build_options(q, level) for q in qs]}

app.mount("/static", StaticFiles(directory=BASE / "static"), name="static")

@app.get("/")
def home():
    return FileResponse(BASE / "static" / "index.html")