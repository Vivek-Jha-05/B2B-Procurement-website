import React, { useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Handshake } from 'lucide-react';

const ClientShowcase: React.FC = () => {
  const { clients_list } = useAdmin();

  // Filter only active clients (in case context has inactive ones for admin)
  const activeClients = useMemo(() => {
    return clients_list.filter((c) => c.isActive);
  }, [clients_list]);

  // We repeat the client list to ensure there are enough logos to fill the marquee track
  // and scroll infinitely without leaving empty gaps
  const marqueeItems = useMemo(() => {
    if (activeClients.length === 0) return [];

    const list = [...activeClients];
    const targetCount = 16; // Target minimum number of items to show in the marquee
    const repeatCount = Math.max(2, Math.ceil(targetCount / list.length));
    
    // Create an array repeating the list
    return Array(repeatCount)
      .fill(list)
      .flat()
      .map((client, index) => ({
        ...client,
        uniqueId: `${client.id}-${index}`, // unique key for rendering
      }));
  }, [activeClients]);

  // If there are no active clients, don't show the section
  if (activeClients.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-[#FFFAEC] via-[#F5ECD5]/15 to-white py-6 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Handshake size={16} className="text-[#578E7E]" />
          <h2 className="text-xs font-bold text-[#8a8a8a] uppercase tracking-[0.2em] font-sans">
            Trusted by Industry Leaders
          </h2>
        </div>
      </div>

      {/* Marquee container */}
      <div className="relative w-full flex overflow-x-hidden">
        {/* Shadow overlays on the edges for a fading glassmorphism effect */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#FFFAEC] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#FFFAEC] to-transparent z-10 pointer-events-none" />

        <div className="marquee-track marquee-left py-3">
          {marqueeItems.map((client) => {
            const firstLetter = client.name ? client.name.charAt(0).toUpperCase() : 'C';
            return (
              <div
                key={client.uniqueId}
                className="flex items-center justify-center bg-white border border-[#F5ECD5]/60 rounded-xl py-4 px-8 shadow-sm h-16 min-w-[240px] mx-6 hover:border-[#578E7E]/40 hover:shadow-md transition-all duration-300 group select-none cursor-pointer"
              >
                {client.logoUrl ? (
                  <img
                    src={client.logoUrl}
                    alt={client.name}
                    className="max-h-10 max-w-[180px] object-contain group-hover:scale-105 transition-transform filter grayscale group-hover:grayscale-0 duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#578E7E]/10 text-[#578E7E] flex items-center justify-center font-serif text-sm font-extrabold group-hover:bg-[#578E7E] group-hover:text-white transition-colors duration-300">
                      {firstLetter}
                    </span>
                    <span className="font-sans font-bold text-sm tracking-wider text-[#5a5a5a] group-hover:text-[#578E7E] transition-colors duration-300 uppercase">
                      {client.name}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ClientShowcase;
