from fastapi import FastAPI

app = FastAPI()


@app.get("/healthz")
def health():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"message": "Hello from Recommender"}
