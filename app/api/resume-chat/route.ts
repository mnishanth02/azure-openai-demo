import { NextResponse } from "next/server";
import { OpenAIClient } from "@azure/openai";
import { ChatRequestMessage } from "@azure/openai/rest";
import { AzureKeyCredential, SearchClient } from "@azure/search-documents";

import { env } from "@/env";

const endpoint = env.AZURE_SEARCH_ENDPOINT;
const apiKey = env.AZURE_SEARCH_API_KEY;
const indexName = env.AZURE_SEARCH_INDEX_NAME;

if (!endpoint || !apiKey || !indexName) {
  throw new Error("Azure Search or OpenAI credentials are not properly configured.");
}

const searchClient = new SearchClient(endpoint, indexName, new AzureKeyCredential(apiKey));
const client = new OpenAIClient(env.AZURE_INTERVIEW_ENDPOINT, new AzureKeyCredential(env.AZRE_INTERVIEW_API_KEY));

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    // Step 1: Retrieve vector chunks from Azure AI Search
    const searchOptions = {
      select: ["chunk_id", "chunk", "text_vector"],
      searchFields: ["chunk"],
      top: 5,
      vectorFields: ["text_vector"],
      vectorFilterMode: "weightedVector",
    };

    const searchResults = await searchClient.search(query, searchOptions);

    let vectorChunks = [];
    for await (const result of searchResults.results) {
      vectorChunks.push((result.document as any)?.chunk);
    }

    // Step 2: Prepare context for GPT-3.5
    const context = vectorChunks.join("\n\n");

    //    get chat completion from Azure OpenAI
    const messages: ChatRequestMessage[] = [
      {
        role: "system",
        content:
          "You are an AI assistant helping to find relevant information from resume data. Use the provided context to answer the user's query about resumes.",
      },
      {
        role: "user",
        content: `Context: ${context}\n\nQuery: ${query}`,
      },
    ];

    const completions = await client.getChatCompletions(env.AZURE_INTERVIEW_DEPLOYMENT_NAME, messages, {
      maxTokens: 500,
    });

    const response = completions.choices[0].message?.content as string;
    console.log("mockJsonResponse->", response);

    const mockJsonResponse = response.replace("```json", "").replace("```", "");

    // Step 4: Return the  response
    return NextResponse.json({ result: mockJsonResponse });
  } catch (error) {
    console.error("Error processing search request:", error);
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 });
  }
}
