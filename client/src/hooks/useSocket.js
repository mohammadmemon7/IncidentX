import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { apiSlice } from '../store/slices/apiSlice';
import toast from 'react-hot-toast';

const useSocket = (incidentId = null) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:10000', {
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('Connected to socket server');
      if (incidentId) {
        socket.emit('join-incident', incidentId);
      }
      socket.emit('join-admin');
    });

    socket.on('incident:update', ({ incidentId: updatedId, update }) => {
      if (incidentId === updatedId) {
        dispatch(apiSlice.util.invalidateTags([{ type: 'Incident', id: updatedId }]));
        if (!update.isAI) {
          toast(`New update from ${update.createdBy?.name || 'team'}`, { icon: '💬' });
        }
      }
    });

    socket.on('incident:new', (incident) => {
      dispatch(apiSlice.util.invalidateTags(['Incident']));
      toast.error(`NEW INCIDENT: ${incident.title}`, { 
        duration: 5000,
        icon: '🚨',
        style: { border: '2px solid #ef4444' }
      });
    });

    socket.on('incident:statusChange', ({ incidentId: updatedId, status }) => {
      if (incidentId === updatedId) {
        dispatch(apiSlice.util.invalidateTags([{ type: 'Incident', id: updatedId }]));
        toast(`Incident status changed to ${status}`, { icon: '🔄' });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [incidentId, dispatch]);
};

export default useSocket;
