"use client"
import React, { useEffect, useState } from 'react';

interface ContributionDay {
  date: string;
  count: number;
}

interface ContributionGraphProps {
  data: ContributionDay[];
}

const ContributionGraph = ({ data }: ContributionGraphProps) => {
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const getContributionLevel = (count: number): string => {
    if (count === 0) return 'bg-gray-800';
    if (count <= 3) return 'bg-orange-900';
    if (count <= 6) return 'bg-orange-700';
    if (count <= 9) return 'bg-orange-500';
    return 'bg-orange-300';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Generate data for 2024
  const generate2024Data = () => {
    const weeks = [];
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-12-31');
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

  const yearData = generate2024Data();

  const handleMouseMove = (e: React.MouseEvent, day: ContributionDay) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = e.currentTarget.closest('.contribution-container')?.getBoundingClientRect();
    
    if (containerRect) {
      setTooltipPosition({
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top
      });
    }
    
    setTooltipContent(
      `${day.count} songs on ${formatDate(day.date)}`
    );
  };

  // Get month label positions
  const getMonthLabels = () => {
    const months: { [key: number]: number } = {};
    yearData.forEach((week, weekIndex) => {
      week.forEach(day => {
        const month = new Date(day.date).getMonth();
        if (months[month] === undefined) {
          months[month] = weekIndex;
        }
      });
    });
    return months;
  };

  const monthLabels = getMonthLabels();
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-6 bg-gray-900 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-6">2024 Listening Activity</h2>
      <div className="contribution-container relative">
        {/* Month labels */}
        <div className="flex gap-2 mb-2">
          <div className="w-8" /> {/* Spacing for day labels */}
          <div className="flex relative w-full">
            {Object.entries(monthLabels).map(([month, weekIndex]) => (
              <div
                key={month}
                className="absolute text-sm text-gray-400"
                style={{ left: `${weekIndex * 20}px` }}
              >
                {monthNames[parseInt(month)]}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          {/* Days of week labels */}
          <div className="flex flex-col gap-2 text-sm text-gray-400">
            {weekDays.map((day, index) => (
              <div key={day} className="h-3 flex items-center">
                {index % 2 === 0 && day}
              </div>
            ))}
          </div>
          
          {/* Contribution grid */}
          <div className="flex gap-2">
            {yearData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-2">
                {week.map((day) => (
                  <div
                    key={day.date}
                    className={`w-3 h-3 ${getContributionLevel(day.count)} rounded-sm 
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
            className="absolute bg-gray-800 text-white px-3 py-2 rounded-md text-sm z-10 pointer-events-none"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y - 40}px`,
              transform: 'translateX(-50%)',
            }}
          >
            {tooltipContent}
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
          <span>Less</span>
          <div className={`w-3 h-3 bg-orange-800 rounded-sm`} />
          <div className={`w-3 h-3 bg-orange-900 rounded-sm`} />
          <div className={`w-3 h-3 bg-orange-700 rounded-sm`} />
          <div className={`w-3 h-3 bg-orange-500 rounded-sm`} />
          <div className={`w-3 h-3 bg-orange-300 rounded-sm`} />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default ContributionGraph;