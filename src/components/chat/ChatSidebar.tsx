import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, LogOut, Plus, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";

interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  status: string;
  is_online: boolean;
}

interface ChatSidebarProps {
  userId: string;
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onSignOut: () => void;
}

const ChatSidebar = ({
  userId,
  selectedConversationId,
  onSelectConversation,
  onSignOut,
}: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<Profile[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    loadUsers();
    loadConversations();
  }, [userId]);

  const loadUsers = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .neq("id", userId);
    
    if (data) setUsers(data);
  };

  const loadConversations = async () => {
    const { data } = await supabase
      .from("conversation_participants")
      .select(`
        conversation_id,
        conversations (
          id,
          created_at,
          updated_at
        )
      `)
      .eq("user_id", userId);
    
    if (data) {
      setConversations(data.map((item: any) => item.conversations));
    }
  };

  const startConversation = async (otherUserId: string) => {
    const { data: existingConv } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", userId);

    if (existingConv) {
      for (const conv of existingConv) {
        const { data: otherParticipant } = await supabase
          .from("conversation_participants")
          .select("*")
          .eq("conversation_id", conv.conversation_id)
          .eq("user_id", otherUserId)
          .single();

        if (otherParticipant) {
          onSelectConversation(conv.conversation_id);
          return;
        }
      }
    }

    const { data: newConv } = await supabase
      .from("conversations")
      .insert({})
      .select()
      .single();

    if (newConv) {
      await supabase.from("conversation_participants").insert([
        { conversation_id: newConv.id, user_id: userId },
        { conversation_id: newConv.id, user_id: otherUserId },
      ]);
      
      onSelectConversation(newConv.id);
      loadConversations();
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 border-r border-border glass-effect flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-10 h-10" />
            <h2 className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
              Messenger
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onSignOut}
            className="hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-effect"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredUsers.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No users found</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => startConversation(user.id)}
                className="w-full p-3 rounded-xl glass-effect hover:bg-accent/10 transition-all duration-200 flex items-center gap-3 animate-slide-in"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-xl font-bold shadow-glow">
                    {user.username[0].toUpperCase()}
                  </div>
                  {user.is_online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.status}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;
