import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { jsPDF } from "jspdf";

// Inicializa o Firebase Admin SDK
admin.initializeApp();

// Função para gerar PDF
export const gerarPDF = functions.https.onRequest(async (req, res) => {
  try {
    const userData = req.body; // Dados do usuário recebidos na requisição
    const doc = new jsPDF();

    doc.setFontSize(32);
    doc.setFont("helvetica", "bold");
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.text(userData.fullName, doc.internal.pageSize.getWidth() / 2, 20, {
      align: "center",
    });

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text("Detalhes empregadícios", 20, 50);
    doc.line(20, 52, 95, 52);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text("Cargo: " + userData.position, 20, 60);
    doc.text("Setor: " + userData.department, 20, 70);
    doc.text("Situação: " + userData.situation, 20, 90); // Corrigido de "situacion" para "situation"
    doc.text("Salário: " + userData.salary, 20, 80);

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text("Informações Pessoais", 20, 110);
    doc.line(20, 112, 90, 112);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Idade: " + userData.age, 20, 120);
    doc.text("Documento: " + userData.document, 20, 130);
    doc.text("Email: " + userData.email, 20, 140);
    doc.text("Celular: " + userData.mobile, 20, 150);

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text("Endereço do Funcionário", 20, 170);
    doc.line(20, 172, 98, 172);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Endereço: " + userData.addressName, 20, 180);
    doc.text("Número: " + userData.number, 20, 210);
    doc.text("Bairro: " + userData.neighborhood, 20, 190);
    doc.text("CEP: " + userData.zipCode, 20, 200);
    doc.text("Cidade: " + userData.city, 20, 220);

    const pdfData = doc.output(); // Obtenha os dados do PDF como ArrayBuffer

    // Armazene o PDF no Firebase Storage
    const bucket = admin.storage().bucket();
    const filename = `users/${userData.id}/${userData.fullName}.pdf`;
    const file = bucket.file(filename);
    await file.save(pdfData, {
      metadata: { contentType: "application/pdf" },
    });

    // Obtenha a URL do PDF armazenado
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: "03-01-2500",
    });

    // Envie a URL como resposta
    res.status(200).json({ pdfUrl: url });
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    res.status(500).send("Erro ao gerar PDF");
  }
});
