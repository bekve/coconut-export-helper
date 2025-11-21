const express = require("express");
const cors = require("cors");
const PDFDocument = require("pdfkit");

const app = express();
app.use(cors());
app.use(express.json());

// ---- Kalkulator Biaya Ekspor ----
app.post("/calculate", (req, res) => {
    const { weightTon, pricePerTon, trucking, handling, freight } = req.body;

    const costProduct = weightTon * pricePerTon;
    const totalCost = costProduct + trucking + handling + freight;

    res.json({
        costProduct,
        totalCost,
        costPerKg: totalCost / (weightTon * 1000)
    });
});

// ---- Generate PDF ----
app.post("/generate-pdf", (req, res) => {
    const { result } = req.body;

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");

    doc.text("Laporan Biaya Ekspor Kelapa", { underline: true });
    doc.moveDown();

    doc.text(`Total Biaya: ${result.totalCost}`);
    doc.text(`Biaya per Kg: ${result.costPerKg}`);

    doc.end();
    doc.pipe(res);
});

// ---- Start Server ----
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
