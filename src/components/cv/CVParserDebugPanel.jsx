import React, { useState } from 'react';
import { Copy, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function CVParserDebugPanel({ 
  rawText, 
  confidence, 
  isOpen, 
  onClose 
}) {
  const [copySuccess, setCopySuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopyText = () => {
    navigator.clipboard.writeText(rawText || '')
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col border border-slate-200 shadow-lg">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-900">CV Parser Debug Information</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-200">
            <XCircle className="h-5 w-5 text-slate-600" />
          </Button>
        </div>

        <div className="p-6 overflow-auto flex-grow">
          {confidence !== undefined && (
            <div className="mb-6">
              <p className="text-sm font-medium mb-2 text-slate-700">
                Parser Confidence: <span className="text-slate-900">{confidence}%</span>
              </p>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    confidence >= 80 ? 'bg-green-500' : 
                    confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {confidence >= 80 ? 'High confidence - parsing should be accurate' :
                 confidence >= 60 ? 'Medium confidence - review extracted data' :
                 'Low confidence - manual review recommended'}
              </p>
            </div>
          )}

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-medium text-slate-700">Extracted Raw Text:</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs flex items-center gap-1 hover:bg-slate-50"
                onClick={handleCopyText}
              >
                <Copy className="h-3.5 w-3.5" />
                Copy Text
              </Button>
            </div>
            <Textarea 
              value={rawText || 'No text was extracted from the document.'}
              readOnly
              className="h-80 font-mono text-xs bg-slate-50 border-slate-200 resize-none"
              placeholder="Raw extracted text will appear here..."
            />
          </div>

          {copySuccess && (
            <Alert className="bg-green-50 border-green-200 text-green-800 mb-6">
              <AlertDescription className="text-sm">
                ✅ Text copied to clipboard successfully!
              </AlertDescription>
            </Alert>
          )}

          <div className="text-sm text-slate-600 space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">💡 How to Use This Debug Information</h4>
            <div className="space-y-2">
              <p>
                <strong className="text-blue-800">What is this?</strong> This shows the raw text extracted from your CV document.
              </p>
              <p>
                <strong className="text-blue-800">Why is this useful?</strong> If the CV parser isn't correctly identifying your information, 
                this can help you understand why and how to format your CV for better results.
              </p>
              <p>
                <strong className="text-blue-800">How to use this:</strong> Check if your CV content was properly extracted. If sections are 
                missing or incorrect, you might need to adjust your CV format or manually enter the information.
              </p>
              <p>
                <strong className="text-blue-800">Tips for better parsing:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-xs">
                <li>Use clear section headers (Experience, Education, Skills)</li>
                <li>Avoid complex formatting, tables, or graphics</li>
                <li>Ensure text is selectable (not embedded in images)</li>
                <li>Use standard fonts and readable text sizes</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <Button onClick={onClose} className="w-full bg-slate-900 hover:bg-slate-800 text-white">
            Close Debug Panel
          </Button>
        </div>
      </Card>
    </div>
  );
}
