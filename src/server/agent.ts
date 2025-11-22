import 'dotenv/config';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { searchTracksByPlaylist } from "./deezer";

const deezerTool = tool(
    async ({ query }) => {
        return JSON.stringify({ status: "success", query });
    },
    {
        name: "deezer_playlist_search",
        description: "Search for a music playlist on Deezer based on a mood keyword. Use this to find music.",
        schema: z.object({
            query: z.string().describe("The best single keyword or short phrase (in English) to search for a playlist matching the user's mood."),
        }),
    }
);

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    temperature: 0,
    maxRetries: 2,
});

const modelWithTools = model.bindTools([deezerTool]);

export async function getPlaylistFromMood(userMood: string) {
    try {
        console.log(`Agent received mood: ${userMood}`);

        const result = await modelWithTools.invoke([
            {
                role: "system",
                content: `You are a DJ assistant. Your goal is to translate the user's mood description into a SINGLE, effective search term for a music playlist on Deezer.
        
        Examples:
        - "I just broke up" -> "Breakup" or "Sad"
        - "Coding all night" -> "Lo-fi" or "Focus"
        - "Going to the gym" -> "Workout" or "Phonk"
        - "Jantar romântico" -> "Dinner Jazz" or "Romantic"
        
        ALWAYS call the 'deezer_playlist_search' tool with the best keyword.`
            },
            {
                role: "user",
                content: userMood
            }
        ]);

        const toolCall = result.tool_calls?.[0];

        if (toolCall && toolCall.name === "deezer_playlist_search") {
            const args = toolCall.args as { query: string };
            console.log(`Agent decided to search for: ${args.query}`);
            return await searchTracksByPlaylist(args.query);
        }

        console.log("Agent did not call tool, using raw mood.");
        return await searchTracksByPlaylist(userMood);

    } catch (error) {
        console.error("Agent error:", error);
        return await searchTracksByPlaylist(userMood);
    }
}
