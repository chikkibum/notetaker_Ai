"use client";

import Markdown from "@/components/markDown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useChat } from '@ai-sdk/react'
import { useAuthToken } from "@convex-dev/auth/react";
import { DefaultChatTransport, UIMessage } from "ai";
import { Bot, Expand, Minimize, Send, Trash, X, FileText, Search, Clock } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.replace(
  /.cloud$/,
  ".site"
);

export function AIChatButton() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setChatOpen(true)} variant="outline">
        <Bot />
        <span>Ask AI</span>
      </Button>
      <AIChatBox open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}

interface AIChatBoxProps {
  open: boolean;
  onClose: () => void;
}

const initialMessages: UIMessage[] = [
  {
    id: "welcome-message",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "I'm your notes assistant. I can find and summarize any information that you saved.",
      },
    ],
  },
];

function AIChatBox({ open, onClose }: AIChatBoxProps) {
  const [input, setInput] = useState("");

  const [isExpanded, setIsExpanded] = useState(false);

  const token = useAuthToken();

  const { messages, sendMessage, setMessages, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${convexSiteUrl}/api/chat`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    messages: initialMessages,
  });

  console.log(messages)

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isProcessing = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, messages]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      sendMessage({ text: input });
      setInput("");
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      onSubmit(e);
    }
  };

  if (!open) return null;

  const lastMessageIsUser = messages[messages.length - 1].role === "user";

  return (
    <div
      className={cn(
        "animate-in slide-in-from-bottom-10 bg-card fixed right-4 bottom-4 z-50 flex flex-col rounded-lg border shadow-lg duration-300 2xl:right-16",
        isExpanded
          ? "h-[650px] max-h-[90vh] w-[550px]"
          : "h-[500px] max-h-[80vh] w-80 sm:w-96"
      )}
    >
      <div className="bg-primary text-primary-foreground flex items-center justify-between rounded-t-lg border-b p-3">
        <div className="flex items-center gap-2">
          <Bot size={18} />
          <h3 className="font-medium">Notes Assistant</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary-foreground hover:bg-primary/90 h-8 w-8"
            title={isExpanded ? "Minimize" : "Expand"}
          >
            {isExpanded ? <Minimize /> : <Expand />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMessages(initialMessages)}
            className="text-primary-foreground hover:bg-primary/90 h-8 w-8"
            title="Clear chat"
            disabled={isProcessing}
          >
            <Trash />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-primary-foreground hover:bg-primary/90 h-8 w-8"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-3">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {status === "submitted" && lastMessageIsUser && <Loader />}
        {status === "error" && <ErrorMessage />}
        <div ref={messagesEndRef} />
      </div>

      <form className="flex gap-2 border-t p-3" onSubmit={onSubmit}>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="max-h-[120px] min-h-[40px] resize-none overflow-y-auto"
          maxLength={1000}
          autoFocus
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isProcessing}
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}

interface ChatMessageProps {
  message: UIMessage;
}

function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "mb-2 flex max-w-[80%] flex-col prose dark:prose-invert",
        message.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
      )}
    >
      {message.parts.map((part, index) => (
        <MessagePart
          key={index}
          part={part}
          role={message.role}
          isLast={index === message.parts.length - 1}
        />
      ))}
    </div>
  );
}

interface MessagePartProps {
  part: UIMessage["parts"][number];
  role: UIMessage["role"];
  isLast: boolean;
}

function MessagePart({ part, role, isLast }: MessagePartProps) {
  return (
    <div
      className={cn(
        "prose dark:prose-invert rounded-lg px-3 py-2 text-sm mb-2",
        role === "user"
          ? "bg-primary text-primary-foreground"
          : "bg-muted first:prose-p:mt-0"
      )}
    >
      {role === "assistant" && isLast && (
        <div className="text-muted-foreground mb-1 flex items-center gap-1 text-xs font-medium">
          <Bot className="text-primary size-3" />
          AI Assistant
        </div>
      )}
      {part.type === "text" && "text" in part && <Markdown>{part.text}</Markdown>}
      {part.type === "tool-findRelevantNotes" && (
        <ToolCallResult toolCall={part as Extract<UIMessage["parts"][number], { type: "tool-findRelevantNotes" }>} />
      )}
    </div>
  );
}

interface ToolCallResultProps {
  toolCall: Extract<UIMessage["parts"][number], { type: "tool-findRelevantNotes" }>;
}

function ToolCallResult({ toolCall }: ToolCallResultProps) {
  // Type assertion to access tool call properties
  const toolCallData = toolCall as { state?: string; output?: Array<{ id: string; title: string; body: string; creationTime: number }>; input?: { query?: string } };
  
  if (toolCallData.state !== "output-available") {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-2">
        <Search className="size-4 animate-pulse" />
        <span className="italic">Searching notes...</span>
      </div>
    );
  }

  const notes: Array<{ id: string; title: string; body: string; creationTime: number }> = toolCallData.output || [];
  const query: string = toolCallData.input?.query || "";

  if (notes.length === 0) {
    return (
      <div className="flex flex-col gap-2 py-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Search className="size-4" />
          <span className="text-sm font-medium">No notes found</span>
        </div>
        {query && (
          <p className="text-xs text-muted-foreground">
            No notes match &quot;{query}&quot;
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 py-2">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Search className="size-4" />
        <span className="text-sm font-medium">
          Found {notes.length} {notes.length === 1 ? "note" : "notes"}
          {query && ` for "${query}"`}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {notes.map((note: { id: string; title: string; body: string; creationTime: number }) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    body: string;
    creationTime: number;
  };
}

function NoteCard({ note }: NoteCardProps) {
  const date = new Date(note.creationTime);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const truncatedBody =
    note.body.length > 150 ? `${note.body.substring(0, 150)}...` : note.body;

  return (
    <Card className="border-border/50 hover:border-border transition-colors cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-semibold line-clamp-2">
            {note.title || "Untitled Note"}
          </CardTitle>
          <a
            href={`/notes?noteId=${note.id}`}
            className="text-primary hover:text-primary/80 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <FileText className="size-4 flex-shrink-0 mt-0.5" />
          </a>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-xs line-clamp-3 mb-2">
          {truncatedBody}
        </CardDescription>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3" />
          <span>{formattedDate}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function Loader() {
  return (
    <div className="ml-2 flex items-center gap-1 py-2">
      <div className="bg-primary size-1.5 animate-pulse rounded-full" />
      <div className="bg-primary size-1.5 animate-pulse rounded-full delay-150" />
      <div className="bg-primary size-1.5 animate-pulse rounded-full delay-300" />
    </div>
  );
}

function ErrorMessage() {
  return (
    <div className="text-sm text-red-500">
      Something went wrong. Please try again.
    </div>
  );
}