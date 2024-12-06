import moment from 'moment';
import React from 'react';
import { GrMapLocation } from 'react-icons/gr';
import { MdClose } from 'react-icons/md';

const ViewTravelStoryReadOnly = ({ storyInfo, onClose }) => {
    return (
        <div className='relative'>
            <div className="flex items-center justify-end">
                <button className="" onClick={onClose} aria-label="Close">
                    <MdClose className="text-xl text-slate-400" />
                </button>
            </div>
            <div>
                <div className='flex-1 flex flex-col gap-2 py-4'>
                    <h1 className='text-2xl text-slate-950'>
                        {storyInfo?.title}
                    </h1>
                    <div className='flex items-center justify-between gap-3'>
                        <span className='text-xs text-slate-500'>
                            {storyInfo?.visitedDate && moment(storyInfo.visitedDate).format("Do MMM YYYY")}
                        </span>
                        <div className='inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded px-2 py-1'>
                            <GrMapLocation className='text-sm' />
                            {Array.isArray(storyInfo?.visitedLocation) && storyInfo.visitedLocation.length > 0 ? (
                                storyInfo.visitedLocation.map((item, index) =>
                                    index === storyInfo.visitedLocation.length - 1
                                        ? item
                                        : `${item}, `
                                )
                            ) : (
                                <span>No locations available</span>
                            )}
                        </div>
                    </div>
                </div>  
                <img 
                    src={storyInfo?.imageUrl}
                    alt={storyInfo?.title || 'Selected travel story'}
                    className='w-full h-[300px] object-cover rounded-lg'
                />
                <div className='mt-4'>
                    <p className='text-sm text-slate-950 leading-6 text-justify whitespace-pre-line'>{storyInfo?.story}</p>
                </div>
            </div>
        </div>
    );
};

export default ViewTravelStoryReadOnly;