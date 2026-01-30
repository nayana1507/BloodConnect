'use client';

import React from "react"

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, or, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Message, UserProfile } from '@/lib/types';
import { MessageSquare, Send } from 'lucide-react';

export default function MessagesPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const selectedUserId = searchParams.get('userId');
  
  const [conversations, setConversations] = useState<Record<string, any>>({});
  const [selectedConversation, setSelectedConversation] = useState<string | null>(selectedUserId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [userNames, setUserNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;

      try {
        const messagesRef = collection(db, 'messages');
        const q = query(
          messagesRef,
          or(
            where('senderId', '==', user.uid),
            where('recipientId', '==', user.uid)
          )
        );
        const querySnapshot = await getDocs(q);

        const conversationMap: Record<string, any> = {};
        const usersRef = collection(db, 'users');

        for (const doc of querySnapshot.docs) {
          const message = doc.data() as Message;
          const otherUserId = message.senderId === user.uid ? message.recipientId : message.senderId;

          if (!conversationMap[otherUserId]) {
            const userQuery = query(usersRef, where('id', '==', otherUserId));
            const userDocs = await getDocs(userQuery);
            if (!userDocs.empty) {
              const userData = userDocs.docs[0].data() as UserProfile;
              conversationMap[otherUserId] = {
                userId: otherUserId,
                userName: userData.name,
                lastMessage: message.content,
                timestamp: message.createdAt,
              };
            }
          }
        }

        setConversations(conversationMap);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    try {
      // TODO: Add message to Firebase
      console.log('Sending message:', messageText, 'to', selectedConversation);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 h-screen max-w-6xl mx-auto flex gap-6">
      {/* Conversations List */}
      <div className="w-full md:w-64 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          <p className="text-sm text-foreground/60">{Object.keys(conversations).length} conversation{Object.keys(conversations).length !== 1 ? 's' : ''}</p>
        </div>

        <div className="space-y-2">
          {Object.keys(conversations).length === 0 ? (
            <Card className="border-border">
              <CardContent className="pt-8 text-center">
                <MessageSquare className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-sm text-foreground/60">No messages yet</p>
              </CardContent>
            </Card>
          ) : (
            Object.values(conversations).map(conv => (
              <button
                key={conv.userId}
                onClick={() => setSelectedConversation(conv.userId)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedConversation === conv.userId
                    ? 'bg-primary/20 border border-primary'
                    : 'border border-border hover:bg-secondary/5'
                }`}
              >
                <p className="font-medium text-foreground text-sm">{conv.userName}</p>
                <p className="text-xs text-foreground/60 truncate mt-1">{conv.lastMessage}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 hidden md:flex flex-col">
        {selectedConversation ? (
          <>
            <Card className="border-border flex-1 flex flex-col">
              <CardHeader className="border-b border-border">
                <CardTitle>
                  {conversations[selectedConversation]?.userName || 'Loading...'}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="text-center text-sm text-foreground/60 py-8">
                  <MessageSquare className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              </CardContent>
              <div className="border-t border-border p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="border-border flex-1"
                  />
                  <Button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </>
        ) : (
          <Card className="border-border flex-1 flex items-center justify-center">
            <CardContent className="text-center">
              <MessageSquare className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No conversation selected
              </h3>
              <p className="text-foreground/60">
                Choose a conversation from the left to start messaging
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
