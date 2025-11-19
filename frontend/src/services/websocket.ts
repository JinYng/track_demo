/**
 * WebSocket服务
 * 处理与后端的实时通信
 */

import { JBrowseController } from './jbrowseController'

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

interface NavigationCommand {
    type: 'navigation'
    action: 'navigate_to_location'
    payload: {
        chromosome: string
        chromosome_ucsc: string
        chromosome_ensembl: string
        start: number
        end: number
        gene_name?: string
    }
    requestId: string
    timestamp: string
}

interface NavigationResponse {
    type: 'navigation_response'
    requestId: string
    status: 'success' | 'error'
    message: string
    location?: {
        chromosome: string
        start: number
        end: number
    }
}

export class WebSocketService {
    private ws: WebSocket | null = null
    private reconnectAttempts = 0
    private maxReconnectAttempts = 5
    private reconnectDelay = 1000
    private messageHandlers: ((response: WebSocketResponse) => void)[] = []
    private connectionHandlers: ((connected: boolean) => void)[] = []
    private jbrowseController: JBrowseController | null = null

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
                        const response = JSON.parse(event.data)

                        // 检查是否是导航指令
                        if (response.type === 'navigation') {
                            this.handleNavigationCommand(response as NavigationCommand)
                        } else {
                            // 普通消息，通知处理器
                            this.notifyMessageHandlers(response as WebSocketResponse)
                        }
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

    /**
     * 设置 JBrowse 控制器
     */
    setJBrowseController(controller: JBrowseController) {
        this.jbrowseController = controller
        console.log('✅ JBrowse controller set in WebSocket service')
    }

    /**
     * 处理导航指令
     */
    private async handleNavigationCommand(command: NavigationCommand) {
        console.log('📍 Received navigation command:', command)

        if (!this.jbrowseController) {
            console.error('❌ JBrowse controller not initialized')
            this.sendNavigationResponse(command.requestId, 'error',
                'JBrowse controller not initialized')
            return
        }

        try {
            // 执行导航
            const result = await this.jbrowseController.navigateToLocation(
                command.payload.chromosome,
                command.payload.start,
                command.payload.end
            )

            if (result.success) {
                console.log('✅ Navigation successful:', result)
                this.sendNavigationResponse(
                    command.requestId,
                    'success',
                    result.message,
                    result.location
                )
            } else {
                console.error('❌ Navigation failed:', result)
                this.sendNavigationResponse(
                    command.requestId,
                    'error',
                    result.message || 'Navigation failed'
                )
            }
        } catch (error: any) {
            console.error('❌ Navigation error:', error)
            this.sendNavigationResponse(
                command.requestId,
                'error',
                `Navigation failed: ${error.message}`
            )
        }
    }

    /**
     * 发送导航响应
     */
    private sendNavigationResponse(
        requestId: string,
        status: 'success' | 'error',
        message: string,
        location?: { chromosome: string; start: number; end: number }
    ) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.error('❌ Cannot send navigation response: WebSocket not connected')
            return
        }

        const response: NavigationResponse = {
            type: 'navigation_response',
            requestId,
            status,
            message,
            location
        }

        try {
            this.ws.send(JSON.stringify(response))
            console.log('📤 Sent navigation response:', response)
        } catch (error) {
            console.error('❌ Failed to send navigation response:', error)
        }
    }
}

// 创建全局WebSocket服务实例
export const websocketService = new WebSocketService()