import { useState, useEffect } from 'react';

interface Location {
  code: string;
  name: string;
}

export function useVietnamLocations() {
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/p/')
      .then(res => res.json())
      .then(data => {
        setProvinces(data.map((p: any) => ({ code: p.code, name: p.name })));
        setLoading(false);
      });
  }, []);

  const loadDistricts = async (provinceCode: string) => {
    const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
    const data = await res.json();
    setDistricts(data.districts.map((d: any) => ({ code: d.code, name: d.name })));
  };

  const loadWards = async (districtCode: string) => {
    const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
    const data = await res.json();
    setWards(data.wards.map((w: any) => ({ code: w.code, name: w.name })));
  };

  return {
    provinces,
    districts,
    wards,
    loading,
    loadDistricts,
    loadWards
  };
} 