import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Mic, Copy, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { chatWithAI } from "../services/roastAPI";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onEndSession: () => void;
  userData?: any;
}

const ChatInterface = ({ onEndSession, userData }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hey! I just roasted you. How are you feeling? 😏",
      timestamp: new Date(),
    },
    {
      id: "2",
      role: "assistant",
      content: "Want me to explain any of those stats?",
      timestamp: new Date(),
    },
    {
      id: "3",
      role: "assistant",
      content: "Or should we talk about how to actually improve?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const quickReplies = [
    "Why did you roast my pace?",
    "How can I improve consistency?",
    "Am I training wrong?",
    "Give me a training plan",
    "Roast me harder",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onEndSession();
          return 0;
        }
        if (prev === 120) {
          toast({
            title: "Session ending soon!",
            description: "Your session ends in 2:00. Want to upgrade to unlimited?",
            variant: "destructive",
          });
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onEndSession, toast]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSend = async (message?: string) => {
    const text = message || input;
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    try {
      const history = messages.map((m) => ({ role: m.role === 'assistant' ? 'ai' : 'user', content: m.content }));
      const resp = await chatWithAI(text, history, userData);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: resp.response || "",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (e: any) {
      toast({ title: "Chat failed", description: e?.message || "Try again later", variant: "destructive" });
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: "Message copied to clipboard",
    });
  };

  return (
    <div className="container mx-auto px-6 py-6">
      <div className="grid lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {/* Left: Roast Summary */}
        <Card className="lg:col-span-2 bg-black border-4 border-pink-500 p-6 h-fit lg:sticky lg:top-24">
          <h3 className="font-heading text-2xl font-black uppercase mb-4">
            🔥 YOUR ROAST
          </h3>
          <div className="text-sm space-y-3 font-mono text-white/80">
            <p>
              "You ran 18 times this month but 15 of those were under 5K..."
            </p>
            <div className="space-y-2">
              <p className="text-lime-500 font-bold">• Longest run: 21.5 km</p>
              <p className="text-pink-500 font-bold">• Shortest run: 2.1 km</p>
              <p>• Consistency score: 6/10</p>
            </div>
          </div>
        </Card>

        {/* Right: Chat Interface */}
        <Card className="lg:col-span-3 bg-black border-4 border-lime-500 flex flex-col h-[calc(100vh-12rem)]">
          {/* Chat Header */}
          <div className="border-b-2 border-white/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-lime-500 animate-pulse" />
                <h2 className="font-heading text-xl font-black uppercase">
                  CHAT WITH YOUR AI COACH 🤖
                </h2>
              </div>
              <Badge
                className={`font-bold uppercase tracking-wide ${
                  timeRemaining < 120
                    ? "bg-yellow-500 text-black animate-pulse"
                    : "bg-lime-500 text-black"
                }`}
              >
                {formatTime(timeRemaining)}
              </Badge>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 relative group ${
                      message.role === "user"
                        ? "bg-lime-500 text-black"
                        : "bg-white/10 text-white border-2 border-white/20"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs opacity-60">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {message.role === "assistant" && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleCopy(message.content)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 text-white border-2 border-white/20 rounded-lg p-4">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Replies */}
          <div className="border-t-2 border-white/20 p-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {quickReplies.map((reply) => (
                <Button
                  key={reply}
                  size="sm"
                  variant="outline"
                  onClick={() => handleSend(reply)}
                  className="border-white/40 text-white hover:bg-lime-500 hover:text-black hover:border-lime-500 text-xs"
                >
                  {reply}
                </Button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything about your training..."
                maxLength={500}
                className="bg-white/10 border-2 border-white/40 text-white placeholder:text-white/50 focus:border-lime-500"
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="bg-pink-500 hover:bg-pink-600 text-black"
              >
                <Send className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                className="border-2 border-white/40 text-white hover:bg-white hover:text-black"
              >
                <Mic className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-white/50 mt-2 text-right">
              {input.length}/500
            </p>
          </div>

          {/* End Session Button */}
          <div className="border-t-2 border-white/20 p-4">
            <Button
              onClick={onEndSession}
              variant="outline"
              className="w-full border-2 border-white text-white hover:bg-white hover:text-black font-bold uppercase tracking-wide"
            >
              END SESSION
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;
