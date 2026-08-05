"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
	Reasoning,
	ReasoningContent,
	ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
	Tool,
	ToolContent,
	ToolHeader,
	ToolInput,
	ToolOutput,
} from "@/components/ai-elements/tool";
import {
	PromptInput,
	PromptInputBody,
	PromptInputFooter,
	PromptInputSubmit,
	PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";

//parse env variables
import "dotenv/config";

type ToolCallPart = {
	type: "dynamic-tool";
	toolName: string;
	toolCallId: string;
	title?: string;
	state: "input-available" | "output-available" | "output-error";
	input?: unknown;
	output?: unknown;
	errorText?: string;
};

type MessagePart =
	| { type: "text"; text: string }
	| { type: "reasoning"; text: string }
	| { type: "tool"; tool: ToolCallPart };

type ChatMessage = {
	id: string;
	role: "user" | "assistant";
	parts: MessagePart[];
};

type StreamEventHandlers = {
	onText: (text: string) => void;
	onReasoning: (text: string) => void;
	onToolStart: (name: string, input: unknown) => void;
	onToolEnd: (name: string, output: unknown) => void;
	onError: (message: string) => void;
};

// const STREAM_ENDPOINT = `${process.env.NEXT_PUBLIC_AGENT_SERVER_URL}chat/stream`
// const HEALTH_ENDPOINT = `${process.env.NEXT_PUBLIC_AGENT_SERVER_URL}/api/health`
// const STREAM_ENDPOINT = `http://localhost:8000/api/chat/stream`
// const HEALTH_ENDPOINT = `http://localhost:8000/api/health`
const STREAM_ENDPOINT = `https://portfolio-agent-cjji.onrender.com/api/chat/stream`
const HEALTH_ENDPOINT = `https://portfolio-agent-cjji.onrender.com/api/health`
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

function parseEventData(payload: string): unknown | null {
	if (!payload || payload === "[DONE]") {
		return null;
	}

	try {
		return JSON.parse(payload) as unknown;
	} catch {
		return payload;
	}
}

function extractTextFromData(data: unknown): string {
	if (typeof data === "string") {
		return data;
	}

	if (!data || typeof data !== "object") {
		return "";
	}

	const event = data as Record<string, unknown>;

	if (typeof event.text === "string") {
		return event.text;
	}

	if (typeof event.token === "string") {
		return event.token;
	}

	if (typeof event.content === "string") {
		return event.content;
	}

	const delta = event.delta as Record<string, unknown> | undefined;
	if (delta && typeof delta.content === "string") {
		return delta.content;
	}

	const choices = event.choices as Array<Record<string, unknown>> | undefined;
	const choiceDelta = choices?.[0]?.delta as
		| Record<string, unknown>
		| undefined;
	if (choiceDelta && typeof choiceDelta.content === "string") {
		return choiceDelta.content;
	}

	return "";
}

function extractToolName(data: unknown): string {
	if (data && typeof data === "object") {
		const name = (data as Record<string, unknown>).name;
		if (typeof name === "string") {
			return name;
		}
	}
	return "tool";
}

function extractToolValue(data: unknown, key: "input" | "output"): unknown {
	if (data && typeof data === "object") {
		return (data as Record<string, unknown>)[key];
	}
	return undefined;
}

function extractErrorMessage(data: unknown): string {
	if (data && typeof data === "object") {
		const error = (data as Record<string, unknown>).error;
		if (typeof error === "string") {
			return error;
		}
	}
	return "Unknown error";
}

function isDoneSignal(data: unknown): boolean {
	return (
		data === null ||
		(typeof data === "object" &&
			(data as Record<string, unknown>).done === true)
	);
}

function shouldStopStream(eventType: string, doneSignal: boolean) {
	return doneSignal || STOP_EVENT_TYPES.has(eventType);
}

function dispatchStreamEvent(
	eventType: string,
	data: unknown,
	handlers: StreamEventHandlers
): boolean {
	if (
		eventType === "error" ||
		(data &&
			typeof data === "object" &&
			typeof (data as Record<string, unknown>).error === "string")
	) {
		handlers.onError(extractErrorMessage(data));
		return true;
	}

	const text = extractTextFromData(data);

	if (eventType === "reasoning") {
		if (text) {
			handlers.onReasoning(text);
		}
	} else if (eventType === "tool_start") {
		handlers.onToolStart(
			extractToolName(data),
			extractToolValue(data, "input")
		);
	} else if (eventType === "tool_end") {
		handlers.onToolEnd(
			extractToolName(data),
			extractToolValue(data, "output")
		);
	} else if (eventType === "message") {
		if (text) {
			handlers.onText(text);
		}
	} else if (text) {
		handlers.onText(text);
	}

	return shouldStopStream(eventType, isDoneSignal(data));
}

async function streamAssistantResponse(
	responseBody: ReadableStream<Uint8Array>,
	handlers: StreamEventHandlers
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
			const data = parseEventData(payload);

			if (dispatchStreamEvent(eventType, data, handlers)) {
				shouldStop = true;
				break;
			}

			separatorIndex = buffer.indexOf("\n\n");
		}
	}
}

export function Chat() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [agentHealthy, setAgentHealthy] = useState<boolean | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
		null
	);

	const threadIdRef = useRef<string>(createUUIDv4());
	const activeRequestRef = useRef<AbortController | null>(null);

	useEffect(() => {
		const abortController = new AbortController();

		async function runHealthCheck() {
			try {
				const res = await fetch(HEALTH_ENDPOINT, {
					method: "GET",
					signal: abortController.signal,
					headers: { Accept: "application/json" },
				});

				if (res.ok) {
					setAgentHealthy(true);
					return;
				}

				setAgentHealthy(false);
			} catch (err) {
				if ((err as any)?.name === "AbortError") return;
				setAgentHealthy(false);
			}
		}

		// perform health check when the component mounts
		runHealthCheck();

		return () => {
			abortController.abort();
			activeRequestRef.current?.abort();
		};
	}, []);

	const updateAssistantParts = useCallback(
		(
			assistantId: string,
			updater: (parts: MessagePart[]) => MessagePart[]
		) => {
			setMessages((prev) => {
				const targetIndex = prev.findIndex(
					(entry) => entry.id === assistantId
				);
				if (targetIndex === -1) {
					return prev;
				}

				const next = [...prev];
				next[targetIndex] = {
					...next[targetIndex],
					parts: updater(next[targetIndex].parts),
				};

				return next;
			});
		},
		[]
	);

	const appendText = useCallback(
		(assistantId: string, textChunk: string) => {
			if (!textChunk) {
				return;
			}

			updateAssistantParts(assistantId, (parts) => {
				const last = parts.at(-1);
				if (last && last.type === "text") {
					return [
						...parts.slice(0, -1),
						{ ...last, text: last.text + textChunk },
					];
				}

				return [...parts, { type: "text", text: textChunk }];
			});
		},
		[updateAssistantParts]
	);

	const appendReasoning = useCallback(
		(assistantId: string, textChunk: string) => {
			if (!textChunk) {
				return;
			}

			updateAssistantParts(assistantId, (parts) => {
				const last = parts.at(-1);
				if (last && last.type === "reasoning") {
					return [
						...parts.slice(0, -1),
						{ ...last, text: last.text + textChunk },
					];
				}

				return [...parts, { type: "reasoning", text: textChunk }];
			});
		},
		[updateAssistantParts]
	);

	const startTool = useCallback(
		(assistantId: string, name: string, input: unknown) => {
			updateAssistantParts(assistantId, (parts) => [
				...parts,
				{
					type: "tool",
					tool: {
						type: "dynamic-tool",
						toolName: name,
						toolCallId: createUUIDv4(),
						state: "input-available",
						input,
					},
				},
			]);
		},
		[updateAssistantParts]
	);

	const endTool = useCallback(
		(assistantId: string, name: string, output: unknown) => {
			updateAssistantParts(assistantId, (parts) => {
				const next = [...parts];
				for (let i = next.length - 1; i >= 0; i--) {
					const part = next[i];
					if (
						part.type === "tool" &&
						part.tool.toolName === name &&
						part.tool.state === "input-available"
					) {
						next[i] = {
							...part,
							tool: {
								...part.tool,
								state: "output-available",
								output,
							},
						};
						break;
					}
				}

				return next;
			});
		},
		[updateAssistantParts]
	);

	const setAssistantError = useCallback(
		(assistantId: string, message: string) => {
			updateAssistantParts(assistantId, (parts) => {
				const errorText = `Error: ${message}`;
				const last = parts.at(-1);
				if (last && last.type === "text") {
					return [
						...parts.slice(0, -1),
						{ ...last, text: last.text + errorText },
					];
				}

				return [...parts, { type: "text", text: errorText }];
			});
		},
		[updateAssistantParts]
	);

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
			{ id: userId, role: "user", parts: [{ type: "text", text: trimmedText }] },
			{ id: assistantId, role: "assistant", parts: [] },
		]);
		setStreamingMessageId(assistantId);
		setIsLoading(true);

		try {
			const response = await fetch(STREAM_ENDPOINT, {
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

			await streamAssistantResponse(response.body, {
				onText: (chunk) => appendText(assistantId, chunk),
				onReasoning: (chunk) => appendReasoning(assistantId, chunk),
				onToolStart: (name, input) => startTool(assistantId, name, input),
				onToolEnd: (name, output) => endTool(assistantId, name, output),
				onError: (message) => setAssistantError(assistantId, message),
			});
		} catch (error) {
			if (abortController.signal.aborted) {
				return;
			}

			const message =
				error instanceof Error
					? error.message
					: "Failed to connect to the chat stream";

			setAssistantError(assistantId, message);
		} finally {
			setIsLoading(false);
			setStreamingMessageId(null);
			if (activeRequestRef.current === abortController) {
				activeRequestRef.current = null;
			}
		}
	};

	return (
			<div className="flex h-[80dvh] min-h-[460px] max-h-[760px] flex-col overflow-hidden rounded-xl bg-background shadow-sm">
				<Conversation className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
					<ConversationContent className="gap-3 p-3 sm:p-4">
					{messages.length === 0 ? (
						<ConversationEmptyState
							className="px-4 py-8"
							title="Start the conversation"
							description="Ask anything about my work, experience, or explore ways we can collaborate."
						/>
					) : null}

				{messages.map((msg) => {
					if (msg.role === "user") {
						return (
							<Message key={msg.id} from="user">
								<MessageContent className="text-[13px] leading-relaxed group-[.is-user]:px-3 group-[.is-user]:py-2.5 sm:text-sm">
									{msg.parts
										.filter((part) => part.type === "text")
										.map((part) => part.text)
										.join("")}
								</MessageContent>
							</Message>
						);
					}

					const isStreaming =
						isLoading && streamingMessageId === msg.id;

					return (
						<Message key={msg.id} from="assistant">
							<MessageContent className="text-[13px] leading-relaxed sm:text-sm">
								{msg.parts.map((part, index) => {
									if (part.type === "reasoning") {
										return (
											<Reasoning
												key={index}
												isStreaming={isStreaming}
											>
												<ReasoningTrigger />
												<ReasoningContent>
													{part.text}
												</ReasoningContent>
											</Reasoning>
										);
									}

									if (part.type === "tool") {
										return (
											<Tool key={index} defaultOpen={true}>
												<ToolHeader
													type="dynamic-tool"
													state={part.tool.state}
													toolName={part.tool.toolName}
												/>
												<ToolContent>
													{part.tool.input !==
														undefined && (
														<ToolInput
															input={part.tool.input}
														/>
													)}
													<ToolOutput
														output={part.tool.output}
														errorText={
															part.tool.errorText
														}
													/>
												</ToolContent>
											</Tool>
										);
									}

									return (
										<MessageResponse key={index}>
											{part.text}
										</MessageResponse>
									);
								})}
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
	);
}
