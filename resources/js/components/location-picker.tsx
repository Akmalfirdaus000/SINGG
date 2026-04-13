import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import { Search, MapPin } from 'lucide-react';

// Fix for default marker icon in Leaflet + React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

interface LocationPickerProps {
    initialLat?: number;
    initialLng?: number;
    onLocationSelect: (lat: number, lng: number, address: string) => void;
}

const SearchField = ({ onLocationFound }: { onLocationFound: (result: any) => void }) => {
    const map = useMap();

    useEffect(() => {
        const provider = new OpenStreetMapProvider();

        // @ts-ignore
        const searchControl = new GeoSearchControl({
            provider,
            style: 'bar',
            showMarker: false,
            showPopup: false,
            autoClose: true,
            retainZoomLevel: false,
            animateZoom: true,
            keepResult: true,
            searchLabel: 'Cari lokasi...',
        });

        map.addControl(searchControl);

        const handleLocationFound = (result: any) => {
            const { x, y, label } = result.location;
            onLocationFound({ lat: y, lng: x, address: label });
        };

        map.on('geosearch/showlocation', handleLocationFound);

        return () => {
            map.removeControl(searchControl);
            map.off('geosearch/showlocation', handleLocationFound);
        };
    }, [map, onLocationFound]);

    return null;
};

const LocationMarker = ({ position, setPosition }: { position: L.LatLng, setPosition: (p: L.LatLng) => void }) => {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return (
        <Marker 
            position={position} 
            draggable={true}
            eventHandlers={{
                dragend: (e) => {
                    setPosition(e.target.getLatLng());
                },
            }}
        />
    );
};

export function LocationPicker({ initialLat = -6.2088, initialLng = 106.8456, onLocationSelect }: LocationPickerProps) {
    const [position, setPosition] = useState<L.LatLng>(new L.LatLng(initialLat, initialLng));
    const [address, setAddress] = useState<string>('');

    const reverseGeocode = useCallback(async (lat: number, lng: number) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
            const data = await response.json();
            if (data && data.display_name) {
                setAddress(data.display_name);
                onLocationSelect(lat, lng, data.display_name);
            }
        } catch (error) {
            console.error('Error in reverse geocoding:', error);
        }
    }, [onLocationSelect]);

    useEffect(() => {
        reverseGeocode(position.lat, position.lng);
    }, [position, reverseGeocode]);

    const handleLocationFound = (result: any) => {
        const newPos = new L.LatLng(result.lat, result.lng);
        setPosition(newPos);
        setAddress(result.address);
        onLocationSelect(result.lat, result.lng, result.address);
    };

    return (
        <div className="space-y-4">
            <div className="h-[300px] w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner relative z-10">
                <MapContainer 
                    center={[position.lat, position.lng]} 
                    zoom={13} 
                    scrollWheelZoom={true}
                    className="h-full w-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <SearchField onLocationFound={handleLocationFound} />
                    <LocationMarker position={position} setPosition={setPosition} />
                </MapContainer>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lokasi Terpilih:</p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                        {address || 'Memuat alamat...'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                        {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
                    </p>
                </div>
            </div>
        </div>
    );
}
