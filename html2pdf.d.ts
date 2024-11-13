declare module 'html2pdf.js' {
    interface Html2PdfOptions {
        margin?: number | [number, number, number, number];
        filename?: string;
        image?: {
            type?: string;
            quality?: number;
        };
        enableLinks?: boolean;
        html2canvas?: {
            scale?: number;
            useCORS?: boolean;
            logging?: boolean;
            [key: string]: unknown;
        };
        jsPDF?: {
            unit?: string;
            format?: string | [number, number];
            orientation?: 'portrait' | 'landscape';
            [key: string]: unknown;
        };
        pagebreak?: {
            mode?: string;
            before?: string[];
            after?: string[];
            avoid?: string[];
            [key: string]: unknown;
        };
    }

    interface Html2PdfInstance {
        set(opt: Html2PdfOptions): Html2PdfInstance;
        from(element: HTMLElement | string): Html2PdfInstance;
        save(): Promise<void>;
        output(type: string, options?: unknown): Promise<unknown>;
        then(callback: (instance: Html2PdfInstance) => void): Promise<unknown>;
        catch(callback: (error: Error) => void): Promise<unknown>;
    }

    interface Html2PdfStatic {
        (opts?: Html2PdfOptions): Html2PdfInstance;
    }

    const html2pdf: Html2PdfStatic;
    export default html2pdf;
}
