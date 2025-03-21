import React, { useEffect, useRef, useState } from 'react'

interface Forecast {
    date: string,
    temperature: number,
    weather_description: string,
    humidity: number,
    wind_speed: number
}

interface IMeteo{
    id: number,
    city: string,
    country: string,
    latitude: number,
    longitude: number,
    temperature: number,
    weather_description: string,
    humidity: number,
    wind_speed: number,
    forecast: Forecast[]
}

interface ApiError {
    message: string;
    status?: number;
    code?: string;
}


const getIcon = (iconType : string) => {
  switch(iconType) {
    case 'Sunny':
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" className='inputImage'/></svg>
    break;
    case 'Clear sky':
        return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" className='inputImage'/></svg>
      break;
    case 'Cloudy':
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
    </svg>
      break;
    case 'Partly Cloudy':
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
    </svg>
      break;
    case 'Partly cloudy':
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
    </svg>
      break;
    case 'Rain':
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 4.5 15 15m0 0V8.25m0 11.25H8.25" />
    </svg>   
      break;
    case 'Rainy':
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 4.5 15 15m0 0V8.25m0 11.25H8.25" />
    </svg>   
      break;
    default:
      // Cette ligne ne devrait jamais être atteinte grâce au type contraint
      return null;
  }
};

const getClothes = (temperature : number) => {
  if(temperature < 10){
    return <p>N'oubliez pas votre manteau.</p>
  }else if(temperature < 22){
    return <p>Prenez un pull.</p>
  }else{
    return <p>Mettez vous en T-shirt.</p>
  }
}



const GetMeteo = ({ville} : {ville : string}) => {
    const [meteo, setMeteo] = useState<IMeteo | null>(null)
    const [error, setError] = useState<ApiError | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
  
    useEffect(() => {
      // Fonction asynchrone pour récupérer les données
      const fetchData = async (): Promise<void> => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await fetch(`api/v1/weathers?search=${ville}`);
          if (!response.ok) {
            throw {
              message: `Erreur HTTP! statut: ${response.status}`,
              status: response.status,
            } as ApiError;
          }
  
          const result: IMeteo[] = await response.json();
          setMeteo(result[0]);
        } catch (e) {
          const error = e as ApiError;
          setError({
            message: error.message || 'Une erreur est survenue',
            status: error.status,
            code: error.code,
          });
        } finally {
          setLoading(false);
        }
      };
      if(ville) {
        fetchData();
      }
  
    }, [ville]);
  
    // Afficher différentes UI basées sur l'état
    if (loading) {
      return <div className='loading'>Chargement en cours...</div>;
    }
  
    if (error) {
      return (
        <div className='error'>
          <h3>Erreur</h3>
          <p>{error.message}</p>
          {error.status && <p>Statut: {error.status}</p>}
        </div>
      );
    }
  
    return (
      <div>
        <div>
          {meteo && (
            <>
              <div>
                <p><strong>{meteo.city}</strong> - {meteo.country}</p>
              </div>
              <hr />
              <div className='weather'>
                <div>
                  <p><strong>{meteo.temperature}°C</strong></p>
                  <p>{meteo.weather_description}</p>
                </div>
                <div>
                  {getIcon(meteo.weather_description)}
                </div>
              </div>
              <hr />
              {getClothes(meteo.temperature)}
            </>
          )}
        </div>
        <div>{error}</div>
      </div>
    );
};

export default GetMeteo;