import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { getValidToken } from '../../utils/auth';

const ProtectedRoute = ({children, role}) => {
  const dispatch = useDispatch();
  const location = useLocation();
    const {user} = useSelector((state)=>state.auth);
  const validToken = getValidToken();

  if(!user || !validToken){
    dispatch(logout());
    const redirectTo = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?redirect=${redirectTo}`} replace/>;
  }

  if(role && user.role !== role){
        return <Navigate to="/login" replace/>;
    }

  return children;
}

export default ProtectedRoute