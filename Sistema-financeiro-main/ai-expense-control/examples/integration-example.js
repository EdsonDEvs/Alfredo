/**
 * Exemplo de integração do sistema de IA com o sistema financeiro existente
 * Este arquivo mostra como conectar os dois sistemas
 */

const axios = require('axios');

// Configurações
const AI_SYSTEM_URL = 'http://localhost:3001';
const FIREBASE_CONFIG = {
  // Suas configurações do Firebase
};

/**
 * Classe para integração com o sistema de IA
 */
class AIExpenseIntegration {
  constructor() {
    this.aiBaseUrl = AI_SYSTEM_URL;
  }

  /**
   * Processa foto de comprovante e salva no sistema
   * @param {File} imageFile - Arquivo de imagem
   * @param {string} userId - ID do usuário
   * @returns {Promise<Object>} - Dados processados
   */
  async processPhotoAndSave(imageFile, userId) {
    try {
      console.log('📸 Processando foto de comprovante...');

      // 1. Enviar foto para o sistema de IA
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axios.post(`${this.aiBaseUrl}/api/ingest/photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.error);
      }

      const processedData = response.data.data;
      console.log('✅ Dados processados:', processedData);

      // 2. Salvar no sistema financeiro existente
      const savedTransaction = await this.saveToExistingSystem(processedData, userId);

      return {
        success: true,
        aiData: processedData,
        savedTransaction: savedTransaction
      };

    } catch (error) {
      console.error('❌ Erro ao processar foto:', error);
      throw error;
    }
  }

  /**
   * Processa áudio de voz e salva no sistema
   * @param {File} audioFile - Arquivo de áudio
   * @param {string} userId - ID do usuário
   * @returns {Promise<Object>} - Dados processados
   */
  async processAudioAndSave(audioFile, userId) {
    try {
      console.log('🎤 Processando áudio de voz...');

      // 1. Enviar áudio para o sistema de IA
      const formData = new FormData();
      formData.append('audio', audioFile);

      const response = await axios.post(`${this.aiBaseUrl}/api/ingest/audio`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.error);
      }

      const processedData = response.data.data;
      console.log('✅ Dados processados:', processedData);

      // 2. Salvar no sistema financeiro existente
      const savedTransaction = await this.saveToExistingSystem(processedData, userId);

      return {
        success: true,
        aiData: processedData,
        savedTransaction: savedTransaction
      };

    } catch (error) {
      console.error('❌ Erro ao processar áudio:', error);
      throw error;
    }
  }

  /**
   * Processa mensagem de texto e salva no sistema
   * @param {string} text - Texto da mensagem
   * @param {string} userId - ID do usuário
   * @returns {Promise<Object>} - Dados processados
   */
  async processTextAndSave(text, userId) {
    try {
      console.log('💬 Processando mensagem de texto...');

      // 1. Enviar texto para o sistema de IA
      const response = await axios.post(`${this.aiBaseUrl}/api/ingest/text`, {
        text: text,
        userId: userId
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.error);
      }

      const processedData = response.data.data;
      console.log('✅ Dados processados:', processedData);

      // 2. Salvar no sistema financeiro existente
      const savedTransaction = await this.saveToExistingSystem(processedData, userId);

      return {
        success: true,
        aiData: processedData,
        savedTransaction: savedTransaction
      };

    } catch (error) {
      console.error('❌ Erro ao processar texto:', error);
      throw error;
    }
  }

  /**
   * Salva dados processados no sistema financeiro existente
   * @param {Object} aiData - Dados processados pela IA
   * @param {string} userId - ID do usuário
   * @returns {Promise<Object>} - Transação salva
   */
  async saveToExistingSystem(aiData, userId) {
    try {
      // Aqui você integra com seu sistema existente
      // Este é um exemplo usando Firebase (seu sistema atual)
      
      const transactionData = {
        userid: userId,
        quando: aiData.quando,
        estabelecimento: aiData.estabelecimento,
        valor: aiData.valor,
        detalhes: aiData.detalhes,
        tipo: aiData.tipo,
        category_id: aiData.category_id,
        created_at: new Date().toISOString(),
        processed_by: 'ai-expense-control',
        categoria_detectada: aiData.categoria_detectada
      };

      // Exemplo usando Firebase (seu sistema atual)
      const { addDoc, collection } = require('firebase/firestore');
      const { db } = require('../src/integrations/firebase/config');

      const docRef = await addDoc(collection(db, 'transacoes'), transactionData);
      
      console.log('💾 Transação salva no Firebase com ID:', docRef.id);

      return {
        id: docRef.id,
        ...transactionData
      };

    } catch (error) {
      console.error('❌ Erro ao salvar no sistema:', error);
      throw error;
    }
  }

  /**
   * Verifica status do sistema de IA
   * @returns {Promise<Object>} - Status do sistema
   */
  async checkAIStatus() {
    try {
      const response = await axios.get(`${this.aiBaseUrl}/api/health`);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao verificar status:', error);
      return { status: 'error', error: error.message };
    }
  }
}

/**
 * Exemplo de uso no React (seu sistema atual)
 */
class ReactIntegrationExample {
  constructor() {
    this.aiIntegration = new AIExpenseIntegration();
  }

  /**
   * Componente React para upload de foto
   */
  async handlePhotoUpload(file, userId) {
    try {
      // Mostrar loading
      this.setState({ loading: true, error: null });

      // Processar foto
      const result = await this.aiIntegration.processPhotoAndSave(file, userId);

      // Atualizar estado
      this.setState({
        loading: false,
        lastTransaction: result.savedTransaction,
        success: true
      });

      // Mostrar notificação
      this.showNotification('Foto processada com sucesso!', 'success');

      // Atualizar lista de transações
      this.refreshTransactions();

    } catch (error) {
      this.setState({
        loading: false,
        error: error.message
      });
      this.showNotification('Erro ao processar foto: ' + error.message, 'error');
    }
  }

  /**
   * Componente React para processamento de texto
   */
  async handleTextSubmit(text, userId) {
    try {
      this.setState({ loading: true, error: null });

      const result = await this.aiIntegration.processTextAndSave(text, userId);

      this.setState({
        loading: false,
        lastTransaction: result.savedTransaction,
        success: true
      });

      this.showNotification('Mensagem processada com sucesso!', 'success');
      this.refreshTransactions();

    } catch (error) {
      this.setState({
        loading: false,
        error: error.message
      });
      this.showNotification('Erro ao processar mensagem: ' + error.message, 'error');
    }
  }

  /**
   * Exemplo de componente React
   */
  renderAIUploadComponent() {
    return `
      <div className="ai-upload-component">
        <h3>🤖 IA de Controle de Gastos</h3>
        
        {/* Upload de Foto */}
        <div className="upload-section">
          <h4>📸 Enviar Comprovante</h4>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => this.handlePhotoUpload(e.target.files[0], this.state.userId)}
            disabled={this.state.loading}
          />
        </div>

        {/* Processamento de Texto */}
        <div className="text-section">
          <h4>💬 Enviar Mensagem</h4>
          <textarea 
            placeholder="Ex: Gastei R$ 50 no mercado hoje"
            onChange={(e) => this.setState({ textInput: e.target.value })}
            disabled={this.state.loading}
          />
          <button 
            onClick={() => this.handleTextSubmit(this.state.textInput, this.state.userId)}
            disabled={this.state.loading || !this.state.textInput}
          >
            {this.state.loading ? 'Processando...' : 'Processar'}
          </button>
        </div>

        {/* Status */}
        {this.state.loading && (
          <div className="loading">🔄 Processando...</div>
        )}

        {this.state.error && (
          <div className="error">❌ {this.state.error}</div>
        )}

        {this.state.success && (
          <div className="success">
            ✅ Última transação: {this.state.lastTransaction?.estabelecimento} - R$ {this.state.lastTransaction?.valor}
          </div>
        )}
      </div>
    `;
  }
}

/**
 * Exemplo de integração com WhatsApp/Telegram
 */
class MessagingIntegration {
  constructor() {
    this.aiIntegration = new AIExpenseIntegration();
  }

  /**
   * Processa mensagem recebida do WhatsApp
   */
  async handleWhatsAppMessage(message, userId) {
    try {
      console.log('📱 Processando mensagem do WhatsApp:', message);

      // Processar texto
      const result = await this.aiIntegration.processTextAndSave(message, userId);

      // Enviar confirmação
      await this.sendWhatsAppConfirmation(result.savedTransaction);

      return result;

    } catch (error) {
      console.error('❌ Erro ao processar mensagem do WhatsApp:', error);
      await this.sendWhatsAppError(error.message);
      throw error;
    }
  }

  /**
   * Envia confirmação via WhatsApp
   */
  async sendWhatsAppConfirmation(transaction) {
    const message = `
💰 Gasto registrado com sucesso!

🏪 Estabelecimento: ${transaction.estabelecimento}
💵 Valor: R$ ${transaction.valor.toFixed(2)}
📅 Data: ${new Date(transaction.quando).toLocaleDateString('pt-BR')}
🏷️ Categoria: ${transaction.category_id}
    `;

    // Aqui você integra com a API do WhatsApp
    console.log('📱 Enviando confirmação:', message);
  }

  /**
   * Envia erro via WhatsApp
   */
  async sendWhatsAppError(error) {
    const message = `❌ Erro ao processar gasto: ${error}`;
    console.log('📱 Enviando erro:', message);
  }
}

// Exportar classes para uso
module.exports = {
  AIExpenseIntegration,
  ReactIntegrationExample,
  MessagingIntegration
};

// Exemplo de uso
if (require.main === module) {
  const integration = new AIExpenseIntegration();
  
  // Verificar status
  integration.checkAIStatus().then(status => {
    console.log('Status do sistema de IA:', status);
  });
}
