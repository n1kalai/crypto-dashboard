'use client';

import { useEffect, useRef } from 'react';
import { cryptoDataOptions } from '@/services/get-crypto-data';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { CRYPTO_DATA } from '@/services/query-keys';

cryptoDataOptions.enabled = false

export const useCryptoData = () => {
  const { data, isLoading, error, dataUpdatedAt, refetch } = useSuspenseQuery(cryptoDataOptions);
  const queryClient = useQueryClient()


  const cryptoDataKeys = Object.keys(data || {});


  const nonHighlightedData = useRef(data || {});

  useEffect(() => {
    const pricesWs = new WebSocket(`wss://ws.coincap.io/prices?assets=${cryptoDataKeys.join(',')}`);
    let interval: ReturnType<typeof setInterval>;
   
  

    pricesWs.onmessage = (event) => {
      try {
        const updatedPrices = JSON.parse(event.data);

        if(updatedPrices.error) {
          pricesWs.close();
          interval = setInterval(() => refetch(), 1000 * 60);
          alert(`Enabling Polling because of WebSockets overload: ${updatedPrices.error}`)

        } else { 
         
         


          const newData = { ...nonHighlightedData.current };

          Object.keys(updatedPrices).forEach((id) => {
            const oldPrice = Number(newData[id].priceUsd);
            const newPrice = Number(updatedPrices[id]);

            if (newData[id]) {
              newData[id].priceUsd = updatedPrices[id];

              nonHighlightedData.current = newData

              if (newPrice > oldPrice) {
                newData[id].className = "highlight-green";
              } else if (newPrice < oldPrice) {
                newData[id].className = "highlight-red"; 
              }
            }
          });

          queryClient.setQueryData([CRYPTO_DATA], newData)
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    pricesWs.onerror = (err) => console.error('WebSocket error:', err);

    return () => {
      if(interval){
        clearInterval(interval);
      }
      if (pricesWs.OPEN){
        pricesWs.close();
      }
    };
  }, []);

  return { data, isLoading, error, dataUpdatedAt, refetchCryptoData: refetch };
};
