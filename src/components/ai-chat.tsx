"use client";

import { useEffect, useRef, useState } from "react";

import {
	Conversation,
	ConversationContent,
	ConversationEmptyState,
	ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
	Message,
	MessageContent,
	MessageResponse,
} from "@/components/ai-elements/message";
import {
	PromptInput,
	PromptInputBody,
	PromptInputFooter,
	PromptInputSubmit,
	PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";

type ChatMessage = {
	id: string;
	role: "user" | "assistant";
	content: string;
};

const STREAM_URL = "http://localhost:8000/api/chat/stream";
const STOP_EVENT_TYPES = new Set(["done", "end", "complete"]);

let uuidFallbackCounter = 0;

function createUUIDv4() {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
		return crypto.randomUUID();
	}

	if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
		const bytes = new Uint8Array(16);
		crypto.getRandomValues(bytes);

		bytes[6] = (bytes[6] & 0x0f) | 0x40;
		bytes[8] = (bytes[8] & 0x3f) | 0x80;

		const hex = [...bytes]
			.map((byte) => byte.toString(16).padStart(2, "0"))
			.join("");

		return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
	}

	uuidFallbackCounter += 1;
	const fallbackHex = `${Date.now().toString(16)}${uuidFallbackCounter
		.toString(16)
		.padStart(12, "0")}`.padEnd(32, "0");

	return `${fallbackHex.slice(0, 8)}-${fallbackHex.slice(8, 12)}-4${fallbackHex.slice(13, 16)}-8${fallbackHex.slice(17, 20)}-${fallbackHex.slice(20, 32)}`;
}

function normalizeChunk(chunk: string) {
	return chunk.replaceAll("\r\n", "\n");
}

function parseSSEEvent(rawEvent: string) {
	const lines = normalizeChunk(rawEvent).split("\n");
	let eventType = "message";
	const dataLines: string[] = [];

	for (const line of lines) {
		if (line.startsWith("event:")) {
			eventType = line.slice(6).trim();
			continue;
		}

		if (line.startsWith("data:")) {
			dataLines.push(line.slice(5).trimStart());
		}
	}

	return {
		eventType,
		payload: dataLines.join("\n"),
	};
}

function getDeltaTextFromPayload(payload: string) {
	if (!payload) {
		return { text: "", done: false };
	}

	if (payload === "[DONE]") {
		return { text: "", done: true };
	}

	try {
		const parsed: unknown = JSON.parse(payload);

		if (typeof parsed === "string") {
			return { text: parsed, done: false };
		}

		if (!parsed || typeof parsed !== "object") {
			return { text: "", done: false };
		}

		const event = parsed as Record<string, unknown>;

		if (event.done === true) {
			return { text: "", done: true };
		}

		if (typeof event.error === "string" && event.error.length > 0) {
			throw new Error(event.error);
		}

		if (typeof event.text === "string") {
			return { text: event.text, done: false };
		}

		if (typeof event.token === "string") {
			return { text: event.token, done: false };
		}

		if (typeof event.content === "string") {
			return { text: event.content, done: false };
		}

		const delta = event.delta as Record<string, unknown> | undefined;
		if (delta && typeof delta.content === "string") {
			return { text: delta.content, done: false };
		}

		const choices = event.choices as Array<Record<string, unknown>> | undefined;
		const firstChoice = choices?.[0];
		const choiceDelta = firstChoice?.delta as Record<string, unknown> | undefined;
		if (choiceDelta && typeof choiceDelta.content === "string") {
			return { text: choiceDelta.content, done: false };
		}

		return { text: "", done: false };
	} catch {
		return { text: payload, done: false };
	}
}

function shouldStopStream(eventType: string, doneSignal: boolean) {
	return doneSignal || STOP_EVENT_TYPES.has(eventType);
}

async function streamAssistantResponse(
	responseBody: ReadableStream<Uint8Array>,
	onChunk: (chunk: string) => void
) {
	const reader = responseBody.getReader();
	const decoder = new TextDecoder();
	let buffer = "";
	let shouldStop = false;

	while (!shouldStop) {
		const { done, value } = await reader.read();
		if (done) {
			break;
		}

		buffer += normalizeChunk(decoder.decode(value, { stream: true }));

		let separatorIndex = buffer.indexOf("\n\n");
		while (separatorIndex !== -1) {
			const rawEvent = buffer.slice(0, separatorIndex);
			buffer = buffer.slice(separatorIndex + 2);

			const { eventType, payload } = parseSSEEvent(rawEvent);
			const { text, done: doneSignal } = getDeltaTextFromPayload(payload);

			if (text) {
				onChunk(text);
			}

			if (shouldStopStream(eventType, doneSignal)) {
				shouldStop = true;
				break;
			}

			separatorIndex = buffer.indexOf("\n\n");
		}
	}
}

export function Chat() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const threadIdRef = useRef<string>(createUUIDv4());
	const activeRequestRef = useRef<AbortController | null>(null);

	useEffect(() => {
		return () => {
			activeRequestRef.current?.abort();
		};
	}, []);

	const appendAssistantText = (assistantId: string, textChunk: string) => {
		if (!textChunk) {
			return;
		}

		setMessages((prev) => {
			const targetIndex = prev.findIndex((entry) => entry.id === assistantId);
			if (targetIndex === -1) {
				return prev;
			}

			const next = [...prev];
			const assistantMessage = next[targetIndex];

			next[targetIndex] = {
				...assistantMessage,
				content: assistantMessage.content + textChunk,
			};

			return next;
		});
	};

	const setAssistantText = (assistantId: string, text: string) => {
		setMessages((prev) => {
			const targetIndex = prev.findIndex((entry) => entry.id === assistantId);
			if (targetIndex === -1) {
				return prev;
			}

			const next = [...prev];
			next[targetIndex] = {
				...next[targetIndex],
				content: text,
			};

			return next;
		});
	};

	const submitMessage = async (text: string) => {
		const trimmedText = text.trim();
		if (!trimmedText || isLoading) {
			return;
		}

		activeRequestRef.current?.abort();
		const abortController = new AbortController();
		activeRequestRef.current = abortController;

		const userId = createUUIDv4();
		const assistantId = createUUIDv4();

		setMessages((prev) => [
			...prev,
			{ id: userId, role: "user", content: trimmedText },
			{ id: assistantId, role: "assistant", content: "" },
		]);
		setIsLoading(true);

		try {
			const response = await fetch(STREAM_URL, {
				method: "POST",
				headers: {
					Accept: "text/event-stream",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: trimmedText,
					thread_id: threadIdRef.current,
				}),
				signal: abortController.signal,
			});

			if (!response.ok) {
				throw new Error(`Request failed with status ${response.status}`);
			}

			if (!response.body) {
				throw new Error("No response body received from SSE endpoint");
			}

			await streamAssistantResponse(response.body, (chunk) => {
				appendAssistantText(assistantId, chunk);
			});
		} catch (error) {
			if (abortController.signal.aborted) {
				return;
			}

			const message =
				error instanceof Error
					? error.message
					: "Failed to connect to the chat stream";

			setAssistantText(assistantId, `Error: ${message}`);
		} finally {
			setIsLoading(false);
			if (activeRequestRef.current === abortController) {
				activeRequestRef.current = null;
			}
		}
	};

	return (
		<div className="container mx-auto w-full px-0 sm:px-2">
			<div className="flex h-[72dvh] min-h-[460px] max-h-[760px] flex-col overflow-hidden rounded-xl border bg-background shadow-sm">
				<Conversation className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
					<ConversationContent className="gap-3 p-3 sm:p-4">
					{messages.length === 0 ? (
						<ConversationEmptyState
							className="px-4 py-8"
							title="Start the conversation"
							description="Ask about my work, projects, or how I can help your team."
						/>
					) : null}

					{messages.map((msg) => {
						if (msg.role === "user") {
							return (
								<Message key={msg.id} from="user">
									<MessageContent className="text-[13px] leading-relaxed group-[.is-user]:px-3 group-[.is-user]:py-2.5 sm:text-sm">
										{msg.content}
									</MessageContent>
								</Message>
							);
						}

						return (
							<Message key={msg.id} from="assistant">
								<MessageContent className="text-[13px] leading-relaxed sm:text-sm">
									<MessageResponse>{msg.content}</MessageResponse>
								</MessageContent>
							</Message>
						);
					})}
					</ConversationContent>

					<ConversationScrollButton className="bottom-3" />
				</Conversation>

				<PromptInput
					className="border-t bg-muted/30 p-2 sm:p-3"
					onSubmit={({ text }) => submitMessage(text)}
				>
					<PromptInputBody>
						<PromptInputTextarea
							className="min-h-10 max-h-36 text-sm"
							placeholder="Ask me something..."
						/>
					</PromptInputBody>
					<PromptInputFooter className="mt-2 items-center">
						<PromptInputSubmit status={isLoading ? "streaming" : "ready"} />
					</PromptInputFooter>
				</PromptInput>
			</div>
		</div>
	);
}
