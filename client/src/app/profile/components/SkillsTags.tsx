import React from 'react';

interface SkillsTagsProps {
  skills: string[];
}

const SkillsTags = ({ skills }: SkillsTagsProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {skills.map((skill) => (
        <span
          key={skill}
          className="px-3 py-1 bg-orange-500 bg-opacity-20 text-orange-400 rounded-full text-sm"
        >
          {skill}
        </span>
      ))}
    </div>
  );
};

export default SkillsTags;