"use client";

import { useEffect, useState, ReactNode } from "react";
import { stompSubscribe } from "../lib/websocket/stomp-client";
import { HOT_ITEMS_DESTINATION } from "../lib/websocket/events";
import { toast } from "react-toastify";

type HotLead = {
  clientId: number;
  productId: number;
  timestamp: number;
};

export function HotLeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<HotLead[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unsubscribe = stompSubscribe(HOT_ITEMS_DESTINATION, (body) => {
      try {
        const payload = body as { productId?: number; clientId?: number };
        if (payload?.productId && payload?.clientId) {
          const newLead = {
            clientId: payload.clientId,
            productId: payload.productId,
            timestamp: Date.now()
          };
          setLeads(prev => [newLead, ...prev]);
          setUnreadCount(prev => prev + 1);
          toast.info(`Novo Hot Lead! Cliente ${payload.clientId} interessado no Produto ${payload.productId}`, {
            position: "bottom-right",
            autoClose: 5000,
          });
        }
      } catch (err) {
        console.error("Failed to parse hot lead event", err);
      }
    });

    return unsubscribe;
  }, []);

  const openPanel = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  return (
    <div className="relative w-full h-full">
      {/* App Content */}
      <div className="w-full h-full">
        {children}
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 bg-orange-500 text-white font-bold shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Painel Hot Leads</span>
            <span className="bg-orange-700 px-2 py-0.5 rounded text-xs">{leads.length}</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white text-2xl leading-none">&times;</button>
        </div>
        <div className="p-4 flex-1 overflow-auto bg-gray-50 flex flex-col gap-3">
          {leads.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              <span className="text-4xl mb-2 block">📡</span>
              <p className="text-sm">Monitorando atividade...</p>
              <p className="text-xs mt-1">Aguardando clientes com alta intenção de compra.</p>
            </div>
          ) : (
            leads.map((lead, i) => (
              <div key={i} className="bg-white p-3 rounded-lg border border-orange-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-400 group-hover:bg-orange-600 transition-colors"></div>
                <div className="pl-2">
                  <p className="font-bold text-orange-700 text-sm mb-1 flex items-center">
                    <span className="mr-1">🔥</span> Alta Intenção!
                  </p>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-gray-600">Cliente:</span>
                    <span className="font-mono bg-gray-100 px-1 rounded border font-semibold">{lead.clientId}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Produto:</span>
                    <span className="font-mono bg-gray-100 px-1 rounded border font-semibold">{lead.productId}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 text-right">
                    {new Date(lead.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <button 
        onClick={openPanel}
        className="fixed bottom-6 right-6 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl z-30 transition-transform hover:scale-105 active:scale-95"
      >
        🔥
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
