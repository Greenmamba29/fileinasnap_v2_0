
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Sparkles, FileText, Image, Users, Radar, FolderPlus, BookOpen, Eye } from 'lucide-react';
import { type UserPlan } from '@/lib/featureConfig';

interface MemoryAssistantProps {
  user: UserPlan;
}

const MemoryAssistant = ({ user }: MemoryAssistantProps) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [enhancedQuery, setEnhancedQuery] = useState('');
  const [confidence, setConfidence] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [showInsights, setShowInsights] = useState(false);
  const [language, setLanguage] = useState('en');
  const [hoveredResult, setHoveredResult] = useState<string | null>(null);
  
  // Mock user plan - in real app, this would come from auth/context
  const userPlan = 'pro'; // 'standard', 'pro', 'veteran', 'enterprise'
  
  const isPlanGated = !['pro', 'veteran', 'enterprise'].includes(userPlan);

  const mockResults = [
    {
      id: '1',
      title: 'Christmas Morning 2023.jpg',
      suggestedFolder: 'Family/Holidays',
      confidence: 'high',
      type: 'image'
    },
    {
      id: '2',
      title: 'Tax Return Draft.pdf',
      suggestedFolder: 'Documents/Finance',
      confidence: 'medium',
      type: 'document'
    },
    {
      id: '3',
      title: 'Sarah Birthday Video',
      suggestedFolder: 'People/Sarah',
      confidence: 'high',
      type: 'video'
    }
  ];

  const searchHistory = [
    { query: 'Christmas photos', timestamp: '2 hours ago' },
    { query: 'Tax documents', timestamp: '1 day ago' },
    { query: 'Sarah birthday', timestamp: '3 days ago' }
  ];

  const handleSearch = (searchQuery: string = query) => {
    if (isPlanGated) {
      alert('SnapBot is available on Pro plans and above. Upgrade to unlock AI-powered search!');
      return;
    }
    
    setIsSearching(true);
    setEnhancedQuery(`Enhanced: "${searchQuery}" → searching across files, journals, and relationships`);
    
    setTimeout(() => {
      setIsSearching(false);
      setResults(mockResults);
      setConfidence('high');
    }, 1500);
  };

  const moveToFolder = (itemId: string) => {
    console.log(`Moving item ${itemId} to suggested folder`);
  };

  const addToJournal = (itemId: string) => {
    console.log(`Adding item ${itemId} to journal`);
  };

  const getConfidenceColor = (conf: string) => {
    switch(conf) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="p-6 hover-lift animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-2xl">🫰</span>
          <h2 className="text-xl font-space font-semibold text-gray-900">
            SnapBot Assistant
          </h2>
        </div>
        <p className="text-gray-600">AI-powered memory search with fallback logic</p>
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <Input
            placeholder="What are you trying to remember?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pr-12 py-3 text-base"
          />
          <Button
            size="sm"
            onClick={() => handleSearch()}
            disabled={!query.trim() || isSearching}
            className="absolute right-1 top-1 bottom-1 px-3"
          >
            {isSearching ? (
              <div className="flex items-center space-x-1">
                <Radar className="w-4 h-4 animate-spin" />
                <div className="w-1 h-1 bg-white rounded-full animate-ping" />
              </div>
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        {/* Enhanced Query Display */}
        {enhancedQuery && (
          <div className="p-3 bg-blue-50 rounded-lg animate-fade-in">
            <p className="text-sm text-blue-700 font-medium">Enhanced Query:</p>
            <p className="text-blue-600">{enhancedQuery}</p>
          </div>
        )}

        {/* Confidence Badge */}
        {confidence && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">AI Confidence:</span>
            <Badge className={getConfidenceColor(confidence)}>
              {confidence.charAt(0).toUpperCase() + confidence.slice(1)}
            </Badge>
          </div>
        )}

        {/* Results List */}
        {results.length > 0 && (
          <div className="space-y-3 animate-slide-up">
            <h3 className="text-lg font-semibold text-gray-900">Search Results</h3>
            {results.map((result) => (
              <div
                key={result.id}
                className={`p-4 border rounded-lg transition-all duration-200 ${
                  hoveredResult === result.id ? 'shadow-lg border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onMouseEnter={() => setHoveredResult(result.id)}
                onMouseLeave={() => setHoveredResult(null)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{result.title}</h4>
                  <Badge className={getConfidenceColor(result.confidence)}>
                    {result.confidence}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">Suggested Folder: {result.suggestedFolder}</p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveToFolder(result.id)}
                    className="flex items-center space-x-1"
                  >
                    <FolderPlus className="w-3 h-3" />
                    <span>Move to Folder</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addToJournal(result.id)}
                    className="flex items-center space-x-1"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>Add to Journal</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Insights Toggle */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <label className="text-sm font-medium text-gray-700">Show AI Insights</label>
            <p className="text-xs text-gray-500">See why each result was selected and which agent helped</p>
          </div>
          <Switch
            checked={showInsights}
            onCheckedChange={setShowInsights}
          />
        </div>

        {/* Language Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Language</label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="pt">Português</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
              <SelectItem value="jp">日本語</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="ru">Русский</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Memory Trail History */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Memory Trail</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {searchHistory.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm animate-fade-slide"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-gray-700">"{item.query}"</span>
                <span className="text-gray-500 text-xs">{item.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
        
        {isSearching && (
          <div className="p-4 bg-blue-50 rounded-lg animate-pulse">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-blue-700">SnapBot is searching across files, journals, and relationships...</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MemoryAssistant;
