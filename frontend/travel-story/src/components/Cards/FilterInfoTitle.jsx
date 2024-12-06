import React from 'react';
import moment from 'moment';
import { MdOutlineClose } from 'react-icons/md';

const FilterInfoTitle = ({ filterType, filterDates, onClear }) => {

  const DateRangeChip = ({ date }) => {
    const startDate = date?.from ? moment(date.from).format("Do MMM YYYY") : "N/A";
    const endDate = date?.to ? moment(date.to).format("Do MMM YYYY") : "N/A";

    return (
      <div className='flex items-center gap-2 bg-slate-100 px-3 py-2 rounded'>
        <p className='text-xs font-medium'>
          {startDate} - {endDate}
        </p>
        <button onClick={onClear} className='text-slate-500 hover:text-red-500'>
          <MdOutlineClose />
        </button>
      </div>
    );
  };

  return (
    <div className='mb-5'>
      {filterType && (
        filterType === "search" ? (
          <h3 className='text-lg font-medium'>Search Results</h3>
        ) : (
          <div className='flex items-center gap-2'>
            <h3 className='text-lg font-medium'>Travel Stories from</h3>
            {filterDates ? <DateRangeChip date={filterDates} /> : <p className="text-sm text-slate-500">No Date Selected</p>}
          </div>
        )
      )}
    </div>
  );
};

export default FilterInfoTitle;
 