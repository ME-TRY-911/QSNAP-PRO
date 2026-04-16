import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";
import { saveAs } from "file-saver";
import { Question } from "../types";

const base64ToUint8Array = (base64: string) => {
  const binaryString = window.atob(base64.split(',')[1]);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const exportService = {
  exportToPDF: async (question: Question) => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(16);
    doc.text("QSnap Pro - Question Export", 20, y);
    y += 15;

    if (question.imageUrl) {
      try {
        // Add image to PDF
        doc.addImage(question.imageUrl, 'JPEG', 20, y, 60, 40);
        y += 45;
      } catch (e) {
        console.error("Failed to add image to PDF", e);
      }
    }

    doc.setFontSize(12);
    doc.text(`Type: ${question.type}`, 20, y);
    y += 10;

    const splitText = doc.splitTextToSize(question.text, 170);
    doc.text(splitText, 20, y);
    y += splitText.length * 7;

    if (question.options && question.options.length > 0) {
      y += 5;
      question.options.forEach((opt, index) => {
        const label = String.fromCharCode(65 + index);
        doc.text(`${label}. ${opt}`, 25, y);
        y += 7;
      });
    }

    doc.save(`Question_${question.id.slice(0, 8)}.pdf`);
  },

  exportToWord: async (question: Question) => {
    const children: any[] = [
      new Paragraph({
        children: [
          new TextRun({
            text: "QSnap Pro - Question Export",
            bold: true,
            size: 32,
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Type: ${question.type}`,
            italics: true,
            size: 24,
          }),
        ],
      }),
    ];

    if (question.imageUrl) {
      try {
        children.push(
          new Paragraph({
            children: [
              new ImageRun({
                data: base64ToUint8Array(question.imageUrl),
                transformation: {
                  width: 300,
                  height: 200,
                },
              } as any),
            ],
          })
        );
      } catch (e) {
        console.error("Failed to add image to Word", e);
      }
    }

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: question.text,
            size: 24,
          }),
        ],
      })
    );

    if (question.options && question.options.length > 0) {
      question.options.forEach((opt, index) => {
        const label = String.fromCharCode(65 + index);
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${label}. ${opt}`,
                size: 24,
              }),
            ],
            indent: { left: 720 },
          })
        );
      });
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children: children,
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Question_${question.id.slice(0, 8)}.docx`);
  }
};

