import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, onSnapshot, or, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { Message } from '@/lib/types';

export const messageService = {
  // Send a message
  async sendMessage(
    senderId: string,
    recipientId: string,
    content: string
  ): Promise<string> {
    try {
      const messageData = {
        senderId,
        recipientId,
        content,
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'messages'), messageData);
      return docRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Get conversation messages
  async getConversation(userId1: string, userId2: string): Promise<Message[]> {
    try {
      const q = query(
        collection(db, 'messages'),
        or(
          where('senderId', '==', userId1),
          where('recipientId', '==', userId1)
        )
      );

      const querySnapshot = await getDocs(q);
      const messages = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Message))
        .filter(msg => 
          (msg.senderId === userId1 && msg.recipientId === userId2) ||
          (msg.senderId === userId2 && msg.recipientId === userId1)
        )
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      return messages;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  },

  // Get all conversations for a user
  async getUserConversations(userId: string): Promise<Map<string, Message>> {
    try {
      const q = query(
        collection(db, 'messages'),
        or(
          where('senderId', '==', userId),
          where('recipientId', '==', userId)
        )
      );

      const querySnapshot = await getDocs(q);
      const conversationMap = new Map<string, Message>();

      querySnapshot.docs.forEach(doc => {
        const message = doc.data() as Message;
        const otherId = message.senderId === userId ? message.recipientId : message.senderId;

        if (!conversationMap.has(otherId) || 
            new Date(message.createdAt) > new Date(conversationMap.get(otherId)!.createdAt)) {
          conversationMap.set(otherId, { id: doc.id, ...message });
        }
      });

      return conversationMap;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  // Subscribe to conversation messages
  subscribeToConversation(
    userId1: string,
    userId2: string,
    callback: (messages: Message[]) => void
  ): (() => void) {
    const q = query(
      collection(db, 'messages'),
      or(
        where('senderId', '==', userId1),
        where('recipientId', '==', userId1)
      )
    );

    const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const messages = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Message))
        .filter(msg => 
          (msg.senderId === userId1 && msg.recipientId === userId2) ||
          (msg.senderId === userId2 && msg.recipientId === userId1)
        )
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      callback(messages);
    });

    return unsubscribe;
  },

  // Mark message as read
  async markMessageAsRead(messageId: string): Promise<void> {
    try {
      const docRef = doc(db, 'messages', messageId);
      await updateDoc(docRef, { isRead: true });
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  },

  // Get unread message count
  async getUnreadCount(userId: string, fromUserId?: string): Promise<number> {
    try {
      const q = fromUserId
        ? query(
            collection(db, 'messages'),
            where('recipientId', '==', userId),
            where('senderId', '==', fromUserId),
            where('isRead', '==', false)
          )
        : query(
            collection(db, 'messages'),
            where('recipientId', '==', userId),
            where('isRead', '==', false)
          );

      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  },
};
