import JSZip from 'jszip';

export async function extractDocxContent(file: File): Promise<string> {
  // If user dropped a plain text file (.txt)
  if (file.name.endsWith('.txt')) {
    return await file.text();
  }

  const zip = await JSZip.loadAsync(file);
  const docXmlPath = 'word/document.xml';
  const docXmlContent = await zip.file(docXmlPath)?.async('string');

  if (!docXmlContent) {
    throw new Error('No se pudo encontrar el contenido principal del documento Word (word/document.xml).');
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(docXmlContent, 'application/xml');
  const paragraphs = xmlDoc.getElementsByTagName('w:p');
  
  let processedText = '';

  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    // Find all runs in this paragraph (including runs nested inside hyperlinks, smarttags, etc.)
    const runs = p.getElementsByTagName('w:r');
    let paragraphText = '';

    for (let j = 0; j < runs.length; j++) {
      const r = runs[j];
      const textNodes = r.getElementsByTagName('w:t');
      const highlight = r.getElementsByTagName('w:highlight')[0];
      const shd = r.getElementsByTagName('w:shd')[0];

      const highlightVal = highlight?.getAttribute('w:val')?.toLowerCase();
      const isHighlight = highlightVal && highlightVal !== 'none';
      
      const shdFill = shd?.getAttribute('w:fill')?.toLowerCase();
      const isShadingYellow = shdFill && (shdFill.includes('ff0') || shdFill.includes('yellow') || shdFill === 'ffff00');

      const isMarked = isHighlight || isShadingYellow;

      let runText = '';
      for (let k = 0; k < textNodes.length; k++) {
        runText += textNodes[k].textContent || '';
      }

      // Check for line break or tab in run
      if (r.getElementsByTagName('w:br').length > 0) {
        runText += '\n';
      }
      if (r.getElementsByTagName('w:tab').length > 0) {
        runText += '\t';
      }

      if (runText) {
        if (isMarked) {
          paragraphText += ` [CORRECT_START]${runText}[CORRECT_END] `;
        } else {
          paragraphText += runText;
        }
      }
    }
    
    if (paragraphText.trim()) {
      // Clean up consecutive marked tags in same paragraph: [CORRECT_END] [CORRECT_START]
      const cleanParagraph = paragraphText
        .replace(/\[CORRECT_END\]\s*\[CORRECT_START\]/g, '')
        .trim();
      processedText += cleanParagraph + '\n';
    }
  }

  if (!processedText.trim()) {
    throw new Error('El documento parece estar vacío o no contiene texto legible.');
  }

  return processedText;
}

