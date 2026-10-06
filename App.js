import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Pressable, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const TEST_REPLY = 'Тест пройден. Игорь работает на iPhone. Подключение AI добавим следующим этапом.';

export default function App() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);

  function send() {
    const value = text.trim();
    if (!value) return;

    const next = [...messages, { role: 'user', content: value }];
    setText('');
    setMessages([...next, { role: 'assistant', content: TEST_REPLY }]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <View style={styles.logo}><Text style={styles.logoText}>✦</Text></View>
          <View>
            <Text style={styles.title}>Игорь</Text>
            <Text style={styles.subtitle}>тестовая версия 0.1</Text>
          </View>
          <View style={styles.status}><View style={styles.statusDot} /><Text style={styles.statusText}>Готов</Text></View>
        </View>

        {messages.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.bigLogo}><Text style={styles.bigLogoText}>✦</Text></View>
            <Text style={styles.welcome}>Привет, я Игорь</Text>
            <Text style={styles.hint}>Это первая тестовая версия приложения.</Text>
            <Text style={styles.hint}>Напиши любое сообщение, чтобы проверить работу.</Text>
          </View>
        ) : (
          <FlatList
            style={styles.list}
            contentContainerStyle={styles.listContent}
            data={messages}
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item }) => (
              <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}>
                <Text style={styles.meta}>{item.role === 'user' ? 'Вы' : 'Игорь'}</Text>
                <Text style={styles.message}>{item.content}</Text>
              </View>
            )}
          />
        )}

        <View style={styles.composer}>
          <TextInput
            value={text}
            onChangeText={setText}
            onSubmitEditing={send}
            returnKeyType="send"
            placeholder="Напиши сообщение…"
            placeholderTextColor="#777987"
            multiline
            style={styles.input}
          />
          <Pressable onPress={send} disabled={!text.trim()} style={[styles.send, !text.trim() && styles.sendDisabled]}>
            <Text style={styles.sendText}>↑</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#101114' },
  root: { flex: 1, paddingHorizontal: 16 },
  header: { height: 72, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: '#292b34' },
  logo: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#2b2242', alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#c2adff', fontSize: 24 },
  title: { color: '#f4f4f5', fontSize: 16, fontWeight: '700' },
  subtitle: { color: '#9698a5', fontSize: 11, marginTop: 2 },
  status: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1b2720', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  statusDot: { width: 7, height: 7, borderRadius: 7, backgroundColor: '#6fd58a' },
  statusText: { color: '#9fe0af', fontSize: 11, fontWeight: '600' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  bigLogo: { width: 68, height: 68, borderRadius: 22, backgroundColor: '#2b2242', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  bigLogoText: { color: '#c2adff', fontSize: 34 },
  welcome: { color: '#f4f4f5', fontSize: 28, fontWeight: '700' },
  hint: { color: '#9698a5', fontSize: 14, marginTop: 8, textAlign: 'center', lineHeight: 20 },
  list: { flex: 1 },
  listContent: { paddingVertical: 18, gap: 12 },
  bubble: { padding: 12, borderRadius: 14 },
  userBubble: { backgroundColor: '#24252c', alignSelf: 'flex-end', maxWidth: '86%' },
  aiBubble: { backgroundColor: '#1a1b21', alignSelf: 'flex-start', maxWidth: '94%' },
  meta: { color: '#888a96', fontSize: 10, marginBottom: 4 },
  message: { color: '#e3e3e8', fontSize: 15, lineHeight: 21 },
  composer: { minHeight: 54, marginVertical: 12, borderWidth: 1, borderColor: '#383944', borderRadius: 16, flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 14, paddingVertical: 8, paddingRight: 8 },
  input: { flex: 1, color: '#f4f4f5', fontSize: 15, maxHeight: 110, paddingTop: 4 },
  send: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#9d80ec', alignItems: 'center', justifyContent: 'center' },
  sendDisabled: { opacity: 0.35 },
  sendText: { color: '#17131f', fontSize: 22, fontWeight: '700' }
});
