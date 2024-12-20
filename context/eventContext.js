import React, { createContext, useContext, useState } from 'react';

const EventContext = createContext(undefined);

export const EventProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [madeEvents, setMadeEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <EventContext.Provider value={{ madeEvents, setMadeEvents, selectedEvent, setSelectedEvent, products, setProducts }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useCompany must be used within an CompanyProvider");
  }
  return context;
};

export default EventContext;
