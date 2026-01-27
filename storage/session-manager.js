/**
 * storage/session-manager.js
 * 
 * Gerenciador de sessões de análise
 * Migrado e adaptado de: content/ipas/peticao_storage.js
 * 
 * MUDANÇAS:
 * - Funções → Classe
 * - Schema estendido (LGPD + IA)
 * - Prefixo: peticao_* → ai_session_*
 * - CRUD completo mantido
 * 
 * @version 1.0.0
 * @migrated 26/01/2026
 */

import { validarSessao, criarSessaoVazia } from './schema.js';

/**
 * Classe SessionManager
 * Gerencia CRUD de sessões no chrome.storage.local
 */
export class SessionManager {
  /**
   * Cria uma nova sessão
   * 
   * @returns {Promise<string>} sessionId gerado
   */
  async criar() {
    const sessionId = this._gerarSessionId();
    
    const sessao = criarSessaoVazia();
    sessao.sessionId = sessionId;
    sessao.timestamp = new Date().toISOString();
    sessao.status = 'created';
    
    await this.salvar(sessao);
    
    console.log(`[SessionManager] Sessão criada: ${sessionId}`);
    
    return sessionId;
  }
  
  /**
   * Salva uma sessão no storage
   * 
   * @param {Object} sessao - Objeto da sessão
   * @returns {Promise<boolean>} true se salvou com sucesso
   */
  async salvar(sessao) {
    try {
      // Valida antes de salvar
      if (!validarSessao(sessao)) {
        throw new Error('[SessionManager] Sessão inválida - não passou na validação');
      }
      
      const chave = sessao.sessionId;
      
      // Salva no storage.local (NUNCA sync por segurança LGPD)
      await chrome.storage.local.set({ [chave]: sessao });
      
      if (chrome.runtime?.lastError) {
        throw new Error(chrome.runtime.lastError.message || 'Falha ao salvar no storage.local');
      }
      
      // Confirma que salvou
      const confirm = await chrome.storage.local.get(chave);
      if (!confirm || !confirm[chave]) {
        console.warn('[SessionManager] ⚠️ Escrita não confirmada:', chave);
      }
      
      console.log(`[SessionManager] Sessão salva: ${chave} (status: ${sessao.status})`);
      
      return true;
    } catch (error) {
      console.error('[SessionManager] Erro ao salvar sessão:', error);
      return false;
    }
  }
  
  /**
   * Carrega uma sessão do storage
   * 
   * @param {string} sessionId - ID da sessão
   * @returns {Promise<Object|null>} Objeto da sessão ou null
   */
  async carregar(sessionId) {
    try {
      if (!sessionId || !sessionId.startsWith('ai_session_')) {
        console.warn('[SessionManager] sessionId inválido:', sessionId);
        return null;
      }
      
      const result = await chrome.storage.local.get(sessionId);
      
      if (!result || !result[sessionId]) {
        console.warn(`[SessionManager] Sessão não encontrada: ${sessionId}`);
        return null;
      }
      
      console.log(`[SessionManager] Sessão carregada: ${sessionId}`);
      
      return result[sessionId];
    } catch (error) {
      console.error('[SessionManager] Erro ao carregar sessão:', error);
      return null;
    }
  }
  
  /**
   * Lista todas as sessões armazenadas
   * 
   * @returns {Promise<Array>} Array de sessões
   */
  async listar() {
    try {
      const todosItens = await chrome.storage.local.get(null);
      const sessoes = [];
      
      for (const [chave, valor] of Object.entries(todosItens)) {
        if (chave.startsWith('ai_session_') && !chave.endsWith('_lgpd_map')) {
          sessoes.push(valor);
        }
      }
      
      // Ordena por timestamp (mais recentes primeiro)
      sessoes.sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return dateB - dateA;
      });
      
      console.log(`[SessionManager] ${sessoes.length} sessões encontradas`);
      
      return sessoes;
    } catch (error) {
      console.error('[SessionManager] Erro ao listar sessões:', error);
      return [];
    }
  }
  
  /**
   * Atualiza campos específicos de uma sessão (merge)
   * 
   * @param {string} sessionId - ID da sessão
   * @param {Object} campos - Objeto com campos a atualizar
   * @returns {Promise<boolean>} true se atualizou
   */
  async atualizar(sessionId, campos) {
    try {
      const sessao = await this.carregar(sessionId);
      
      if (!sessao) {
        console.error(`[SessionManager] Sessão não encontrada para atualizar: ${sessionId}`);
        return false;
      }
      
      // Merge profundo (1 nível)
      for (const [chave, valor] of Object.entries(campos)) {
        if (typeof valor === 'object' && !Array.isArray(valor) && valor !== null) {
          sessao[chave] = { ...sessao[chave], ...valor };
        } else {
          sessao[chave] = valor;
        }
      }
      
      await this.salvar(sessao);
      
      console.log(`[SessionManager] Sessão atualizada: ${sessionId}`);
      
      return true;
    } catch (error) {
      console.error('[SessionManager] Erro ao atualizar sessão:', error);
      return false;
    }
  }
  
  /**
   * Remove uma sessão do storage
   * 
   * @param {string} sessionId - ID da sessão
   * @returns {Promise<boolean>} true se removeu
   */
  async remover(sessionId) {
    try {
      if (!sessionId) {
        console.warn('[SessionManager] sessionId vazio para remoção');
        return false;
      }
      
      // Remove a sessão principal
      await chrome.storage.local.remove(sessionId);
      
      // Remove o mapa LGPD associado (se existir)
      const mapaKey = `${sessionId}_lgpd_map`;
      await chrome.storage.local.remove(mapaKey);
      
      console.log(`[SessionManager] Sessão removida: ${sessionId}`);
      
      return true;
    } catch (error) {
      console.error('[SessionManager] Erro ao remover sessão:', error);
      return false;
    }
  }
  
  /**
   * Remove sessões mais antigas que X dias
   * 
   * @param {number} diasParaExpirar - Dias de retenção (padrão: 30)
   * @returns {Promise<number>} Quantidade de sessões removidas
   */
  async limparAntigas(diasParaExpirar = 30) {
    try {
      const sessoes = await this.listar();
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - diasParaExpirar);
      
      let removidas = 0;
      
      for (const sessao of sessoes) {
        const dataSessao = new Date(sessao.timestamp);
        
        if (dataSessao < dataLimite) {
          await this.remover(sessao.sessionId);
          removidas++;
        }
      }
      
      console.log(`[SessionManager] ${removidas} sessões antigas removidas (>${diasParaExpirar} dias)`);
      
      return removidas;
    } catch (error) {
      console.error('[SessionManager] Erro ao limpar sessões antigas:', error);
      return 0;
    }
  }
  
  /**
   * Obtém estatísticas das sessões
   * 
   * @returns {Promise<Object>} Estatísticas
   */
  async obterEstatisticas() {
    try {
      const sessoes = await this.listar();
      
      const stats = {
        total: sessoes.length,
        porStatus: {},
        porProvider: {},
        ultimaSessao: null
      };
      
      // Conta por status
      for (const sessao of sessoes) {
        const status = sessao.status || 'unknown';
        stats.porStatus[status] = (stats.porStatus[status] || 0) + 1;
        
        if (sessao.ia?.provider) {
          const provider = sessao.ia.provider;
          stats.porProvider[provider] = (stats.porProvider[provider] || 0) + 1;
        }
      }
      
      // Última sessão
      if (sessoes.length > 0) {
        stats.ultimaSessao = {
          sessionId: sessoes[0].sessionId,
          timestamp: sessoes[0].timestamp,
          status: sessoes[0].status
        };
      }
      
      return stats;
    } catch (error) {
      console.error('[SessionManager] Erro ao obter estatísticas:', error);
      return { total: 0, porStatus: {}, porProvider: {}, ultimaSessao: null };
    }
  }
  
  /**
   * Gera um sessionId único
   * Formato: ai_session_YYYYMMDDTHHMMSS_RANDOM
   * @private
   */
  _gerarSessionId() {
    // Timestamp formatado: 20260126T153045
    const now = new Date();
    const timestamp = now.toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}Z$/, '')
      .slice(0, 15); // YYYYMMDDTHHMMSS
    
    // String aleatória de 8 caracteres
    const random = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();
    
    return `ai_session_${timestamp}_${random}`;
  }
}
