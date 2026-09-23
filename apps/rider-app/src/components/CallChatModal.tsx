import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CallChatModalProps {
  visible: boolean;
  onClose: () => void;
  driverName?: string;
  driverPhone?: string;
}

export const CallChatModal: React.FC<CallChatModalProps> = ({
  visible,
  onClose,
  driverName = 'Rajesh Kumar',
  driverPhone = '+91 98****5678'
}) => {
  const [activeTab, setActiveTab] = useState<'CHAT' | 'CALL'>('CHAT');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'rider' | 'driver'; text: string; time: string }>>([
    { sender: 'driver', text: 'Hello! I am preparing for your scheduled pickup.', time: '05:15 AM' },
    { sender: 'rider', text: 'Hi! I have 2 large suitcases. Will wait at Gate 3.', time: '05:16 AM' },
    { sender: 'driver', text: 'Understood, plenty of boot space in my Honda City.', time: '05:17 AM' }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setMessages((prev) => [
      ...prev,
      { sender: 'rider', text: message.trim(), time: 'Just now' }
    ]);
    setMessage('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{driverName}</Text>
              <Text style={styles.privacyBadge}>Number Masked for Privacy ({driverPhone})</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Tab Switcher */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'CHAT' && styles.activeTab]}
              onPress={() => setActiveTab('CHAT')}
            >
              <Text style={[styles.tabText, activeTab === 'CHAT' && styles.activeTabText]}>In-App Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'CALL' && styles.activeTab]}
              onPress={() => setActiveTab('CALL')}
            >
              <Text style={[styles.tabText, activeTab === 'CALL' && styles.activeTabText]}>Masked Call</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'CHAT' ? (
            <View style={styles.chatSection}>
              <ScrollView style={styles.messageList} contentContainerStyle={{ paddingVertical: 8 }}>
                {messages.map((m, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.bubble,
                      m.sender === 'rider' ? styles.riderBubble : styles.driverBubble
                    ]}
                  >
                    <Text style={[styles.bubbleText, m.sender === 'rider' ? styles.riderText : styles.driverText]}>
                      {m.text}
                    </Text>
                    <Text style={[styles.bubbleTime, m.sender === 'rider' ? styles.riderTime : styles.driverTime]}>
                      {m.time}
                    </Text>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.inputRow}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Type a message to driver..."
                  placeholderTextColor="#94A3B8"
                  value={message}
                  onChangeText={setMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                  <Text style={styles.sendText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.callSection}>
              <View style={styles.callAvatarCircle}>
                <Text style={styles.callAvatarText}>
                  {driverName ? driverName.charAt(0) : 'D'}
                </Text>
              </View>
              <Text style={styles.callingText}>Encrypted VoIP Call</Text>
              <Text style={styles.callingSubtext}>Neither you nor the driver can see each other's real phone numbers.</Text>

              <TouchableOpacity style={styles.startCallButton} onPress={() => alert('Starting masked call to ' + driverName)}>
                <Text style={styles.startCallText}>Call {driverName}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700'
  },
  privacyBadge: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2
  },
  closeButton: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9'
  },
  closeText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: 'bold'
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2
  },
  tabText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600'
  },
  activeTabText: {
    color: '#0F172A',
    fontWeight: '700'
  },
  chatSection: {
    height: 320
  },
  messageList: {
    flex: 1
  },
  bubble: {
    maxWidth: '78%',
    padding: 12,
    borderRadius: 14,
    marginBottom: 8
  },
  driverBubble: {
    backgroundColor: '#F1F5F9',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  riderBubble: {
    backgroundColor: '#0284C7',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 2
  },
  bubbleText: {
    fontSize: 13
  },
  driverText: {
    color: '#0F172A'
  },
  riderText: {
    color: '#FFFFFF'
  },
  bubbleTime: {
    fontSize: 9,
    marginTop: 4,
    alignSelf: 'flex-end'
  },
  driverTime: {
    color: '#64748B'
  },
  riderTime: {
    color: '#E0F2FE'
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    color: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  sendButton: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10
  },
  sendText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13
  },
  callSection: {
    alignItems: 'center',
    paddingVertical: 24
  },
  callAvatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE'
  },
  callAvatarText: {
    fontSize: 28,
    color: '#0284C7',
    fontWeight: '800'
  },
  callingText: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700'
  },
  callingSubtext: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20
  },
  startCallButton: {
    marginTop: 24,
    backgroundColor: '#059669',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12
  },
  startCallText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15
  }
});
