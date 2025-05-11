import { useRef, useEffect } from 'react';

const Terminal = ({ output }) => {
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="h-48 bg-black border-t border-gray-700 overflow-auto">
      <div className="p-2 flex items-center bg-gray-900 border-b border-gray-800">
        <div className="flex space-x-1 mr-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-xs text-gray-400">Terminal</span>
      </div>
      <pre 
        ref={terminalRef}
        className="p-3 text-sm font-mono text-green-400 overflow-auto h-36"
      >
        {output || '> Ready'}
      </pre>
    </div>
  );
};

export default Terminal;