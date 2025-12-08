import { ChatMessage, useWebSocket } from '@/hooks/useWebSocket';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface ChatInterfaceProps {
    userId: number;
    recipientId: number;
    recipientName?: string;
    wsUrl: string;
}

export default function ChatInterface({
    userId,
    recipientId,
    recipientName = 'User',
    wsUrl,
}: ChatInterfaceProps) {
    const [messageText, setMessageText] = useState('');
    const flatListRef = useRef<FlatList>(null);
    const { connected, messages, sendMessage } = useWebSocket({ userId, wsUrl });

    // Filter messages for current conversation
    const conversationMessages = messages.filter(
        (msg) =>
            (msg.senderId === userId && msg.recipientId === recipientId) ||
            (msg.senderId === recipientId && msg.recipientId === userId)
    );

    useEffect(() => {
        // Auto-scroll to bottom when new messages arrive
        if (conversationMessages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: true });
        }
    }, [conversationMessages.length]);

    const handleSend = () => {
        if (messageText.trim() && connected) {
            sendMessage(recipientId, messageText.trim());
            setMessageText('');
        }
    };

    const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => {
        const isMyMessage = item.senderId === userId;
        return (
            <View
                style={[
                    styles.messageContainer,
                    isMyMessage ? styles.myMessageContainer : styles.theirMessageContainer,
                ]}
            >
                <View
                    style={[
                        styles.messageBubble,
                        isMyMessage ? styles.myMessageBubble : styles.theirMessageBubble,
                    ]}
                >
                    <Text style={[styles.messageText, isMyMessage && styles.myMessageText]}>
                        {item.content}
                    </Text>
                    {item.timestamp && (
                        <Text style={[styles.timestamp, isMyMessage && styles.myTimestamp]}>
                            {new Date(item.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </Text>
                    )}
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={90}
        >
            {/* Connection Status */}
            <View style={styles.statusBar}>
                <View style={[styles.statusDot, connected ? styles.connected : styles.disconnected]} />
                <Text style={styles.statusText}>
                    {connected ? `Connected - Chat with ${recipientName}` : 'Connecting...'}
                </Text>
            </View>

            {/* Messages List */}
            <FlatList
                ref={flatListRef}
                data={conversationMessages}
                keyExtractor={(item, index) => `${item.senderId}-${item.recipientId}-${index}`}
                renderItem={renderMessage}
                contentContainerStyle={styles.messagesContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        {connected ? (
                            <Text style={styles.emptyText}>No messages yet. Start the conversation!</Text>
                        ) : (
                            <ActivityIndicator size="large" color="#007AFF" />
                        )}
                    </View>
                }
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {/* Input Area */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={messageText}
                    onChangeText={setMessageText}
                    placeholder="Type a message..."
                    placeholderTextColor="#999"
                    multiline
                    maxLength={500}
                    editable={connected}
                />
                <TouchableOpacity
                    style={[styles.sendButton, (!connected || !messageText.trim()) && styles.sendButtonDisabled]}
                    onPress={handleSend}
                    disabled={!connected || !messageText.trim()}
                >
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    statusBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    connected: {
        backgroundColor: '#4CAF50',
    },
    disconnected: {
        backgroundColor: '#F44336',
    },
    statusText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    messagesContainer: {
        padding: 16,
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
    },
    messageContainer: {
        marginBottom: 12,
        flexDirection: 'row',
    },
    myMessageContainer: {
        justifyContent: 'flex-end',
    },
    theirMessageContainer: {
        justifyContent: 'flex-start',
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 18,
    },
    myMessageBubble: {
        backgroundColor: '#007AFF',
        borderBottomRightRadius: 4,
    },
    theirMessageBubble: {
        backgroundColor: '#E9E9EB',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        color: '#000',
        lineHeight: 20,
    },
    myMessageText: {
        color: '#FFF',
    },
    timestamp: {
        fontSize: 11,
        color: '#666',
        marginTop: 4,
    },
    myTimestamp: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        alignItems: 'flex-end',
    },
    input: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        maxHeight: 100,
        marginRight: 8,
    },
    sendButton: {
        backgroundColor: '#007AFF',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#B0B0B0',
    },
    sendButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
