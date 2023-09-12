"use client";
import { Nation } from '@/lib/interfaces/db-data-Interfaces';
import React, { useState } from 'react'

function CacheDashboard() {
    const [nations, setNations] = useState<Nation[]>([]);
    const [message, setMessage] = useState<string>('');
    const [sortedNationNames, setSortedNationNames] = useState<string[]>([]);
  
    const handleGetCache = () => {
      fetch('http://localhost:3000/api/redis/nations')
        .then((response) => {
          if (response.status === 404) {
            return [];
          } else {
            return response.json();
          }
        })
        .then((data) => {
          if (Array.isArray(data) && data.length === 0) {
            setMessage('No nations in cache.');
          } else {
            const sorted = data.map((nation:Nation) => nation.name).sort();
            setSortedNationNames(sorted);
            setNations(data);
            setMessage('');
          }
        })
        .catch((error) => {
          console.error('Error fetching nations:', error);
          setMessage('Error fetching nations.');
        });
    };
  
    const handleRevalidateCache = () => {
      fetch('http://localhost:3000/api/redis/nations', {
        method: 'POST',
      })
        .then((response) => {
          if (response.status === 200) {
            setMessage('Cache Revalidation Success');
          } else {
            setMessage('Cache Revalidation Failed');
          }
        })
        .catch((error) => {
          console.error('Error revalidating cache:', error);
          setMessage('Error revalidating cache.');
        });
    };
  
    const handleDeleteCache = () => {
      fetch('http://localhost:3000/api/redis/nations', {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.status === 200) {
            setNations([]);
            setMessage('Nations cache is deleted.');
          } else {
            setMessage('Cache Deletion Failed');
          }
        })
        .catch((error) => {
          console.error('Error deleting cache:', error);
          setMessage('Error deleting cache.');
        });
    };
  
    return (
      <div>
        <button onClick={handleGetCache} style={{marginTop:"5px"}}>Get Cache</button>
        <button onClick={handleRevalidateCache} style={{marginTop:"5px"}}>Revalidate Cache</button>
        <button onClick={handleDeleteCache} style={{marginTop:"5px"}}>Delete Cache</button>
  
        {message && <div>{message}</div>}
  
        {nations.length > 0 && (
          <ul>
            {sortedNationNames.map((nation:string) => (
              <li key={nation}>
                {nation}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
}

export default CacheDashboard