import React from 'react';

type FilterType = 'All' | 'Veg' | 'Non-Veg';

interface VegToggleProps {
    currentFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
}

const VegToggle: React.FC<VegToggleProps> = ({ currentFilter, onFilterChange }) => {
    return (
        <div className="flex justify-center mb-12">
            <div className="inline-flex p-1 bg-zinc-900/50 backdrop-blur-md rounded-full border border-zinc-800 shadow-2xl">
                {(['All', 'Veg', 'Non-Veg'] as FilterType[]).map((filter) => (
                    <button
                        key={filter}
                        onClick={() => onFilterChange(filter)}
                        className={`
              px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${currentFilter === filter
                                ? 'bg-amber-500 text-black shadow-lg scale-105'
                                : 'text-zinc-400 hover:text-white hover:bg-white/5'}
            `}
                    >
                        {filter}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default VegToggle;
