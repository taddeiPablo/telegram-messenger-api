export interface AutoResponseProvider {
    getMessage(): string; // Para obtener el mensaje configurado (ej: desde DB o memoria)
}