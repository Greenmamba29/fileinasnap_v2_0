import React, { useEffect, useMemo, useState } from 'react';
import { Filter, X, Calendar, Tag, Folder as FolderIcon, Image, FileText, Video } from 'lucide-react';

export default function FilterPanel({
  open,
  onClose,
  folders = [],
  onApply,
  initialFilters = {}
}) {
  const [type, setType] = useState(initialFilters.type || '');
  const [folderId, setFolderId] = useState(initialFilters.folder_id || '');
  const [dateFrom, setDateFrom] = useState(initialFilters.date_from || '');
  const [dateTo, setDateTo] = useState(initialFilters.date_to || '');
  const [tag, setTag] = useState(initialFilters.tag || '');

  useEffect(() => {
    setType(initialFilters.type || '');
    setFolderId(initialFilters.folder_id || '');
    setDateFrom(initialFilters.date_from || '');
    setDateTo(initialFilters.date_to || '');
    setTag(initialFilters.tag || '');
  }, [initialFilters]);

  const apply = () => {
    const filters = {};
    if (type) filters.type = type;
    if (folderId) filters.folder_id = folderId;
    if (dateFrom) filters.date_from = dateFrom;
    if (dateTo) filters.date_to = dateTo;
    if (tag) filters.tag = tag;
    onApply?.(filters);
  };

  const clear = () => {
    setType('');
    setFolderId('');
    setDateFrom('');
    setDateTo('');
    setTag('');
    onApply?.({});
  };

  return (
    <div className={`fixed top-16 left-0 right-0 z-20 transition-all ${open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
              </div>
              <button onClick={onClose} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Type */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { key: '', label: 'All', icon: null },
                    { key: 'image', label: 'Images', icon: Image },
                    { key: 'video', label: 'Videos', icon: Video },
                    { key: 'document', label: 'Docs', icon: FileText }
                  ].map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setType(opt.key)}
                      className={`flex items-center justify-center gap-1 px-2 py-2 rounded border text-sm transition-colors ${type === opt.key ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300' : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                      {opt.icon ? <opt.icon className="w-4 h-4" /> : null}
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Folder */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Folder</label>
                <div className="relative">
                  <FolderIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={folderId}
                    onChange={(e) => setFolderId(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">All folders</option>
                    {folders.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date range */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Date range</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full pl-10 pr-3 py-2 rounded border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
                  </div>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full pl-10 pr-3 py-2 rounded border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
                  </div>
                </div>
              </div>

              {/* Tag */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Tag</label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="e.g. beach, birthday"
                    className="w-full pl-10 pr-3 py-2 rounded border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-4">
              <button onClick={clear} className="px-4 py-2 rounded border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Clear</button>
              <button onClick={apply} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md">Apply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

