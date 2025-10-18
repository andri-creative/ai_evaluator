// src/ai/vectorDB/chromaClient.ts
import { ChromaClient } from "chromadb";

class VectorDBService {
  private client: ChromaClient;
  private collection: any;

  constructor() {
    this.client = new ChromaClient({
      path: "http://localhost:4602",
    });
  }

  async initialize() {
    try {
      this.collection = await this.client.getOrCreateCollection({
        name: "evaluation_documents",
      });
      console.log("✅ ChromaDB connected successfully");
    } catch (error) {
      console.error("❌ ChromaDB connection failed:", error);
      throw error;
    }
  }

  async addDocuments(
    documents: { id: string; content: string; metadata: any }[]
  ) {
    try {
      await this.collection.add({
        ids: documents.map((doc) => doc.id),
        documents: documents.map((doc) => doc.content),
        metadatas: documents.map((doc) => doc.metadata),
      });
      console.log(`✅ Added ${documents.length} documents to vector DB`);
    } catch (error) {
      console.error("❌ Failed to add documents:", error);
    }
  }

  async searchSimilar(query: string, documentType: string, limit: number = 3) {
    try {
      const results = await this.collection.query({
        queryTexts: [query],
        nResults: limit,
        where: { type: documentType },
      });

      return results.documents[0] || [];
    } catch (error) {
      console.error("❌ Vector search failed:", error);
      return [];
    }
  }
}

export const vectorDB = new VectorDBService();
