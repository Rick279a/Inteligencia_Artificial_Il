document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById("inputText");
    const executeActionButton = document.getElementById("executeActionButton");
    const actionSelect = document.getElementById("actionSelect");
    const resultDiv = document.getElementById("result");
    const historyList = document.getElementById("historyList");

    const apiUrl = "http://127.0.0.1:8000";

    // Carregar histórico ao iniciar a página
    loadHistory();

    executeActionButton.addEventListener("click", async () => {
        const text = inputText.value;
        const action = actionSelect.value;

        if (!text) {
            alert("Por favor, insira um texto.");
            return;
        }

        let endpoint;
        if (action === "gerar-texto") {
            endpoint = "/gerar-texto/";
        } else if (action === "resumir-texto") {
            endpoint = "/resumir-texto/";
        }

        try {
            const response = await fetch(`${apiUrl}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ texto: text })
            });

            const data = await response.json();
            resultDiv.textContent = data.texto_gerado || data.resumo || "Erro ao buscar resultado.";

            // Armazenar consulta no histórico
            saveToHistory(action, text);
        } catch (error) {
            console.error("Erro:", error);
        }
    });

    // Função para salvar consulta no histórico usando localStorage
    function saveToHistory(type, text) {
        const history = JSON.parse(localStorage.getItem("queryHistory")) || [];
        const newEntry = { type, text, timestamp: new Date().toLocaleString() };
        history.push(newEntry);
        localStorage.setItem("queryHistory", JSON.stringify(history));
        displayHistory();
    }

    // Função para carregar e exibir o histórico
    function loadHistory() {
        displayHistory();
    }

    // Função para exibir histórico na interface
    function displayHistory() {
        const history = JSON.parse(localStorage.getItem("queryHistory")) || [];
        historyList.innerHTML = "";
        history.forEach((entry) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${entry.timestamp} - ${entry.type}: "${entry.text}"`;
            historyList.appendChild(listItem);
        });
    }
});
