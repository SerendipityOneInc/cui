export interface GeminiHealthResponse {
    status: 'healthy' | 'unhealthy';
    message: string;
    apiKeyValid: boolean;
}
export interface GeminiTranscribeRequest {
    audio: string;
    mimeType: string;
}
export interface GeminiTranscribeResponse {
    text: string;
}
export interface GeminiSummarizeRequest {
    text: string;
}
export interface GeminiSummarizeResponse {
    title: string;
    keypoints: string[];
}
export declare class GeminiService {
    private logger;
    private genAI;
    private model;
    constructor();
    initialize(): Promise<void>;
    checkHealth(): Promise<GeminiHealthResponse>;
    transcribe(audio: string, mimeType: string): Promise<GeminiTranscribeResponse>;
    summarize(text: string): Promise<GeminiSummarizeResponse>;
}
export declare const geminiService: GeminiService;
//# sourceMappingURL=gemini-service.d.ts.map