import {  useEffect, useState } from 'react';
import { useRouteStore } from '../components/store/store';

export const useGetPathFromParam = () => {
  const [params, setParams] = useState<Record<string, string>>({});

  const {setStartId, setEndId} = useRouteStore();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const paramsObj: Record<string, string> = {};
    queryParams.forEach((value, key) => {
      paramsObj[key] = value;
    });
    setParams(paramsObj);
  }, []);

  useEffect(() => {
    setStartId(params.start);
    setEndId(params.end)
  },[params.end, params.start, setEndId, setStartId])

};