import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { Document, Packer, Paragraph, TextRun } from 'docx'

export async function exportToPDF(title: string, element: HTMLElement) {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#FAF9F7',
  })
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({
    unit: 'px',
    format: 'a4',
    orientation: 'portrait',
    hotfixes: ['px_scaling'],
  })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = canvas.width
  const imgHeight = canvas.height
  const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight)
  const imgX = (pageWidth - imgWidth * ratio) / 2
  let position = 0
  let heightLeft = imgHeight * ratio

  pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio)
  heightLeft -= pageHeight

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight * ratio
    pdf.addPage()
    pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio)
    heightLeft -= pageHeight
  }

  pdf.save(`${sanitizeFilename(title)}.pdf`)
}

export async function exportToDOCX(title: string, htmlContent: string) {
  const text = stripHtml(htmlContent)
  const paragraphs = text.split(/\n\n+/).map((p) =>
    new Paragraph({
      children: [new TextRun({ text: p.trim(), size: 22 })],
      spacing: { after: 200 },
    })
  )
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun({ text: title, bold: true, size: 32 })],
            spacing: { after: 300 },
          }),
          ...paragraphs,
        ],
      },
    ],
  })
  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${sanitizeFilename(title)}.docx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function stripHtml(html: string) {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9\s\-_]/g, '').trim() || 'documento'
}
