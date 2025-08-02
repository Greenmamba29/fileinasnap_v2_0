
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Mic, Calendar, Heart, Zap, Coffee, Sun } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const JournalView = () => {
  const [selectedEntry, setSelectedEntry] = useState(null);
  
  const journalEntries = [
    {
      id: 1,
      date: '2024-01-15',
      title: 'Morning Coffee Thoughts',
      summary: 'Reflected on the week ahead and felt optimistic about new projects...',
      emotion: 'positive',
      emoji: '☀️',
      color: 'bg-emerald-100 border-emerald-200',
      full_content: 'Had my morning coffee while watching the sunrise. There\'s something magical about those quiet moments before the world wakes up. Feeling grateful for the opportunities ahead this week.'
    },
    {
      id: 2,
      date: '2024-01-14',
      title: 'Family Dinner',
      summary: 'Wonderful evening with loved ones, lots of laughter and stories...',
      emotion: 'joyful',
      emoji: '❤️',
      color: 'bg-rose-100 border-rose-200',
      full_content: 'Family dinner was amazing tonight. Mom made her famous lasagna and we spent hours just talking and laughing. These moments remind me what truly matters in life.'
    },
    {
      id: 3,
      date: '2024-01-13',
      title: 'Work Challenges',
      summary: 'Dealing with some project setbacks, but found new solutions...',
      emotion: 'neutral',
      emoji: '⚡',
      color: 'bg-amber-100 border-amber-200',
      full_content: 'Today was challenging at work. The client requested major changes to the project, but after brainstorming with the team, we found an even better approach. Sometimes obstacles lead to breakthroughs.'
    },
    {
      id: 4,
      date: '2024-01-12',
      title: 'Peaceful Walk',
      summary: 'Took a long walk in the park, clear mind and fresh perspective...',
      emotion: 'calm',
      emoji: '🍃',
      color: 'bg-green-100 border-green-200',
      full_content: 'Needed to clear my head so I took a long walk through Central Park. The fresh air and movement helped me gain perspective on recent decisions. Nature has a way of putting things in perspective.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-space font-bold text-gray-900 mb-2">
            Journal Timeline
          </h1>
          <p className="text-gray-600 text-lg">Your thoughts, memories, and moments</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-2xl hover-lift glow-blue">
            <Plus className="w-5 h-5 mr-2" />
            Add Journal
          </Button>
          <Button variant="outline" className="border-2 border-gray-300 hover:bg-gray-50 font-semibold px-6 py-3 rounded-2xl hover-lift">
            <Mic className="w-5 h-5 mr-2" />
            Voice Entry
          </Button>
          <Button variant="outline" className="border-2 border-gray-300 hover:bg-gray-50 font-semibold px-6 py-3 rounded-2xl hover-lift">
            <Calendar className="w-5 h-5 mr-2" />
            Summarize All
          </Button>
        </div>

        {/* Horizontal Timeline */}
        <ScrollArea className="w-full">
          <div className="flex gap-6 pb-4 min-w-max">
            {journalEntries.map((entry, index) => (
              <Dialog key={entry.id}>
                <DialogTrigger asChild>
                  <Card 
                    className={`w-80 ${entry.color} cursor-pointer hover-lift transition-all duration-300 hover:scale-105 animate-fade-in`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="text-2xl">{entry.emoji}</div>
                        <span className="text-sm text-gray-500 font-medium">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                      <CardTitle className="text-lg font-space text-gray-900">
                        {entry.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {entry.summary}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                          ${entry.emotion === 'positive' ? 'bg-emerald-200 text-emerald-800' : 
                            entry.emotion === 'joyful' ? 'bg-rose-200 text-rose-800' :
                            entry.emotion === 'neutral' ? 'bg-amber-200 text-amber-800' :
                            'bg-green-200 text-green-800'}`}>
                          {entry.emotion}
                        </span>
                        <span className="text-xs text-gray-500">Click to expand</span>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{entry.emoji}</span>
                      <div>
                        <DialogTitle className="text-2xl font-space">
                          {entry.title}
                        </DialogTitle>
                        <p className="text-gray-500">
                          {new Date(entry.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {entry.full_content}
                    </p>
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium capitalize
                        ${entry.emotion === 'positive' ? 'bg-emerald-100 text-emerald-800' : 
                          entry.emotion === 'joyful' ? 'bg-rose-100 text-rose-800' :
                          entry.emotion === 'neutral' ? 'bg-amber-100 text-amber-800' :
                          'bg-green-100 text-green-800'}`}>
                        Emotion: {entry.emotion}
                      </span>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </ScrollArea>

        {/* Memory Capsule CTA */}
        <div className="mt-12 text-center">
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <h3 className="text-2xl font-space font-semibold text-gray-900 mb-2">
              Create a Memory Capsule
            </h3>
            <p className="text-gray-600 mb-6">
              Let AI weave your journal entries into a beautiful narrative
            </p>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold px-8 py-3 rounded-2xl hover-lift glow-blue">
              <Zap className="w-5 h-5 mr-2" />
              Trigger Memory Capsule
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JournalView;
