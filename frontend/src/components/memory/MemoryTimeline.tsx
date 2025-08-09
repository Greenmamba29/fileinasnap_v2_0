
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Heart, Briefcase, GraduationCap, Camera, FileText, Calendar as CalendarIcon } from 'lucide-react';

const MemoryTimeline = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<'vertical' | 'horizontal'>('vertical');

  const memories = [
    {
      id: 1,
      date: '2024-01-15',
      type: 'journal',
      title: 'Morning Reflections',
      theme: 'family',
      icon: Heart,
      color: 'bg-rose-500',
      borderColor: 'border-rose-200',
      bgColor: 'bg-rose-50',
      content: 'Started the day with gratitude for family moments...',
      media: null
    },
    {
      id: 2,
      date: '2024-01-14',
      type: 'file',
      title: 'Team Meeting Photos',
      theme: 'work',
      icon: Briefcase,
      color: 'bg-blue-500',
      borderColor: 'border-blue-200',
      bgColor: 'bg-blue-50',
      content: 'Quarterly review meeting with the whole team',
      media: 'image'
    },
    {
      id: 3,
      date: '2024-01-10',
      type: 'journal',
      title: 'Learning Journey',
      theme: 'milestone',
      icon: GraduationCap,
      color: 'bg-emerald-500',
      borderColor: 'border-emerald-200',
      bgColor: 'bg-emerald-50',
      content: 'Completed my certification course today...',
      media: null
    },
    {
      id: 4,
      date: '2024-01-08',
      type: 'file',
      title: 'Vacation Memories',
      theme: 'family',
      icon: Camera,
      color: 'bg-purple-500',
      borderColor: 'border-purple-200',
      bgColor: 'bg-purple-50',
      content: 'Beach trip with family - amazing sunset photos',
      media: 'video'
    },
    {
      id: 5,
      date: '2024-01-05',
      type: 'file',
      title: 'Project Documentation',
      theme: 'work',
      icon: FileText,
      color: 'bg-amber-500',
      borderColor: 'border-amber-200',
      bgColor: 'bg-amber-50',
      content: 'Final project delivery documents',
      media: 'document'
    }
  ];

  const years = [2024, 2023, 2022, 2021];
  const themes = ['all', 'family', 'work', 'milestone'];

  const getMediaIcon = (media: string | null) => {
    if (media === 'image') return <Camera className="w-4 h-4" />;
    if (media === 'video') return <Camera className="w-4 h-4" />;
    if (media === 'document') return <FileText className="w-4 h-4" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-space font-bold text-gray-900 mb-2">
            Memory Timeline
          </h1>
          <p className="text-gray-600 text-lg">Your journey through moments and memories</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          {/* Date Picker */}
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-gray-500" />
            <select 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Theme Filter */}
          <div className="flex gap-2">
            {themes.map(theme => (
              <Button
                key={theme}
                variant={theme === 'all' ? 'default' : 'outline'}
                size="sm"
                className="capitalize"
              >
                {theme}
              </Button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('vertical')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'vertical' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Vertical
            </button>
            <button
              onClick={() => setViewMode('horizontal')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'horizontal' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Horizontal
            </button>
          </div>
        </div>

        {/* Timeline */}
        {viewMode === 'vertical' ? (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"></div>
            
            <div className="space-y-8">
              {memories.map((memory, index) => {
                const IconComponent = memory.icon;
                return (
                  <div 
                    key={memory.id}
                    className="relative flex items-start animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Timeline Node */}
                    <div className={`absolute left-6 w-4 h-4 ${memory.color} rounded-full border-4 border-white shadow-lg z-10`}></div>
                    
                    {/* Content Card */}
                    <div className="ml-16 w-full">
                      <Card className={`${memory.bgColor} ${memory.borderColor} border-2 hover-lift transition-all duration-300 hover:scale-105`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 ${memory.color} rounded-lg`}>
                                <IconComponent className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <CardTitle className="text-lg font-space text-gray-900">
                                  {memory.title}
                                </CardTitle>
                                <p className="text-sm text-gray-500 capitalize">
                                  {memory.theme} • {memory.type}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-600">
                                {new Date(memory.date).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </p>
                              {memory.media && (
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                  {getMediaIcon(memory.media)}
                                  <span>{memory.media}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700">
                            {memory.content}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <ScrollArea className="w-full">
            <div className="flex gap-6 pb-4 min-w-max">
              {memories.map((memory, index) => {
                const IconComponent = memory.icon;
                return (
                  <Card 
                    key={memory.id}
                    className={`w-80 ${memory.bgColor} ${memory.borderColor} border-2 hover-lift transition-all duration-300 hover:scale-105 animate-fade-in`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 ${memory.color} rounded-lg`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg font-space text-gray-900">
                            {memory.title}
                          </CardTitle>
                          <p className="text-sm text-gray-500 capitalize">
                            {memory.theme} • {memory.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">
                          {new Date(memory.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        {memory.media && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            {getMediaIcon(memory.media)}
                            <span>{memory.media}</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 text-sm">
                        {memory.content}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default MemoryTimeline;
