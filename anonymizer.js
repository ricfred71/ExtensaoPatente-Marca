/**
 * Módulo de Anonimização de Dados Sensíveis (LGPD Compliance)
 * 
 * Este módulo protege dados pessoais sensíveis antes do envio para serviços de IA,
 * em conformidade com a Lei Geral de Proteção de Dados (LGPD).
 */

class DataAnonymizer {
    constructor() {
        this.stats = {
            cpf: 0,
            cnpj: 0,
            names: 0,
            emails: 0,
            addresses: 0,
            phones: 0
        };
        
        // Mapa para rastrear substituições e permitir reversão se necessário
        this.replacementMap = new Map();
        this.replacementCounter = 0;
    }

    /**
     * Reseta as estatísticas de anonimização
     */
    resetStats() {
        this.stats = {
            cpf: 0,
            cnpj: 0,
            names: 0,
            emails: 0,
            addresses: 0,
            phones: 0
        };
        this.replacementMap.clear();
        this.replacementCounter = 0;
    }

    /**
     * Retorna as estatísticas de anonimização
     */
    getStats() {
        return { ...this.stats };
    }

    /**
     * Anonimiza CPF no formato xxx.xxx.xxx-xx ou xxxxxxxxxxx
     */
    anonymizeCPF(text) {
        // Regex para CPF com formatação: xxx.xxx.xxx-xx
        const cpfRegex1 = /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g;
        // Regex para CPF sem formatação: xxxxxxxxxxx
        const cpfRegex2 = /\b\d{11}\b/g;
        
        text = text.replace(cpfRegex1, (match) => {
            this.stats.cpf++;
            this.replacementMap.set(`CPF-${this.replacementCounter}`, match);
            this.replacementCounter++;
            return '[CPF-REDACTED]';
        });
        
        // Para números de 11 dígitos, verificar se não é telefone (heurística simples)
        text = text.replace(cpfRegex2, (match) => {
            // Se começar com 0, provavelmente não é CPF
            if (match[0] === '0') return match;
            this.stats.cpf++;
            this.replacementMap.set(`CPF-${this.replacementCounter}`, match);
            this.replacementCounter++;
            return '[CPF-REDACTED]';
        });
        
        return text;
    }

    /**
     * Anonimiza CNPJ no formato xx.xxx.xxx/xxxx-xx ou xxxxxxxxxxxxxx
     */
    anonymizeCNPJ(text) {
        // Regex para CNPJ com formatação: xx.xxx.xxx/xxxx-xx
        const cnpjRegex1 = /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/g;
        // Regex para CNPJ sem formatação: xxxxxxxxxxxxxx
        const cnpjRegex2 = /\b\d{14}\b/g;
        
        text = text.replace(cnpjRegex1, (match) => {
            this.stats.cnpj++;
            this.replacementMap.set(`CNPJ-${this.replacementCounter}`, match);
            this.replacementCounter++;
            return '[CNPJ-REDACTED]';
        });
        
        text = text.replace(cnpjRegex2, (match) => {
            this.stats.cnpj++;
            this.replacementMap.set(`CNPJ-${this.replacementCounter}`, match);
            this.replacementCounter++;
            return '[CNPJ-REDACTED]';
        });
        
        return text;
    }

    /**
     * Anonimiza e-mails
     */
    anonymizeEmails(text) {
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        
        return text.replace(emailRegex, (match) => {
            this.stats.emails++;
            this.replacementMap.set(`EMAIL-${this.replacementCounter}`, match);
            this.replacementCounter++;
            return '[EMAIL-REDACTED]';
        });
    }

    /**
     * Anonimiza telefones brasileiros
     * Formatos: (xx) xxxx-xxxx, (xx) xxxxx-xxxx, xx xxxx-xxxx, etc.
     */
    anonymizePhones(text) {
        // Telefone com DDD entre parênteses: (xx) xxxx-xxxx ou (xx) xxxxx-xxxx
        const phoneRegex1 = /\(\d{2}\)\s?\d{4,5}-?\d{4}/g;
        // Telefone com DDD: xx xxxx-xxxx ou xx xxxxx-xxxx
        const phoneRegex2 = /\b\d{2}\s\d{4,5}-?\d{4}\b/g;
        // Telefone sem DDD: xxxx-xxxx ou xxxxx-xxxx
        const phoneRegex3 = /\b\d{4,5}-\d{4}\b/g;
        
        text = text.replace(phoneRegex1, (match) => {
            this.stats.phones++;
            this.replacementMap.set(`PHONE-${this.replacementCounter}`, match);
            this.replacementCounter++;
            return '[TELEFONE-REDACTED]';
        });
        
        text = text.replace(phoneRegex2, (match) => {
            this.stats.phones++;
            this.replacementMap.set(`PHONE-${this.replacementCounter}`, match);
            this.replacementCounter++;
            return '[TELEFONE-REDACTED]';
        });
        
        text = text.replace(phoneRegex3, (match) => {
            this.stats.phones++;
            this.replacementMap.set(`PHONE-${this.replacementCounter}`, match);
            this.replacementCounter++;
            return '[TELEFONE-REDACTED]';
        });
        
        return text;
    }

    /**
     * Anonimiza nomes próprios comuns (heurística simples)
     * Procura por palavras capitalizadas que podem ser nomes
     */
    anonymizeNames(text) {
        // Lista de palavras que não devem ser consideradas nomes
        const excludedWords = new Set([
            'INPI', 'Brasil', 'Brasileiro', 'Brasileira', 'CPF', 'CNPJ', 'RG',
            'São', 'Paulo', 'Rio', 'Janeiro', 'Minas', 'Gerais', 'Santa', 'Catarina',
            'Patente', 'Marca', 'Documento', 'Requerente', 'Titular', 'Inventor',
            'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo',
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
            'Rua', 'Avenida', 'Alameda', 'Praça', 'Travessa'
        ]);
        
        // Padrão para nomes próprios: 2 ou mais palavras capitalizadas seguidas
        // Ex: João Silva, Maria da Costa, etc.
        const namePattern = /\b([A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ][a-záàâãéèêíïóôõöúçñ]+(?:\s+(?:da|de|do|das|dos|e)\s+)?(?:\s+[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ][a-záàâãéèêíïóôõöúçñ]+)+)\b/g;
        
        return text.replace(namePattern, (match) => {
            // Verifica se não é uma palavra excluída
            const words = match.split(/\s+/);
            const isExcluded = words.some(word => excludedWords.has(word));
            
            if (isExcluded) {
                return match;
            }
            
            // Verifica se parece ser um nome (tem pelo menos 2 palavras substantivas)
            const substantiveWords = words.filter(w => !['da', 'de', 'do', 'das', 'dos', 'e'].includes(w.toLowerCase()));
            if (substantiveWords.length >= 2) {
                this.stats.names++;
                this.replacementMap.set(`NAME-${this.replacementCounter}`, match);
                this.replacementCounter++;
                return '[NOME-REDACTED]';
            }
            
            return match;
        });
    }

    /**
     * Anonimiza endereços (padrão simplificado)
     */
    anonymizeAddresses(text) {
        // Padrão para endereços: Rua/Avenida/etc + nome + número
        const addressPattern = /(?:Rua|Avenida|Av\.|R\.|Alameda|Praça|Travessa)\s+[^,\n]{3,50}(?:,\s*(?:n[°º]?|número)\s*\d+)?(?:,\s*[^,\n]{3,30})?/gi;
        
        return text.replace(addressPattern, (match) => {
            this.stats.addresses++;
            this.replacementMap.set(`ADDRESS-${this.replacementCounter}`, match);
            this.replacementCounter++;
            return '[ENDERECO-REDACTED]';
        });
    }

    /**
     * Método principal para anonimizar texto com base nas configurações
     */
    anonymize(text, options = {}) {
        const {
            anonymizeCPF = true,
            anonymizeCNPJ = true,
            anonymizeNames = true,
            anonymizeEmails = true,
            anonymizeAddresses = true,
            anonymizePhones = true
        } = options;

        let anonymizedText = text;

        // Ordem de processamento importa para evitar conflitos
        if (anonymizeCPF) {
            anonymizedText = this.anonymizeCPF(anonymizedText);
        }
        
        if (anonymizeCNPJ) {
            anonymizedText = this.anonymizeCNPJ(anonymizedText);
        }
        
        if (anonymizeEmails) {
            anonymizedText = this.anonymizeEmails(anonymizedText);
        }
        
        if (anonymizePhones) {
            anonymizedText = this.anonymizePhones(anonymizedText);
        }
        
        if (anonymizeAddresses) {
            anonymizedText = this.anonymizeAddresses(anonymizedText);
        }
        
        if (anonymizeNames) {
            anonymizedText = this.anonymizeNames(anonymizedText);
        }

        return anonymizedText;
    }

    /**
     * Retorna uma representação em HTML das estatísticas
     */
    getStatsHTML() {
        const stats = this.getStats();
        const total = Object.values(stats).reduce((a, b) => a + b, 0);
        
        if (total === 0) {
            return '<p style="color: #28a745;">✅ Nenhum dado sensível detectado no documento.</p>';
        }
        
        let html = `<p style="color: #856404; margin-bottom: 10px;"><strong>⚠️ ${total} item(ns) de dados sensíveis foram anonimizados:</strong></p>`;
        
        if (stats.cpf > 0) {
            html += `<div class="stat-item"><span>CPFs:</span><span><strong>${stats.cpf}</strong></span></div>`;
        }
        if (stats.cnpj > 0) {
            html += `<div class="stat-item"><span>CNPJs:</span><span><strong>${stats.cnpj}</strong></span></div>`;
        }
        if (stats.names > 0) {
            html += `<div class="stat-item"><span>Nomes:</span><span><strong>${stats.names}</strong></span></div>`;
        }
        if (stats.emails > 0) {
            html += `<div class="stat-item"><span>E-mails:</span><span><strong>${stats.emails}</strong></span></div>`;
        }
        if (stats.addresses > 0) {
            html += `<div class="stat-item"><span>Endereços:</span><span><strong>${stats.addresses}</strong></span></div>`;
        }
        if (stats.phones > 0) {
            html += `<div class="stat-item"><span>Telefones:</span><span><strong>${stats.phones}</strong></span></div>`;
        }
        
        return html;
    }
}

// Exporta a classe para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataAnonymizer;
}
