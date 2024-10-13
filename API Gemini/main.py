from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware

# Configurar a chave de API do Google AI Studio
API_KEY = ''
os.environ['GOOGLE_API_KEY'] = API_KEY

# Configurar a API do Google Generative AI
genai.configure(api_key=os.environ['GOOGLE_API_KEY'])
model = genai.GenerativeModel('gemini-1.5-flash')

# Inicializando a aplicação FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos de solicitação
class TextRequest(BaseModel):
    texto: str

# Função auxiliar para usar o modelo de IA para gerar conteúdo
def gerar_conteudo(prompt: str):
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar conteúdo: {str(e)}")

# Rota para geração de texto automatizada
@app.post("/gerar-texto/")
async def gerar_texto(request: TextRequest):
    try:
        result = gerar_conteudo(request.texto)
        return {"texto_gerado": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Rota para resumos automatizados
@app.post("/resumir-texto/")
async def resumir_texto(request: TextRequest):
    try:
        prompt = f"Resuma o seguinte texto: {request.texto}"
        resumo = gerar_conteudo(prompt)
        return {"resumo": resumo}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
