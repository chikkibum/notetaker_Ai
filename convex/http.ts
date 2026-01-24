import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { getAuthUserId } from "@convex-dev/auth/server";
import { convertToModelMessages, stepCountIs, streamText, tool, UIMessage } from "ai";
import { httpAction } from "./_generated/server";
import {google} from "@ai-sdk/google";
import { z } from "zod/v4";
import { internal } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";


const http = httpRouter();

auth.addHttpRoutes(http);


http.route({
    path: "/api/chat",
    method: "POST",
    handler: httpAction(async (ctx, req) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const { messages }: { messages: UIMessage[] } = await req.json();
  
      const lastMessages = messages.slice(-10);
  
      const result = streamText({
        model:google("gemini-3-flash-preview"),
        system: `
        You are a helpful assistant that can search through the user's notes.
        Use the information from the notes to answer questions and provide insights.
        If the requested information is not available, respond with "Sorry, I can't find that information in your notes".
        You can use markdown formatting like links, bullet points, numbered lists, and bold text.
        Provide links to relevant notes using this relative URL structure (omit the base URL): '/notes?noteId=<note-id>'.
        Keep your responses concise and to the point.
        `,
        messages: await convertToModelMessages(lastMessages),
        tools: {
          findRelevantNotes: tool({
            description:
              "Retrieve relevant notes from the database based on the user's query, you need to extract the query from user and then use the tool to fetch relevant notes",
            parameters: z.object({
              query: z.string().describe("The user's query"),
            }),
            execute: async ({ query }: { query: string }): Promise<Array<{ id: string; title: string; body: unknown; creationTime: number }>> => {
              console.log("findRelevantNotes query:", query);
  
              const relevantNotes = await ctx.runAction(
                internal.notesAction.findRelevantNotes,
                {
                  query,
                  userId,
                }
              );
  
              return relevantNotes.map((note: Doc<"notes">) => ({
                id: note._id,
                title: note.title,
                body: note.content,
                creationTime: note._creationTime,
              }));
            },
          }),
        },
        stopWhen: stepCountIs(5),
        onError(error) {
          console.error("streamText error:", error);
        },
      });
  
      return result.toUIMessageStreamResponse({
        headers: new Headers({
          "Access-Control-Allow-Origin": "*",
          Vary: "origin",
        }),
      });
    }),
  });
  

  http.route({
    path: "/api/chat",
    method: "OPTIONS",
    handler: httpAction(async (_, request) => {
      const headers = request.headers;
      if (
        headers.get("Origin") !== null &&
        headers.get("Access-Control-Request-Method") !== null &&
        headers.get("Access-Control-Request-Headers") !== null
      ) {
        return new Response(null, {
          headers: new Headers({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type, Digest, Authorization",
            "Access-Control-Max-Age": "86400",
          }),
        });
      } else {
        return new Response();
      }
    }),
  });
  

export default http;
