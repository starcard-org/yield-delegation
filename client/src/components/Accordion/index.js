import React, {useState} from 'react';

export const Accordion = ({top, children, className}) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className={`${className} accordion-wrapper`}>
      <div
        className={`accordion-top ${isOpen ? 'open' : ''}`}
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
