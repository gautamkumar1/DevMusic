"use client"
import React, { useEffect, useState } from 'react';

interface ContributionDay {
  date: string;
  count: number;
}

interface ContributionGraphProps {
  data: ContributionDay[];
}

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ContributionGraph: React.FC<ContributionGraphProps> = ({ data }) => {
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [visibleMonths, setVisibleMonths] = useState(12);
  const [startMonth, setStartMonth] = useState(0);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  interface TooltipPosition {
    x: number;
    y: number;
  }

  const getContributionLevel = (count: number): string => {
    if (count === 0) return 'bg-gray-800';
    if (count <= 3) return 'bg-orange-900';
    if (count <= 6) return 'bg-orange-700';
    if (count <= 9) return 'bg-orange-500';
    return 'bg-orange-300';
  };

  // Updated to generate 2025 data
  const generate2025Data = () => {
    const weeks = [];
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-12-31');
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        if (currentDate <= endDate) {
          const dateString = currentDate.toISOString().split('T')[0];
          const contribution = data.find(d => d.date === dateString);
          
          weekData.push({
            date: dateString,
            count: contribution?.count || 0,
            month: currentDate.getMonth()
          });
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      if (weekData.length > 0) {
        weeks.push(weekData);
      }
    }
    return weeks;
  };

  const yearData = generate2025Data();

  // Get visible weeks based on current start month and number of visible months
  const getVisibleWeeks = () => {
    const startDate = new Date(2025, startMonth, 1);
    const endDate = new Date(2025, startMonth + visibleMonths, 0);
    
    return yearData.filter(week => {
      const weekDate = new Date(week[0].date);
      return weekDate >= startDate && weekDate <= endDate;
    });
  };

  // Get month labels for currently visible range
  const getVisibleMonthLabels = () => {
    const labels = [];
    for (let i = 0; i < visibleMonths; i++) {
      const monthIndex = (startMonth + i) % 12;
      const date = new Date(2025, monthIndex, 1);
      labels.push(
        date.toLocaleString('en-US', { month: 'short' })
      );
    }
    return labels;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleMonths(3);
      } else if (window.innerWidth < 768) {
        setVisibleMonths(6);
      } else if (window.innerWidth < 1024) {
        setVisibleMonths(9);
      } else {
        setVisibleMonths(12);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, day: { date: any; count: any; month?: number; }) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top
    });
    setTooltipContent(`${day.count} songs on ${formatDate(day.date)}`);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const visibleWeeks = getVisibleWeeks();
  const monthLabels = getVisibleMonthLabels();

  return (
    <Card className="w-full bg-gray-900">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold text-white">2025 Listening Activity</CardTitle>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setStartMonth(Math.max(0, startMonth - 1))}
            disabled={startMonth === 0}
            className="p-1 rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={() => setStartMonth(Math.min(12 - visibleMonths, startMonth + 1))}
            disabled={startMonth >= 12 - visibleMonths}
            className="p-1 rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-hidden">
          <div className="contribution-container relative">
            
            <div className="flex">
              {/* Days of week labels */}
              <div className="flex flex-col gap-1 text-xs text-gray-400 mr-2">
                {weekDays.map((day, index) => (
                  <div key={day} className="h-3 flex items-center">
                    {index % 2 === 0 && day}
                  </div>
                ))}
              </div>
              
              {/* Contribution grid */}
              <div className="flex gap-1 flex-grow">
                {visibleWeeks.map((week, weekIndex) => (
                  <div key={`week-${weekIndex}-${week[0].date}`} className="flex flex-col gap-1 flex-1">
                    {week.map((day) => (
                      <div
                        key={day.date}
                        className={`aspect-square ${getContributionLevel(day.count)} rounded-sm 
                          hover:ring-2 hover:ring-white hover:ring-opacity-50 transition-all cursor-pointer`}
                        onMouseEnter={(e) => handleMouseMove(e, day)}
                        onMouseLeave={() => setTooltipContent(null)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Tooltip */}
            {tooltipContent && (
              <div
                className="fixed bg-gray-800 text-white px-3 py-2 rounded-md text-sm z-10 pointer-events-none transform -translate-x-1/2 -translate-y-full"
                style={{
                  left: `${tooltipPosition.x}px`,
                  top: `${tooltipPosition.y - 8}px`,
                }}
              >
                {tooltipContent}
              </div>
            )}

            {/* Legend */}
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-400 justify-center">
              <span>Less</span>
              <div className="w-3 h-3 bg-gray-800 rounded-sm" />
              <div className="w-3 h-3 bg-orange-900 rounded-sm" />
              <div className="w-3 h-3 bg-orange-700 rounded-sm" />
              <div className="w-3 h-3 bg-orange-500 rounded-sm" />
              <div className="w-3 h-3 bg-orange-300 rounded-sm" />
              <span>More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


export default ContributionGraph;