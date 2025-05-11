import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

const CodeEditor = ({ value, language, onChange, editorRef }) => {
  const containerRef = useRef(null);
  const monacoRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Initialize Monaco editor
      monacoRef.current = monaco.editor.create(containerRef.current, {
        value: value || '',
        language: language || 'javascript',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: {
          enabled: true
        },
        scrollBeyondLastLine: false,
        fontSize: 14,
        tabSize: 2,
      });

      // Set up change event handler
      monacoRef.current.onDidChangeModelContent(() => {
        onChange(monacoRef.current.getValue());
      });

      // Expose editor instance through ref
      if (editorRef) {
        editorRef.current = monacoRef.current;
      }
    }

    return () => {
      if (monacoRef.current) {
        monacoRef.current.dispose();
      }
    };
  }, []);

  // Update editor value when prop changes
  useEffect(() => {
    if (monacoRef.current && value !== monacoRef.current.getValue()) {
      monacoRef.current.setValue(value || '');
    }
  }, [value]);

  // Update editor language when prop changes
  useEffect(() => {
    if (monacoRef.current) {
      const model = monacoRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language || 'javascript');
      }
    }
  }, [language]);

  return <div ref={containerRef} className="flex-1" />;
};

export default CodeEditor;