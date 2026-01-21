export interface Reading {
  id: string;
  status: string;
  layoutId?: string;
  layoutName?: string;
  question?: string;
  cards?: Card[];
  seed?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Card {
  id: string;
  name: string;
  arcana: string;
  suit?: string;
  number?: number;
  position: number;
  orientation: string;
  positionName: string;
  positionDescription: string;
}

export interface Layout {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  positions: LayoutPosition[];
}

export interface LayoutPosition {
  position: number;
  name: string;
  description: string;
}

export interface Interpretation {
  id: string;
  readingId: string;
  layoutId: string;
  question?: string;
  cardInterpretations: CardInterpretation[];
  overallTheme: string;
  narrative: string;
  createdAt: string;
}

export interface CardInterpretation {
  cardId: string;
  cardName: string;
  position: number;
  positionName: string;
  interpretation: string;
}

export interface ConversationMessage {
  id: string;
  interpretationId: string;
  question: string;
  answer: string;
  createdAt: string;
}

const READING_SERVICE_URL = process.env.NEXT_PUBLIC_READING_SERVICE_URL || 'http://localhost:3002';
const LAYOUT_SERVICE_URL = process.env.NEXT_PUBLIC_LAYOUT_SERVICE_URL || 'http://localhost:3003';
const INTERPRETATION_SERVICE_URL = process.env.NEXT_PUBLIC_INTERPRETATION_SERVICE_URL || 'http://localhost:3004';

export class TarotApiClient {
  async createReading(): Promise<Reading> {
    const response = await fetch(`${READING_SERVICE_URL}/readings`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error(`Failed to create reading: ${response.statusText}`);
    }

    const data = (await response.json()) as { reading: Reading };
    return data.reading;
  }

  async getReading(id: string): Promise<Reading> {
    const response = await fetch(`${READING_SERVICE_URL}/readings/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch reading: ${response.statusText}`);
    }

    const data = (await response.json()) as { reading: Reading };
    return data.reading;
  }

  async listLayouts(): Promise<Layout[]> {
    const response = await fetch(`${LAYOUT_SERVICE_URL}/layouts`);

    if (!response.ok) {
      throw new Error(`Failed to fetch layouts: ${response.statusText}`);
    }

    const data = (await response.json()) as { layouts: Layout[] };
    return data.layouts;
  }

  async selectLayout(readingId: string, layoutId: string): Promise<Reading> {
    const response = await fetch(
      `${READING_SERVICE_URL}/readings/${readingId}/layout`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layoutId })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to select layout: ${response.statusText}`);
    }

    const data = (await response.json()) as { reading: Reading };
    return data.reading;
  }

  async drawCards(
    readingId: string,
    question?: string
  ): Promise<Reading> {
    const response = await fetch(
      `${READING_SERVICE_URL}/readings/${readingId}/draw`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to draw cards: ${response.statusText}`);
    }

    const data = (await response.json()) as { reading: Reading };
    return data.reading;
  }

  async getInterpretation(readingId: string): Promise<Interpretation> {
    const response = await fetch(
      `${INTERPRETATION_SERVICE_URL}/interpretations/reading/${readingId}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch interpretation: ${response.statusText}`);
    }

    const data = (await response.json()) as { interpretation: Interpretation };
    return data.interpretation;
  }

  async askFollowUp(
    interpretationId: string,
    question: string
  ): Promise<ConversationMessage> {
    const response = await fetch(
      `${INTERPRETATION_SERVICE_URL}/interpretations/${interpretationId}/follow-up`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to ask follow-up: ${response.statusText}`);
    }

    const data = (await response.json()) as { message: ConversationMessage };
    return data.message;
  }

  async getConversation(interpretationId: string): Promise<ConversationMessage[]> {
    const response = await fetch(
      `${INTERPRETATION_SERVICE_URL}/interpretations/${interpretationId}/conversation`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch conversation: ${response.statusText}`);
    }

    const data = (await response.json()) as { messages: ConversationMessage[] };
    return data.messages;
  }
}

export const apiClient = new TarotApiClient();
