import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { apiSlice } from '../store/slices/apiSlice';
import { logout, updateRole } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const useSocket = (incidentId = null) => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
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
      // Only show toast if I am NOT the person who created this incident
      if (currentUser?._id !== incident.createdBy) {
        toast.error(`NEW INCIDENT: ${incident.title}`, { 
          duration: 5000,
          icon: '🚨',
          style: { border: '2px solid #ef4444' }
        });
      }
    });

    socket.on('incident:statusChange', ({ incidentId: updatedId, status }) => {
      if (incidentId === updatedId) {
        dispatch(apiSlice.util.invalidateTags([{ type: 'Incident', id: updatedId }]));
        toast(`Incident status changed to ${status}`, { icon: '🔄' });
      }
    });
    
    socket.on('user:new', (newUser) => {
      dispatch(apiSlice.util.invalidateTags(['User']));
      toast.success(`New Unit Enrolled: ${newUser.name}`, { icon: '👤' });
    });

    socket.on('user:deleted', (deletedId) => {
      dispatch(apiSlice.util.invalidateTags(['User']));
      if (currentUser?._id === deletedId) {
        dispatch(logout());
        toast.error('Your account has been terminated by an administrator.', { duration: 6000 });
      }
    });

    socket.on('user:roleUpdated', ({ userId, role }) => {
      dispatch(apiSlice.util.invalidateTags(['User']));
      if (currentUser?._id === userId) {
        dispatch(updateRole(role));
        toast.success(`Your access level has been updated to: ${role}`, { icon: '🔐' });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [incidentId, dispatch]);
};

export default useSocket;
