// import-export.js - State import/export component
function ImportExport({ onImport, onExport }) {
    const [importText, setImportText] = useState('');
    const [importFeedback, setImportFeedback] = useState('');

    const handleExportOrImport = () => {
        if (importText.trim()) {
            try {
                onImport(importText);
                setImportText('');
                setImportFeedback('Import succeeded');
                setTimeout(() => setImportFeedback(''), 2000);
            } catch (error) {
                setImportFeedback('Import FAILED');
                setTimeout(() => setImportFeedback(''), 3000);
            }
        } else {
            const stateString = onExport();
            navigator.clipboard.writeText(stateString);
            setImportFeedback('Copied to clipboard');
            setTimeout(() => setImportFeedback(''), 2000);
        }
    };

    return (
        <div className="mt-4 pt-3 border-t flex gap-4 items-center">
            <button 
                onClick={handleExportOrImport}
                className="px-3 py-1 rounded bg-blue-500 text-white text-sm"
            >
                {importText.trim() ? 'Import State' : 'Export State'}
            </button>
            <textarea
                value={importText}
                onChange={e => setImportText(e.target.value)}
                placeholder={importFeedback || "To import, paste state string here..."}
                className="flex-1 px-2 py-1 border rounded text-sm resize-none"
                rows={1}
            />
        </div>
    );
}