import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';

// Message types
type MessageType = 'user' | 'ai' | 'system';

interface Message {
  id: string;
  text: string;
  type: MessageType;
  timestamp: Date;
}

// Quick suggestions for chat
const QUICK_SUGGESTIONS = [
  'What should I eat today?',
  'How can I improve my sleep?',
  'Give me a quick workout idea',
  'How am I progressing on my goals?',
  'Recommend a healthy snack',
];

// Mock AI responses (in a real app, these would come from an API)
const MOCK_RESPONSES = {
  'What should I eat today?': 
    "Based on your nutrition log, you're low on protein today. I'd recommend:\n\n" +
    "- Breakfast: Greek yogurt with berries and a sprinkle of nuts\n" +
    "- Lunch: Grilled chicken salad with plenty of colorful vegetables\n" +
    "- Dinner: Baked salmon with roasted sweet potatoes and broccoli\n\n" +
    "This will help balance your macros and provide essential nutrients.",
  
  'How can I improve my sleep?': 
    "Looking at your sleep data, I see you average 6.2 hours of sleep with frequent interruptions. Here are some suggestions:\n\n" +
    "1. Establish a consistent sleep schedule, even on weekends\n" +
    "2. Create a relaxing bedtime routine without screens 1 hour before bed\n" +
    "3. Keep your bedroom cool (around 65°F or 18°C)\n" +
    "4. Consider limiting caffeine after 2pm\n\n" +
    "Would you like a more detailed plan?",
  
  'Give me a quick workout idea':
    "Here's a 15-minute HIIT workout you can do anywhere:\n\n" +
    "Complete 4 rounds of:\n" +
    "- 30 sec Jumping Jacks\n" +
    "- 30 sec Push-ups (modify as needed)\n" +
    "- 30 sec Bodyweight Squats\n" +
    "- 30 sec Plank\n" +
    "- 30 sec Rest\n\n" +
    "This hits all major muscle groups and provides cardio benefits in minimal time!",
  
  'How am I progressing on my goals?':
    "You're making steady progress! Your weight loss goal is 35% complete, and you've been consistent with logging meals (92% of days). Your step count has increased by 12% from last month.\n\n" +
    "Areas to improve: You're still a bit below your protein target and could increase water intake by about 500ml daily.\n\n" +
    "Overall, you're on track to reach your weight goal by June if you maintain your current habits!",
  
  'Recommend a healthy snack':
    "Based on your nutritional needs and preferences, here are some healthy snack options:\n\n" +
    "1. Apple slices with 1 tbsp almond butter (fiber + protein)\n" +
    "2. A small handful of mixed nuts and dried berries (healthy fats + antioxidants)\n" +
    "3. Greek yogurt with a drizzle of honey (protein + probiotics)\n" +
    "4. Cucumber slices with hummus (hydration + protein)\n\n" +
    "The apple with almond butter would be especially good before your afternoon workout!"
};

// Function to get a generic response when no specific response exists
const getGenericResponse = (query: string) => {
  return `I'll help you with "${query}". In a fully implemented version, I'd analyze your health data and provide personalized advice based on your specific goals and patterns.`;
};

// MessageBubble component
const MessageBubble = ({ message }: { message: Message }) => {
  const { theme } = useTheme();
  const isUser = message.type === 'user';
  
  return (
    <View style={[
      styles.messageBubble,
      isUser ? styles.userBubble : styles.aiBubble,
      {
        backgroundColor: isUser ? theme.primary : theme.card,
      }
    ]}>
      {!isUser && (
        <View style={styles.aiIconContainer}>
          <Icon name="robot" size={20} color={theme.primary} />
        </View>
      )}
      
      <View style={styles.messageContent}>
        <Text style={[
          styles.messageText,
          { color: isUser ? '#FFFFFF' : theme.text }
        ]}>
          {message.text}
        </Text>
        
        <Text style={[
          styles.timestamp,
          { color: isUser ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)' }
        ]}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
};

// System message component
const SystemMessage = ({ message }: { message: Message }) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.systemMessageContainer}>
      <Text style={[styles.systemMessageText, { color: theme.text }]}>
        {message.text}
      </Text>
    </View>
  );
};

// Quick suggestions component
const QuickSuggestions = ({ onSuggestionPress }) => {
  const { theme } = useTheme();
  
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.suggestionsContainer}
    >
      {QUICK_SUGGESTIONS.map((suggestion, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.suggestionButton, { backgroundColor: theme.card }]}
          onPress={() => onSuggestionPress(suggestion)}
        >
          <Text style={[styles.suggestionText, { color: theme.text }]} numberOfLines={1}>
            {suggestion}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// Main component
const CoachScreen = () => {
  const { theme } = useTheme();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Initialize chat with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: `Hello ${user?.name || 'there'}! I'm your HealthCoach AI assistant. I can help you with nutrition advice, workout suggestions, and tracking your health goals. How can I help you today?`,
        type: 'ai',
        timestamp: new Date(),
      };
      
      const systemMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `You can ask me questions about your health, diet, or fitness goals.`,
        type: 'system',
        timestamp: new Date(),
      };
      
      setMessages([welcomeMessage, systemMessage]);
    }
  }, [user]);

  // Handles sending a message
  const handleSendMessage = (text: string = inputText) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      type: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    // Simulate AI typing
    setTimeout(() => {
      // Get response (in a real app, this would be an API call)
      const response = MOCK_RESPONSES[text.trim()] || getGenericResponse(text.trim());
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: response,
        type: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500); // Simulate delay for AI response
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Render message item
  const renderMessageItem = ({ item }: { item: Message }) => {
    if (item.type === 'system') {
      return <SystemMessage message={item} />;
    }
    return <MessageBubble message={item} />;
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Chat messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesContainer}
      />
      
      {/* AI is typing indicator */}
      {isTyping && (
        <View style={[styles.typingIndicator, { backgroundColor: theme.card }]}>
          <Text style={[styles.typingText, { color: theme.text }]}>HealthCoach is typing</Text>
          <ActivityIndicator size="small" color={theme.primary} style={styles.typingDots} />
        </View>
      )}
      
      {/* Quick suggestions */}
      <QuickSuggestions onSuggestionPress={handleSendMessage} />
      
      {/* Message input */}
      <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
        <TextInput
          style={[styles.textInput, { color: theme.text, backgroundColor: theme.background }]}
          placeholder="Ask your AI health coach anything..."
          placeholderTextColor="gray"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: inputText.trim() ? theme.primary : theme.border }
          ]}
          onPress={() => handleSendMessage()}
          disabled={!inputText.trim()}
        >
          <Icon name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingTop:.16,
    paddingBottom: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 6,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    flexDirection: 'row',
  },
  aiIconContainer: {
    marginRight: 8,
    alignSelf: 'flex-start',
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  systemMessageContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  systemMessageText: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginBottom: 8,
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  typingText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  typingDots: {
    marginLeft: 8,
  },
  suggestionsContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  suggestionButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  suggestionText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 120,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default CoachScreen; 