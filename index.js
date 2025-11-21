<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Coconut Export Helper</title>

    <style>
        body {
            font-family: Arial;
            max-width: 520px;
            margin: auto;
            padding: 20px;
        }
        h2 { text-align: center; }
        input, button {
            width: 100%;
            padding: 10px;
            margin: 8px 0;
            font-size: 16px;
        }
        .result-box {
            background: #f3f3f3;
            padding: 12px;
            margin-top: 10px;
            border-radius: 8px;
        }
        .hidden { display: none; }
    </style>
</head>
<body>

<h2>Coconut Export Helper</h2>

<label>Weight (Ton)</label>
<input type="number" id="weightTon" />

<label>Price per Ton</label>
<input type="number" id="pricePerTon" />

<label>Trucking Cost</label>
<input type="number" id="trucking" />

<label>Handling Cost</label>
<input type="number" id="handling" />

<label>Freight Cost</label>
<input type="number" id="freight" />

<button onclick="calculate()">Hitung</button>

<div id="result" class="result-box hidden"></div>

<button id="btnPdf" class="hidden" onclick="downloadPDF()">Download PDF</button>

<script>
const API_BASE = "https://coconut-export-helper-production.up.railway.app";

let lastResult = null;

async function calculate() {
    const data = {
        weightTon: Number(document.getElementById("weightTon").value),
        pricePerTon: Number(document.getElementById("pricePerTon").value),
        trucking: Number(document.getElementById("trucking").value),
        handling: Number(document.getElementById("handling").value),
        freight: Number(document.getElementById("freight").value)
    };

    // Validasi
    if (Object.values(data).some(v => !v || v < 0)) {
        alert("Semua input harus angka dan tidak boleh kosong.");
        return;
    }

    const res = await fetch(API_BASE + "/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await res.json();
    lastResult = result;

    document.getElementById("result").classList.remove("hidden");
    document.getElementById("result").innerHTML = `
        <b>Hasil Perhitungan:</b><br>
        Total Cost: ${result.totalCost}<br>
        Cost per Kg: ${result.costPerKg.toFixed(3)}
    `;

    document.getElementById("btnPdf").classList.remove("hidden");
}

async function downloadPDF() {
    if (!lastResult) return alert("Hitung dulu!");

    const res = await fetch(API_BASE + "/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result: lastResult })
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.pdf";
    a.click();
}
</script>

</body>
</html>
