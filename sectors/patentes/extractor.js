/**
 * sectors/patentes/extractor.js
 * 
 * Extrator específico do setor de Patentes (placeholder para MVP).
 * Implementação real será adicionada depois da aprovação.
 */

class PatentesExtractor {
  extrairDadosPeticao(textoCompleto, classificacao, urlPdf = '') {
    const storageKey = `patentes_peticao_${Date.now()}`;

    return {
      storageKey,
      dados: {
        setor: 'patentes',
        categoria: 'peticao',
        tipo: classificacao?.tipoId || '',
        subtipo: classificacao?.subtipoId || '',
        confianca: classificacao?.confianca || 0,
        textoPeticao: textoCompleto,
        urlPdf,
        dataProcessamento: new Date().toISOString()
      }
    };
  }

  extrairDadosDocumentoOficial(textoCompleto, classificacao, urlPdf = '') {
    const storageKey = `patentes_doc_oficial_${Date.now()}`;

    return {
      storageKey,
      dados: {
        setor: 'patentes',
        categoria: 'documento_oficial',
        tipo: classificacao?.tipoId || '',
        subtipo: classificacao?.subtipoId || '',
        confianca: classificacao?.confianca || 0,
        textoCompleto: textoCompleto,
        urlPdf,
        dataProcessamento: new Date().toISOString()
      }
    };
  }
}

export default new PatentesExtractor();
