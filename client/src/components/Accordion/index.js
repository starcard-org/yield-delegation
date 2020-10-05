import React, {useState} from 'react';

export const Accordion = ({top, children, className, isLoading}) => {
  const [isOpen, setOpen] = useState(false);

  if (isLoading) {
    return (
      <div className={`${className} accordion-wrapper`}>
        <div className={'accordion-top'}>
          <div className="loader" />
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} accordion-wrapper`}>
      <div
        className={`accordion-top accordion-top-icon ${isOpen ? 'open' : ''}`}
        onClick={() => setOpen(!isOpen)}
      >
        {top}
      </div>
      <div className={`accordion-item ${!isOpen ? 'collapsed' : ''}`}>
        <div className="accordion-content">{children}</div>
      </div>
    </div>
  );
};
