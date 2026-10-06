import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Pressable, FlatList, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const API_URL = 'https://YOUR-BACKEND-DOMAIN.example';
const models = [{ id: 'openai', label: 'GPT', color: '#ae8cff' }, { id: 'anthropic', label: 'Claude', color: '#f0a36c' }, { id: 'deepseek', label: 'DeepSeek', color: '#63d8eb' }];

export default function App() {
  const [model, setModel] = useState('openai');
  const [notion, setNotion] = useState(false);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([]);
  const active = models.find(x => x.id === model);

  async function send() {
    const value = text.trim(); if (!value || busy) return;
    const history = [...messages, { role: 'user', content: value }];
    setMessages(history); setText(''); setBusy(true);
    try {
      const response = await fetch(`${API_URL}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ provider: model, messages: [{ role: 'system', content: 'Ты — Игорь, персональный AI-помощник. Отвечай на русском кратко и по делу.' }, ...history], notion }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Ошибка сервера');
      setMessages([...history, { role: 'assistant', content: data.text }]);
    } catch (error) { setMessages([...history, { role: 'assistant', content: `Ошибка: ${error.message}` }]); }
    finally { setBusy(false); }
  }

  return <SafeAreaView style={styles.safe}><StatusBar style="light" /><KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <View style={styles.header}><View style={styles.logo}><Text style={styles.logoText}>✦</Text></View><View><Text style={styles.title}>Игорь</Text><Text style={styles.subtitle}>единый AI-чат</Text></View></View>
    <View style={styles.modelRow}>{models.map(x => <Pressable key={x.id} onPress={() => setModel(x.id)} style={[styles.model, model === x.id && styles.modelActive]}><View style={[styles.dot, { backgroundColor: x.color }]} /><Text style={styles.modelText}>{x.label}</Text></Pressable>)}</View>
    <View style={styles.memoryRow}><Text style={styles.memoryText}>Память Notion</Text><Pressable onPress={() => setNotion(!notion)} style={[styles.toggle, notion && styles.toggleOn]}><View style={[styles.knob, notion && styles.knobOn]} /></Pressable></View>
    {messages.length === 0 ? <View style={styles.empty}><View style={styles.bigLogo}><Text style={styles.logoText}>✦</Text></View><Text style={styles.welcome}>Привет, я Игорь</Text><Text style={styles.hint}>Один чат для GPT, Claude, DeepSeek и Notion.</Text></View> : <FlatList style={styles.list} contentContainerStyle={styles.listContent} data={messages} keyExtractor={(_, i) => String(i)} renderItem={({ item }) => <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}><Text style={styles.meta}>{item.role === 'user' ? 'Вы' : active.label}</Text><Text style={styles.message}>{item.content}</Text></View>} />}
    <View style={styles.composer}><TextInput value={text} onChangeText={setText} onSubmitEditing={send} returnKeyType="send" placeholder="Напиши сообщение…" placeholderTextColor="#777987" multiline style={styles.input} /><Pressable onPress={send} style={styles.send}>{busy ? <ActivityIndicator color="#17131f" /> : <Text style={styles.sendText}>↑</Text>}</Pressable></View>
  </KeyboardAvoidingView></SafeAreaView>;
}
const styles = StyleSheet.create({ safe:{flex:1,backgroundColor:'#101114'},root:{flex:1,paddingHorizontal:16},header:{height:72,flexDirection:'row',alignItems:'center',gap:10,borderBottomWidth:1,borderBottomColor:'#292b34'},logo:{width:38,height:38,borderRadius:12,backgroundColor:'#2b2242',alignItems:'center',justifyContent:'center'},bigLogo:{width:62,height:62,borderRadius:20,backgroundColor:'#2b2242',alignItems:'center',justifyContent:'center',marginBottom:18},logoText:{color:'#c2adff',fontSize:24},title:{color:'#f4f4f5',fontSize:16,fontWeight:'700'},subtitle:{color:'#9698a5',fontSize:11,marginTop:2},modelRow:{flexDirection:'row',gap:8,paddingVertical:14},model:{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,paddingVertical:9,borderRadius:10},modelActive:{backgroundColor:'#252630'},dot:{width:8,height:8,borderRadius:8},modelText:{color:'#c7c8d0',fontSize:12},memoryRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:8},memoryText:{color:'#bcbec8',fontSize:13},toggle:{width:32,height:20,borderRadius:20,backgroundColor:'#363842',padding:2},toggleOn:{backgroundColor:'#7659c8'},knob:{width:16,height:16,borderRadius:10,backgroundColor:'#a9aab4'},knobOn:{alignSelf:'flex-end',backgroundColor:'#fff'},empty:{flex:1,alignItems:'center',justifyContent:'center'},welcome:{color:'#f4f4f5',fontSize:28,fontWeight:'700'},hint:{color:'#9698a5',fontSize:14,marginTop:10,textAlign:'center'},list:{flex:1},listContent:{paddingVertical:18,gap:12},bubble:{padding:12,borderRadius:14},userBubble:{backgroundColor:'#24252c',alignSelf:'flex-end',maxWidth:'86%'},aiBubble:{backgroundColor:'#1a1b21',alignSelf:'flex-start',maxWidth:'94%'},meta:{color:'#888a96',fontSize:10,marginBottom:4},message:{color:'#e3e3e8',fontSize:15,lineHeight:21},composer:{minHeight:54,marginVertical:12,borderWidth:1,borderColor:'#383944',borderRadius:16,flexDirection:'row',alignItems:'flex-end',paddingLeft:14,paddingVertical:8,paddingRight:8},input:{flex:1,color:'#f4f4f5',fontSize:15,maxHeight:110,paddingTop:4},send:{width:34,height:34,borderRadius:10,backgroundColor:'#9d80ec',alignItems:'center',justifyContent:'center'},sendText:{color:'#17131f',fontSize:22,fontWeight:'700'}});