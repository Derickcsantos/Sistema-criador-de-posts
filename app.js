import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

// Config OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configurações do Express
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Adicionar suporte a JSON

// Rota inicial - servir arquivo HTML estático
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Rota para gerar imagem
app.post("/generate", async (req, res) => {
  try {
    // Verifica se os dados vieram como JSON ou form urlencoded
    const prompt = req.body.prompt;
    const size = req.body.size || "1024x1024";

    if (!prompt) {
      return res.status(400).json({ error: "Prompt é obrigatório" });
    }

    const response = await client.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: size,
      n: 1,
      response_format: "b64_json"
    });

    const imageBase64 = response.data[0].b64_json;
    const imageUrl = `data:image/png;base64,${imageBase64}`;

    // Retorna JSON para o frontend
    res.json({ prompt, imageUrl });
  } catch (error) {
    console.error("Erro ao gerar imagem:", error);
    res.status(500).json({ error: "Erro ao gerar imagem" });
  }
});

// Inicia servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});