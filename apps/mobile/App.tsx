import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar } from 'react-native';
import { CONSTANTS } from '@safqa/utils';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.title}>مرحباً بك في صفقة موبايل 📱</Text>
        <Text style={styles.subtitle}>أسهل سوق إلكتروني للبيع والشراء</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>تطبيق React Native جاهز 🎉</Text>
          <Text style={styles.cardText}>✅ تم ربطه بنجاح مع Monorepo</Text>
          <Text style={styles.cardText}>✅ يستخدم الحزم المشتركة (@safqa/types & @safqa/utils)</Text>
          <Text style={styles.cardText}>
            ✅ الحد الأقصى للمنشورات اليومية: {CONSTANTS.MAX_DAILY_POSTS} إعلانات
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 32,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
    textAlign: 'right',
  },
  cardText: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
    textAlign: 'right',
  },
});
