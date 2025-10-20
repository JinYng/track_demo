/**
 * WebSocket服务
 * 处理与后端的实时通信
 */

interface ModelConfig {
    apiBaseUrl: string
    apiKey: string
    modelName: string
}

interface Message {
    id: string
    content: string
    sender: 'user' | 'ai'
    timestamp: Date
}

interface WebSocketMessage {
    query: string
    messages: Array<{ role: 'user' | 'assistant', content: string }>
    ai_model_config: {
        apiBaseUrl: string
        apiKey: string
        modelName: string
    }
}

interface WebSocketResponse {
    status: 'success' | 'error'
    message: string
    data?: any
}

export class WebSocketService {
    private ws: WebSocket | null = null
    private reconnectAttempts = 0
    private maxReconnectAttempts = 5
    private reconnectDelay = 1000
    private messageHandlers: ((response: WebSocketResponse) => void)[] = []
    private connectionHandlers: ((connected: boolean) => void)[] = []

    constructor(private url: string = 'ws://localhost:8000/ws') { }

    /**
     * 连接WebSocket
     */
    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(this.url)

                this.ws.onopen = () => {
                    console.log('WebSocket连接成功')
                    this.reconnectAttempts = 0
                    this.notifyConnectionHandlers(true)
                    resolve()
                }

                this.ws.onmessage = (event) => {
                    try {
                        const response: WebSocketResponse = JSON.parse(event.data)
                        this.notifyMessageHandlers(response)
                    } catch (error) {
                        console.error('解析WebSocket消息失败:', error)
                    }
                }

                this.ws.onclose = () => {
                    console.log('WebSocket连接关闭')
                    this.notifyConnectionHandlers(false)
                    this.attemptReconnect()
                }

                this.ws.onerror = (error) => {
                    console.error('WebSocket错误:', error)
                    reject(error)
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * 发送消息
     */
    sendMessage(query: string, modelConfig: ModelConfig, chatHistory: Message[] = []): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                reject(new Error('WebSocket未连接'))
                return
            }

            // 构建干净的对话历史 - 只包含用户和助手的对话内容
            const messages = chatHistory.map(msg => ({
                role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
                content: msg.content
            }))

            // 添加当前用户查询
            messages.push({
                role: 'user' as const,
                content: query
            })

            const message: WebSocketMessage = {
                query,
                messages, // 纯粹的对话历史，不包含配置信息
                ai_model_config: {
                    apiBaseUrl: modelConfig.apiBaseUrl,
                    apiKey: modelConfig.apiKey,
                    modelName: modelConfig.modelName
                }
            }

            try {
                this.ws.send(JSON.stringify(message))
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * 添加消息处理器
     */
    onMessage(handler: (response: WebSocketResponse) => void) {
        this.messageHandlers.push(handler)
    }

    /**
     * 添加连接状态处理器
     */
    onConnectionChange(handler: (connected: boolean) => void) {
        this.connectionHandlers.push(handler)
    }

    /**
     * 移除消息处理器
     */
    removeMessageHandler(handler: (response: WebSocketResponse) => void) {
        const index = this.messageHandlers.indexOf(handler)
        if (index > -1) {
            this.messageHandlers.splice(index, 1)
        }
    }

    /**
     * 移除连接状态处理器
     */
    removeConnectionHandler(handler: (connected: boolean) => void) {
        const index = this.connectionHandlers.indexOf(handler)
        if (index > -1) {
            this.connectionHandlers.splice(index, 1)
        }
    }

    /**
     * 断开连接
     */
    disconnect() {
        if (this.ws) {
            this.ws.close()
            this.ws = null
        }
    }

    /**
     * 获取连接状态
     */
    isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN
    }

    /**
     * 尝试重连
     */
    private attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('WebSocket重连次数已达上限')
            return
        }

        this.reconnectAttempts++
        console.log(`尝试重连WebSocket (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)

        setTimeout(() => {
            this.connect().catch(error => {
                console.error('WebSocket重连失败:', error)
            })
        }, this.reconnectDelay * this.reconnectAttempts)
    }

    /**
     * 通知消息处理器
     */
    private notifyMessageHandlers(response: WebSocketResponse) {
        this.messageHandlers.forEach(handler => {
            try {
                handler(response)
            } catch (error) {
                console.error('消息处理器执行失败:', error)
            }
        })
    }

    /**
     * 通知连接状态处理器
     */
    private notifyConnectionHandlers(connected: boolean) {
        this.connectionHandlers.forEach(handler => {
            try {
                handler(connected)
            } catch (error) {
                console.error('连接状态处理器执行失败:', error)
            }
        })
    }
}

// 创建全局WebSocket服务实例
export const websocketService = new WebSocketService()